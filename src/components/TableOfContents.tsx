"use client";

import { useEffect, useState } from "react";

interface Props {
  items: { id: string; label: string }[];
}

export function TableOfContents({ items }: Props) {
  const [active, setActive] = useState(items[0]?.id);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length) {
          visible.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
          setActive(visible[0].target.id);
        }
      },
      // Treat a section as "current" once it crosses the upper third of the viewport
      { rootMargin: "-80px 0px -65% 0px" }
    );
    items.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [items]);

  return (
    <nav aria-label="On this page" className="sticky top-28">
      <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-subtle mb-4">
        On this page
      </p>
      <ul className="border-l border-line">
        {items.map((item) => {
          const isActive = item.id === active;
          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                aria-current={isActive ? "location" : undefined}
                className={`block -ml-px border-l py-1.5 pl-4 text-sm transition-colors ${
                  isActive
                    ? "border-accent text-fg font-medium"
                    : "border-transparent text-muted hover:text-fg"
                }`}
              >
                {item.label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
