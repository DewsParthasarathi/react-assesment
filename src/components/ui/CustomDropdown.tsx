import React, { useState, useRef, useCallback } from "react";
import { FloatingPortal } from "./FloatingPortal";

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
}

const sizeStyles: Record<DropdownSize, string> = {
  sm: "h-8 px-2.5 text-fs12",
  md: "h-10 px-3.5 text-fs14",
  lg: "h-12 px-3.5 text-fs14",
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
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [internalValue, setInternalValue] = useState<
    string | number | undefined
  >(defaultValue);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const selectedValue = value !== undefined ? value : internalValue;
  const selectedOption = options.find((opt) => opt.value === selectedValue);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  const handleSelect = (option: DropdownOption) => {
    if (option.disabled || disabled) return;
    if (value === undefined) {
      setInternalValue(option.value);
    }
    onChange?.(option.value);
    setIsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setIsOpen((prev) => !prev);
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  const hasWidthClass = /\b(!?w-|size-|min-w-|max-w-)/.test(containerClassName);

  return (
    <div
      className={`relative ${hasWidthClass ? "" : "w-full"} ${containerClassName}`.trim()}
    >
      {label && (
        <label
          htmlFor={id}
          className="block text-fs14 font-medium text-[#32475c] mb-1"
        >
          {label}
        </label>
      )}

      <button
        ref={triggerRef}
        id={id}
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen((prev) => !prev)}
        onKeyDown={handleKeyDown}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className={`w-full ${sizeStyles[sizeVariant]} rounded-md border bg-white flex items-center justify-between gap-1.5 text-left transition outline-none cursor-pointer ${
          error
            ? "border-red-500 focus:ring-1 focus:ring-red-500"
            : "border-[#dbdade] hover:border-[#b8b7be] focus:border-[#696cff] focus:ring-1 focus:ring-[#696cff]"
        } ${disabled ? "bg-[#f5f5f9] text-[#a5a3ae] cursor-not-allowed opacity-60" : ""} ${className}`}
      >
        <span
          className={`truncate ${selectedOption ? "text-[#32475c]" : "text-[#a5a3ae]"}`}
        >
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <svg
          className={`w-4 h-4 text-[#8a8d93] transition-transform duration-200 shrink-0 ${
            isOpen ? "rotate-180 text-[#696cff]" : ""
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
      </button>

      <FloatingPortal
        isOpen={isOpen}
        anchorRef={triggerRef}
        onClose={handleClose}
        align="left"
        matchWidth
        offset={6}
      >
        <ul
          role="listbox"
          tabIndex={-1}
          className="w-full bg-white border border-[#dbdade] rounded-md shadow-[0_4px_16px_rgba(47,43,61,0.12)] max-h-[min(15rem,var(--floating-max-h,15rem))] overflow-y-auto py-1 text-fs14 focus:outline-none"
        >
          {options.length === 0 ? (
            <li className="px-3.5 py-2.5 text-[#a5a3ae] text-fs13 text-center">
              No options available
            </li>
          ) : (
            options.map((opt) => {
              const isSelected = opt.value === selectedValue;
              return (
                <li
                  key={String(opt.value)}
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => handleSelect(opt)}
                  className={`px-3.5 py-2.5 flex items-center justify-between gap-2 whitespace-nowrap cursor-pointer transition ${
                    opt.disabled
                      ? "text-[#a5a3ae] cursor-not-allowed bg-gray-50"
                      : isSelected
                        ? "bg-[#e7e7ff] text-[#696cff] font-medium"
                        : "text-[#5d596c] hover:bg-[#f5f5f9] hover:text-[#32475c]"
                  }`}
                >
                  <span>{opt.label}</span>
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
      </FloatingPortal>

      {error && (
        <p className="mt-1 text-fs12 text-red-500 font-normal">{error}</p>
      )}
    </div>
  );
};

export default CustomDropdown;
