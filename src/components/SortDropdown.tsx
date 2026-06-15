import { createSignal, For, Show, onCleanup, onMount } from "solid-js";
import { SortField, SortOrder } from "~/lib/api";

interface SortOption {
  field: number;
  order: number;
  label: string;
  value: string;
}

const ALL_OPTIONS: SortOption[] = [
  { field: SortField.Date, order: SortOrder.Descending, label: "Newest", value: "1-2" },
  { field: SortField.Date, order: SortOrder.Ascending, label: "Oldest", value: "1-1" },
  { field: SortField.Popularity, order: SortOrder.Ascending, label: "Most popular", value: "6-1" },
  { field: SortField.Popularity, order: SortOrder.Descending, label: "Least popular", value: "6-2" },
  { field: SortField.Likes, order: SortOrder.Ascending, label: "Most liked", value: "2-1" },
  { field: SortField.Comments, order: SortOrder.Ascending, label: "Most commented", value: "3-1" },
  { field: SortField.Reblogs, order: SortOrder.Ascending, label: "Most reblogged", value: "4-1" },
];

export interface SortDropdownProps {
  value: string;
  onChange: (field: number, order: number) => void;
  options?: {
    newest?: boolean;
    oldest?: boolean;
    mostPopular?: boolean;
    leastPopular?: boolean;
    mostLiked?: boolean;
    mostCommented?: boolean;
    mostReblogged?: boolean;
  };
}

export default function SortDropdown(props: SortDropdownProps) {
  const [open, setOpen] = createSignal(false);
  let containerRef: HTMLDivElement | undefined;

  const enabledMap = () => {
    const opts = props.options ?? {};
    return {
      newest: opts.newest ?? true,
      oldest: opts.oldest ?? true,
      mostPopular: opts.mostPopular ?? false,
      leastPopular: opts.leastPopular ?? false,
      mostLiked: opts.mostLiked ?? false,
      mostCommented: opts.mostCommented ?? false,
      mostReblogged: opts.mostReblogged ?? false,
    };
  };

  const availableOptions = () => {
    const map = enabledMap();
    return ALL_OPTIONS.filter((o) => {
      if (o.value === "1-2") return map.newest;
      if (o.value === "1-1") return map.oldest;
      if (o.value === "6-1") return map.mostPopular;
      if (o.value === "6-2") return map.leastPopular;
      if (o.value === "2-1") return map.mostLiked;
      if (o.value === "3-1") return map.mostCommented;
      if (o.value === "4-1") return map.mostReblogged;
      return false;
    });
  };

  const currentLabel = () => {
    const found = ALL_OPTIONS.find((o) => o.value === props.value);
    return found?.label ?? "Sort";
  };

  const handleSelect = (option: SortOption) => {
    props.onChange(option.field, option.order);
    setOpen(false);
  };

  const handleClickOutside = (e: MouseEvent) => {
    if (containerRef && !containerRef.contains(e.target as Node)) {
      setOpen(false);
    }
  };

  const handleKeydown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      setOpen(false);
    }
  };

  onMount(() => {
    if (typeof document === "undefined") return;
    document.addEventListener("click", handleClickOutside);
    document.addEventListener("keydown", handleKeydown);
  });

  onCleanup(() => {
    if (typeof document === "undefined") return;
    document.removeEventListener("click", handleClickOutside);
    document.removeEventListener("keydown", handleKeydown);
  });

  return (
    <div class="sort-dropdown" ref={containerRef}>
      <button
        type="button"
        class="sort-dropdown-trigger"
        onClick={() => setOpen(!open())}
        aria-haspopup="listbox"
        aria-expanded={open()}
      >
        {currentLabel()}
        <span class="sort-dropdown-chevron" aria-hidden="true">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path
              d={open() ? "M2 8L6 4L10 8" : "M2 4L6 8L10 4"}
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </span>
      </button>

      <Show when={open()}>
        <div class="sort-dropdown-menu" role="listbox">
          <For each={availableOptions()}>
            {(option) => (
              <button
                type="button"
                class="sort-dropdown-item"
                classList={{ "sort-dropdown-item-active": option.value === props.value }}
                role="option"
                aria-selected={option.value === props.value}
                onClick={() => handleSelect(option)}
              >
                {option.label}
              </button>
            )}
          </For>
        </div>
      </Show>
    </div>
  );
}
