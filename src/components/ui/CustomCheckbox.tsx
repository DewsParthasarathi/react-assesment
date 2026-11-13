import React from 'react';

export interface CustomCheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: React.ReactNode;
  labelClassName?: string;
  containerClassName?: string;
  error?: string;
}

export const CustomCheckbox: React.FC<CustomCheckboxProps> = ({
  id,
  label,
  checked,
  disabled,
  onChange,
  className = '',
  labelClassName = '',
  containerClassName = '',
  error,
  ...rest
}) => {
  const inputId = id || (typeof label === 'string' ? `checkbox-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);

  return (
    <div className={`inline-flex flex-col ${containerClassName}`}>
      <label
        htmlFor={inputId}
        className={`inline-flex items-center gap-2 select-none cursor-pointer ${
          disabled ? 'opacity-60 cursor-not-allowed' : ''
        }`}
      >
        <input
          id={inputId}
          type="checkbox"
          checked={checked}
          disabled={disabled}
          onChange={onChange}
          className={`w-4 h-4 rounded border-[#dbdade] text-[#696cff] focus:ring-[#696cff] transition cursor-pointer accent-[#696cff] ${className}`}
          {...rest}
        />
        {label && (
          <span className={`text-fs15 text-[#6f6b7d] ${labelClassName}`}>
            {label}
          </span>
        )}
      </label>
      {error && <p className="mt-1 text-fs13 text-red-500">{error}</p>}
    </div>
  );
};

export default CustomCheckbox;
