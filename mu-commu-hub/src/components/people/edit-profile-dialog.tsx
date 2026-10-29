"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Button, Field, Modal, inputClass } from "@/components/ui";
import { useApp } from "@/stores/app";
import type { User } from "@/types";

const profileSchema = z.object({
  name: z.string().min(2, "Use at least 2 characters for your name."),
  bio: z
    .string()
    .min(10, "Tell collaborators a little more (at least 10 characters).")
    .max(300, "Keep your bio to 300 characters."),
  faculty: z.string().min(2),
  major: z.string().min(2),
  year: z.number().min(1).max(8),
  skills: z.string(),
  interests: z.string(),
  availability: z.string(),
});

type ProfileForm = z.infer<typeof profileSchema>;

function splitList(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function EditProfileDialog({
  user,
  open,
  onOpenChange,
}: {
  user: User;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [saveError, setSaveError] = useState("");
  const updateProfile = useApp((state) => state.updateProfile);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    values: {
      name: user.name,
      bio: user.bio,
      faculty: user.faculty,
      major: user.major,
      year: user.year,
      skills: user.skills.join(", "),
      interests: user.interests.join(", "),
      availability: user.availability.join(", "),
    },
  });

  const submit = async (data: ProfileForm) => {
    if (isSubmitting) return;
    setSaveError("");
    try {
      updateProfile({
        ...user,
        name: data.name,
        initials: data.name
          .split(" ")
          .map((part) => part[0])
          .slice(0, 2)
          .join(""),
        bio: data.bio,
        faculty: data.faculty,
        major: data.major,
        year: data.year,
        skills: splitList(data.skills),
        interests: splitList(data.interests),
        availability: splitList(data.availability),
      });
      onOpenChange(false);
      toast.success("Profile updated on this device");
    } catch {
      setSaveError(
        "Your changes could not be saved. Allow browser storage and try again. Your edits are still here.",
      );
    }
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Edit your profile"
      description="Make it easier for the right people to find you."
    >
      <form className="space-y-4" onSubmit={handleSubmit(submit)}>
        <Field label="Name" error={errors.name?.message}>
          <input {...register("name")} className={inputClass} />
        </Field>
        <Field label="Bio" error={errors.bio?.message}>
          <textarea
            {...register("bio")}
            rows={3}
            className={inputClass + " py-3"}
          />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Faculty" error={errors.faculty?.message}>
            <input {...register("faculty")} className={inputClass} />
          </Field>
          <Field label="Major" error={errors.major?.message}>
            <input {...register("major")} className={inputClass} />
          </Field>
        </div>
        <Field label="Year" error={errors.year?.message}>
          <input
            {...register("year", { valueAsNumber: true })}
            type="number"
            min="1"
            max="8"
            className={inputClass}
          />
        </Field>
        <Field label="Skills (comma separated)">
          <input {...register("skills")} className={inputClass} />
        </Field>
        <Field label="Interests (comma separated)">
          <input {...register("interests")} className={inputClass} />
        </Field>
        <Field label="Open to (comma separated)">
          <input {...register("availability")} className={inputClass} />
        </Field>
        <p className="text-xs leading-5 text-muted">
          Separate skills, interests, and availability with commas. Your profile
          is saved only in this browser.
        </p>
        {saveError && (
          <p role="alert" className="text-sm text-red-700">
            {saveError}
          </p>
        )}
        <div className="flex justify-end gap-2 border-t border-[var(--line)] pt-4">
          <Button
            type="button"
            variant="secondary"
            disabled={isSubmitting}
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving…" : "Save changes"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
