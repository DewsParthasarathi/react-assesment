import React, { type ImgHTMLAttributes, useState } from "react";

export type ImageObjectFit =
  | "contain"
  | "cover"
  | "fill"
  | "none"
  | "scale-down";

export interface CustomImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  containerClassName?: string;

  objectFit?: ImageObjectFit;

  fallback?: React.ReactNode;
}

const objectFitClasses: Record<ImageObjectFit, string> = {
  contain: "object-contain",
  cover: "object-cover",
  fill: "object-fill",
  none: "object-none",
  "scale-down": "object-scale-down",
};

export const CustomImage: React.FC<CustomImageProps> = ({
  src,
  alt = "",
  className = "",
  containerClassName = "",
  objectFit = "contain",
  fallback,
  onError,
  loading = "lazy",
  ...props
}) => {
  const [hasError, setHasError] = useState(false);

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setHasError(true);
    if (onError) {
      onError(e);
    }
  };

  if (hasError && fallback) {
    return (
      <div
        className={`flex items-center justify-center ${containerClassName || "w-full h-full"}`.trim()}
      >
        {fallback}
      </div>
    );
  }

  const hasDimensionClass = /\b(w-|h-|size-)/.test(containerClassName);
  const containerClasses = [
    !hasDimensionClass ? "w-full h-full" : "",
    containerClassName,
  ]
    .filter(Boolean)
    .join(" ");

  const fitClass = objectFitClasses[objectFit] || "object-contain";

  return (
    <div className={containerClasses}>
      <img
        src={src}
        alt={alt}
        loading={loading}
        className={` ${fitClass} ${className}`.trim()}
        onError={handleError}
        {...props}
      />
    </div>
  );
};

export default CustomImage;
