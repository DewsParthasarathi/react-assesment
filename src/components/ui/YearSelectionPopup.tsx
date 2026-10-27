import React, { useState, useRef, useEffect } from "react";

export interface YearSelectionPopupProps {
  /** Currently selected year (e.g. "2023") */
  selectedYear: string;
  /** Callback fired when a year is selected */
  onSelectYear: (year: string) => void;
  /** Available years list (e.g. ["2023", "2022"]) from database */
  availableYears?: string[];
  /** Trigger element (e.g. more-options button) */
  children?: React.ReactNode;
  /** Optional container class name */
  className?: string;
  /** Custom popup menu class name */
  popupClassName?: string;
}

export const YearSelectionPopup: React.FC<YearSelectionPopupProps> = ({
  selectedYear,
  onSelectYear,
  availableYears = ["2023", "2022"],
  children,
  className = "",
  popupClassName = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen((prev) => !prev);
  };

  const handleSelect = (year: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onSelectYear(year);
    setIsOpen(false);
  };

  return (
    <div className={`relative inline-block ${className}`} ref={containerRef}>
      {/* Trigger: wraps children or renders default more button */}
      <div onClick={handleToggle} className="cursor-pointer inline-flex">
        {children ? (
          children
        ) : (
          <button
            type="button"
            aria-label="More options"
            aria-haspopup="true"
            aria-expanded={isOpen}
            className="p-1 text-[#a5a3ae] hover:text-[#5d596c] transition cursor-pointer"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
            </svg>
          </button>
        )}
      </div>

      {/* Year Selection Popup Menu */}
      {isOpen && (
        <div
          role="menu"
          aria-orientation="vertical"
          className={`absolute right-0 top-full mt-1.5 z-50 w-28 bg-white border border-[#dbdade] shadow-[0_4px_16px_rgba(47,43,61,0.14)] rounded-[5px] py-1 text-fs13 focus:outline-none animate-in fade-in-50 duration-150 ${popupClassName}`}
        >
          {availableYears.map((yr) => {
            const isSelected = yr === selectedYear;
            return (
              <button
                key={yr}
                type="button"
                role="menuitem"
                onClick={(e) => handleSelect(yr, e)}
                className={`w-full px-3 py-1.5 text-left text-fs13 transition flex items-center justify-between cursor-pointer ${
                  isSelected
                    ? "bg-[#e7e7ff] text-[#696cff] font-medium"
                    : "text-[#5d596c] hover:bg-[#f5f5f9] hover:text-[#32475c]"
                }`}
              >
                <span>{yr}</span>
                {isSelected && (
                  <svg
                    className="w-3.5 h-3.5 text-[#696cff]"
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
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default YearSelectionPopup;
