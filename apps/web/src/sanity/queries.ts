import { groq } from 'next-sanity'

// Get store settings with design system
export const storeSettingsQuery = groq`
  *[_type == "storeSettings" && storeId == $storeId][0]{
    ...,
    designSystem->{
      name,
      slug,
      colors,
      typography,
      layout
    }
  }
`

// Get homepage with all sections
export const homepageQuery = groq`
  *[_type == "homepage" && storeId == $storeId][0]{
    title,
    sections[]{
      _type,
      _key,
      ...,
      _type == "heroSection" => {
        title,
        subtitle,
        backgroundImage,
        ctaText,
        ctaLink,
        layout
      },
      _type == "productGridSection" => {
        title,
        columns,
        productSource,
        limit
      },
      _type == "bannerSection" => {
        text,
        backgroundColor,
        ctaText,
        ctaLink
      }
    }
  }
`

// Get header
export const headerQuery = groq`
  *[_type == "header" && storeId == $storeId][0]{
    storeName,
    logo,
    navigationLinks,
    announcementBar
  }
`

// Get footer
export const footerQuery = groq`
  *[_type == "footer" && storeId == $storeId][0]{
    linkColumns,
    newsletter,
    socialLinks,
    copyrightText
  }
`
