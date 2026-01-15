import HeroSection from './HeroSection'
import ProductGridSection from './ProductGridSection'
import BannerSection from './BannerSection'

interface SectionRendererProps {
    sections: any[]
}

export default function SectionRenderer({ sections }: SectionRendererProps) {
    if (!sections || sections.length === 0) {
        return null
    }

    return (
        <>
            {sections.map((section, index) => {
                const key = section._key || `section-${index}`

                switch (section._type) {
                    case 'heroSection':
                        return <HeroSection key={key} {...section} />

                    case 'productGridSection':
                        return <ProductGridSection key={key} {...section} />

                    case 'bannerSection':
                        return <BannerSection key={key} {...section} />

                    default:
                        console.warn(`Unknown section type: ${section._type}`)
                        return null
                }
            })}
        </>
    )
}
