"use client";

import { CustomersTable } from "./customers-table";
import { StatsCard } from "../dashboard/components/stats-card"; 
import { Users, UserPlus, Crown, Zap } from "lucide-react";

export default function CustomersPage() {
  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
      <div className="flex items-center justify-between">
         <h1 className="text-2xl font-bold text-foreground">Customers</h1>
         <div className="text-sm text-muted-foreground">
            <span className="hover:text-foreground cursor-pointer">Home</span>
            <span className="mx-2">›</span>
            <span className="text-foreground font-medium">Customers</span>
         </div>
      </div>

      {/* Customer Insights Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard 
            title="Total Customers" 
            value="12,345" 
            change="12%" 
            trend="up" 
            icon={Users} 
        />
        <StatsCard 
            title="Active Now" 
            value="142" 
            change="5%" 
            trend="up" 
            icon={Zap} 
        />
        <StatsCard 
            title="New This Month" 
            value="345" 
            change="2%" 
            trend="down" 
            icon={UserPlus} 
        />
        <StatsCard 
            title="VIP Members" 
            value="1,204" 
            change="8%" 
            trend="up" 
            icon={Crown} 
        />
      </div>

      <CustomersTable />
    </div>
  );
}