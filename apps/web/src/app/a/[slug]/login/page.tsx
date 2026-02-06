import { LoginForm } from "@/app/(auth)/components/login-form";
import { auth } from "@vendly/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function TenantAdminLoginPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ next?: string }>;
}) {
  const { slug } = await params;
  const { next } = await searchParams;

  const session = await auth.api.getSession({ headers: await headers() });
  const base = `/a/${slug}`;

  if (session?.user) {
    redirect(base);
  }

  const redirectTo = next && next.startsWith(base) ? next : base;
  const title = `Welcome to ${slug} Admin`;

  return (
    <div className="relative min-h-screen bg-gray-50 p-4 flex items-center justify-center">
      <div className="relative z-10 w-full bg-white shadow-xl rounded-t-2xl p-6 pb-12 sm:max-w-md sm:rounded-xl sm:p-8 sm:pb-8 sm:mb-0">
        <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-muted sm:hidden" />
        <LoginForm title={title} redirectTo={redirectTo} />
      </div>
    </div>
  );
}
