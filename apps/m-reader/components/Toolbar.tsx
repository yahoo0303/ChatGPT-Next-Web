'use client';

import Link from "next/link";
import { HOME_ROUTE, READER_ROUTE } from "@/lib/constants";

type ToolbarProps = {
  title?: string;
  onToggleToc?: () => void;
};

export function Toolbar({ title = "阅读器", onToggleToc }: ToolbarProps) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-4 rounded-reader bg-surface px-5 py-4 shadow-sheet">
      <div className="flex items-center gap-3">
        <span className="rounded-full border border-ink/10 px-3 py-1 text-xs uppercase tracking-[0.35em] text-ink-subtle">
          M档
        </span>
        <h2 className="text-xl font-semibold text-ink">{title}</h2>
      </div>
      <div className="flex items-center gap-3 text-sm text-ink-subtle">
        <button
          type="button"
          onClick={onToggleToc}
          className="rounded-full border border-ink/20 px-4 py-1 transition hover:border-accent hover:text-ink"
        >
          目录
        </button>
        <Link
          href={HOME_ROUTE}
          className="rounded-full border border-transparent bg-accent px-4 py-1 font-medium text-surface transition hover:bg-accent-soft hover:text-ink"
        >
          返回首页
        </Link>
        <Link
          href={READER_ROUTE}
          className="rounded-full border border-ink/10 px-4 py-1 transition hover:border-accent hover:text-ink"
        >
          刷新
        </Link>
      </div>
    </header>
  );
}
