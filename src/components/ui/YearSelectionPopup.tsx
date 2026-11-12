import React, { useState, useRef, useCallback } from "react";
import { FloatingPortal } from "./FloatingPortal";

export interface YearSelectionPopupProps {
  selectedYear: string;
  onSelectYear: (year: string) => void;
  availableYears?: string[];
  children?: React.ReactNode;
  className?: string;
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
  const triggerRef = useRef<HTMLDivElement>(null);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen((prev) => !prev);
  };

  const handleSelect = (year: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onSelectYear(year);
    setIsOpen(false);
  };

  const align = popupClassName.includes("left-1/2") ? "center" : "right";
  const cleanPopupClassName = popupClassName
    .replace(/\b(left-1\/2|-translate-x-1\/2|right-auto)\b/g, "")
    .trim();

  return (
    <div className={`relative inline-block ${className}`}>
      <div
        ref={triggerRef}
        onClick={handleToggle}
        className="cursor-pointer inline-flex"
      >
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

      <FloatingPortal
        isOpen={isOpen}
        anchorRef={triggerRef}
        onClose={handleClose}
        align={align}
        offset={6}
      >
        <div
          role="menu"
          aria-orientation="vertical"
          className={`w-28 bg-white border border-[#dbdade] shadow-[0_4px_16px_rgba(47,43,61,0.14)] rounded-[5px] py-1 text-fs13 focus:outline-none animate-in fade-in-50 duration-150 ${cleanPopupClassName}`.trim()}
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
      </FloatingPortal>
    </div>
  );
};

export default YearSelectionPopup;
