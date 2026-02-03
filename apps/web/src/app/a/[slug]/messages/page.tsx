"use client";

import { SegmentedStatsCard } from "../components/SegmentedStatsCard";
import { DataTable } from "../components/DataTable";
import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@vendly/ui/components/badge";

type NotificationRow = {
  id: string;
  type: "Order" | "Message" | "Rating" | "Like";
  summary: string;
  channel: "Email" | "WhatsApp" | "In-App";
  status: "New" | "Seen";
  time: string;
};

const notifications: NotificationRow[] = [
  { id: "#N-8934", type: "Order", summary: "New order from Alex Morgan", channel: "In-App", status: "New", time: "2h ago" },
  { id: "#N-7432", type: "Message", summary: "WhatsApp inquiry about size", channel: "WhatsApp", status: "New", time: "3h ago" },
  { id: "#N-6521", type: "Rating", summary: "4.8★ rating from Rose", channel: "In-App", status: "Seen", time: "Yesterday" },
  { id: "#N-5410", type: "Like", summary: "Product wishlisted by Megan", channel: "In-App", status: "Seen", time: "2 days ago" },
  { id: "#N-4309", type: "Order", summary: "Refund requested by Tobin", channel: "Email", status: "New", time: "3 days ago" },
];

const columns: ColumnDef<NotificationRow>[] = [
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => <span className="font-medium">{row.original.type}</span>,
  },
  {
    accessorKey: "summary",
    header: "Summary",
    cell: ({ row }) => <span className="text-sm text-foreground">{row.original.summary}</span>,
  },
  {
    accessorKey: "channel",
    header: "Channel",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge
        variant="outline"
        className={
          row.original.status === "New"
            ? "bg-emerald-100 text-emerald-700 border-0"
            : "bg-muted text-muted-foreground border-0"
        }
      >
        {row.original.status}
      </Badge>
    ),
  },
  {
    accessorKey: "time",
    header: "Time",
    cell: ({ row }) => <span className="text-xs text-muted-foreground">{row.original.time}</span>,
  },
];

export default function NotificationsPage() {
  const statSegments = [
    {
      label: "New Alerts",
      value: "12",
      changeLabel: "+18% vs last 24h",
      changeTone: "positive" as const,
    },
    {
      label: "Orders",
      value: "6",
      changeLabel: "+12% vs last 24h",
      changeTone: "positive" as const,
    },
    {
      label: "Messages",
      value: "4",
      changeLabel: "Flat vs last 24h",
      changeTone: "neutral" as const,
    },
    {
      label: "Ratings & Likes",
      value: "2",
      changeLabel: "+5% vs last 24h",
      changeTone: "positive" as const,
    },
  ];

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Notifications</h1>
        <p className="text-sm text-muted-foreground">Recent activities: orders, messages, ratings, likes.</p>
      </div>

      <SegmentedStatsCard segments={statSegments} />

      <div className="rounded-md border bg-card p-3">
        <DataTable columns={columns} data={notifications} />
      </div>
    </div>
  );
}