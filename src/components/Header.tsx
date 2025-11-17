import React from 'react';
import Image from 'next/image';

export default function Header() {
  return (
    <header className="p-4 mb-6">
      <div className="mx-auto max-w-[66.25rem] max-h-[4.5rem] bg-white shadow-lg rounded-lg px-6 py-4 flex items-center">
        <div className="flex items-center h-8 w-auto">
          <Image src="/logo.svg" alt="Logo" width={115} height={32} className="h-full w-auto" />
        </div>
      </div>
    </header>
  );
}

