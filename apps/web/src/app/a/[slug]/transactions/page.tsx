import { redirect } from "next/navigation";

export default async function TransactionsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  redirect(`/a/${slug}/orders`);
}
