import React from "react";
import { Command } from "cmdk";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface VoucherDropdownProps {
  items: Array<{ id: number | string; [key: string]: any }>;
  value: string;
  onChange: (value: string) => void;
  displayKey: string;
  formatDisplay?: (item: any) => string;
  placeholder?: string;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}

const VoucherDropdown = ({
  items,
  value,
  onChange,
  displayKey,
  formatDisplay,
  placeholder = "Search...",
  disabled = false,
  loading = false,
  className,
}: VoucherDropdownProps) => {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");

  const filteredItems = React.useMemo(() => {
    return items.filter((item) =>
      item[displayKey].toLowerCase().includes(search.toLowerCase()),
    );
  }, [items, search, displayKey]);

  return (
    <Command
      className={cn(
        "relative h-auto w-full rounded-lg border border-gray-300 bg-white text-gray-900 shadow-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white",
        className,
      )}
    >
      <div className="flex items-center border-b border-gray-300 px-3 dark:border-gray-600">
        <Search className="h-4 w-4 shrink-0 text-gray-500 dark:text-gray-400" />
        <Command.Input
          value={search}
          onValueChange={setSearch}
          className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-gray-500 disabled:cursor-not-allowed disabled:opacity-50 dark:placeholder:text-gray-400"
          placeholder={placeholder}
          disabled={disabled}
        />
      </div>
      <Command.List className="max-h-[300px] overflow-y-auto p-1">
        {loading ? (
          <Command.Loading className="py-6 text-center text-sm">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </Command.Loading>
        ) : filteredItems.length === 0 ? (
          <Command.Empty className="py-6 text-center text-sm">
            No items found.
          </Command.Empty>
        ) : (
          filteredItems.map((item) => (
            <Command.Item
              key={item.id}
              value={item[displayKey]}
              onSelect={() => onChange(item[displayKey])}
              className="relative flex cursor-pointer select-none items-center rounded-md px-2 py-1.5 text-sm outline-none aria-selected:bg-gray-100 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 dark:aria-selected:bg-gray-700"
            >
              {formatDisplay ? formatDisplay(item) : item[displayKey]}
            </Command.Item>
          ))
        )}
      </Command.List>
    </Command>
  );
};

export default VoucherDropdown;
