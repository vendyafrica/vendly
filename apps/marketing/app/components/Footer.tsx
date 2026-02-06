import Link from 'next/link'
import Image from 'next/image'

const links = [
    { label: 'Features', href: '#' },
    { label: 'Pricing', href: '#' },
    { label: 'About', href: '#' },
    { label: 'Blog', href: '#' },
    { label: 'Contact', href: '#' },
]

export function Footer() {
    return (
        <footer className="bg-background @container py-12">
            <div className="mx-auto max-w-6xl px-6">
                <div className="flex flex-col">
                    <Link
                        href="/"
                        aria-label="go home"
                        className="hover:bg-foreground/5 -ml-1.5 flex size-8 rounded-lg *:m-auto">
                        <Image
                        src="/vendly.png"
                        alt="logo"
                        width={32}
                        height={32}
                        />
                    </Link>
                    <nav className="my-8 flex flex-wrap gap-x-8 gap-y-2">
                        {links.map((link) => (
                            <Link
                                key={link.label}
                                href={link.href}
                                className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                                {link.label}
                            </Link>
                        ))}
                    </nav>
                    <p className="text-muted-foreground mt-2 border-t pt-6 text-sm">&copy; {2026} vendly. </p>
                </div>
            </div>
        </footer>
    )
}