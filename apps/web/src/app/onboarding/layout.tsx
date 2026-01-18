import type { ReactNode } from "react";
import Image from "next/image";

export default function OnboardingLayout({
    children,
}: {
    children: ReactNode
}) {
    return (
        <div className="h-screen bg-muted flex flex-col overflow-hidden">
            {/* Header */}
            <header className="flex items-start justify-between p-6 shrink-0">
                <div className="flex items-center gap-1">
                    <Image src="/vendly.png" alt="Vendly" width={32} height={32} />
                    <span className="text-md font-semibold">vendly.</span>
                </div>
            </header>

            {/* Centered content */}
            <main className="flex-1 flex items-center justify-center px-6">
                <div className="w-full max-w-4xl">
                    {children}
                </div>
            </main>
        </div>
    )
}
