import React from 'react';

export function CategoryTab({ active, children }: { active?: boolean; children: React.ReactNode }) {
    return (
        <button
            className={`px-6 py-2 rounded-full text-sm transition-colors whitespace-nowrap shrink-0 ${active
                ? 'bg-black text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
        >
            {children}
        </button>
    );
}