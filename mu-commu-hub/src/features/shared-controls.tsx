import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";
import { inputClass } from "@/components/ui";

export function Segmented({
  options,
  value,
  setValue,
}: {
  options: string[];
  value: string;
  setValue: (value: string) => void;
}) {
  return (
    <div className="flex max-w-full gap-1 overflow-x-auto rounded-xl border border-[#e5ecf3] bg-white p-1">
      {options.map((x) => (
        <button
          key={x}
          onClick={() => setValue(x)}
          className={`shrink-0 rounded-lg px-4 py-2 text-xs font-semibold transition ${x === value ? "bg-[#17468c] text-white" : "text-[#7b8ba0] hover:bg-[#f4f7fb]"}`}
        >
          {x}
        </button>
      ))}
    </div>
  );
}

export function SearchInput({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  return (
    <div className="relative">
      <Search
        size={18}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9aabba]"
      />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={inputClass + " pl-11"}
        placeholder={placeholder}
      />
    </div>
  );
}

export function SectionHead({ title, href }: { title: string; href: string }) {
  return (
    <div className="mb-4 flex items-center justify-between">
      <h2 className="section-title">{title}</h2>
      <Link href={href} className="text-xs font-bold text-[#17468c]">
        View all <ArrowRight size={12} className="inline" />
      </Link>
    </div>
  );
}
