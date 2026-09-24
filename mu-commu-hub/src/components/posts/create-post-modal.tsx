"use client";
import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Save, Send } from "lucide-react";
import { toast } from "sonner";
import { Button, Field, Modal, inputClass } from "@/components/ui";
import { db } from "@/lib/db";
import {
  createPostSchema,
  isRecruitmentCategory,
  parseTags,
  parseTeamSize,
  postCategories,
} from "@/lib/validation/create-post";
import { useApp } from "@/stores/app";
import type { CreatePostForm } from "@/lib/validation/create-post";
import type { Post, TeamRecruitment } from "@/types";
export function CreatePostModal() {
  const open = useApp((s) => s.createOpen);
  const setOpen = useApp((s) => s.setCreateOpen);
  const createPost = useApp((s) => s.createPost);
  const createTeam = useApp((s) => s.createTeam);
  const competitions = useApp((s) => s.competitions);
  const user = useApp((s) => s.user);
  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    control,
    getValues,
    reset,
    formState: { errors },
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
    },
  });
  useEffect(() => {
    if (open)
      db.drafts.get("current").then((d) => {
        if (d)
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
          });
      });
  }, [open, reset]);
  const category = useWatch({ control, name: "category" });
  const title = useWatch({ control, name: "title" }) ?? "";
  const content = useWatch({ control, name: "content" }) ?? "";
  const recruitment = isRecruitmentCategory(category);
  const saveDraft = async () => {
    await db.drafts.put({
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
      updatedAt: new Date().toISOString(),
    });
    toast.success("Draft saved on this device");
    setOpen(false);
  };
  const submit = async (data: CreatePostForm) => {
    setSubmitting(true);
    try {
      const post: Post = {
        id: `local-${crypto.randomUUID()}`,
        authorId: user.id,
        category: data.category,
        title: data.title,
        content: data.content,
        tags: parseTags(data.tags),
        createdAt: new Date().toISOString(),
        likes: 0,
        comments: 0,
      };
      if (recruitment) {
        const teamId = `local-team-${crypto.randomUUID()}`;
        const parsedRoles = parseTags(data.roles ?? "");
        const size = parseTeamSize(data.teamSize ?? "");
        if (!size) throw new Error("Invalid team size");
        const team: TeamRecruitment = {
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
          location: data.location?.trim() || (data.mode === "Online" ? "Online" : "Main Campus"),
          faculty: data.faculty?.trim() || undefined,
          contactMethod: data.contactMethod?.trim(),
          createdAt: new Date().toISOString(),
        };
        await createTeam(team);
        post.recruitmentId = teamId;
      }
      await createPost(post);
      await db.drafts.delete("current");
      reset();
      setOpen(false);
      toast.success("Your post is live in the community");
    } catch {
      toast.error("Could not publish your post");
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <Modal
      open={open}
      onOpenChange={setOpen}
      title="Create a post"
      description="Share an idea, ask a question, or find your next teammate."
    >
      <form onSubmit={handleSubmit(submit)} className="space-y-5">
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
              <input {...register("faculty")} className={inputClass} placeholder="Optional" />
            </Field>
            <Field label="Contact method" error={errors.contactMethod?.message}>
              <input {...register("contactMethod")} className={inputClass} placeholder="MU Connect messages" />
            </Field>
          </div>
        )}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#e9eef4] pt-5">
          <Button type="button" variant="ghost" onClick={saveDraft}>
            <Save size={16} /> Save draft
          </Button>
          <Button type="submit" disabled={submitting}>
            <Send size={16} />
            {submitting ? "Publishing..." : "Publish post"}
          </Button>
        </div>
      </form>
      <p className="mt-4 flex items-center gap-1.5 text-xs text-[#8998a8]">
        <Check size={13} /> Visible to everyone in the demo community
      </p>
    </Modal>
  );
}
