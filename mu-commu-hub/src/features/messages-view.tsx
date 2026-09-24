"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ImagePlus,
  MessageCircle,
  Search,
  Send,
  Smile,
} from "lucide-react";
import {
  Avatar,
  Button,
  EmptyState,
  PageHeader,
  inputClass,
} from "@/components/ui";
import { useApp } from "@/stores/app";
import { relative } from "@/lib/utils";
export function MessagesView() {
  const {
    user,
    users,
    teams,
    conversations,
    messages,
    sendMessage,
    startConversation,
    openConversation,
  } = useApp();
  const [selected, setSelected] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [draft, setDraft] = useState("");
  const [typing, setTyping] = useState(false);
  const bottom = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);
  useEffect(() => {
    if (initialized.current || !conversations.length || !users.length) return;
    initialized.current = true;
    const params = new URLSearchParams(location.search);
    const target = params.get("user");
    const inviteId = params.get("invite");
    const invitedTeam = teams.find(
      (team) => team.id === inviteId && team.leaderId === user.id,
    );
    if (invitedTeam) {
      queueMicrotask(() =>
        setDraft(`Hi! Would you be interested in joining ${invitedTeam.title}? I'd love to tell you more about the team.`),
      );
    }
    if (!target) {
      if (window.innerWidth >= 768 && conversations[0]) {
        queueMicrotask(() => setSelected(conversations[0].id));
        void openConversation(conversations[0].id);
      }
      return;
    }
    void startConversation(target).then((id) => {
      setSelected(id);
      void openConversation(id);
    });
  }, [conversations, users, teams, user.id, startConversation, openConversation]);
  useEffect(() => {
    bottom.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, selected]);
  const shown = conversations.filter((x) => {
    const other = users.find(
      (u) => x.participantIds.includes(u.id) && u.id !== user.id,
    );
    return other?.name.toLowerCase().includes(query.toLowerCase());
  }).sort((first, second) => second.updatedAt.localeCompare(first.updatedAt));
  const current = conversations.find((x) => x.id === selected);
  const other = users.find(
    (x) => current?.participantIds.includes(x.id) && x.id !== user.id,
  );
  const thread = messages
    .filter((x) => x.conversationId === selected)
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft.trim() || !selected) return;
    await sendMessage({
      id: `msg-${crypto.randomUUID()}`,
      conversationId: selected,
      senderId: user.id,
      content: draft.trim(),
      createdAt: new Date().toISOString(),
    });
    setDraft("");
    setTyping(true);
    setTimeout(() => setTyping(false), 1700);
  };
  return (
    <div>
      <PageHeader
        eyebrow="CONVERSATIONS"
        title="Messages"
        subtitle="Keep the conversation going with people on campus."
      />
      <div className="card flex h-[min(680px,calc(100vh-190px))] min-h-[480px] overflow-hidden">
        <aside
          className={`w-full shrink-0 border-r border-[#e9eef4] md:w-[270px] ${selected ? "hidden md:block" : "block"}`}
        >
          <div className="border-b border-[#e9eef4] p-4">
            <div className="relative">
              <Search
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9aa8b6]"
              />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className={inputClass + " min-h-9 pl-9 text-xs"}
                placeholder="Search messages"
              />
            </div>
          </div>
          <div className="h-[calc(100%-70px)] overflow-y-auto">
            {shown.map((c) => {
              const person = users.find(
                (x) => c.participantIds.includes(x.id) && x.id !== user.id,
              );
              const last = messages
                .filter((message) => message.conversationId === c.id)
                .sort((first, second) => second.createdAt.localeCompare(first.createdAt))[0];
              return (
                <button
                  key={c.id}
                  onClick={() => {
                    setSelected(c.id);
                    void openConversation(c.id);
                  }}
                  className={`flex w-full items-start gap-3 border-b border-[#f0f3f7] p-4 text-left transition hover:bg-[#f7f9fc] ${selected === c.id ? "bg-[#eef4fc]" : ""}`}
                >
                  <Avatar user={person} size="sm" />
                  <span className="min-w-0 flex-1">
                    <span className="flex justify-between gap-2">
                      <strong className="truncate text-xs">
                        {person?.name ?? "Student"}
                      </strong>
                      <small className="shrink-0 text-[10px] text-[#a1afbd]">
                        {relative(c.updatedAt).replace(" ago", "")}
                      </small>
                    </span>
                    <span className="mt-1 block truncate text-xs text-[#8696a8]">
                      {last?.content ?? "Start a conversation"}
                    </span>
                  </span>
                  {c.unread > 0 && (
                    <i className="mt-1 h-2 w-2 rounded-full bg-[#17468c]" />
                  )}
                </button>
              );
            })}
          </div>
        </aside>
        <div
          className={`flex min-w-0 flex-1 flex-col ${selected ? "flex" : "hidden md:flex"}`}
        >
          {current && other ? (
            <>
              <div className="flex items-center gap-3 border-b border-[#e9eef4] px-4 py-3">
                <button
                  onClick={() => setSelected(null)}
                  className="rounded-lg p-1 text-[#6b7b90] md:hidden"
                  aria-label="Back to conversations"
                >
                  <ArrowLeft size={19} />
                </button>
                <Avatar user={other} size="sm" />
                <span className="flex-1">
                  <Link
                    href={`/profile/${other.username}`}
                    className="text-sm font-bold hover:text-[#17468c]"
                  >
                    {other.name}
                  </Link>
                  <span className="block text-[11px] text-[#46a27c]">
                    ● Active recently
                  </span>
                </span>
              </div>
              <div className="flex-1 space-y-4 overflow-y-auto bg-[#fbfcfe] p-4 sm:p-6">
                {thread.map((message) => {
                  const mine = message.senderId === user.id;
                  return (
                    <div
                      key={message.id}
                      className={`flex ${mine ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[78%] rounded-2xl px-4 py-3 text-sm leading-6 ${mine ? "rounded-br-sm bg-[#17468c] text-white" : "rounded-bl-sm border border-[#e8edf3] bg-white text-[#52657a]"}`}
                      >
                        {message.content}
                        <small
                          className={`mt-1 block text-right text-[10px] ${mine ? "text-[#cbdcf2]" : "text-[#a5b1be]"}`}
                        >
                          {new Date(message.createdAt).toLocaleTimeString(
                            "en-US",
                            { hour: "numeric", minute: "2-digit" },
                          )}
                        </small>
                      </div>
                    </div>
                  );
                })}
                {typing && (
                  <div className="inline-flex gap-1 rounded-2xl border border-[#e8edf3] bg-white px-4 py-3">
                    <i className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#a0aebe]" />
                    <i className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#a0aebe] [animation-delay:150ms]" />
                    <i className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#a0aebe] [animation-delay:300ms]" />
                  </div>
                )}
                <div ref={bottom} />
              </div>
              <form
                onSubmit={send}
                className="flex items-center gap-2 border-t border-[#e9eef4] p-3"
              >
                <button
                  type="button"
                  onClick={() => setDraft((x) => x + " 😊")}
                  className="p-2 text-[#8a9aac]"
                  aria-label="Add emoji"
                >
                  <Smile size={20} />
                </button>
                <button
                  type="button"
                  onClick={() => setDraft((x) => x + " [image]")}
                  className="p-2 text-[#8a9aac]"
                  aria-label="Attach image placeholder"
                >
                  <ImagePlus size={20} />
                </button>
                <input
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  className={inputClass + " min-h-10"}
                  placeholder="Write a message..."
                  aria-label="Message"
                />
                <Button
                  type="submit"
                  size="sm"
                  disabled={!draft.trim()}
                  aria-label="Send message"
                >
                  <Send size={17} />
                </Button>
              </form>
            </>
          ) : (
            <div className="flex h-full items-center justify-center">
              <EmptyState
                icon={<MessageCircle />}
                title="Select a conversation"
                description="Choose a student to continue chatting."
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
