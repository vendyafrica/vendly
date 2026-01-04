import { redirect } from 'next/navigation'
import { auth } from '@/app/(auth)/auth'
import { AuthForm } from '@/components/auth-form'

export default async function LoginPage() {
  const session = await auth()

  if (session) {
    redirect('/')
  }

  return (
    <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="w-full max-w-sm">
        <AuthForm type="signin" />
      </div>
    </div>
  )
}
