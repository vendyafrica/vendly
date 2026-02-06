import { SegmentedStatsCard } from "./components/SegmentedStatsCard";
import { RevenueAreaChartCard, TopProductsBarChartCard } from "./components/DynamicCharts";
import { RecentTransactionsTable } from "./components/RecentTransactionsTable";


// Mock Data for Main Chart (Revenue)
const mockRevenueData = [
  { date: "Jan", total: 12500 },
  { date: "Feb", total: 18900 },
  { date: "Mar", total: 15600 },
  { date: "Apr", total: 21000 },
  { date: "May", total: 25800 },
  { date: "Jun", total: 29500 },
  { date: "Jul", total: 34200 },
  { date: "Aug", total: 39952 }, // Highlighted in design
  { date: "Sep", total: 37800 },
  { date: "Oct", total: 42500 },
  { date: "Nov", total: 41000 },
  { date: "Dec", total: 52000 },
];

// Mock Data for Top Products
const topProductsData = [
  { product: "Winter Beanie", sales: 12628, fill: "hsl(var(--primary))" },
  { product: "Leather Wallet", sales: 10628, fill: "hsl(var(--primary))" },
  { product: "Wireless Earbuds", sales: 8628, fill: "hsl(var(--primary))" },
  { product: "Yoga Mat", sales: 6628, fill: "hsl(var(--primary))" },
  { product: "Running Sneakers", sales: 4200, fill: "hsl(var(--primary))" },
];

// Mock Data for Recent Transactions
const mockTransactions = [
  {
    id: "#893427",
    customer: "Alex Morgan",
    product: "Winter Beanie",
    amount: 49.20,
    status: "Completed",
    payment: "Apple Pay",
    date: "Nov 12, 2025 3:42 PM",
    currency: "USD",
  },
  {
    id: "#A74329",
    customer: "Megan Rapin",
    product: "Smart Watch",
    amount: 150.75,
    status: "Failed",
    payment: "PayPal",
    date: "Nov 13, 2025 4:20 PM",
    currency: "USD",
  },
  {
    id: "#B8652C",
    customer: "Kristie Mewis",
    product: "Sunglasses",
    amount: 120.62,
    status: "Completed",
    payment: "Bank Transfer",
    date: "Nov 14, 2025 5:42 PM",
    currency: "USD",
  },
  {
    id: "#C8872F",
    customer: "Rose Lavelle",
    product: "Baseball Cap",
    amount: 200.45,
    status: "Pending",
    payment: "Stripe",
    date: "Nov 15, 2025 5:54 PM",
    currency: "USD",
  },
  {
    id: "#D9983G",
    customer: "Tobin Heath",
    product: "Soccer Ball",
    amount: 35.00,
    status: "Completed",
    payment: "Visa",
    date: "Nov 16, 2025 10:15 AM",
    currency: "USD",
  },
];

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", { // Matching mock design Currency
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(amount);
}

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <SegmentedStatsCard
        segments={[
          {
            label: "Total Profit",
            value: formatCurrency(30720),
            changeLabel: "+12.04% Last 30 days",
            changeTone: "positive",
          },
          {
            label: "Total Orders",
            value: "15,350",
            changeLabel: "+16.02% Last 30 days",
            changeTone: "positive",
          },
          {
            label: "New Customers",
            value: "4,972",
            changeLabel: "+19.08% Last 30 days",
            changeTone: "positive",
          },
          {
            label: "Conversion Rate",
            value: "5.18%",
            changeLabel: "+10.02% Last 30 days",
            changeTone: "positive",
          },
        ]}
      />

      {/* Charts Section */}
      <div className="grid gap-5 md:grid-cols-7 lg:grid-cols-7">
        <RevenueAreaChartCard
          className="md:col-span-4"
          title="Total Revenue"
          totalLabel="$72,592"
          data={mockRevenueData}
        />
        <TopProductsBarChartCard
          className="md:col-span-3"
          title="Top Products"
          description="By sales volume"
          totalLabel="38,512"
          data={topProductsData}
        />
      </div>

      {/* Recent Transactions Table */}
      <RecentTransactionsTable
        rows={mockTransactions.map((t) => ({
          id: t.id,
          customer: t.customer,
          product: t.product,
          amount: formatCurrency(t.amount),
          status: t.status as "Completed" | "Failed" | "Pending",
          payment: t.payment,
          date: t.date,
        }))}
      />
    </div>
  );
}
