import React, { useState, useRef, useCallback, useEffect, useMemo } from "react";
import { FloatingPortal } from "./FloatingPortal";
import { CustomButton } from "./CustomButton";

export interface DropdownOption {
  label: string;
  value: string | number;
  disabled?: boolean;
}

export type DropdownSize = "sm" | "md" | "lg";

export interface CustomDropdownProps {
  options: DropdownOption[];
  value?: string | number;
  defaultValue?: string | number;
  placeholder?: string;
  label?: string;
  error?: string;
  disabled?: boolean;
  onChange?: (value: string | number) => void;
  className?: string;
  containerClassName?: string;
  id?: string;
  sizeVariant?: DropdownSize;
  searchable?: boolean;
  searchPlaceholder?: string;
  noResultsText?: string;
}

const sizeStyles: Record<
  DropdownSize,
  { height: string; padding: string; text: string }
> = {
  sm: { height: "!h-9", padding: "!px-3.5", text: "text-fs13" },
  md: { height: "!h-10", padding: "!px-3.5", text: "text-fs15" },
  lg: { height: "!h-12", padding: "!px-3.5", text: "text-fs15" },
};

export const CustomDropdown: React.FC<CustomDropdownProps> = ({
  options,
  value,
  defaultValue,
  placeholder = "Select an option",
  label,
  error,
  disabled = false,
  onChange,
  className = "",
  containerClassName = "",
  id,
  sizeVariant = "lg",
  searchable = false,
  searchPlaceholder = "Search...",
  noResultsText = "No options available",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [internalValue, setInternalValue] = useState<
    string | number | undefined
  >(defaultValue);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const selectedValue = value !== undefined ? value : internalValue;
  const selectedOption = options.find(
    (opt) =>
      opt.value === selectedValue ||
      (selectedValue !== undefined &&
        String(opt.value).replace(/[^0-9a-zA-Z]/g, "") !== "" &&
        String(opt.value).replace(/[^0-9a-zA-Z]/g, "") ===
          String(selectedValue).replace(/[^0-9a-zA-Z]/g, "")),
  );

  useEffect(() => {
    if (isOpen && searchable) {
      setSearchQuery("");
      const timer = setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen, searchable]);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    setSearchQuery("");
  }, []);

  const handleSelect = (option: DropdownOption) => {
    if (option.disabled || disabled) return;
    if (value === undefined) {
      setInternalValue(option.value);
    }
    onChange?.(option.value);
    setIsOpen(false);
    setSearchQuery("");
  };

  const filteredOptions = useMemo(() => {
    if (!searchable || !searchQuery.trim()) return options;
    const q = searchQuery.toLowerCase().trim();
    const cleanQ = q.replace(/[^0-9a-zA-Z]/g, "");
    return options.filter((opt) => {
      const labelMatch = opt.label.toLowerCase().includes(q);
      const valMatch = String(opt.value).toLowerCase().includes(q);
      const cleanLabel = opt.label.toLowerCase().replace(/[^0-9a-zA-Z]/g, "");
      const cleanVal = String(opt.value).toLowerCase().replace(/[^0-9a-zA-Z]/g, "");
      return (
        labelMatch ||
        valMatch ||
        (cleanQ.length > 0 &&
          (cleanLabel.includes(cleanQ) || cleanVal.includes(cleanQ)))
      );
    });
  }, [options, searchable, searchQuery]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setIsOpen((prev) => !prev);
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    e.stopPropagation();
    if (e.key === "Escape") {
      setIsOpen(false);
      triggerRef.current?.focus();
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filteredOptions.length > 0) {
        handleSelect(filteredOptions[0]);
      }
    }
  };

  const hasWidthClass = /\b(!?w-|size-|min-w-|max-w-)/.test(containerClassName);
  const hasCustomHeight = /\b(!?h-)/.test(className);
  const hasCustomPadding = /\b(!?p[xy]?-)/.test(className);
  const currentSize = sizeStyles[sizeVariant];
  const computedSizeClasses = `${hasCustomHeight ? "" : currentSize.height} ${hasCustomPadding ? "" : currentSize.padding} ${currentSize.text}`;

  return (
    <div
      className={`relative ${hasWidthClass ? "" : "w-full"} ${containerClassName}`.trim()}
    >
      {label && (
        <label
          htmlFor={id}
          className="block text-fs15 font-medium text-[#32475c] dark:text-[#dbdade] mb-1"
        >
          {label}
        </label>
      )}

      <CustomButton
        ref={triggerRef}
        id={id}
        type="button"
        variant="ghost"
        size={sizeVariant}
        disabled={disabled}
        onClick={() => setIsOpen((prev) => !prev)}
        onKeyDown={handleKeyDown}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className={`w-full !justify-between font-normal ${computedSizeClasses} rounded-md border !bg-white hover:!bg-white dark:!bg-[#2f3349] dark:hover:!bg-[#2f3349] dark:border-[#434968] flex items-center gap-1.5 text-left transition outline-none cursor-pointer ${
          error
            ? "border-red-500 focus:ring-1 focus:ring-red-500"
            : "border-[#dbdade] hover:border-[#b8b7be] focus:border-[#696cff] focus:ring-1 focus:ring-[#696cff]"
        } ${disabled ? "!bg-[#f5f5f9] dark:!bg-[#25293c] text-[#a5a3ae] cursor-not-allowed opacity-60" : ""} ${className}`}
      >
        <span
          className={`truncate ${selectedOption ? "text-[#32475c] dark:text-[#dbdade]" : "text-[#a5a3ae]"}`}
        >
          {selectedOption ? selectedOption.label : selectedValue ? String(selectedValue) : placeholder}
        </span>
        <svg
          className={`w-4 h-4 text-[#8a8d93] dark:text-[#a5a3ae] transition-transform duration-200 shrink-0 ${
            isOpen ? "rotate-180 text-[#696cff] dark:text-[#696cff]" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </CustomButton>

      <FloatingPortal
        isOpen={isOpen}
        anchorRef={triggerRef}
        onClose={handleClose}
        align="left"
        matchWidth
        offset={6}
      >
        <div className="w-full min-w-[200px] bg-white dark:bg-[#2f3349] border border-[#dbdade] dark:border-[#434968] rounded-md shadow-[0_4px_16px_rgba(47,43,61,0.12)] max-h-[min(18rem,var(--floating-max-h,18rem))] flex flex-col overflow-hidden text-fs15 focus:outline-none">
          {searchable && (
            <div className="p-2 border-b border-[#dbdade] dark:border-[#434968] bg-white dark:bg-[#2f3349] shrink-0">
              <div className="relative flex items-center">
                <svg
                  className="w-4 h-4 text-[#a5a3ae] absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleSearchKeyDown}
                  onClick={(e) => e.stopPropagation()}
                  placeholder={searchPlaceholder}
                  className="w-full pl-8 pr-7 py-1.5 text-fs14 bg-[#f8f7fa] dark:bg-[#25293c] border border-[#dbdade] dark:border-[#434968] rounded-[5px] text-[#32475c] dark:text-[#dbdade] placeholder-[#a5a3ae] focus:outline-none focus:border-[#696cff] transition"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSearchQuery("");
                      searchInputRef.current?.focus();
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-[#a5a3ae] hover:text-[#5d596c] dark:hover:text-[#dbdade] text-fs14 font-bold cursor-pointer"
                  >
                    &times;
                  </button>
                )}
              </div>
            </div>
          )}

          <ul
            role="listbox"
            tabIndex={-1}
            className="w-full overflow-y-auto py-1 focus:outline-none flex-1 min-h-0 chat-email-scrollbar"
          >
            {filteredOptions.length === 0 ? (
              <li className="px-3.5 py-3 text-[#a5a3ae] dark:text-[#a5a3ae] text-fs14 text-center">
                {noResultsText}
              </li>
            ) : (
              filteredOptions.map((opt) => {
                const isSelected =
                  opt.value === selectedValue ||
                  (selectedOption && opt.value === selectedOption.value);
                return (
                  <li
                    key={String(opt.value)}
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => handleSelect(opt)}
                    className={`px-3.5 py-2 flex items-center justify-between gap-2 whitespace-nowrap cursor-pointer transition ${
                      opt.disabled
                        ? "text-[#a5a3ae] cursor-not-allowed bg-gray-50 dark:bg-transparent"
                        : isSelected
                          ? "bg-[#e7e7ff] dark:bg-[#696cff]/20 text-[#696cff] font-medium"
                          : "text-[#5d596c] dark:text-[#dbdade] hover:bg-[#f5f5f9] dark:hover:bg-[#353952] hover:text-[#32475c] dark:hover:text-white"
                    }`}
                  >
                    <span className="truncate">{opt.label}</span>
                    {isSelected && (
                      <svg
                        className="w-4 h-4 text-[#696cff] shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </li>
                );
              })
            )}
          </ul>
        </div>
      </FloatingPortal>

      {error && (
        <p className="mt-1 text-fs13 text-red-500 font-normal">{error}</p>
      )}
    </div>
  );
};

export default CustomDropdown;
