"use client";

import { Check, ChevronDown, Search } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/form";

const topicOptions = [
  ["all", "Tất cả"],
  ["size", "Chọn size"],
  ["care", "Bảo quản"],
  ["material", "Chất liệu"],
  ["gift", "Quà tặng"],
] as const;

export function JournalSearchForm({ query, topic }: { query: string; topic: string }) {
  const [selectedTopic, setSelectedTopic] = useState(topicOptions.some(([value]) => value === topic) ? topic : "all");

  return (
    <form className="grid gap-3 rounded-sm border border-line bg-white p-4 shadow-soft md:grid-cols-[minmax(260px,1fr)_220px_auto]">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-light" />
        <Input className="pl-10" name="q" defaultValue={query} placeholder="Tìm bài viết..." />
      </div>
      <TopicSelect value={selectedTopic} onChange={setSelectedTopic} />
      <Button type="submit" className="h-11 px-5">Tìm kiếm</Button>
    </form>
  );
}

function TopicSelect({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const [open, setOpen] = useState(false);
  const label = topicOptions.find(([optionValue]) => optionValue === value)?.[1] ?? "Tất cả";

  return (
    <div className="relative">
      <input type="hidden" name="topic" value={value} />
      <button
        type="button"
        aria-expanded={open}
        aria-label="Chủ đề bài viết"
        onClick={() => setOpen((current) => !current)}
        className="flex h-11 w-full min-w-52 items-center justify-between gap-3 rounded-sm border border-line bg-pearl px-4 text-left text-sm font-medium text-slate outline-none transition hover:border-cta focus:border-cta focus:ring-2 focus:ring-cta/20"
      >
        <span>{label}</span>
        <ChevronDown className="h-4 w-4 text-slate-muted" />
      </button>
      {open ? (
        <div className="absolute left-0 right-0 top-full z-30 mt-2 overflow-hidden rounded-sm border border-line bg-pearl p-1 shadow-premium">
          {topicOptions.map(([optionValue, optionLabel]) => (
            <button
              key={optionValue}
              type="button"
              className="flex w-full items-center justify-between rounded-sm px-3 py-2 text-left text-sm text-slate hover:bg-cta-soft/45"
              onClick={() => {
                onChange(optionValue);
                setOpen(false);
              }}
            >
              {optionLabel}
              {optionValue === value ? <Check className="h-4 w-4 text-cta" /> : null}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
