import { designSystem } from './designSystem'
import { storeSettings } from './storeSettings'
import { homepage } from './homepage'
import { header } from './header'
import { footer } from './footer'
import { heroSection } from './sections/hero'
import { productGridSection } from './sections/productGrid'
import { bannerSection } from './sections/banner'
import { collectionsSection } from './sections/collectionsSection'
import { offersSection } from './sections/offersSection'
import { productDetailsPage } from './productDetailsPage'

export const schemaTypes = [
    // Design System
    designSystem,

    // Store Configuration
    storeSettings,

    // Pages
    homepage,
    productDetailsPage,

    // Layout
    header,
    footer,

    // Sections
    heroSection,
    collectionsSection,
    productGridSection,
    offersSection,
    bannerSection,
]
