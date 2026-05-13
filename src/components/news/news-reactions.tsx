"use client";

import { useCallback, useLayoutEffect, useMemo, useState, useSyncExternalStore } from "react";
import { uiT } from "@/lib/i18n/ui-dictionary";
import { useLocale } from "@/components/locale-provider";
import { cn } from "@/lib/cn";

const STORAGE_PREFIX = "su-react-v1:";
const COMMENT_PREFIX = "su-comm-v1:";

function hashCounts(id: string, salt: string, min: number, max: number) {
  const s = id + salt;
  let h = 0;
  for (let i = 0; i < s.length; i++) h = Math.imul(31, h) + s.charCodeAt(i);
  return min + (Math.abs(h) % (max - min));
}

function formatCount(n: number): string {
  if (n >= 10_000) return `${Math.round(n / 1000)}k`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

type StoredComment = { id: string; text: string; at: string };

type ReactionPack = {
  l: boolean;
  k: boolean;
  comments: StoredComment[];
  ready: boolean;
};

const EMPTY_PACK: ReactionPack = {
  l: false,
  k: false,
  comments: [],
  ready: false,
};

function newPack(): ReactionPack {
  return {
    l: false,
    k: false,
    comments: [],
    ready: false,
  };
}

const reactionByArticle = new Map<string, ReactionPack>();
const reactionListeners = new Map<string, Set<() => void>>();

function ensurePack(articleId: string): ReactionPack {
  let p = reactionByArticle.get(articleId);
  if (!p) {
    p = newPack();
    reactionByArticle.set(articleId, p);
  }
  return p;
}

function emitReaction(articleId: string) {
  reactionListeners.get(articleId)?.forEach((fn) => {
    fn();
  });
}

function subscribeReactions(articleId: string, onChange: () => void) {
  if (!reactionListeners.has(articleId)) {
    reactionListeners.set(articleId, new Set());
  }
  reactionListeners.get(articleId)!.add(onChange);
  const onStorage = (e: StorageEvent) => {
    if (
      e.key === STORAGE_PREFIX + articleId ||
      e.key === COMMENT_PREFIX + articleId ||
      e.key === null
    ) {
      loadReactionsFromStorage(articleId);
    }
  };
  if (typeof window !== "undefined") {
    window.addEventListener("storage", onStorage);
  }
  return () => {
    reactionListeners.get(articleId)?.delete(onChange);
    if (typeof window !== "undefined") {
      window.removeEventListener("storage", onStorage);
    }
  };
}

function getReactionSnapshot(articleId: string): ReactionPack {
  return reactionByArticle.get(articleId) ?? EMPTY_PACK;
}

function loadReactionsFromStorage(articleId: string) {
  const cur = ensurePack(articleId);
  let l = cur.l;
  let k = cur.k;
  let comments = cur.comments;
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + articleId);
    if (raw) {
      const p = JSON.parse(raw) as { l?: boolean; k?: boolean };
      l = !!p.l;
      k = !!p.k;
    }
  } catch {
    /* ignore */
  }
  try {
    const cr = localStorage.getItem(COMMENT_PREFIX + articleId);
    if (cr) {
      const list = JSON.parse(cr) as StoredComment[];
      if (Array.isArray(list)) comments = list;
    }
  } catch {
    /* ignore */
  }
  reactionByArticle.set(articleId, { l, k, comments, ready: true });
  emitReaction(articleId);
}

function persistReactions(articleId: string, next: { l: boolean; k: boolean }) {
  const cur = ensurePack(articleId);
  reactionByArticle.set(articleId, {
    ...cur,
    l: next.l,
    k: next.k,
  });
  try {
    localStorage.setItem(
      STORAGE_PREFIX + articleId,
      JSON.stringify({ l: next.l, k: next.k }),
    );
  } catch {
    /* ignore */
  }
  emitReaction(articleId);
}

function saveCommentsToStore(articleId: string, list: StoredComment[]) {
  const cur = ensurePack(articleId);
  reactionByArticle.set(articleId, { ...cur, comments: list });
  try {
    localStorage.setItem(COMMENT_PREFIX + articleId, JSON.stringify(list));
  } catch {
    /* ignore */
  }
  emitReaction(articleId);
}

export function NewsReactions({
  articleId,
  slug,
  title,
  summary,
  variant,
}: {
  articleId: string;
  slug: string;
  title: string;
  summary: string;
  variant: "card" | "article";
}) {
  const { locale } = useLocale();
  const pack = useSyncExternalStore(
    (cb) => subscribeReactions(articleId, cb),
    () => getReactionSnapshot(articleId),
    () => EMPTY_PACK,
  );

  useLayoutEffect(() => {
    loadReactionsFromStorage(articleId);
  }, [articleId]);

  const loved = pack.l;
  const liked = pack.k;
  const comments = pack.comments;
  const hydrated = pack.ready;

  const [announce, setAnnounce] = useState("");
  const [commentOpen, setCommentOpen] = useState(false);
  const [draft, setDraft] = useState("");

  const baseLove = useMemo(() => hashCounts(articleId, "love", 120, 9800), [articleId]);
  const baseLike = useMemo(() => hashCounts(articleId, "like", 340, 22_000), [articleId]);
  const baseComment = useMemo(() => hashCounts(articleId, "cmt", 12, 240), [articleId]);

  const persist = useCallback(
    (next: { l: boolean; k: boolean }) => {
      persistReactions(articleId, next);
    },
    [articleId],
  );

  const saveComments = useCallback(
    (list: StoredComment[]) => {
      saveCommentsToStore(articleId, list);
    },
    [articleId],
  );

  const loveCount = baseLove + (loved ? 1 : 0);
  const likeCount = baseLike + (liked ? 1 : 0);
  const commentCount = baseComment + comments.length;

  const pulseLove = () => {
    const next = !loved;
    persist({ l: next, k: liked });
    if (next) {
      setAnnounce(uiT(locale, "thanksLove"));
      window.setTimeout(() => setAnnounce(""), 3800);
    }
  };

  const toggleLike = () => {
    persist({ l: loved, k: !liked });
  };

  const share = async () => {
    const url =
      typeof window === "undefined" ? "" : `${window.location.origin}/news/${slug}`;
    try {
      if (navigator.share) {
        await navigator.share({ title, text: summary, url });
      } else {
        await navigator.clipboard.writeText(url);
      }
      setAnnounce(uiT(locale, "linkCopied"));
    } catch {
      try {
        await navigator.clipboard.writeText(url);
        setAnnounce(uiT(locale, "linkCopied"));
      } catch {
        setAnnounce("");
      }
    }
    window.setTimeout(() => setAnnounce(""), 4500);
  };

  const postComment = () => {
    const text = draft.trim();
    if (!text) return;
    const next: StoredComment[] = [
      ...comments,
      { id: `${Date.now()}`, text, at: new Date().toISOString() },
    ];
    saveComments(next);
    setDraft("");
  };

  const action = (active: boolean) =>
    cn(
      "inline-flex items-center gap-2 border-0 bg-transparent p-0 text-left text-sm transition-colors group",
      "text-[var(--muted-foreground)] hover:text-[var(--foreground)]",
      active && "font-medium text-[var(--foreground)]",
    );

  return (
    <div className={cn(variant === "article" ? "space-y-4" : "mt-4 space-y-3")}>
      <div
        className="flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-[var(--border)] pt-3 text-sm"
        role="group"
        aria-label={uiT(locale, "shareStory")}
      >
        <button type="button" onClick={pulseLove} aria-pressed={loved} className={action(loved)}>
          <IconHeart className="shrink-0" filled={loved} />
          <span>{uiT(locale, "love")}</span>
          <span className="tabular-nums text-[var(--muted-foreground)]">
            {formatCount(hydrated ? loveCount : baseLove)}
          </span>
        </button>
        <button type="button" onClick={toggleLike} aria-pressed={liked} className={action(liked)}>
          <IconThumb className="shrink-0" up={liked} />
          <span>{uiT(locale, "like")}</span>
          <span className="tabular-nums text-[var(--muted-foreground)]">
            {formatCount(hydrated ? likeCount : baseLike)}
          </span>
        </button>
        <button
          type="button"
          onClick={() => setCommentOpen((o) => !o)}
          aria-expanded={commentOpen}
          className={action(commentOpen)}
        >
          <IconComment className="shrink-0" active={commentOpen} />
          <span>{uiT(locale, "comment")}</span>
          <span className="tabular-nums text-[var(--muted-foreground)]">
            {formatCount(hydrated ? commentCount : baseComment)}
          </span>
        </button>
        <button type="button" onClick={share} className={action(false)}>
          <IconShare className="shrink-0" />
          {uiT(locale, "share")}
        </button>
      </div>

      {commentOpen && (
        <div className="border border-[var(--border)] bg-[var(--card)] p-4">
          <label className="sr-only" htmlFor={`comment-${articleId}`}>
            {uiT(locale, "addComment")}
          </label>
          <textarea
            id={`comment-${articleId}`}
            rows={3}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder={uiT(locale, "addComment")}
            className="w-full resize-none rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:border-[var(--foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--foreground)]/20"
          />
          <div className="mt-3 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setCommentOpen(false)}
              className="text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
            >
              Close
            </button>
            <button
              type="button"
              onClick={postComment}
              disabled={!draft.trim()}
              className="text-sm font-medium text-[var(--foreground)] underline underline-offset-4 decoration-[var(--border)] hover:decoration-[var(--foreground)] disabled:opacity-40 disabled:no-underline"
            >
              {uiT(locale, "postComment")}
            </button>
          </div>
          {comments.length > 0 && (
            <ul className="mt-4 max-h-40 space-y-2 overflow-y-auto border-t border-[var(--border)] pt-4 text-sm text-[var(--foreground)]">
              {comments.map((c) => (
                <li key={c.id} className="text-[var(--muted-foreground)]">
                  {c.text}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {variant === "article" && (
        <p className="max-w-prose text-sm text-[var(--muted-foreground)]">
          {uiT(locale, "readingComfort")}
        </p>
      )}

      <p className="sr-only" aria-live="polite">
        {announce}
      </p>
    </div>
  );
}

function IconHeart({ className, filled }: { className?: string; filled?: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={cn(
        "h-[17px] w-[17px] shrink-0 text-current",
        filled && "text-rose-600 dark:text-rose-400",
        className,
      )}
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.5 4.04 3 5.5l7 7Z" />
    </svg>
  );
}

function IconThumb({ className, up }: { className?: string; up?: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={cn("h-[17px] w-[17px] shrink-0 text-current", !up && "opacity-80", up && "opacity-100", className)}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M7 10v12" />
      <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z" />
    </svg>
  );
}

function IconComment({ className, active }: { className?: string; active?: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={cn("h-[17px] w-[17px] shrink-0 text-current", !active && "opacity-80", className)}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 7.5 7.5 0 0 1 4.7-7.59 8.38 8.38 0 0 1 3.8-.5h.5a8.5 8.5 0 0 1 8 8z" />
    </svg>
  );
}

function IconShare({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={cn("h-[17px] w-[17px] shrink-0 text-current opacity-80 group-hover:opacity-100", className)}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="18" cy="5" r="2.5" />
      <circle cx="6" cy="12" r="2.5" />
      <circle cx="18" cy="19" r="2.5" />
      <path d="M8.7 10.7 15.3 7.3M8.7 13.3l6.6 3.4" />
    </svg>
  );
}
