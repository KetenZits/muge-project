"use client";
import { useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import SplitText from "@/components/SplitText";
import BlurText from "@/components/BlurText";
import AnimatedContent from "@/components/AnimatedContent";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  GraduationCap,
  Eye,
  EyeOff,
  LoaderCircle,
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
  const [showPassword, setShowPassword] = useState(false);
  const [entering, setEntering] = useState(false);
  const entryLock = useRef(false);
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
    if (!ready || entryLock.current) return;
    entryLock.current = true;
    setEntering(true);
    setEntryError("");
    try {
      const current = useApp.getState().user;
      const completed = localStorage.getItem("mu-connect-onboarded") === "true";
      setUser({ ...current, role });
      router.push(completed ? "/home" : "/onboarding");
    } catch {
      entryLock.current = false;
      setEntering(false);
      setEntryError(
        "Could not save your demo session. Allow browser storage and try again. Your existing profile has not been replaced.",
      );
    }
  };
  return (
    <main className="login-page grid min-h-svh bg-white lg:grid-cols-2">
      <section
        className="login-story relative hidden min-h-svh flex-col justify-between overflow-hidden bg-[#071e40] p-10 text-white lg:flex xl:p-14"
        aria-label="Welcome to MU Connect"
      >
        <Link
          href="/"
          className="relative z-10 inline-flex min-h-11 items-center text-xl font-bold tracking-tight"
        >
          MU <span className="ml-1 font-medium">CONNECT</span>
          <span className="ml-1 text-[#f6d184]">·</span>
        </Link>
        <div className="relative z-10 my-14 max-w-lg">
          <h2 className="login-headline text-5xl font-semibold leading-[1.08] tracking-[-.035em] xl:text-6xl">
            <SplitText
              text="Find your people."
              tag="span"
              trigger="load"
              effect="rise"
              splitType="words"
              delay={45}
              duration={0.5}
            />
            <br />
            <em className="mt-2 block font-serif font-normal text-[#f6d184]">
              Build something together.
            </em>
          </h2>
          <BlurText
            text="Different faculties. Shared curiosity. Your next collaboration starts with a connection."
            trigger="load"
            delay={25}
            distance={8}
            blur={3}
            stepDuration={0.15}
            className="mt-6 max-w-sm text-base leading-7 text-[#d5e4f6]"
          />
        </div>
        <div className="relative z-10 max-w-md">
          <div className="relative h-48 overflow-hidden rounded-2xl xl:h-56">
            <Image
              src="/images/welcome/photo-collaboration.webp"
              alt="Two people collaborating at a laptop"
              fill
              sizes="(min-width: 1024px) 440px, 1px"
              className="object-cover"
              priority
            />
          </div>
          <p className="mt-3 text-xs leading-5 text-[#b8cce6]">
            A place to find collaborators, share ideas, and try something new.
            <br />
            Illustrative photograph · independent student community prototype.
          </p>
        </div>
        <p className="relative z-10 mt-10 text-xs text-[#b8cce6]">
          MU CONNECT · MADE FOR WHAT’S NEXT
        </p>
      </section>
      <section
        className="flex items-center justify-center px-5 py-8 sm:px-10 sm:py-12"
        aria-label="Demo login"
      >
        <div className="w-full max-w-[400px]">
          <Link
            href="/"
            className="mb-10 inline-flex min-h-11 items-center gap-2 text-sm text-muted hover:text-[#17468c]"
          >
            <ArrowLeft size={16} /> Back to home
          </Link>
          <div className="mb-6 text-lg font-bold text-[#17468c] lg:hidden">
            MU CONNECT<span className="text-[#a5812d]"> ·</span>
          </div>
          <AnimatedContent
            trigger="mount"
            distance={8}
            duration={0.3}
            initialOpacity={0.85}
          >
            <h1 className="text-3xl font-bold tracking-tight">
              Enter the demo
            </h1>
            <p className="mt-3 text-sm leading-6 text-[#68778c]">
              Pick up with your saved profile, or start exploring campus. No
              real account is created.
            </p>
            {dataError && (
              <div role="alert" className="mt-6 text-sm leading-6">
                <p className="font-semibold">Campus data is unavailable</p>
                <p className="mt-1 text-[var(--text-muted)]">{dataError}</p>
                <p className="mt-2 text-[var(--text-muted)]">
                  Your demo profile is ready. Campus data can be retried
                  separately.
                </p>
                <Button
                  variant="secondary"
                  className="mt-3"
                  onClick={retryData}
                >
                  Retry campus data
                </Button>
              </div>
            )}
            <p className="mt-6 text-xs font-semibold text-muted">
              Preview role · no real permissions
            </p>
            <div
              className="mt-2 grid grid-cols-3 gap-2"
              role="group"
              aria-label="Preview role"
            >
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
                  className={`flex min-h-11 items-center justify-center gap-2 rounded-xl border px-2 py-2 text-left transition ${role === value ? "border-[#17468c] bg-[#eef4fc] text-[#17468c]" : "border-[#e3eaf2] text-[#68778c] hover:border-[#b8cbe0]"}`}
                >
                  <Icon size={16} aria-hidden="true" />
                  <span className="text-xs font-semibold">{label}</span>
                </button>
              ))}
            </div>
            <form
              onSubmit={(event) => {
                void handleSubmit(enter)(event);
              }}
              className="mt-7 space-y-4"
            >
              <Field label="Demo email" error={errors.email?.message}>
                <input
                  {...register("email")}
                  type="email"
                  autoComplete="email"
                  aria-invalid={Boolean(errors.email)}
                  className={inputClass}
                />
              </Field>
              <div>
                <label
                  htmlFor="login-password"
                  className="mb-2 block text-sm font-semibold text-[#33445c]"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    {...register("password")}
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    aria-invalid={Boolean(errors.password)}
                    aria-describedby={
                      errors.password ? "password-error" : undefined
                    }
                    className={inputClass + " pr-12"}
                  />
                  <button
                    type="button"
                    className="icon-button absolute right-1 top-0 text-muted"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    aria-pressed={showPassword}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && (
                  <p
                    id="password-error"
                    role="alert"
                    className="mt-1 text-sm text-red-700"
                  >
                    {errors.password.message}
                  </p>
                )}
              </div>
              <Button
                type="submit"
                size="lg"
                className="w-full"
                disabled={!ready || entering}
              >
                {entering ? (
                  <>
                    <LoaderCircle size={17} className="animate-spin" /> Opening
                    campus…
                  </>
                ) : (
                  <>
                    Continue to campus <ArrowRight size={17} />
                  </>
                )}
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
              disabled={!ready || entering}
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
          </AnimatedContent>
        </div>
      </section>
    </main>
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
    <main className="min-h-screen bg-[#f5f8fc] px-4 py-8">
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
    </main>
  );
}
