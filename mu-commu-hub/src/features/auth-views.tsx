"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  GraduationCap,
  LockKeyhole,
  Sparkles,
  Users,
} from "lucide-react";
import { Button, ErrorState, Field, inputClass } from "@/components/ui";
import { demoUser, interests, skills } from "@/lib/mock/data";
import { useApp } from "@/stores/app";
import type { Role } from "@/types";
const loginSchema = z.object({
  email: z.email("Enter a valid email"),
  password: z.string().min(4, "Enter at least 4 characters"),
});
type LoginForm = z.infer<typeof loginSchema>;
export function LoginView() {
  return (
    <SessionBoundary>
      <LoginForm />
    </SessionBoundary>
  );
}
function SessionBoundary({ children }: { children: React.ReactNode }) {
  const status = useApp((state) => state.sessionStatus);
  const error = useApp((state) => state.sessionError);
  const retry = useApp((state) => state.initializeSession);
  if (status === "error")
    return (
      <main className="flex min-h-screen items-center justify-center bg-[var(--background)] px-5 py-12">
        <div className="w-full max-w-md">
          <ErrorState
            title="Could not restore your demo profile"
            description={
              error ?? "Allow browser storage for this site, then try again."
            }
            onRetry={retry}
          />
          <Link
            href="/"
            className="mt-5 inline-flex min-h-11 items-center text-sm font-semibold text-[#17468c]"
          >
            <ArrowLeft size={16} className="mr-2" /> Back to home
          </Link>
        </div>
      </main>
    );
  if (status === "initializing")
    return (
      <main
        className="flex min-h-screen items-center justify-center px-5 py-12"
        aria-busy="true"
      >
        <p role="status" className="text-sm text-[var(--text-muted)]">
          Loading your saved demo profile…
        </p>
      </main>
    );
  return children;
}
function LoginForm() {
  const router = useRouter();
  const user = useApp((s) => s.user);
  const ready = useApp((s) => s.sessionStatus === "ready");
  const dataError = useApp((s) => s.error);
  const retryData = useApp((s) => s.load);
  const setUser = useApp((s) => s.setUser);
  const [role, setRole] = useState<Role>(user.role ?? "student");
  const [entryError, setEntryError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: user.email ?? demoUser.email ?? "user@gmail.com",
      password: "demo1234",
    },
  });
  const enter = () => {
    if (!ready) return;
    try {
      const current = useApp.getState().user;
      const completed = localStorage.getItem("mu-connect-onboarded") === "true";
      setUser({ ...current, role });
      router.push(completed ? "/home" : "/onboarding");
    } catch {
      setEntryError(
        "Could not save your demo session. Allow browser storage and try again. Your existing profile has not been replaced.",
      );
    }
  };
  return (
    <div className="flex min-h-screen bg-white">
      <div className="hidden w-[48%] flex-col justify-between bg-[#17468c] p-10 text-white lg:flex">
        <Link href="/" className="text-xl font-bold">
          M<span className="text-[#fac334]">.</span>{" "}
          <span className="font-medium">MU Connect</span>
        </Link>
        <div className="max-w-md">
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/12">
            <Users size={31} className="text-[#fac334]" />
          </div>
          <h1 className="text-4xl font-bold leading-tight tracking-[-.04em]">
            Good things happen when we connect.
          </h1>
          <p className="mt-5 text-sm leading-7 text-[#dce8f8]">
            A home for students to meet collaborators, exchange ideas, and take
            on the next challenge together.
          </p>
          <div className="mt-10 flex -space-x-2">
            {["T", "PS", "NW", "SK"].map((x, i) => (
              <span
                key={x}
                className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-[#17468c] text-xs font-bold text-[#17468c]"
                style={{
                  background: ["#e4edf9", "#fae6ce", "#e7e4f8", "#ddf1e8"][i],
                }}
              >
                {x}
              </span>
            ))}
          </div>
          <p className="mt-3 text-xs text-[#c7d9ef]">
            Explore sample students, teams, and campus opportunities.
          </p>
        </div>
        <p className="text-xs text-[#aebfda]">
          Independent university community prototype · 2026
        </p>
      </div>
      <div className="flex w-full items-center justify-center px-5 py-12 lg:w-[52%]">
        <div className="w-full max-w-md">
          <Link
            href="/"
            className="mb-12 inline-flex items-center gap-2 text-sm text-[#68778c] hover:text-[#17468c]"
          >
            <ArrowLeft size={15} /> Back to home
          </Link>
          <h2 className="text-3xl font-bold tracking-tight">Enter the demo</h2>
          <p className="mt-3 text-sm leading-6 text-[#68778c]">
            Choose a preview role and continue with your saved profile. These
            roles do not grant real permissions. No real account is created.
          </p>
          {dataError && (
            <div role="alert" className="mt-6 text-sm leading-6">
              <p className="font-semibold">Campus data is unavailable</p>
              <p className="mt-1 text-[var(--text-muted)]">{dataError}</p>
              <p className="mt-2 text-[var(--text-muted)]">
                Your demo profile is ready. Campus data can be retried
                separately.
              </p>
              <Button variant="secondary" className="mt-3" onClick={retryData}>
                Retry campus data
              </Button>
            </div>
          )}
          <div className="mt-7 grid grid-cols-3 gap-2">
            {(
              [
                ["student", "Student", GraduationCap],
                ["organizer", "Organizer", Users],
                ["admin", "Admin", LockKeyhole],
              ] as const
            ).map(([value, label, Icon]) => (
              <button
                key={value}
                onClick={() => setRole(value)}
                aria-pressed={role === value}
                className={`rounded-2xl border p-3 text-left transition ${role === value ? "border-[#17468c] bg-[#eef4fc] text-[#17468c]" : "border-[#e3eaf2] text-[#68778c] hover:border-[#b8cbe0]"}`}
              >
                <Icon size={19} />
                <span className="mt-3 block text-xs font-bold">{label}</span>
              </button>
            ))}
          </div>
          <form onSubmit={handleSubmit(enter)} className="mt-7 space-y-4">
            <Field label="Demo email" error={errors.email?.message}>
              <input
                {...register("email")}
                type="email"
                className={inputClass}
              />
            </Field>
            <Field label="Password" error={errors.password?.message}>
              <input
                {...register("password")}
                type="password"
                className={inputClass}
              />
            </Field>
            <Button
              type="submit"
              size="lg"
              className="w-full"
              disabled={!ready}
            >
              Continue to campus <ArrowRight size={17} />
            </Button>
          </form>
          <div className="my-5 flex items-center gap-3 text-xs text-[#68778c]">
            <span className="h-px flex-1 bg-[#e3eaf1]" />
            or explore instantly
            <span className="h-px flex-1 bg-[#e3eaf1]" />
          </div>
          <Button
            variant="secondary"
            size="lg"
            className="w-full"
            onClick={enter}
            disabled={!ready}
          >
            <Sparkles size={17} /> Continue as demo {role}
          </Button>
          {entryError && (
            <p role="alert" className="mt-4 text-sm text-red-700">
              {entryError}
            </p>
          )}
          <p className="mt-6 text-center text-xs leading-5 text-[#68778c]">
            Frontend demo only. Your activity stays on this device.
          </p>
        </div>
      </div>
    </div>
  );
}
export function OnboardingView() {
  return (
    <SessionBoundary>
      <OnboardingForm />
    </SessionBoundary>
  );
}
function OnboardingForm() {
  const router = useRouter();
  const user = useApp((s) => s.user);
  const setUser = useApp((s) => s.setUser);
  const [selectedInterests, setInterests] = useState<string[]>(user.interests);
  const [selectedSkills, setSkills] = useState<string[]>(user.skills);
  const [step, setStep] = useState(0);
  const [saveError, setSaveError] = useState("");
  const toggle = (value: string, items: string[], set: (v: string[]) => void) =>
    set(
      items.includes(value)
        ? items.filter((x) => x !== value)
        : [...items, value],
    );
  const finish = () => {
    if (selectedInterests.length < 3 || selectedSkills.length < 1) return;
    try {
      setUser({
        ...useApp.getState().user,
        interests: selectedInterests,
        skills: selectedSkills,
      });
      localStorage.setItem("mu-connect-onboarded", "true");
      router.push("/home");
    } catch {
      setSaveError(
        "Could not save your selections. Allow browser storage and try again. Your choices are still here.",
      );
    }
  };
  return (
    <div className="min-h-screen bg-[#f5f8fc] px-4 py-8">
      <div className="mx-auto max-w-3xl">
        <Link href="/" className="text-xl font-bold text-[#17468c]">
          M<span className="text-[#fac334]">.</span>{" "}
          <span className="font-medium">MU Connect</span>
        </Link>
        <div className="mt-10 card p-6 sm:p-10">
          <div className="mb-8 flex items-center gap-3">
            <div className="h-1.5 flex-1 rounded-full bg-[#17468c]" />
            <div
              className={`h-1.5 flex-1 rounded-full ${step === 1 ? "bg-[#17468c]" : "bg-[#e3eaf3]"}`}
            />
          </div>
          <p className="text-sm font-semibold text-[var(--text-muted)]">
            STEP {step + 1} OF 2
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">
            {step === 0
              ? "What are you curious about?"
              : "What can you bring to a team?"}
          </h1>
          <p className="mt-3 text-sm leading-6 text-[#68778c]">
            {step === 0
              ? "Choose at least 3 interests to help find relevant students and opportunities. There is no maximum; you can edit these later."
              : "Choose at least 1 skill you'd like to use or keep growing. There is no maximum; you can edit these later."}
          </p>
          <div className="mt-7 flex flex-wrap gap-2">
            {[
              ...new Set(
                step === 0
                  ? [...interests, ...selectedInterests]
                  : [...skills, ...selectedSkills],
              ),
            ].map((x) => {
              const active = (
                step === 0 ? selectedInterests : selectedSkills
              ).includes(x);
              return (
                <button
                  key={x}
                  aria-pressed={active}
                  onClick={() =>
                    step === 0
                      ? toggle(x, selectedInterests, setInterests)
                      : toggle(x, selectedSkills, setSkills)
                  }
                  className={`rounded-xl border px-4 py-2.5 text-sm font-semibold transition ${active ? "border-[#e0b64a] bg-[#fff4d4] text-[#795d20]" : "border-[#e0e8f0] bg-white text-[#68778c] hover:border-[#b8cbe0]"}`}
                >
                  {active && <Check size={14} className="mr-1 inline" />}
                  {x}
                </button>
              );
            })}
          </div>
          <div className="mt-8 flex items-center justify-between border-t border-[#e9eef4] pt-6">
            <span className="text-sm text-[#53647c]" role="status">
              {(step === 0 ? selectedInterests : selectedSkills).length}{" "}
              selected ·{" "}
              {step === 0 ? "at least 3 required" : "at least 1 required"}
            </span>
            <div className="flex gap-2">
              {step === 1 && (
                <Button variant="secondary" onClick={() => setStep(0)}>
                  Back
                </Button>
              )}
              <Button
                onClick={() => (step === 0 ? setStep(1) : finish())}
                disabled={
                  step === 0
                    ? selectedInterests.length < 3
                    : selectedSkills.length < 1
                }
              >
                {step === 0 ? "Continue" : "Enter the community"}{" "}
                <ArrowRight size={16} />
              </Button>
            </div>
          </div>
          {saveError && (
            <p role="alert" className="mt-4 text-sm text-red-700">
              {saveError}
            </p>
          )}
        </div>
        <p className="mt-5 text-center text-xs text-[#68778c]">
          Your selections are saved in this browser for the demo.
        </p>
      </div>
    </div>
  );
}
