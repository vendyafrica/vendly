"use client";

import InteractiveImageBentoGallery from "../../../components/bento-gallery";

const imageItems = [
  {
    id: 1,
    title: "Women",
    desc: "",
    url: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=2070&auto=format&fit=crop",
    span: "col-span-2 row-span-1 md:col-span-2 md:row-span-2",
  },
  {
    id: 2,
    title: "Men",
    desc: "",
    url: "https://images.unsplash.com/photo-1629198688000-71f23e745b6e?q=80&w=2080&auto=format&fit=crop",
    span: "col-span-1 row-span-1",
  },
  {
    id: 3,
    title: "Food & Drinks",
    desc: "",
    url: "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?q=80&w=2070&auto=format&fit=crop",
    span: "col-span-1 row-span-1",
  },
  {
    id: 4,
    title: "Accessories",
    desc: "",
    url: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop",
    span: "col-span-1 row-span-2 md:row-span-2",
  },
  {
    id: 5,
    title: "Beauty & Personal Care",
    desc: "",
    url: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop",
    span: "col-span-1 row-span-1",
  },
  {
    id: 6,
    title: "Home & Living",
    desc: "",
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
