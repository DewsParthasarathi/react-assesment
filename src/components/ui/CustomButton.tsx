import React from "react";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "danger"
  | "ghost"
  | "icon";
export type ButtonSize = "sm" | "md" | "lg";

export interface CustomButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  loadingText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-[#696cff] hover:bg-[#5f61e6] active:bg-[#585ad7] text-white shadow-[0_2px_4px_rgba(105,108,255,0.4)]",
  secondary:
    "bg-[#8592a3] hover:bg-[#788393] active:bg-[#6b7583] text-white shadow-[0_2px_4px_rgba(133,146,163,0.4)]",
  outline:
    "border border-[#dbdade] bg-white text-[#6f6b7d] hover:bg-[#f8f7fa] hover:text-[#5d596c] hover:border-[#d0d0d5]",
  danger:
    "bg-[#ea5455] hover:bg-[#d94849] active:bg-[#c93d3e] text-white shadow-[0_2px_4px_rgba(234,84,85,0.4)]",
  ghost:
    "bg-transparent text-[#6f6b7d] hover:bg-[#f5f5f9] hover:text-[#5d596c]",
  icon: "p-2 rounded-full text-[#6f6b7d] hover:bg-[#f5f5f9] hover:text-[#5d596c] bg-transparent",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "h-8 px-2.5 text-fs13 rounded-md",
  md: "h-[46px] px-4 text-fs15 rounded-md",
  lg: "h-12 px-6 text-fs17 rounded-lg",
};

export const CustomButton = React.forwardRef<HTMLButtonElement, CustomButtonProps>(
  (
    {
      children,
      variant = "primary",
      size = "md",
      isLoading = false,
      loadingText,
      leftIcon,
      rightIcon,
      fullWidth = false,
      className = "",
      disabled,
      type = "button",
      ...rest
    },
    ref
  ) => {
    const isButtonDisabled = disabled || isLoading;
    const baseSizeStyle = variant === "icon" ? "" : sizeStyles[size];

    return (
      <button
        ref={ref}
        type={type}
        disabled={isButtonDisabled}
        className={`inline-flex items-center justify-center font-medium transition duration-150 cursor-pointer select-none outline-hidden ${
          fullWidth ? "w-full" : ""
        } ${variantStyles[variant]} ${baseSizeStyle} ${
          isButtonDisabled
            ? "opacity-70 cursor-not-allowed pointer-events-none"
            : ""
        } ${className}`}
        {...rest}
      >
        {isLoading ? (
          <span className="inline-flex items-center gap-2">
            <svg
              className="animate-spin w-4 h-4 text-current"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              />
            </svg>
            {loadingText ? <span>{loadingText}</span> : children}
          </span>
        ) : (
          <>
            {leftIcon && (
              <span className="mr-2 inline-flex shrink-0">{leftIcon}</span>
            )}
            {children}
            {rightIcon && (
              <span className="ml-2 inline-flex shrink-0">{rightIcon}</span>
            )}
          </>
        )}
      </button>
    );
  }
);

CustomButton.displayName = "CustomButton";

export default CustomButton;
