'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@vendly/ui/components/button'
import { Info } from 'lucide-react'
import Image from 'next/image'

interface AppHeaderProps {
  className?: string
}

export function AppHeader({ className = '' }: AppHeaderProps) {
  const pathname = usePathname()
  const isHomepage = pathname === '/'
  const [isInfoDialogOpen, setIsInfoDialogOpen] = useState(false)

  // Handle logo click - reset UI if on homepage, otherwise navigate to homepage
  const handleLogoClick = (e: React.MouseEvent) => {
    if (isHomepage) {
      e.preventDefault()
      // Add reset parameter to trigger UI reset
      window.location.href = '/?reset=true'
    }
    // If not on homepage, let the Link component handle navigation normally
  }

  return (
    <div
      className={`${!isHomepage ? 'border-b border-border dark:border-input' : ''} ${className}`}
    >
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left side - Logo */}
          <div className="flex items-center gap-4">
            <Link href="/" onClick={handleLogoClick}>
              <Image
                src="/apple-icon.png"
                alt="vendly logo"
                width={32}
                height={32}
              />
            </Link>
          </div>
          <div className="hidden lg:flex items-center gap-4">
           <Button
              variant="outline"
              className="py-1.5 px-2 h-fit text-sm"
              asChild
            >
              <Link
                href="/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image src="/apple-icon.png" alt="vendly" width={16} height={16} />
                Sync to your Vendly
              </Link>
            </Button>
          </div>

          {/* Mobile right side - Info button */}
          <div className="flex lg:hidden items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsInfoDialogOpen(true)}
            >
              <Info size={16} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

