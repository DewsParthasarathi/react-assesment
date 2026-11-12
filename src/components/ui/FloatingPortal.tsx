import React, { useLayoutEffect, useRef } from "react";
import { createPortal } from "react-dom";

export type FloatingAlign = "left" | "right" | "center";

export interface FloatingPortalProps {
  isOpen: boolean;
  anchorRef: React.RefObject<HTMLElement | null>;
  onClose: () => void;
  align?: FloatingAlign;
  matchWidth?: boolean;
  offset?: number;
  zIndexClass?: string;
  className?: string;
  children: React.ReactNode;
}

const VIEWPORT_MARGIN = 8;

export const FloatingPortal: React.FC<FloatingPortalProps> = ({
  isOpen,
  anchorRef,
  onClose,
  align = "left",
  matchWidth = false,
  offset = 6,
  zIndexClass = "z-[60]",
  className = "",
  children,
}) => {
  const portalRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!isOpen) return;

    const updatePosition = () => {
      const anchor = anchorRef.current;
      const portalEl = portalRef.current;
      if (!anchor || !portalEl) return;

      const anchorRect = anchor.getBoundingClientRect();
      const vw = window.innerWidth;
      const vh = window.innerHeight;

      portalEl.style.minWidth = matchWidth ? `${anchorRect.width}px` : "";
      portalEl.style.maxWidth = `${Math.max(120, vw - VIEWPORT_MARGIN * 2)}px`;
      portalEl.style.left = "";
      portalEl.style.right = "";
      portalEl.style.top = "";
      portalEl.style.bottom = "";
      portalEl.style.transform = "";

      const portalRect = portalEl.getBoundingClientRect();
      const naturalHeight = Math.max(
        portalEl.scrollHeight,
        portalRect.height,
        40,
      );
      const naturalWidth = Math.max(
        portalRect.width,
        matchWidth ? anchorRect.width : 0,
      );

      const spaceBelow = vh - anchorRect.bottom - offset - VIEWPORT_MARGIN;
      const spaceAbove = anchorRect.top - offset - VIEWPORT_MARGIN;
      const openUpward = spaceBelow < naturalHeight && spaceAbove > spaceBelow;
      const availableHeight = Math.max(
        96,
        openUpward ? spaceAbove : spaceBelow,
      );

      portalEl.style.setProperty("--floating-max-h", `${availableHeight}px`);

      if (openUpward) {
        portalEl.style.bottom = `${Math.max(VIEWPORT_MARGIN, vh - anchorRect.top + offset)}px`;
      } else {
        portalEl.style.top = `${Math.max(VIEWPORT_MARGIN, anchorRect.bottom + offset)}px`;
      }

      if (align === "center") {
        const centerX = anchorRect.left + anchorRect.width / 2;
        const halfWidth = naturalWidth / 2;
        const clampedCenter = Math.min(
          Math.max(centerX, halfWidth + VIEWPORT_MARGIN),
          vw - halfWidth - VIEWPORT_MARGIN,
        );
        portalEl.style.left = `${clampedCenter}px`;
        portalEl.style.transform = "translateX(-50%)";
      } else if (align === "right") {
        const rightOffset = Math.max(
          VIEWPORT_MARGIN,
          Math.min(vw - anchorRect.right, vw - naturalWidth - VIEWPORT_MARGIN),
        );
        portalEl.style.right = `${rightOffset}px`;
      } else {
        const leftOffset = Math.max(
          VIEWPORT_MARGIN,
          Math.min(anchorRect.left, vw - naturalWidth - VIEWPORT_MARGIN),
        );
        portalEl.style.left = `${leftOffset}px`;
      }

      portalEl.style.visibility = "visible";
    };

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        anchorRef.current?.contains(target) ||
        portalRef.current?.contains(target)
      ) {
        return;
      }
      onClose();
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, anchorRef, onClose, align, matchWidth, offset]);

  if (!isOpen || typeof document === "undefined") {
    return null;
  }

  return createPortal(
    <div
      ref={portalRef}
      style={{ position: "fixed", visibility: "hidden" }}
      className={`${zIndexClass} ${className}`.trim()}
    >
      {children}
    </div>,
    document.body,
  );
};

export interface AnchoredPortalProps {
  isOpen: boolean;
  onClose: () => void;
  trigger: React.ReactNode;
  align?: FloatingAlign;
  matchWidth?: boolean;
  offset?: number;
  zIndexClass?: string;
  wrapperClassName?: string;
  portalClassName?: string;
  children: React.ReactNode;
}

export const AnchoredPortal: React.FC<AnchoredPortalProps> = ({
  isOpen,
  onClose,
  trigger,
  align = "right",
  matchWidth = false,
  offset = 6,
  zIndexClass = "z-[60]",
  wrapperClassName = "relative inline-flex",
  portalClassName = "",
  children,
}) => {
  const anchorRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={anchorRef} className={wrapperClassName}>
      {trigger}
      <FloatingPortal
        isOpen={isOpen}
        anchorRef={anchorRef}
        onClose={onClose}
        align={align}
        matchWidth={matchWidth}
        offset={offset}
        zIndexClass={zIndexClass}
        className={portalClassName}
      >
        {children}
      </FloatingPortal>
    </div>
  );
};

export default FloatingPortal;
