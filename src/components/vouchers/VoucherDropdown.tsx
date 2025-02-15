import React, { useState } from "react";
import { Command } from "cmdk";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface VoucherDropdownProps {
  items: any[];
  value?: string;
  onChange: (value: string) => void;
  displayKey: string;
  formatDisplay?: (item: any) => string;
  placeholder?: string;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}

const VoucherDropdown: React.FC<VoucherDropdownProps> = ({
  items,
  value,
  onChange,
  displayKey,
  formatDisplay,
  placeholder = "Search...",
  disabled = false,
  loading = false,
  className,
}) => {
  const [search, setSearch] = useState("");

  const filteredItems = items.filter((item) =>
    (formatDisplay ? formatDisplay(item) : item[displayKey])
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  return (
    <div className={cn("relative w-full", className)}>
      <Command
        className="rounded-lg border border-gray-300 bg-white shadow-sm dark:border-gray-400 dark:bg-gray-800"
        shouldFilter={false}
      >
        <div className="flex items-center border-b border-gray-300 px-3 dark:border-gray-500">
          <Search className="h-4 w-4 shrink-0 text-gray-500 dark:text-gray-400" />
          <Command.Input
            value={search}
            onValueChange={setSearch}
            className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-gray-500 disabled:cursor-not-allowed disabled:opacity-50 dark:placeholder:text-gray-400"
            placeholder={placeholder}
            disabled={disabled}
          />
        </div>

        <Command.List className="max-h-[300px] overflow-y-auto p-2">
          {loading ? (
            <div className="flex h-32 items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
            </div>
          ) : (
            filteredItems.map((item) => (
              <Command.Item
                key={item.id || item[displayKey]}
                value={item[displayKey]}
                onSelect={() => onChange(item[displayKey])}
                className={cn(
                  "flex cursor-pointer items-center justify-between rounded-md p-2 text-sm hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-gray-700",
                  value === item[displayKey] &&
                    "bg-blue-50 text-blue-600 dark:bg-blue-900/50 dark:text-gray-100",
                )}
              >
                <span>
                  {formatDisplay ? formatDisplay(item) : item[displayKey]}
                </span>
                {item.amount && (
                  <span className="text-sm text-gray-500 dark:text-gray-100">
                    R {(item.amount / 100).toFixed(2)}
                  </span>
                )}
              </Command.Item>
            ))
          )}
          {!loading && filteredItems.length === 0 && (
            <div className="py-6 text-center text-sm text-gray-500">
              No results found.
            </div>
          )}
        </Command.List>
      </Command>
    </div>
  );
};

export default VoucherDropdown;
