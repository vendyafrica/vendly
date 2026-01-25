"use client";

import InteractiveImageBentoGallery from "../../../components/bento-gallery";

const imageItems = [
  {
    id: 1,
    title: "Mountain Vista",
    desc: "Serenity above the clouds.",
    url: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=2070&auto=format&fit=crop",
    span: "col-span-2 row-span-1 md:col-span-2 md:row-span-2",
  },
  {
    id: 2,
    title: "Coastal Arch",
    desc: "Where the land meets the sea.",
    url: "https://images.unsplash.com/photo-1629198688000-71f23e745b6e?q=80&w=2080&auto=format&fit=crop",
    span: "col-span-1 row-span-1",
  },
  {
    id: 3,
    title: "Forest Canopy",
    desc: "Sunlight filtering through leaves.",
    url: "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?q=80&w=2070&auto=format&fit=crop",
    span: "col-span-1 row-span-1",
  },
  {
    id: 4,
    title: "Desert Dunes",
    desc: "Golden sands under the sun.",
    url: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop",
    span: "col-span-1 row-span-2 md:row-span-2",
  },
  {
    id: 5,
    title: "City at Night",
    desc: "A vibrant urban landscape.",
    url: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop",
    span: "col-span-1 row-span-1",
  },
  {
    id: 6,
    title: "Misty Lake",
    desc: "Morning fog over calm waters.",
    url: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop",
    span: "col-span-1 row-span-1 md:col-span-1 md:row-span-1",
  },
]


export default function InteractiveImageBentoGalleryDemo() {
  return (
    <div className="w-full antialiased">
      <InteractiveImageBentoGallery
        imageItems={imageItems}
      />
    </div>
  )
}
