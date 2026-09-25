import React, { useRef } from 'react';
import { Calendar } from 'lucide-react';
import { formatDate, toInputDateFormat } from '../utils/dateFormatter';

interface DateInputProps {
  value: string;
  onChange: (valDDMMYYYY: string) => void;
  placeholder?: string;
  className?: string;
  inputClassName?: string;
  required?: boolean;
}

export const DateInput: React.FC<DateInputProps> = ({
  value,
  onChange,
  placeholder = 'dd/mm/yyyy',
  className = '',
  inputClassName = '',
  required = false,
}) => {
  const hiddenDateInputRef = useRef<HTMLInputElement>(null);

  // Always display formatted dd/mm/yyyy text
  const displayValue = value ? formatDate(value) : '';
  const nativeValue = value ? toInputDateFormat(value) : '';

  const handleNativePickerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value; // YYYY-MM-DD
    if (!rawValue) {
      onChange('');
      return;
    }
    const [y, m, d] = rawValue.split('-');
    if (y && m && d) {
      onChange(`${d}/${m}/${y}`);
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    onChange(raw);
  };

  const openPicker = () => {
    const elem = hiddenDateInputRef.current;
    if (elem) {
      if ('showPicker' in elem) {
        try {
          (elem as any).showPicker();
        } catch {
          (elem as HTMLInputElement).click();
        }
      } else {
        (elem as HTMLInputElement).click();
      }
    }
  };

  return (
    <div className={`relative flex items-center ${className}`}>
      <input
        type="text"
        value={displayValue}
        onChange={handleTextChange}
        placeholder={placeholder}
        required={required}
        className={`w-full text-[var(--text-main)] font-mono text-xs focus:outline-none pr-7 ${inputClassName}`}
      />
      <button
        type="button"
        onClick={openPicker}
        className="absolute right-1 text-[var(--text-muted)] hover:text-[var(--color-primary)] transition p-1 cursor-pointer"
        title="Open calendar date picker"
      >
        <Calendar className="w-3.5 h-3.5" />
      </button>
      <input
        ref={hiddenDateInputRef}
        type="date"
        value={nativeValue}
        onChange={handleNativePickerChange}
        className="sr-only opacity-0 absolute w-0 h-0 pointer-events-none"
        tabIndex={-1}
      />
    </div>
  );
};
