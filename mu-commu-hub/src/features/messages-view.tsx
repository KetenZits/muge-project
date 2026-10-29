"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { ArrowLeft, MessageCircle, Search, Send, Smile } from "lucide-react";
import { toast } from "sonner";
import {
  Avatar,
  Button,
  EmptyState,
  PageHeader,
  inputClass,
} from "@/components/ui";
import { useShallow } from "zustand/react/shallow";
import { useApp } from "@/stores/app";
import { relative } from "@/lib/utils";
import { useUrlState, withReturnTo } from "@/lib/navigation";
import { motionTiming } from "@/lib/motion/config";

type Drafts = Record<string, string>;
export function MessagesView() {
  const reducedMotion = useReducedMotion();
  const {
    ready,
    user,
    users,
    teams,
    conversations,
    messages,
    sendMessage,
    startConversation,
    openConversation,
  } = useApp(
    useShallow((state) => ({
      ready: state.ready,
      user: state.user,
      users: state.users,
      teams: state.teams,
      conversations: state.conversations,
      messages: state.messages,
      sendMessage: state.sendMessage,
      startConversation: state.startConversation,
      openConversation: state.openConversation,
    })),
  );
  const [state, setState] = useUrlState({
    conversation: "",
    query: "",
    user: "",
    invite: "",
  });
  const selected = state.conversation || null;
  const [drafts, setDrafts] = useState<Drafts>({});
  const draftsRef = useRef<Drafts>({});
  const [draftUser, setDraftUser] = useState("");
  const [storageWarning, setStorageWarning] = useState("");
  const [startError, setStartError] = useState("");
  const [startRetry, setStartRetry] = useState(0);
  const [sendErrors, setSendErrors] = useState<Record<string, string>>({});
  const [sending, setSending] = useState(false);
  const [animatedMessageId, setAnimatedMessageId] = useState<string | null>(
    null,
  );
  const storageKey = `mu-connect-message-drafts:${user.id}`;
  const canPersist = useRef(true);
  const initialized = useRef("");
  const bottom = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let active = true;
    let restored: Drafts = {};
    let warning = "";
    canPersist.current = true;
    try {
      const raw = localStorage.getItem(storageKey);
      const value: unknown = raw ? JSON.parse(raw) : {};
      if (!value || typeof value !== "object" || Array.isArray(value))
        throw new Error("Invalid drafts");
      restored = Object.fromEntries(
        Object.entries(value).filter(
          (entry): entry is [string, string] => typeof entry[1] === "string",
        ),
      );
    } catch {
      canPersist.current = false;
      warning =
        "Saved message drafts could not be restored. New drafts will stay in this page until you leave. Allow browser storage and reload to try again.";
    }
    queueMicrotask(() => {
      if (!active) return;
      draftsRef.current = restored;
      setDrafts(restored);
      setStorageWarning(warning);
      setDraftUser(user.id);
    });
    return () => {
      active = false;
    };
  }, [storageKey, user.id]);
  const updateDraft = useCallback(
    (conversationId: string, value: string) => {
      const next = { ...draftsRef.current };
      if (value) next[conversationId] = value;
      else delete next[conversationId];
      draftsRef.current = next;
      setDrafts(next);
      if (!canPersist.current) return;
      try {
        localStorage.setItem(storageKey, JSON.stringify(next));
        setStorageWarning("");
      } catch {
        setStorageWarning(
          "This draft is still here, but browser storage could not save it. Keep this page open and try again before leaving.",
        );
      }
    },
    [storageKey],
  );
  useEffect(() => {
    if (!ready || !users.length || draftUser !== user.id) return;
    const key = `${user.id}:${state.user}:${state.invite}:${startRetry}`;
    if (initialized.current === key) return;
    initialized.current = key;
    if (!state.user) {
      if (!selected && window.innerWidth >= 768 && conversations[0])
        queueMicrotask(() =>
          setState({ conversation: conversations[0].id }, { replace: true }),
        );
      return;
    }
    void (async () => {
      try {
        if (
          state.user === user.id ||
          !users.some((person) => person.id === state.user)
        )
          throw new Error("Student not found");
        const id = await startConversation(state.user);
        if (
          initialized.current !== key ||
          window.location.pathname !== "/messages"
        )
          return;
        const invitedTeam = teams.find(
          (team) => team.id === state.invite && team.leaderId === user.id,
        );
        if (invitedTeam && !draftsRef.current[id])
          updateDraft(
            id,
            `Hi! Would you be interested in joining ${invitedTeam.title}? I'd love to tell you more about the team.`,
          );
        setState({ conversation: id, user: "", invite: "" }, { replace: true });
        setStartError("");
      } catch {
        if (
          initialized.current === key &&
          window.location.pathname === "/messages"
        )
          setStartError(
            "Could not open this conversation. Try again or choose another student from People.",
          );
      }
    })();
  }, [
    ready,
    users,
    teams,
    conversations,
    draftUser,
    user.id,
    state.user,
    state.invite,
    selected,
    startRetry,
    startConversation,
    setState,
    updateDraft,
  ]);
  useEffect(() => {
    if (!selected) return;
    void openConversation(selected).catch(() =>
      toast.error(
        "Could not mark this conversation as read. Open it again to retry.",
      ),
    );
  }, [selected, openConversation]);
  useEffect(() => {
    // Scroll only the thread; keep page position and mobile navigation still.
    const scroller = bottom.current?.parentElement;
    scroller?.scrollTo({
      top: scroller.scrollHeight,
      behavior: reducedMotion ? "instant" : "smooth",
    });
  }, [messages, selected, reducedMotion]);
  const shown = conversations
    .filter((conversation) => {
      const person = users.find(
        (item) =>
          conversation.participantIds.includes(item.id) && item.id !== user.id,
      );
      return (
        conversation.participantIds.includes(user.id) &&
        person?.name.toLowerCase().includes(state.query.trim().toLowerCase())
      );
    })
    .sort((first, second) => second.updatedAt.localeCompare(first.updatedAt));
  const current = conversations.find(
    (item) => item.id === selected && item.participantIds.includes(user.id),
  );
  const other = users.find(
    (person) =>
      current?.participantIds.includes(person.id) && person.id !== user.id,
  );
  const thread = messages
    .filter((message) => message.conversationId === selected)
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  const draft = selected ? (drafts[selected] ?? "") : "";
  const send = async (event: React.FormEvent) => {
    event.preventDefault();
    if (
      !draft.trim() ||
      !selected ||
      !current ||
      sending ||
      draftUser !== user.id
    )
      return;
    const conversationId = selected;
    const submitted = draft;
    const id = `msg-${crypto.randomUUID()}`;
    setSending(true);
    setSendErrors((items) => ({ ...items, [conversationId]: "" }));
    try {
      await sendMessage({
        id,
        conversationId,
        senderId: user.id,
        content: submitted.trim(),
        createdAt: new Date().toISOString(),
      });
      setAnimatedMessageId(id);
      if (draftsRef.current[conversationId] === submitted)
        updateDraft(conversationId, "");
      toast.success("Message saved in your local demo");
    } catch {
      setSendErrors((items) => ({
        ...items,
        [conversationId]:
          "Could not save your message. Your draft is still here. Try sending again.",
      }));
    } finally {
      setSending(false);
    }
  };
  return (
    <div>
      <PageHeader
        title="Messages"
        subtitle="Pick up a conversation or connect with someone new."
        action={
          <Button asChild variant="secondary">
            <Link href="/people">
              <MessageCircle size={16} />
              New conversation
            </Link>
          </Button>
        }
      />
      <p className="mb-4 text-xs leading-5 text-muted">
        Local demo · conversations stay in this browser and are not delivered to
        other people.
      </p>
      {startError && (
        <div
          role="alert"
          className="mb-4 rounded-xl bg-[#fdf0ef] p-4 text-sm text-red-800"
        >
          <p>{startError}</p>
          <Button
            variant="secondary"
            size="sm"
            className="mt-3"
            onClick={() => setStartRetry((value) => value + 1)}
          >
            Try again
          </Button>
          <Link href="/people" className="ml-4 font-semibold underline">
            Find students
          </Link>
        </div>
      )}
      <div className="messages-workspace card flex min-h-[400px] overflow-hidden">
        <aside
          className={`h-full w-full shrink-0 flex-col border-r border-[#e5ebf2] md:w-[280px] ${selected ? "hidden md:flex" : "flex"}`}
        >
          <div className="border-b border-[#e5ebf2] p-4">
            <label
              htmlFor="conversation-search"
              className="mb-2 block text-sm font-semibold"
            >
              Find a conversation
            </label>
            <div className="relative">
              <Search
                size={17}
                aria-hidden
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#68778c]"
              />
              <input
                id="conversation-search"
                type="search"
                value={state.query}
                onChange={(event) =>
                  setState({ query: event.target.value }, { replace: true })
                }
                className={inputClass + " pl-10"}
                placeholder="Search students by name"
              />
            </div>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto">
            {shown.map((conversation) => {
              const person = users.find(
                (item) =>
                  conversation.participantIds.includes(item.id) &&
                  item.id !== user.id,
              );
              const last = messages
                .filter((message) => message.conversationId === conversation.id)
                .sort((a, b) => b.createdAt.localeCompare(a.createdAt))[0];
              return (
                <button
                  key={conversation.id}
                  onClick={() =>
                    setState({
                      conversation: conversation.id,
                      user: "",
                      invite: "",
                    })
                  }
                  aria-pressed={selected === conversation.id}
                  className={`flex w-full items-start gap-3 border-b border-[#edf1f5] p-4 text-left hover:bg-[#f5f8fc] ${selected === conversation.id ? "bg-[#eaf1fc]" : ""}`}
                >
                  <Avatar user={person} size="sm" />
                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap justify-between gap-x-2 gap-y-1">
                      <strong className="text-sm">
                        {person?.name ?? "Student"}
                      </strong>
                      <small className="text-xs text-[#68778c]">
                        {relative(conversation.updatedAt)}
                      </small>
                    </span>
                    <span className="mt-1 block truncate text-sm text-[#53647c]">
                      {drafts[conversation.id]
                        ? `Draft: ${drafts[conversation.id]}`
                        : (last?.content ?? "Start a conversation")}
                    </span>
                    {conversation.unread > 0 && (
                      <span className="mt-1 block text-xs font-semibold text-[#17468c]">
                        {conversation.unread} unread
                      </span>
                    )}
                  </span>
                </button>
              );
            })}
            {!shown.length && (
              <div className="p-5 text-sm leading-6 text-[#53647c]">
                <p>
                  {state.query.trim()
                    ? `No conversations match “${state.query.trim()}”.`
                    : "No conversations yet. Find a student to start one in your local demo."}
                </p>
                {state.query.trim() ? (
                  <Button
                    variant="secondary"
                    size="sm"
                    className="mt-3"
                    onClick={() => setState({ query: "" })}
                  >
                    Clear search
                  </Button>
                ) : (
                  <Link
                    href="/people"
                    className="mt-3 inline-flex min-h-11 items-center font-semibold text-[#17468c]"
                  >
                    Find students
                  </Link>
                )}
              </div>
            )}
          </div>
        </aside>
        <div
          className={`min-h-0 min-w-0 flex-1 flex-col ${selected ? "flex" : "hidden md:flex"}`}
        >
          {current && other ? (
            <>
              <div className="flex items-center gap-3 border-b border-[#e5ebf2] px-3 py-3 sm:px-4">
                <button
                  onClick={() => setState({ conversation: "" })}
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-[#53647c] md:hidden"
                  aria-label="Back to conversations"
                >
                  <ArrowLeft size={20} />
                </button>
                <Avatar user={other} size="sm" />
                <div className="min-w-0 flex-1">
                  <Link
                    href={withReturnTo(`/profile/${other.username}`)}
                    className="break-words text-sm font-bold text-[#17468c]"
                  >
                    {other.name}
                  </Link>
                  <p className="mt-1 text-xs text-[#68778c]">
                    Local demo conversation
                  </p>
                </div>
              </div>
              <div className="min-h-0 flex-1 space-y-4 overflow-y-auto bg-[#f8fafd] p-4 sm:p-6">
                {!thread.length && (
                  <p className="py-6 text-center text-sm text-[#53647c]">
                    Start with an introduction or ask about a shared interest.
                  </p>
                )}
                {thread.map((message) => {
                  const mine = message.senderId === user.id;
                  return (
                    <motion.div
                      key={message.id}
                      initial={
                        reducedMotion || animatedMessageId !== message.id
                          ? false
                          : { opacity: 0, x: mine ? 12 : -12 }
                      }
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        duration: reducedMotion ? 0 : motionTiming.normal,
                        ease: motionTiming.easeOut,
                      }}
                      className={`flex ${mine ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[85%] break-words rounded-2xl px-4 py-3 text-sm leading-6 ${mine ? "rounded-br-sm bg-[#17468c] text-white" : "rounded-bl-sm border border-[#e5ebf2] bg-white text-[#53647c]"}`}
                      >
                        <p className="whitespace-pre-wrap">{message.content}</p>
                        <small
                          className={`mt-1 block text-right text-xs ${mine ? "text-[#dbe8fa]" : "text-[#68778c]"}`}
                        >
                          {new Date(message.createdAt).toLocaleTimeString(
                            "en-US",
                            { hour: "numeric", minute: "2-digit" },
                          )}
                        </small>
                      </div>
                    </motion.div>
                  );
                })}
                <div ref={bottom} />
              </div>
              {sendErrors[selected!] && (
                <p
                  id="message-send-error"
                  role="alert"
                  className="border-t border-[#e5ebf2] px-4 py-3 text-sm text-red-700"
                >
                  {sendErrors[selected!]}
                </p>
              )}
              {storageWarning && (
                <p role="status" className="px-4 py-2 text-sm text-[#8a6820]">
                  {storageWarning}
                </p>
              )}
              <form
                onSubmit={send}
                className="flex items-center gap-2 border-t border-[#e5ebf2] p-3"
              >
                <button
                  type="button"
                  disabled={draftUser !== user.id}
                  onClick={() => updateDraft(selected!, draft + " 🙂")}
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-[#53647c]"
                  aria-label="Add smile emoji"
                >
                  <Smile size={20} />
                </button>
                <input
                  value={draft}
                  onChange={(event) =>
                    updateDraft(selected!, event.target.value)
                  }
                  disabled={draftUser !== user.id}
                  className={
                    inputClass + " min-w-0 flex-1 text-base sm:text-sm"
                  }
                  placeholder="Write a message…"
                  aria-label={`Message ${other.name}`}
                  aria-describedby={
                    sendErrors[selected!] ? "message-send-error" : undefined
                  }
                />
                <Button
                  type="submit"
                  className="min-h-11 min-w-11 shrink-0"
                  disabled={!draft.trim() || sending || draftUser !== user.id}
                  aria-label={sending ? "Saving message" : "Send message"}
                >
                  {sending ? "Saving…" : <Send size={18} />}
                </Button>
              </form>
            </>
          ) : (
            <div className="flex h-full items-center justify-center">
              <EmptyState
                icon={<MessageCircle />}
                title={
                  selected
                    ? "Conversation unavailable"
                    : "Select a conversation"
                }
                description={
                  selected
                    ? "Choose another conversation or find a student to start one."
                    : "Choose a student to continue a local demo conversation."
                }
                action={
                  selected ? (
                    <Button
                      variant="secondary"
                      onClick={() =>
                        setState({ conversation: "", user: "", invite: "" })
                      }
                    >
                      Back to conversations
                    </Button>
                  ) : undefined
                }
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
