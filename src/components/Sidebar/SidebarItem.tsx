import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import SidebarDropdown from "@/components/Sidebar/SidebarDropdown";

interface SidebarItemProps {
  item: {
    icon: React.ReactNode;
    label: string;
    route: string;
    children?: { label: string; route: string }[];
  };
  pageName: string;
  setPageName: (name: string) => void;
}

const SidebarItem = ({ item, pageName, setPageName }: SidebarItemProps) => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    if (item.children) {
      e.preventDefault();
      setIsOpen(!isOpen);
    }
    const updatedPageName =
      pageName !== item.label.toLowerCase() ? item.label.toLowerCase() : "";
    setPageName(updatedPageName);
  };

  // Check if current path matches this item or any of its children
  const isActive = React.useMemo(() => {
    if (pathname === `/${item.route}`) return true;
    if (item.children) {
      return item.children.some((child: any) => pathname === `/${child.route}`);
    }
    return false;
  }, [pathname, item]);

  // Show dropdown if item is active or manually opened
  const showDropdown = isActive || isOpen;

  return (
    <li>
      <Link
        href={item.route === "#" ? "#" : `/${item.route}`}
        onClick={handleClick}
        className={`${
          isActive
            ? "bg-primary/[.07] text-primary dark:bg-white/10 dark:text-white"
            : "text-dark-4 hover:bg-gray-2 hover:text-dark dark:text-gray-5 dark:hover:bg-white/10 dark:hover:text-white"
        } group relative flex items-center gap-3 rounded-[7px] px-3.5 py-3 font-medium duration-300 ease-in-out`}
        prefetch={true}
      >
        {item.icon}
        <span className="ml-2">{item.label}</span>

        {item.children && (
          <svg
            className={`absolute right-3.5 top-1/2 -translate-y-1/2 fill-current transition-transform duration-200 ${
              showDropdown ? "" : "rotate-180"
            }`}
            width="22"
            height="22"
            viewBox="0 0 22 22"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M10.5525 7.72801C10.81 7.50733 11.1899 7.50733 11.4474 7.72801L17.864 13.228C18.1523 13.4751 18.1857 13.9091 17.9386 14.1974C17.6915 14.4857 17.2575 14.5191 16.9692 14.272L10.9999 9.15549L5.03068 14.272C4.7424 14.5191 4.30838 14.4857 4.06128 14.1974C3.81417 13.9091 3.84756 13.4751 4.13585 13.228L10.5525 7.72801Z"
              fill=""
            />
          </svg>
        )}
      </Link>

      {item.children && (
        <div
          className={`translate transform overflow-hidden transition-all duration-300 ${
            showDropdown ? "visible opacity-100" : "invisible h-0 opacity-0"
          }`}
        >
          <SidebarDropdown item={item.children} />
        </div>
      )}
    </li>
  );
};

export default SidebarItem;
