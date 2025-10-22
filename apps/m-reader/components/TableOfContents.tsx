'use client';

import Link from "next/link";

type TocItem = {
  id: string;
  title: string;
};

type TableOfContentsProps = {
  items?: TocItem[];
};

export function TableOfContents({ items = [] }: TableOfContentsProps) {
  return (
    <aside className="flex h-fit flex-col gap-4 rounded-reader bg-surface px-5 py-6 shadow-sheet">
      <header className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-ink-subtle">
        <span>目录</span>
        <span>{items.length.toString().padStart(2, "0")} 节</span>
      </header>
      <nav className="flex flex-col gap-2">
        {items.length === 0 ? (
          <span className="text-sm text-ink-subtle">
            即将加载章节结构。
          </span>
        ) : (
          items.map((item) => (
            <Link
              key={item.id}
              href={`#${item.id}`}
              className="rounded-md px-3 py-2 text-sm text-ink-subtle transition hover:bg-surface-muted hover:text-ink"
            >
              {item.title}
            </Link>
          ))
        )}
      </nav>
    </aside>
  );
}
