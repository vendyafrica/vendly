"use client";

import Link from "next/link";
import { categories } from "@/constants/stores";


export function CategoryOverview() {
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6">
      {/* Mobile: 2 columns */}
      <div className="grid grid-cols-2 gap-3 md:hidden">
        {categories.map((category) => (
          <Link
            key={category}
            href={`/category/${category.toLowerCase()}`}
            className="group block p-4 bg-white rounded-2xl border border-gray-200 hover:border-gray-300 lgver:shadow-sm transition-all duration-200"
          >
            <div className="flex flex-col items-center text-center gap-2">
              <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center group-hover:bg-gray-200 transition-colors"></div>
              <div>

                <h3 className="font-semibold text-sm text-gray-900 capitalize group-hover:text-gray-700 transition-colors">
                  {category}
                </h3>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Desktop/Tablet: 3 columns */}
      <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-3">
        {categories.map((category) => (
          <Link
            key={category}
            href={`/category/${category.toLowerCase()}`}
            className="group block p-6 bg-white rounded-2xl border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all duration-200"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center group-hover:bg-gray-200 transition-colors"></div>
                <div>
                  <h3 className="font-semibold text-gray-900 capitalize group-hover:text-gray-700 transition-colors">
                    {category}
                  </h3>
                  <p className="text-sm text-gray-500">
                    View all {category.toLowerCase()} stores
                  </p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
