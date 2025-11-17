import { useState, useEffect, useRef } from "react";

interface SearchBarProps {
  onSearch: (value: string) => void;
  onReset: () => void;
}

export default function SearchBar({ onSearch, onReset }: SearchBarProps) {
  const [inputValue, setInputValue] = useState("");
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(() => {
      onSearch(inputValue);
    }, 400);

    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [inputValue, onSearch]);

  const handleReset = () => {
    setInputValue("");
    onReset();
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
      <label className="block text-lg font-bold text-[#1d443a] mb-3">Search Advocates</label>
      <div className="flex gap-3">
        <input
          className="flex-1 border-2 border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-[#1d443a] transition-colors duration-200 ease-in-out"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Search by name, city, degree, specialties..."
        />
        <button 
          onClick={handleReset} 
          className="rounded-md px-6 py-2 border-2 border-[#1d443a] text-[#1d443a] font-semibold hover:bg-[#1d443a] hover:text-white transition-colors whitespace-nowrap"
        >
          Clear Search
        </button>
      </div>
    </div>
  );
}

