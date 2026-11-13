import React, { useState } from "react";

export interface CustomInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  enablePasswordToggle?: boolean;
  containerClassName?: string;
  labelClassName?: string;
  sizeVariant?: "sm" | "md" | "lg";
}

export const CustomInput = React.forwardRef<HTMLInputElement, CustomInputProps>(
  (
    {
      id,
      type = "text",
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      enablePasswordToggle = false,
      containerClassName = "",
      labelClassName = "",
      className = "",
      disabled,
      sizeVariant = "lg",
      ...rest
    },
    ref,
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPasswordType = type === "password";
    const shouldShowToggle = isPasswordType || enablePasswordToggle;
    const inputType = shouldShowToggle && showPassword ? "text" : type;

    if (type === "checkbox") {
      return (
        <div className={`inline-flex flex-col ${containerClassName}`}>
          <label
            htmlFor={id}
            className={`inline-flex items-center gap-2 select-none cursor-pointer ${
              disabled ? "opacity-60 cursor-not-allowed" : ""
            }`}
          >
            <input
              ref={ref}
              id={id}
              type="checkbox"
              disabled={disabled}
              className={`w-4 h-4 rounded border-[#dbdade] text-[#696cff] focus:ring-[#696cff] transition cursor-pointer accent-[#696cff] ${className}`}
              {...rest}
            />
            {label && (
              <span className={`text-fs14 text-[#5d596c] ${labelClassName}`}>
                {label}
              </span>
            )}
          </label>
          {error && <p className="mt-1 text-fs12 text-red-500">{error}</p>}
        </div>
      );
    }

    const sizeClasses =
      {
        sm: "h-9 text-fs13",
        md: "h-10 text-fs14",
        lg: "h-12 text-fs14",
      }[sizeVariant] || "h-12 text-fs14";

    const hasCustomWidth =
      containerClassName.includes("w-") ||
      containerClassName.includes("flex-1") ||
      containerClassName.includes("inline-flex");

    const containerClasses = hasCustomWidth
      ? containerClassName
      : `w-full ${containerClassName}`;

    return (
      <div className={containerClasses}>
        {label && (
          <label
            htmlFor={id}
            className={`block text-fs14 font-medium text-[#32475c] mb-1 ${labelClassName}`}
          >
            {label}
          </label>
        )}

        <div className="relative flex items-center">
          {leftIcon && (
            <span className="absolute left-3.5 text-[#6f6b7d] flex items-center pointer-events-none shrink-0">
              {leftIcon}
            </span>
          )}

          <input
            ref={ref}
            id={id}
            type={inputType}
            disabled={disabled}
            className={`w-full rounded-md border text-[#32475c] bg-white transition outline-none ${sizeClasses} ${
              leftIcon ? "pl-10" : "pl-3.5"
            } ${rightIcon || shouldShowToggle ? "pr-11" : "pr-3.5"} ${
              error
                ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                : "border-[#dbdade] focus:border-[#696cff] focus:ring-1 focus:ring-[#696cff]"
            } ${
              disabled ? "bg-[#f5f5f9] text-[#a5a3ae] cursor-not-allowed" : ""
            } ${className}`}
            {...rest}
          />

          {shouldShowToggle && (
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              tabIndex={-1}
              disabled={disabled}
              className="absolute right-3.5 text-[#8a8d93] hover:text-[#5d596c] transition cursor-pointer p-0.5"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <svg
                  className="w-5 h-5 text-[#9f9f9f]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              ) : (
                <svg
                  width="20"
                  height="16"
                  viewBox="0 0 25 20"
                  fill="none"
                  className="text-[#9f9f9f]"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M22.2932 0.202106C22.0237 -0.0673687 21.5873 -0.0673687 21.3181 0.202106L18.0576 3.46257C9.46898 -0.707001 2.47111 6.29725 0.504407 8.58234C-0.175162 9.37115 -0.167063 10.6063 0.522649 11.3928C2.18451 13.2913 3.91127 14.7877 5.66689 15.8533L2.69738 18.8228C2.4279 19.0923 2.4279 19.5287 2.69738 19.7979C2.83223 19.9326 3.00865 20 3.18506 20C3.36148 20 3.5379 19.9326 3.67275 19.7979L22.2929 1.17718C22.5624 0.907709 22.5624 0.471309 22.2929 0.202047L22.2932 0.202106ZM1.56029 10.4843C1.32522 10.2162 1.32061 9.74817 1.54944 9.48216C3.81189 6.85392 9.73312 1.28548 17.0212 4.49883L14.4611 7.05898C13.8813 6.67105 13.2028 6.45425 12.4951 6.45425C10.5393 6.45425 8.9485 8.045 8.9485 10.0001C8.9485 10.7136 9.15794 11.3944 9.54703 11.973L6.67654 14.8435C4.94285 13.8453 3.22371 12.385 1.5602 10.4844L1.56029 10.4843ZM10.5609 10.9591C10.4141 10.6637 10.3279 10.34 10.3279 10.0001C10.3279 8.80533 11.3005 7.83344 12.4953 7.83344C12.8326 7.83344 13.1573 7.91957 13.4536 8.06643L10.5609 10.9589L10.5609 10.9591ZM24.4851 11.4184C22.6607 13.5393 18.2285 17.8588 12.4242 17.8588C11.3345 17.8588 10.1977 17.7066 9.01894 17.3591C8.65387 17.2512 8.44513 16.8682 8.55296 16.5024C8.6608 16.138 9.04389 15.9279 9.40964 16.0364C16.0942 18.0084 21.4469 12.8346 23.4396 10.5185C23.6687 10.2525 23.6639 9.78375 23.4288 9.51496C22.2751 8.19762 21.0876 7.08161 19.9004 6.19721C19.5947 5.97023 19.5314 5.53798 19.7589 5.23272C19.9866 4.92838 20.4188 4.86303 20.7234 5.09117C21.989 6.03261 23.2482 7.21535 24.4667 8.60612C25.1564 9.39469 25.1638 10.63 24.4849 11.4179L24.4851 11.4184ZM15.4337 9.96292C15.8047 10.0472 16.0377 10.4169 15.9537 10.7887C15.6364 12.1848 14.5204 13.247 13.1102 13.4941C13.0698 13.5008 12.4549 13.5901 12.3114 12.9336C12.2302 12.5616 12.4966 12.2009 12.8719 12.1349C13.7332 11.9841 14.4149 11.3355 14.6081 10.4827C14.6924 10.111 15.0581 9.87936 15.4339 9.96272L15.4337 9.96292Z"
                    fill="currentColor"
                  />
                </svg>
              )}
            </button>
          )}

          {!shouldShowToggle && rightIcon && (
            <span className="absolute right-3.5 text-[#6f6b7d] flex items-center pointer-events-none shrink-0">
              {rightIcon}
            </span>
          )}
        </div>

        {error && (
          <p className="mt-1 text-fs12 text-red-500 font-normal">{error}</p>
        )}
        {!error && helperText && (
          <p className="mt-1 text-fs12 text-[#a5a3ae]">{helperText}</p>
        )}
      </div>
    );
  },
);

CustomInput.displayName = "CustomInput";

export default CustomInput;
