import { useState, useRef, useEffect } from 'react';

export default function CustomSelect({ name, value, options, onChange, className }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find(opt => opt.value === value) || options[0];

  const handleSelect = (option) => {
    if (onChange) {
      onChange({ target: { name, value: option.value } });
    }
    setIsOpen(false);
  };

  return (
    <div className="relative w-full" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-between w-full text-left transition-colors ${className} ${isOpen ? 'ring-2 ring-primary-container border-primary-container' : ''}`}
      >
        <span className="block truncate">{selectedOption ? selectedOption.label : 'Chọn...'}</span>
        <span className="material-symbols-outlined text-on-surface-variant transition-transform" style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>expand_more</span>
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-surface-container-lowest border border-surface-variant rounded-xl shadow-md overflow-hidden">
          <ul className="max-h-60 overflow-y-auto py-1 m-0 list-none">
            {options.map((option) => (
              <li
                key={option.value}
                onClick={() => handleSelect(option)}
                className={`px-4 py-3 cursor-pointer text-[15px] transition-colors ${
                  option.value === (value || options[0].value)
                    ? 'bg-primary-container/10 text-primary-container font-semibold'
                    : 'text-on-surface hover:bg-surface-container-low'
                }`}
              >
                {option.label}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
