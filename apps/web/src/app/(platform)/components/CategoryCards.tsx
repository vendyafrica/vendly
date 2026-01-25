"use client";

import InteractiveImageBentoGallery from "../../../components/bento-gallery";

const imageItems = [
  {
    id: 1,
    title: "Women",
    desc: "",
    url: "https://cdn.cosmos.so/d48eee2c-5cfa-4bb9-a35d-ec78717c2c7e?format=jpeg",
    span: "col-span-2 row-span-1 md:col-span-2 md:row-span-2",
  },
  {
    id: 2,
    title: "Men",
    desc: "",
    url: "https://cdn.cosmos.so/25e7ef9d-3d95-486d-b7db-f0d19c1992d7?format=jpeg",
    span: "col-span-1 row-span-1",
  },
  {
    id: 3,
    title: "Food & Drinks",
    desc: "",
    url: "https://cdn.cosmos.so/562b5773-17ce-4e9b-9f6b-b7b652e0a6b0?format=jpeg",
    span: "col-span-1 row-span-1",
  },
  {
    id: 4,
    title: "Accessories",
    desc: "",
    url: "https://cdn.cosmos.so/23dcbd2e-147b-4387-8c4e-aa2bbcf22704?format=jpeg",
    span: "col-span-1 row-span-2 md:row-span-2",
  },
  {
    id: 5,
    title: "Beauty & Personal Care",
    desc: "",
    url: "https://cdn.cosmos.so/5199a33a-50dc-4571-8b1f-bc1eb00b54e3?format=jpeg",
    span: "col-span-1 row-span-1",
  },
  {
    id: 6,
    title: "Home & Living",
    desc: "",
    url: "https://cdn.cosmos.so/64986e58-da40-41e5-b0e2-1d041230c287?format=jpeg",
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
