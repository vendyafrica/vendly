"use client";

import { Card, CardContent } from "@vendly/ui/components/card";

interface StatsCardProps {
  title: string;
  value: string;
  change: string;
  period: string;
}

export function StatsCard({ title, value, change, period }: StatsCardProps) {
  return (
    <Card className="bg-white border-gray-200 shadow-sm">
      <CardContent className="pt-6 pb-4">
        <div className="flex justify-between items-start">
            <div>
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                {title}
                </div>
                <div className="text-2xl font-bold text-gray-900">{value}</div>
                <div className="flex items-center gap-1 mt-1 text-xs text-green-600 font-medium">
                <span>{change} {period}</span>
                </div>
            </div>
            
            {/* Visual "Mini Chart" made of divs to match design */}
            <div className="flex items-end gap-1 h-10 pb-1">
                <div className="w-1 bg-gray-100 h-[40%] rounded-t-sm"></div>
                <div className="w-1 bg-gray-200 h-[70%] rounded-t-sm"></div>
                <div className="w-1 bg-gray-300 h-[50%] rounded-t-sm"></div>
                <div className="w-1 bg-gray-400 h-[80%] rounded-t-sm"></div>
                <div className="w-1 bg-gray-900 h-[100%] rounded-t-sm"></div>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}