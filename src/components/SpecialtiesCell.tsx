import { useState } from "react";

interface SpecialtiesCellProps {
  specialties: string[];
}

export default function SpecialtiesCell({
  specialties,
}: SpecialtiesCellProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasMultipleRows = specialties.length > 3;

  const toggleExpand = () => {
    setIsExpanded((prev) => !prev);
  };

  return (
    <div>
      <div className="relative">
        <div
          className={`flex flex-wrap gap-2 transition-all duration-300 ${
            isExpanded ? "max-h-none" : "max-h-[4.5rem] overflow-hidden"
          }`}
        >
          {specialties.map((specialty: string, idx: number) => (
            <span
              key={`${specialty}-${idx}`}
              className="px-3 py-1 rounded-full text-sm break-words bg-[rgb(213,228,225)] text-[#1d443a]"
            >
              {specialty}
            </span>
          ))}
        </div>
        {hasMultipleRows && !isExpanded && (
          <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-[rgb(233,240,238)] to-transparent pointer-events-none" />
        )}
      </div>
      {hasMultipleRows && (
        <button
          onClick={toggleExpand}
          className="mt-1 text-sm text-[#1d443a] hover:text-[#152f28] font-semibold underline"
        >
          {isExpanded ? "Show less" : "Show more"}
        </button>
      )}
    </div>
  );
}

