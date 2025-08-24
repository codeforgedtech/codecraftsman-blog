import React from "react";
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/solid";

interface SearchBarProps {
  value: string;
  onSearch: (term: string) => void;
  placeholder?: string;
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onSearch,
  placeholder = "Search…",
  className = "",
}) => {
  const clear = () => onSearch("");

  return (
    <div className={`relative ${className}`}>
      {/* Gradient border wrapper for the input */}
      <div className="rounded-xl p-[1px] bg-gradient-to-br from-cyan-500/30 via-white/10 to-transparent">
        <div className="relative rounded-xl bg-slate-900 ring-1 ring-white/10 focus-within:ring-2 focus-within:ring-cyan-500/50">
          {/* Left icon */}
          <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />

          <input
            type="text"
            value={value}
            onChange={(e) => onSearch(e.target.value)}
            placeholder={placeholder}
            className="w-full bg-transparent text-white placeholder-gray-400 rounded-xl pl-10 pr-10 py-2.5 outline-none"
            aria-label={placeholder}
          />

          {/* Clear button */}
          {value && (
            <button
              type="button"
              onClick={clear}
              className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex items-center justify-center h-8 w-8 rounded-lg text-gray-300 hover:text-white hover:bg-white/10"
              aria-label="Clear search"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchBar;

