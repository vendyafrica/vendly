import Link from 'next/link'
import Image from 'next/image'
import { HugeiconsIcon } from '@hugeicons/react'
import { ArrowRight02Icon } from '@hugeicons/core-free-icons'

export function Header() {
    return (
        <div className="absolute top-0 left-0 right-0 z-100 flex justify-center w-full px-4 pt-6 pointer-events-none transition-all duration-300">
            <div className="pointer-events-auto flex w-full max-w-5xl items-center justify-between px-6 py-4">

                {/* Left: Logo and Name */}
                <div className="flex-1 flex justify-start items-center">
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="relative w-8 h-8 overflow-hidden flex items-center justify-center">
                            <Image
                                src="/vendly.png"
                                alt="Vendly Logo"
                                fill
                                className="object-cover"
                            />
                        </div>
                        <span className="text-2xl font-black tracking-tighter uppercase text-white drop-shadow-md">
                            vendly
                        </span>
                    </Link>
                </div>

                {/* Middle: Links */}
                <div className="flex-1 hidden md:flex justify-center items-center gap-8">
                    <Link href="#features" className="text-sm font-mono font-bold lowercase text-white/90 hover:text-white transition-colors drop-shadow-md">
                        Features
                    </Link>
                    <Link href="#pricing" className="text-sm font-mono font-bold lowercase text-white/90 hover:text-white transition-colors drop-shadow-md">
                        Pricing
                    </Link>
                    <Link href="#about" className="text-sm font-mono font-bold lowercase text-white/90 hover:text-white transition-colors drop-shadow-md">
                        About
                    </Link>
                </div>

                {/* Right: Login Link */}
                <div className="flex-1 flex justify-end items-center gap-6">
                    <Link
                        href="/login"
                        className="text-sm font-mono font-bold lowercase flex items-center text-white hover:text-white/80 transition-colors px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 shadow-sm"
                    >
                        Start Selling
                        <HugeiconsIcon icon={ArrowRight02Icon} className="ml-2 size-4" />
                    </Link>
                </div>
            </div>
        </div>
    )
}

