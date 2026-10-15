"use client";
import { useEffect, useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Save, Send, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button, Field, Modal, inputClass } from "@/components/ui";
import { draftService } from "@/lib/db/draft-service";
import { storageErrorMessage } from "@/lib/db/storage-error";
import { PostImageUploader } from "./post-image-uploader";
import {
  createPostSchema,
  isRecruitmentCategory,
  parseTags,
  parseTeamSize,
  postCategories,
} from "@/lib/validation/create-post";
import { useApp } from "@/stores/app";
import type { CreatePostForm } from "@/lib/validation/create-post";
import type { Post, PreparedPostImage, TeamRecruitment } from "@/types";
export function CreatePostModal() {
  const open = useApp((s) => s.createOpen);
  return open ? <PostComposer /> : null;
}

function PostComposer() {
  const setOpen = useApp((s) => s.setCreateOpen);
  const createPost = useApp((s) => s.createPost);
  const competitions = useApp((s) => s.competitions);
  const user = useApp((s) => s.user);
  const [submitting, setSubmitting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [restoring, setRestoring] = useState(true);
  const [restoreFailed, setRestoreFailed] = useState(false);
  const [restoreAttempt, setRestoreAttempt] = useState(0);
  const [hasDraft, setHasDraft] = useState(false);
  const [imageProcessing, setImageProcessing] = useState(false);
  const [operationError, setOperationError] = useState<string | null>(null);
  const operation = useRef(false);
  const processing = useRef(false);
  const [postId] = useState(() => `local-${crypto.randomUUID()}`);
  const {
    register,
    handleSubmit,
    control,
    getValues,
    reset,
    setValue,
    formState: { errors, isDirty },
  } = useForm<CreatePostForm>({
    resolver: zodResolver(createPostSchema),
    defaultValues: {
      category: "General",
      title: "",
      content: "",
      tags: "",
      mode: "Hybrid",
      teamSize: "1 of 5",
      contactMethod: "MU Connect messages",
      images: [],
    },
  });
  useEffect(() => {
    let active = true;
    draftService
      .getCurrent()
      .then(async (d) => {
        const records = d ? await draftService.getImages(d) : [];
        if (!active) return;
        if (d) {
          setHasDraft(true);
          reset({
            category: d.type as CreatePostForm["category"],
            title: d.title,
            content: d.content,
            tags: d.tags.join(", "),
            competitionId: d.competitionId,
            roles: d.roles,
            teamSize: d.teamSize ?? "1 of 5",
            deadline: d.deadline,
            mode: d.mode ?? "Hybrid",
            location: d.location,
            faculty: d.faculty,
            contactMethod: d.contactMethod ?? "MU Connect messages",
            eventDate: d.eventDate,
            eventTime: d.eventTime,
            eventLocation: d.eventLocation,
            images: records.filter(
              (image): image is NonNullable<typeof image> => !!image,
            ),
          });
          if (records.some((image) => !image))
            setOperationError(
              "Some draft photos are missing or damaged. The remaining photos and your text have been restored.",
            );
        }
        setRestoreFailed(false);
      })
      .catch((error: unknown) => {
        if (active) {
          setRestoreFailed(true);
          setOperationError(storageErrorMessage(error, "restore your draft"));
        }
      })
      .finally(() => {
        if (active) setRestoring(false);
      });
    return () => {
      active = false;
    };
  }, [reset, restoreAttempt]);
  const category = useWatch({ control, name: "category" });
  const title = useWatch({ control, name: "title" }) ?? "";
  const content = useWatch({ control, name: "content" }) ?? "";
  const images = useWatch({ control, name: "images" }) ?? [];
  const recruitment = isRecruitmentCategory(category);
  const saveDraft = async () => {
    if (operation.current || processing.current || restoring || restoreFailed)
      return;
    operation.current = true;
    setSaving(true);
    setOperationError(null);
    try {
      await draftService.save(
        {
          id: "current",
          type: category,
          title,
          content,
          tags: parseTags(getValues("tags") ?? ""),
          competitionId: getValues("competitionId"),
          roles: getValues("roles"),
          teamSize: getValues("teamSize"),
          deadline: getValues("deadline"),
          mode: getValues("mode"),
          location: getValues("location"),
          faculty: getValues("faculty"),
          contactMethod: getValues("contactMethod"),
          eventDate: getValues("eventDate"),
          eventTime: getValues("eventTime"),
          eventLocation: getValues("eventLocation"),
          updatedAt: new Date().toISOString(),
        },
        getValues("images"),
      );
      toast.success("Draft and photos saved on this device");
      setOpen(false);
    } catch (error) {
      const message = storageErrorMessage(error, "save your draft");
      setOperationError(message);
      toast.error(message);
    } finally {
      operation.current = false;
      setSaving(false);
    }
  };
  const discardDraft = async () => {
    if (operation.current || processing.current || restoring) return;
    operation.current = true;
    setSaving(true);
    try {
      await draftService.clear();
      setOpen(false);
      toast.success("Draft discarded");
    } catch (error) {
      const message = storageErrorMessage(error, "discard your draft");
      setOperationError(message);
      toast.error(message);
    } finally {
      operation.current = false;
      setSaving(false);
    }
  };
  const closeComposer = (nextOpen: boolean) => {
    if (nextOpen || operation.current || processing.current || restoring)
      return;
    if (restoreFailed) {
      setOpen(false);
      return;
    }
    if (isDirty) {
      void saveDraft();
      return;
    }
    setOpen(false);
  };
  const submit = async (data: CreatePostForm) => {
    if (operation.current || processing.current || restoring || restoreFailed)
      return;
    operation.current = true;
    setSubmitting(true);
    setOperationError(null);
    try {
      const post: Post = {
        id: postId,
        authorId: user.id,
        category: data.category,
        title: data.title || "Photos from campus",
        content: data.content,
        tags: parseTags(data.tags),
        createdAt: new Date().toISOString(),
        likes: 0,
        comments: 0,
        imageIds: data.images.map((image) => image.id),
      };
      let team: TeamRecruitment | undefined;
      if (data.category === "Event") {
        post.eventDate = new Date(
          `${data.eventDate}T${data.eventTime}`,
        ).toISOString();
        post.eventTime = data.eventTime;
        post.eventLocation = data.eventLocation?.trim();
        post.eventHost = user.name;
      }
      if (recruitment) {
        const teamId = `${postId}-team`;
        const parsedRoles = parseTags(data.roles ?? "");
        const size = parseTeamSize(data.teamSize ?? "");
        if (!size) throw new Error("Invalid team size");
        team = {
          id: teamId,
          title: data.title,
          leaderId: user.id,
          competitionId: data.competitionId || undefined,
          description: data.content,
          roles: parsedRoles.map((name) => ({ name, filled: false })),
          skills: post.tags,
          members: size.members,
          memberIds: [user.id],
          capacity: size.capacity,
          deadline: new Date(`${data.deadline}T23:59:59`).toISOString(),
          mode: data.mode ?? "Hybrid",
          location:
            data.location?.trim() ||
            (data.mode === "Online" ? "Online" : "Main Campus"),
          faculty: data.faculty?.trim() || undefined,
          contactMethod: data.contactMethod?.trim(),
          createdAt: new Date().toISOString(),
        };
        post.recruitmentId = teamId;
      }
      await createPost(post, { images: data.images, draftId: "current", team });
      reset();
      setOpen(false);
      toast.success("Your post is live in the community");
    } catch (error) {
      const message = storageErrorMessage(error, "publish your post");
      setOperationError(message);
      toast.error(message);
    } finally {
      operation.current = false;
      setSubmitting(false);
    }
  };
  return (
    <Modal
      open
      onOpenChange={closeComposer}
      title="Create a post"
      description="Share an idea, ask a question, or find your next teammate."
    >
      {restoring && (
        <p role="status" className="mb-4 text-xs text-[#718096]">
          Restoring your local draft...
        </p>
      )}
      {operationError && (
        <p
          role="alert"
          className="mb-4 rounded-xl bg-red-50 p-3 text-xs leading-5 text-red-700 [overflow-wrap:anywhere]"
        >
          {operationError}
        </p>
      )}
      {restoreFailed && (
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={() => {
            setRestoring(true);
            setOperationError(null);
            setRestoreAttempt((attempt) => attempt + 1);
          }}
        >
          Retry loading draft
        </Button>
      )}
      <form onSubmit={(event) => void handleSubmit(submit)(event)}>
        <fieldset
          disabled={submitting || saving || restoring || restoreFailed}
          className="min-w-0 space-y-5"
        >
          <Field label="What would you like to share?">
            <select {...register("category")} className={inputClass}>
              {postCategories.map((x) => (
                <option key={x} value={x}>
                  {x === "Team"
                    ? "Find teammates"
                    : x === "Friends"
                      ? "Find friends"
                      : x}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Title" error={errors.title?.message}>
            <input
              {...register("title")}
              className={inputClass}
              placeholder="Give your post a clear, inviting title"
            />
            <span className="mt-1 block text-right text-[11px] text-[#9aa8ba]">
              {title.length}/120
            </span>
          </Field>
          <Field label="Your post" error={errors.content?.message}>
            <textarea
              {...register("content")}
              rows={5}
              className={inputClass + " resize-y py-3"}
              placeholder="Tell students what you're thinking, building, or looking for..."
            />
            <span className="mt-1 block text-right text-[11px] text-[#9aa8ba]">
              {content.length}/2000
            </span>
          </Field>
          <PostImageUploader
            images={images}
            onChange={(value: PreparedPostImage[]) =>
              setValue("images", value, {
                shouldDirty: true,
                shouldValidate: true,
              })
            }
            disabled={submitting || saving || restoring || restoreFailed}
            onProcessingChange={(value) => {
              processing.current = value;
              setImageProcessing(value);
            }}
            error={errors.images?.message ?? errors.images?.root?.message}
          />
          {images.length > 0 && !recruitment && category !== "Event" && (
            <p className="text-xs text-[#718096]">
              A title and caption are optional when you share photos.
            </p>
          )}
          <Field label="Tags (comma separated)">
            <input
              {...register("tags")}
              className={inputClass}
              placeholder="AI, React, Hackathons"
            />
          </Field>
          {recruitment && (
            <div className="grid gap-4 rounded-2xl border border-[#e4ebf4] bg-[#f8fafd] p-4 sm:grid-cols-2">
              <Field label="Competition" error={errors.competitionId?.message}>
                <select {...register("competitionId")} className={inputClass}>
                  <option value="">Independent project</option>
                  {competitions.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Roles needed" error={errors.roles?.message}>
                <input
                  {...register("roles")}
                  className={inputClass}
                  placeholder="Designer, developer"
                />
              </Field>
              <Field label="Team size" error={errors.teamSize?.message}>
                <input
                  {...register("teamSize")}
                  className={inputClass}
                  placeholder="e.g. 3 of 5"
                />
              </Field>
              <Field label="Deadline" error={errors.deadline?.message}>
                <input
                  {...register("deadline")}
                  type="date"
                  className={inputClass}
                />
              </Field>
              <Field label="Work mode">
                <select {...register("mode")} className={inputClass}>
                  <option>Hybrid</option>
                  <option>Online</option>
                  <option>On-site</option>
                </select>
              </Field>
              <div className="sm:col-span-2">
                <Field label="Location">
                  <input
                    {...register("location")}
                    className={inputClass}
                    placeholder="Main Campus or online"
                  />
                </Field>
              </div>
              <Field label="Faculty requirement">
                <input
                  {...register("faculty")}
                  className={inputClass}
                  placeholder="Optional"
                />
              </Field>
              <Field
                label="Contact method"
                error={errors.contactMethod?.message}
              >
                <input
                  {...register("contactMethod")}
                  className={inputClass}
                  placeholder="MU Connect messages"
                />
              </Field>
            </div>
          )}
          {category === "Event" && (
            <div className="grid gap-4 rounded-2xl border border-[#e4ebf4] bg-[#f8fafd] p-4 sm:grid-cols-2">
              <Field label="Event date" error={errors.eventDate?.message}>
                <input
                  {...register("eventDate")}
                  type="date"
                  className={inputClass}
                />
              </Field>
              <Field label="Event time" error={errors.eventTime?.message}>
                <input
                  {...register("eventTime")}
                  type="time"
                  className={inputClass}
                />
              </Field>
              <div className="sm:col-span-2">
                <Field
                  label="Event location"
                  error={errors.eventLocation?.message}
                >
                  <input
                    {...register("eventLocation")}
                    className={inputClass}
                    placeholder="Innovation Hub or online"
                  />
                </Field>
              </div>
            </div>
          )}
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#e9eef4] pt-5">
            <div className="flex flex-wrap items-center gap-1">
              <Button
                type="button"
                variant="ghost"
                disabled={imageProcessing || saving}
                onClick={() => void saveDraft()}
              >
                <Save size={16} /> {saving ? "Saving..." : "Save draft"}
              </Button>
              {hasDraft && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  disabled={imageProcessing || saving}
                  onClick={() => void discardDraft()}
                >
                  <Trash2 size={14} /> Discard draft
                </Button>
              )}
            </div>
            <Button
              type="submit"
              disabled={submitting || saving || imageProcessing}
            >
              <Send size={16} />
              {submitting ? "Publishing..." : "Publish post"}
            </Button>
          </div>
        </fieldset>
      </form>
      <p className="mt-3 text-[11px] text-[#8998a8]">
        Closing saves unfinished posts and photos as a draft on this device.
      </p>
      <p className="mt-4 flex items-center gap-1.5 text-xs text-[#8998a8]">
        <Check size={13} /> Visible to everyone in the demo community
      </p>
    </Modal>
  );
}
