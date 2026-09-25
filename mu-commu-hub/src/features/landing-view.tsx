import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  Compass,
  MessageCircle,
  Sparkles,
  Trophy,
  Users,
} from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { HeroNetwork } from "@/components/three/hero-network";
const features = [
  {
    icon: Users,
    title: "Find teammates",
    body: "Build a team around the skills and energy your idea needs.",
  },
  {
    icon: Trophy,
    title: "Discover competitions",
    body: "See challenges worth entering and find people to join you.",
  },
  {
    icon: MessageCircle,
    title: "Share ideas",
    body: "Ask questions, swap insights, and start conversations.",
  },
  {
    icon: Compass,
    title: "Grow your network",
    body: "Meet students across faculties who see the world like you.",
  },
];
export default function LandingView() {
  return (
    <div className="bg-white">
      <header className="landing-nav-enter sticky top-0 z-20 border-b border-[#e9eef4] bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-5 md:px-8">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-[13px] bg-[#17468c] text-xl font-black text-white">
              M<span className="text-[#fac334]">.</span>
            </span>
            <span className="text-xl font-bold tracking-[-.06em] text-[#17468c]">
              MU <span className="font-medium text-[#263e5b]">Connect</span>
            </span>
          </Link>
          <nav className="hidden items-center gap-8 text-sm font-semibold text-[#718196] md:flex">
            <a href="#features">Features</a>
            <a href="#communities">Community</a>
            <a href="#competitions">Competitions</a>
            <a href="#about">About</a>
          </nav>
          <Link
            href="/login"
            className="landing-link-button landing-primary-cta inline-flex h-10 items-center gap-2 rounded-xl bg-[#17468c] px-4 text-sm font-semibold text-white"
          >
            Enter demo <ArrowRight size={16} />
          </Link>
        </div>
      </header>
      <main>
        <section className="hero-glow border-b border-[#edf1f5]">
          <div className="mx-auto grid max-w-7xl items-center gap-8 px-5 py-12 sm:py-16 md:grid-cols-2 md:gap-12 md:px-8 md:py-28">
            <Reveal className="min-w-0" y={12}>
              <span className="inline-flex items-center gap-2 rounded-full border border-[#e6d49f] bg-[#fff8e5] px-3 py-1.5 text-xs font-bold text-[#927028]">
                <Sparkles size={14} /> YOUR CAMPUS, MORE CONNECTED
              </span>
              <h1 className="mt-5 max-w-xl text-[44px] font-bold leading-[1.06] tracking-[-.065em] text-[#172a43] sm:mt-7 sm:text-[64px]">
                Find your people.
                <br />
                <span className="text-[#17468c]">Build something</span>
                <br />
                together<span className="text-[#fac334]">.</span>
              </h1>
              <p className="thai mt-4 max-w-lg text-base text-[#65788f] sm:mt-6">
                พื้นที่สำหรับหาเพื่อนร่วมทีม แบ่งปันไอเดีย และค้นพบโอกาสใหม่ ๆ
                ในมหาวิทยาลัย
              </p>
              <p className="mt-3 max-w-lg text-sm leading-7 text-[#788ba0]">
                Meet students through shared interests, skills, projects,
                competitions, and everyday campus life.
              </p>
              <div className="mt-6 flex flex-wrap gap-3 sm:mt-8">
                <Link
                  href="/login"
                  className="landing-link-button landing-primary-cta inline-flex h-12 items-center gap-2 rounded-xl bg-[#17468c] px-6 text-sm font-bold text-white"
                >
                  Start exploring <ArrowRight size={17} />
                </Link>
                <Link
                  href="/teams"
                  className="landing-link-button inline-flex h-12 items-center gap-2 rounded-xl border border-[#dbe5ef] bg-white px-6 text-sm font-bold text-[#17468c]"
                >
                  Find a team <Users size={17} />
                </Link>
              </div>
              <div className="mt-6 flex items-center gap-4 sm:mt-9">
                <div className="flex -space-x-2">
                  {["TC", "PS", "NW", "SK"].map((x, i) => (
                    <span
                      key={x}
                      className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white text-xs font-bold text-[#17468c]"
                      style={{
                        background: [
                          "#dce9fa",
                          "#fae5c8",
                          "#e5e1f6",
                          "#dff2e8",
                        ][i],
                      }}
                    >
                      {x}
                    </span>
                  ))}
                </div>
                <p className="text-xs leading-5 text-[#8b9bad]">
                  <b className="text-[#243c59]">Ideas grow faster together.</b>
                  <br />
                  Meet the people behind your next project.
                </p>
              </div>
            </Reveal>
            <Reveal className="min-w-0" delay={0.16}>
              <HeroNetwork />
            </Reveal>
          </div>
        </section>
        <section id="features" className="mx-auto max-w-7xl px-5 py-20 md:px-8">
          <Reveal className="text-center">
            <p className="text-xs font-bold uppercase tracking-[.16em] text-[#a5812d]">
              EVERYTHING STARTS WITH CONNECTION
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Make more of your campus years.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-[#8292a5]">
              The right conversation can become your next project, friendship,
              or breakthrough.
            </p>
          </Reveal>
          <div className="mt-10 grid gap-4 md:grid-cols-4">
            {features.map(({ icon: Icon, title, body }, index) => (
              <Reveal key={title} delay={index * 0.05}>
                <div className="landing-card h-full rounded-[20px] border border-[#e6edf4] bg-white p-6">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eaf1fc] text-[#17468c]">
                    <Icon size={23} />
                  </span>
                  <h3 className="mt-5 text-base font-bold">{title}</h3>
                  <p className="mt-2 text-xs leading-6 text-[#8292a5]">
                    {body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>
        <section id="communities" className="bg-[#f5f8fc] py-20">
          <div className="mx-auto max-w-7xl px-5 md:px-8">
            <Reveal className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-[#a5812d]">
                  FIND YOUR CIRCLE
                </p>
                <h2 className="mt-2 text-3xl font-bold tracking-tight">
                  Communities that feel like yours.
                </h2>
              </div>
              <Link
                href="/communities"
                className="text-sm font-bold text-[#17468c]"
              >
                Explore communities{" "}
                <ArrowUpRight size={15} className="inline" />
              </Link>
            </Reveal>
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {[
                [
                  "✦",
                  "AI Collective",
                  "Explore AI, research, and tools changing our world.",
                  "#e6eef9",
                ],
                [
                  "⌘",
                  "Web Builders",
                  "Design and ship better things for the web.",
                  "#f8eccc",
                ],
                [
                  "◐",
                  "Design Studio",
                  "A home for visual thinkers and problem solvers.",
                  "#eee6f9",
                ],
              ].map(([icon, name, copy, color], index) => (
                <Reveal key={name} delay={index * 0.06}>
                  <Link
                    href="/communities"
                    className="landing-card block h-full overflow-hidden rounded-[20px] border border-[#e4ebf3] bg-white"
                  >
                    <div
                      className="flex h-28 items-center px-6 text-5xl text-[#17468c]"
                      style={{ background: color }}
                    >
                      {icon}
                    </div>
                    <div className="p-6">
                      <h3 className="font-bold">{name}</h3>
                      <p className="mt-2 text-xs leading-6 text-[#8696a8]">
                        {copy}
                      </p>
                      <span className="mt-4 inline-flex text-xs font-bold text-[#17468c]">
                        Meet the community →
                      </span>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
        <section
          id="competitions"
          className="mx-auto max-w-7xl px-5 py-20 md:px-8"
        >
          <div className="grid items-center gap-10 md:grid-cols-2">
            <Reveal>
              <p className="text-xs font-bold uppercase tracking-widest text-[#a5812d]">
                YOUR NEXT CHALLENGE
              </p>
              <h2 className="mt-3 max-w-md text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
                Big ideas deserve a great team.
              </h2>
              <p className="mt-4 max-w-md text-sm leading-7 text-[#7b8c9f]">
                From hackathons to startup pitches, find the events that stretch
                you and the teammates who help you get there.
              </p>
              <Link
                href="/competitions"
                className="landing-link-button landing-primary-cta mt-6 inline-flex h-11 items-center gap-2 rounded-xl bg-[#17468c] px-5 text-sm font-bold text-white"
              >
                Explore competitions <ArrowRight size={16} />
              </Link>
            </Reveal>
            <Reveal className="space-y-3" delay={0.1}>
              {[
                [
                  "Campus AI Challenge 2026",
                  "Innovation · Technology",
                  "Open for registration",
                ],
                [
                  "MU Innovation Hackathon",
                  "Design · Engineering",
                  "Teams forming now",
                ],
                [
                  "Thailand Startup League",
                  "Business · Startup",
                  "Applications open",
                ],
              ].map(([name, tags, status], i) => (
                <div
                  key={name}
                  className="flex items-center gap-4 rounded-2xl border border-[#e6edf4] bg-white p-4"
                >
                  <span
                    className={`flex h-14 w-14 items-center justify-center rounded-xl ${i === 0 ? "bg-[#17468c] text-[#fac334]" : "bg-[#eaf1fc] text-[#17468c]"}`}
                  >
                    {i === 0 ? (
                      <Trophy size={23} />
                    ) : i === 1 ? (
                      <Sparkles size={23} />
                    ) : (
                      <CalendarDays size={23} />
                    )}
                  </span>
                  <span className="flex-1">
                    <b className="block text-sm">{name}</b>
                    <small className="mt-1 block text-xs text-[#93a0af]">
                      {tags}
                    </small>
                  </span>
                  <span className="hidden rounded-full bg-[#e9f6ef] px-2 py-1 text-[10px] font-bold text-[#27815c] sm:block">
                    {status}
                  </span>
                </div>
              ))}
            </Reveal>
          </div>
        </section>
        <section
          id="about"
          className="bg-[#17468c] px-5 py-20 text-center text-white"
        >
          <Reveal>
            <p className="text-xs font-bold uppercase tracking-widest text-[#fac334]">
              READY WHEN YOU ARE
            </p>
            <h2 className="mx-auto mt-3 max-w-xl text-3xl font-bold tracking-tight sm:text-4xl">
              Your next team could be one hello away.
            </h2>
            <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-[#d9e6f7]">
              Step into a community made for curious, ambitious students. Your
              first connection starts here.
            </p>
            <Link
              href="/login"
              className="landing-link-button landing-gold-cta mt-7 inline-flex h-12 items-center gap-2 rounded-xl bg-[#fac334] px-6 text-sm font-bold text-[#55400c]"
            >
              Enter the demo <ArrowRight size={17} />
            </Link>
          </Reveal>
        </section>
      </main>
      <footer className="bg-[#102f61] px-5 py-7 text-[#abc1df]">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 text-xs">
          <span>
            <b className="text-white">MU Connect</b> · A student community
            prototype
          </span>
          <span>Independent concept · Not an official university service</span>
        </div>
      </footer>
    </div>
  );
}
