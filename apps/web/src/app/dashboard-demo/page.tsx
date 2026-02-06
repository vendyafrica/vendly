import { SegmentedStatsCard, type StatSegment } from "@/app/a/[slug]/(dashboard)/components/SegmentedStatsCard";
import {
  RevenueAreaChartCard,
  TopProductsBarChartCard,
  type RevenuePoint,
  type TopProductPoint,
} from "@/app/a/[slug]/(dashboard)/components/DynamicCharts";
import { RecentTransactionsTable, type TransactionRow } from "@/app/a/[slug]/(dashboard)/components/RecentTransactionsTable";

const statSegments: StatSegment[] = [
  {
    label: "Total Revenue",
    value: "$48,200",
    changeLabel: "+12.4% vs last month",
    changeTone: "positive",
  },
  {
    label: "Paid Orders",
    value: "1,284",
    changeLabel: "+6.1% vs last month",
    changeTone: "positive",
  },
  {
    label: "Customers",
    value: "836",
    changeLabel: "92 new this month",
    changeTone: "neutral",
  },
  {
    label: "Refunds",
    value: "18",
    changeLabel: "-0.8% vs last month",
    changeTone: "negative",
  },
];

const revenueSeries: RevenuePoint[] = [
  { date: "Week 1", total: 12_000 },
  { date: "Week 2", total: 16_200 },
  { date: "Week 3", total: 15_400 },
  { date: "Week 4", total: 18_800 },
  { date: "Week 5", total: 22_300 },
  { date: "Week 6", total: 20_900 },
  { date: "Week 7", total: 24_400 },
  { date: "Week 8", total: 29_100 },
  { date: "Week 9", total: 32_600 },
  { date: "Week 10", total: 30_200 },
  { date: "Week 11", total: 34_700 },
  { date: "Week 12", total: 38_100 },
];

const topProducts: TopProductPoint[] = [
  { product: "Signature Hoodie", sales: 412 },
  { product: "Minimalist Sneakers", sales: 286 },
  { product: "Everyday Tote", sales: 241 },
  { product: "Studio Bottle", sales: 198 },
  { product: "Compact Wallet", sales: 154 },
];

const transactionRows: TransactionRow[] = [
  {
    id: "#10482",
    customer: "Amina K",
    product: "Signature Hoodie",
    amount: "$92.00",
    status: "Completed",
    payment: "Card",
    date: "Today, 2:14 PM",
  },
  {
    id: "#10481",
    customer: "Joel N",
    product: "Minimalist Sneakers",
    amount: "$124.00",
    status: "Completed",
    payment: "Momo",
    date: "Today, 12:08 PM",
  },
  {
    id: "#10480",
    customer: "Mary W",
    product: "Studio Bottle",
    amount: "$38.00",
    status: "Pending",
    payment: "Cash",
    date: "Today, 10:21 AM",
  },
  {
    id: "#10479",
    customer: "Chris B",
    product: "Everyday Tote",
    amount: "$68.00",
    status: "Completed",
    payment: "Card",
    date: "Yesterday, 6:44 PM",
  },
  {
    id: "#10478",
    customer: "Ruth A",
    product: "Compact Wallet",
    amount: "$42.00",
    status: "Failed",
    payment: "Momo",
    date: "Yesterday, 4:19 PM",
  },
];

export default function DashboardDemoPage() {
  return (
    <div className="space-y-6">
      <SegmentedStatsCard segments={statSegments} />

      <div className="grid gap-5 md:grid-cols-7 lg:grid-cols-7">
        <RevenueAreaChartCard
          className="md:col-span-4"
          title="Total Revenue"
          totalLabel="$48.2k"
          data={revenueSeries}
        />
        <TopProductsBarChartCard
          className="md:col-span-3"
          title="Top Products"
          description="By sales volume"
          totalLabel={topProducts.reduce((acc, p) => acc + p.sales, 0).toLocaleString()}
          data={topProducts}
        />
      </div>

      <RecentTransactionsTable rows={transactionRows} />
    </div>
  );
}
