"use client";

import React, { useState } from 'react';
import { Menu, X, LayoutDashboard, Package, CreditCard, BarChart3, Mail, Users, Headphones, HelpCircle, ChevronDown } from 'lucide-react';

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);

  const menuSections = [
    {
      title: 'Main Menu',
      items: [
        { icon: LayoutDashboard, label: 'Dashboard' },
        { icon: Package, label: 'Products' },
        { icon: CreditCard, label: 'Transactions' },
        { icon: BarChart3, label: 'Reports & Analytics' },
      ]
    },
    {
      title: 'Customers',
      items: [
        { icon: Users, label: 'Customers' },
        { icon: Package, label: 'Order Management' },
      ]
    },
    {
      title: 'Settings',
      items: [
        { icon: Headphones, label: 'Customer Support' },
        { icon: HelpCircle, label: 'System Settings' },
      ]
    }
  ];

  const MenuItem = ({ icon: Icon, label }) => (
    <button className="w-full flex items-center gap-3 px-4 py-2 rounded-md text-gray-700 hover:bg-gray-100 active:bg-gray-200 transition-colors text-sm">
      <Icon size={18} className="flex-shrink-0" />
      {isOpen && <span>{label}</span>}
    </button>
  );

  return (
    <div className={`${isOpen ? 'w-64' : 'w-24'} bg-white border-r border-gray-200 transition-all duration-300 flex flex-col justify-between h-full`}>

      {/* Top Section */}
      <div>
        {/* Header with Store Name */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className={`flex items-center gap-2 ${!isOpen && 'hidden'}`}>
            <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
              <span className="text-white text-xs font-bold">SP</span>
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-900">Spark Pixel</div>
              <div className="text-xs text-gray-500">Store</div>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-1 hover:bg-gray-100 rounded-md transition-colors"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Navigation */}
        <div className="py-4 px-2">
          {menuSections.map((section, idx) => (
            <div key={idx}>
              {isOpen && (
                <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide px-4 py-2 mt-3 first:mt-0">
                  {section.title}
                </div>
              )}
              {section.items.map((item, itemIdx) => (
                <MenuItem key={itemIdx} icon={item.icon} label={item.label} />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Profile Section */}
      <div className="border-t border-gray-200 p-4">
        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 transition-colors">
          <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-white text-xs font-semibold">SP</span>
          </div>
          {isOpen && (
            <>
              <div className="flex-1 text-left min-w-0">
                <div className="text-sm font-medium text-gray-900 truncate">Sabung Prestyo</div>
                <div className="text-xs text-gray-500 truncate">Senior Operator</div>
              </div>
              <ChevronDown size={16} className="text-gray-400 flex-shrink-0" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}