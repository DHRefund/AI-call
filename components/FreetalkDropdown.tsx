// components/FreetalkDropdown.tsx
"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils"; // Import cn nếu cần dùng

const languages = [
  { code: "en", label: "English" },
  { code: "ja", label: "日本語 (Japanese)" },
  { code: "vi", label: "Tiếng Việt" },
];

const FreeTalkDropdown = ({ className, style }: { className?: string; style?: React.CSSProperties }) => {
  const [isHovering, setIsHovering] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsHovering(false);
    }, 200); // Adjust delay time as needed (e.g., 200ms)
  };

  return (
    <div
      className="relative" // Cần relative để dropdown con định vị tuyệt đối
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Button Freetalk */}
      <Button
        asChild
        className={cn(
          "max-sm:w-full rounded-full px-8 py-4 text-lg font-bold bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white shadow-lg transition-all duration-300",
          className // Kết hợp class truyền từ cha (nếu có animationDelay)
        )}
        style={style} // Kết hợp style truyền từ cha (nếu có animationDelay)
      >
        <Link href="/freetalk">Freetalk</Link>
      </Button>

      {/* Dropdown ngôn ngữ */}
      {isHovering && (
        <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-white dark:bg-neutral-800 rounded-lg shadow-xl overflow-hidden z-10 min-w-[180px]">
          <div className="flex flex-col">
            {languages.map((lang) => (
              <Link href={`/freetalk/${lang.code}`} key={lang.code}>
                <span className="block px-4 py-2 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-neutral-700 cursor-pointer">
                  {lang.label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FreeTalkDropdown;
