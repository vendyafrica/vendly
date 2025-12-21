"use client";

import { useState, useEffect } from "react";
import Header from "@/components/header";
import Search from "@/components/search";
import MarketplaceSection from "@/components/marketplace-section";
import "@/styles/home.css";

export default function HomePage() {
  const [scrolled, setScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if mobile on mount and resize
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);

    const handleScroll = () => {
      const isScrolled = window.scrollY > 50;
      setScrolled(isScrolled);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  const shops = [
    { name: "Women's Clothing", image: "https://picsum.photos/300/300?women" },
    { name: "Men's Clothing", image: "https://picsum.photos/300/300?men" },
    { name: "Kids & Baby", image: "https://picsum.photos/300/300?kids" },
    { name: "Cozy Knits", image: "https://picsum.photos/300/300?knits" },
    { name: "Personalized Tees", image: "https://picsum.photos/300/300?tees" },
    { name: "Jackets & Coats", image: "https://picsum.photos/300/300?jackets" },
    { name: "Summer Collection", image: "https://picsum.photos/300/300?summer" },
    { name: "Winter Essentials", image: "https://picsum.photos/300/300?winter" },
    { name: "Accessories", image: "https://picsum.photos/300/300?accessories" },
    { name: "Footwear", image: "https://picsum.photos/300/300?shoes" },
  ];

  // Marketplace data
  const marketplaceCategories = [
    {
      title: "Fashion",
      slug: "fashion",
      shops: [
        { id: "f1", name: "Chic Boutique", images: ["https://picsum.photos/400/500?fashion1a", "https://picsum.photos/400/500?fashion1b", "https://picsum.photos/400/500?fashion1c"], pfp: "https://picsum.photos/100/100?fashion1pfp", rating: 4.8, reviewCount: 234 },
        { id: "f2", name: "Urban Style", images: ["https://picsum.photos/400/500?fashion2a", "https://picsum.photos/400/500?fashion2b", "https://picsum.photos/400/500?fashion2c"], pfp: "https://picsum.photos/100/100?fashion2pfp", rating: 4.6, reviewCount: 189 },
        { id: "f3", name: "Elegant Wear", images: ["https://picsum.photos/400/500?fashion3a", "https://picsum.photos/400/500?fashion3b", "https://picsum.photos/400/500?fashion3c"], pfp: "https://picsum.photos/100/100?fashion3pfp", rating: 4.9, reviewCount: 421 },
        { id: "f4", name: "Casual Corner", images: ["https://picsum.photos/400/500?fashion4a", "https://picsum.photos/400/500?fashion4b", "https://picsum.photos/400/500?fashion4c"], pfp: "https://picsum.photos/100/100?fashion4pfp", rating: 4.5, reviewCount: 156 },
        { id: "f5", name: "Trendy Threads", images: ["https://picsum.photos/400/500?fashion5a", "https://picsum.photos/400/500?fashion5b", "https://picsum.photos/400/500?fashion5c"], pfp: "https://picsum.photos/100/100?fashion5pfp", rating: 4.7, reviewCount: 298 },
        { id: "f6", name: "Classic Fits", images: ["https://picsum.photos/400/500?fashion6a", "https://picsum.photos/400/500?fashion6b", "https://picsum.photos/400/500?fashion6c"], pfp: "https://picsum.photos/100/100?fashion6pfp", rating: 4.8, reviewCount: 312 },
        { id: "f7", name: "Modern Look", images: ["https://picsum.photos/400/500?fashion7a", "https://picsum.photos/400/500?fashion7b", "https://picsum.photos/400/500?fashion7c"], pfp: "https://picsum.photos/100/100?fashion7pfp", rating: 4.6, reviewCount: 245 },
        { id: "f8", name: "Vintage Vibes", images: ["https://picsum.photos/400/500?fashion8a", "https://picsum.photos/400/500?fashion8b", "https://picsum.photos/400/500?fashion8c"], pfp: "https://picsum.photos/100/100?fashion8pfp", rating: 4.9, reviewCount: 567 },
        { id: "f9", name: "Street Style", images: ["https://picsum.photos/400/500?fashion9a", "https://picsum.photos/400/500?fashion9b", "https://picsum.photos/400/500?fashion9c"], pfp: "https://picsum.photos/100/100?fashion9pfp", rating: 4.5, reviewCount: 178 },
        { id: "f10", name: "Formal Wear", images: ["https://picsum.photos/400/500?fashion10a", "https://picsum.photos/400/500?fashion10b", "https://picsum.photos/400/500?fashion10c"], pfp: "https://picsum.photos/100/100?fashion10pfp", rating: 4.7, reviewCount: 289 },
        { id: "f11", name: "Boho Chic", images: ["https://picsum.photos/400/500?fashion11a", "https://picsum.photos/400/500?fashion11b", "https://picsum.photos/400/500?fashion11c"], pfp: "https://picsum.photos/100/100?fashion11pfp", rating: 4.8, reviewCount: 334 },
        { id: "f12", name: "Minimalist", images: ["https://picsum.photos/400/500?fashion12a", "https://picsum.photos/400/500?fashion12b", "https://picsum.photos/400/500?fashion12c"], pfp: "https://picsum.photos/100/100?fashion12pfp", rating: 4.6, reviewCount: 201 },
        { id: "f13", name: "Maxi Dresses", images: ["https://picsum.photos/400/500?fashion13a", "https://picsum.photos/400/500?fashion13b", "https://picsum.photos/400/500?fashion13c"], pfp: "https://picsum.photos/100/100?fashion13pfp", rating: 4.9, reviewCount: 412 },
        { id: "f14", name: "Designer Denim", images: ["https://picsum.photos/400/500?fashion14a", "https://picsum.photos/400/500?fashion14b", "https://picsum.photos/400/500?fashion14c"], pfp: "https://picsum.photos/100/100?fashion14pfp", rating: 4.7, reviewCount: 276 },
        { id: "f15", name: "Athleisure", images: ["https://picsum.photos/400/500?fashion15a", "https://picsum.photos/400/500?fashion15b", "https://picsum.photos/400/500?fashion15c"], pfp: "https://picsum.photos/100/100?fashion15pfp", rating: 4.8, reviewCount: 389 },
      ],
    },
    {
      title: "Beauty",
      slug: "beauty",
      shops: [
        { id: "b1", name: "Glow Up Cosmetics", images: ["https://picsum.photos/400/500?beauty1a", "https://picsum.photos/400/500?beauty1b", "https://picsum.photos/400/500?beauty1c"], pfp: "https://picsum.photos/100/100?beauty1pfp", rating: 4.9, reviewCount: 512 },
        { id: "b2", name: "Natural Beauty", images: ["https://picsum.photos/400/500?beauty2a", "https://picsum.photos/400/500?beauty2b", "https://picsum.photos/400/500?beauty2c"], pfp: "https://picsum.photos/100/100?beauty2pfp", rating: 4.7, reviewCount: 298 },
        { id: "b3", name: "Luxe Makeup", images: ["https://picsum.photos/400/500?beauty3a", "https://picsum.photos/400/500?beauty3b", "https://picsum.photos/400/500?beauty3c"], pfp: "https://picsum.photos/100/100?beauty3pfp", rating: 4.8, reviewCount: 423 },
        { id: "b4", name: "Skincare Haven", images: ["https://picsum.photos/400/500?beauty4a", "https://picsum.photos/400/500?beauty4b", "https://picsum.photos/400/500?beauty4c"], pfp: "https://picsum.photos/100/100?beauty4pfp", rating: 4.9, reviewCount: 634 },
        { id: "b5", name: "Beauty Box", images: ["https://picsum.photos/400/500?beauty5a", "https://picsum.photos/400/500?beauty5b", "https://picsum.photos/400/500?beauty5c"], pfp: "https://picsum.photos/100/100?beauty5pfp", rating: 4.6, reviewCount: 187 },
        { id: "b6", name: "Perfect Pout", images: ["https://picsum.photos/400/500?beauty6a", "https://picsum.photos/400/500?beauty6b", "https://picsum.photos/400/500?beauty6c"], pfp: "https://picsum.photos/100/100?beauty6pfp", rating: 4.8, reviewCount: 356 },
        { id: "b7", name: "Eco Beauty", images: ["https://picsum.photos/400/500?beauty7a", "https://picsum.photos/400/500?beauty7b", "https://picsum.photos/400/500?beauty7c"], pfp: "https://picsum.photos/100/100?beauty7pfp", rating: 4.7, reviewCount: 278 },
        { id: "b8", name: "Pro Makeup", images: ["https://picsum.photos/400/500?beauty8a", "https://picsum.photos/400/500?beauty8b", "https://picsum.photos/400/500?beauty8c"], pfp: "https://picsum.photos/100/100?beauty8pfp", rating: 4.9, reviewCount: 445 },
        { id: "b9", name: "Organic Glow", images: ["https://picsum.photos/400/500?beauty9a", "https://picsum.photos/400/500?beauty9b", "https://picsum.photos/400/500?beauty9c"], pfp: "https://picsum.photos/100/100?beauty9pfp", rating: 4.8, reviewCount: 312 },
        { id: "b10", name: "Beauty Pro", images: ["https://picsum.photos/400/500?beauty10a", "https://picsum.photos/400/500?beauty10b", "https://picsum.photos/400/500?beauty10c"], pfp: "https://picsum.photos/100/100?beauty10pfp", rating: 4.6, reviewCount: 234 },
        { id: "b11", name: "Cosmetic Corner", images: ["https://picsum.photos/400/500?beauty11a", "https://picsum.photos/400/500?beauty11b", "https://picsum.photos/400/500?beauty11c"], pfp: "https://picsum.photos/100/100?beauty11pfp", rating: 4.7, reviewCount: 289 },
        { id: "b12", name: "Face Art", images: ["https://picsum.photos/400/500?beauty12a", "https://picsum.photos/400/500?beauty12b", "https://picsum.photos/400/500?beauty12c"], pfp: "https://picsum.photos/100/100?beauty12pfp", rating: 4.9, reviewCount: 523 },
        { id: "b13", name: "Pure Beauty", images: ["https://picsum.photos/400/500?beauty13a", "https://picsum.photos/400/500?beauty13b", "https://picsum.photos/400/500?beauty13c"], pfp: "https://picsum.photos/100/100?beauty13pfp", rating: 4.8, reviewCount: 367 },
        { id: "b14", name: "Beauty Lab", images: ["https://picsum.photos/400/500?beauty14a", "https://picsum.photos/400/500?beauty14b", "https://picsum.photos/400/500?beauty14c"], pfp: "https://picsum.photos/100/100?beauty14pfp", rating: 4.7, reviewCount: 298 },
        { id: "b15", name: "Glow Secrets", images: ["https://picsum.photos/400/500?beauty15a", "https://picsum.photos/400/500?beauty15b", "https://picsum.photos/400/500?beauty15c"], pfp: "https://picsum.photos/100/100?beauty15pfp", rating: 4.9, reviewCount: 456 },
      ],
    },
    {
      title: "Accessories",
      slug: "accessories",
      shops: [
        { id: "a1", name: "Bling Boutique", images: ["https://picsum.photos/400/500?acc1a", "https://picsum.photos/400/500?acc1b", "https://picsum.photos/400/500?acc1c"], pfp: "https://picsum.photos/100/100?acc1pfp", rating: 4.8, reviewCount: 345 },
        { id: "a2", name: "Leather Goods", images: ["https://picsum.photos/400/500?acc2a", "https://picsum.photos/400/500?acc2b", "https://picsum.photos/400/500?acc2c"], pfp: "https://picsum.photos/100/100?acc2pfp", rating: 4.7, reviewCount: 278 },
        { id: "a3", name: "Watch World", images: ["https://picsum.photos/400/500?acc3a", "https://picsum.photos/400/500?acc3b", "https://picsum.photos/400/500?acc3c"], pfp: "https://picsum.photos/100/100?acc3pfp", rating: 4.9, reviewCount: 489 },
        { id: "a4", name: "Bag Paradise", images: ["https://picsum.photos/400/500?acc4a", "https://picsum.photos/400/500?acc4b", "https://picsum.photos/400/500?acc4c"], pfp: "https://picsum.photos/100/100?acc4pfp", rating: 4.6, reviewCount: 234 },
        { id: "a5", name: "Hat Shop", images: ["https://picsum.photos/400/500?acc5a", "https://picsum.photos/400/500?acc5b", "https://picsum.photos/400/500?acc5c"], pfp: "https://picsum.photos/100/100?acc5pfp", rating: 4.8, reviewCount: 312 },
        { id: "a6", name: "Sunglass Store", images: ["https://picsum.photos/400/500?acc6a", "https://picsum.photos/400/500?acc6b", "https://picsum.photos/400/500?acc6c"], pfp: "https://picsum.photos/100/100?acc6pfp", rating: 4.7, reviewCount: 256 },
        { id: "a7", name: "Belt Boutique", images: ["https://picsum.photos/400/500?acc7a", "https://picsum.photos/400/500?acc7b", "https://picsum.photos/400/500?acc7c"], pfp: "https://picsum.photos/100/100?acc7pfp", rating: 4.5, reviewCount: 189 },
        { id: "a8", name: "Scarf Collection", images: ["https://picsum.photos/400/500?acc8a", "https://picsum.photos/400/500?acc8b", "https://picsum.photos/400/500?acc8c"], pfp: "https://picsum.photos/100/100?acc8pfp", rating: 4.8, reviewCount: 334 },
        { id: "a9", name: "Jewelry Box", images: ["https://picsum.photos/400/500?acc9a", "https://picsum.photos/400/500?acc9b", "https://picsum.photos/400/500?acc9c"], pfp: "https://picsum.photos/100/100?acc9pfp", rating: 4.9, reviewCount: 567 },
        { id: "a10", name: "Wallet World", images: ["https://picsum.photos/400/500?acc10a", "https://picsum.photos/400/500?acc10b", "https://picsum.photos/400/500?acc10c"], pfp: "https://picsum.photos/100/100?acc10pfp", rating: 4.6, reviewCount: 223 },
        { id: "a11", name: "Phone Cases", images: ["https://picsum.photos/400/500?acc11a", "https://picsum.photos/400/500?acc11b", "https://picsum.photos/400/500?acc11c"], pfp: "https://picsum.photos/100/100?acc11pfp", rating: 4.7, reviewCount: 289 },
        { id: "a12", name: "Key Chains", images: ["https://picsum.photos/400/500?acc12a", "https://picsum.photos/400/500?acc12b", "https://picsum.photos/400/500?acc12c"], pfp: "https://picsum.photos/100/100?acc12pfp", rating: 4.5, reviewCount: 167 },
        { id: "a13", name: "Tie Shop", images: ["https://picsum.photos/400/500?acc13a", "https://picsum.photos/400/500?acc13b", "https://picsum.photos/400/500?acc13c"], pfp: "https://picsum.photos/100/100?acc13pfp", rating: 4.8, reviewCount: 345 },
        { id: "a14", name: "Glove Store", images: ["https://picsum.photos/400/500?acc14a", "https://picsum.photos/400/500?acc14b", "https://picsum.photos/400/500?acc14c"], pfp: "https://picsum.photos/100/100?acc14pfp", rating: 4.7, reviewCount: 278 },
        { id: "a15", name: "Accessory Hub", images: ["https://picsum.photos/400/500?acc15a", "https://picsum.photos/400/500?acc15b", "https://picsum.photos/400/500?acc15c"], pfp: "https://picsum.photos/100/100?acc15pfp", rating: 4.9, reviewCount: 412 },
      ],
    },
    {
      title: "Gifts",
      slug: "gifts",
      shops: [
        { id: "g1", name: "Gift Box", images: ["https://picsum.photos/400/500?gift1a", "https://picsum.photos/400/500?gift1b", "https://picsum.photos/400/500?gift1c"], pfp: "https://picsum.photos/100/100?gift1pfp", rating: 4.9, reviewCount: 623 },
        { id: "g2", name: "Personalized Gifts", images: ["https://picsum.photos/400/500?gift2a", "https://picsum.photos/400/500?gift2b", "https://picsum.photos/400/500?gift2c"], pfp: "https://picsum.photos/100/100?gift2pfp", rating: 4.8, reviewCount: 456 },
        { id: "g3", name: "Surprise Store", images: ["https://picsum.photos/400/500?gift3a", "https://picsum.photos/400/500?gift3b", "https://picsum.photos/400/500?gift3c"], pfp: "https://picsum.photos/100/100?gift3pfp", rating: 4.7, reviewCount: 334 },
        { id: "g4", name: "Gift Wrapping", images: ["https://picsum.photos/400/500?gift4a", "https://picsum.photos/400/500?gift4b", "https://picsum.photos/400/500?gift4c"], pfp: "https://picsum.photos/100/100?gift4pfp", rating: 4.6, reviewCount: 278 },
        { id: "g5", name: "Party Favors", images: ["https://picsum.photos/400/500?gift5a", "https://picsum.photos/400/500?gift5b", "https://picsum.photos/400/500?gift5c"], pfp: "https://picsum.photos/100/100?gift5pfp", rating: 4.8, reviewCount: 389 },
        { id: "g6", name: "Gift Cards", images: ["https://picsum.photos/400/500?gift6a", "https://picsum.photos/400/500?gift6b", "https://picsum.photos/400/500?gift6c"], pfp: "https://picsum.photos/100/100?gift6pfp", rating: 4.5, reviewCount: 234 },
        { id: "g7", name: "Unique Gifts", images: ["https://picsum.photos/400/500?gift7a", "https://picsum.photos/400/500?gift7b", "https://picsum.photos/400/500?gift7c"], pfp: "https://picsum.photos/100/100?gift7pfp", rating: 4.9, reviewCount: 512 },
        { id: "g8", name: "Gift Baskets", images: ["https://picsum.photos/400/500?gift8a", "https://picsum.photos/400/500?gift8b", "https://picsum.photos/400/500?gift8c"], pfp: "https://picsum.photos/100/100?gift8pfp", rating: 4.7, reviewCount: 345 },
        { id: "g9", name: "Holiday Gifts", images: ["https://picsum.photos/400/500?gift9a", "https://picsum.photos/400/500?gift9b", "https://picsum.photos/400/500?gift9c"], pfp: "https://picsum.photos/100/100?gift9pfp", rating: 4.8, reviewCount: 423 },
        { id: "g10", name: "Corporate Gifts", images: ["https://picsum.photos/400/500?gift10a", "https://picsum.photos/400/500?gift10b", "https://picsum.photos/400/500?gift10c"], pfp: "https://picsum.photos/100/100?gift10pfp", rating: 4.6, reviewCount: 289 },
        { id: "g11", name: "Baby Gifts", images: ["https://picsum.photos/400/500?gift11a", "https://picsum.photos/400/500?gift11b", "https://picsum.photos/400/500?gift11c"], pfp: "https://picsum.photos/100/100?gift11pfp", rating: 4.9, reviewCount: 567 },
        { id: "g12", name: "Wedding Gifts", images: ["https://picsum.photos/400/500?gift12a", "https://picsum.photos/400/500?gift12b", "https://picsum.photos/400/500?gift12c"], pfp: "https://picsum.photos/100/100?gift12pfp", rating: 4.7, reviewCount: 378 },
        { id: "g13", name: "Gift Shop", images: ["https://picsum.photos/400/500?gift13a", "https://picsum.photos/400/500?gift13b", "https://picsum.photos/400/500?gift13c"], pfp: "https://picsum.photos/100/100?gift13pfp", rating: 4.8, reviewCount: 412 },
        { id: "g14", name: "Special Gifts", images: ["https://picsum.photos/400/500?gift14a", "https://picsum.photos/400/500?gift14b", "https://picsum.photos/400/500?gift14c"], pfp: "https://picsum.photos/100/100?gift14pfp", rating: 4.6, reviewCount: 256 },
        { id: "g15", name: "Gift Ideas", images: ["https://picsum.photos/400/500?gift15a", "https://picsum.photos/400/500?gift15b", "https://picsum.photos/400/500?gift15c"], pfp: "https://picsum.photos/100/100?gift15pfp", rating: 4.9, reviewCount: 489 },
      ],
    },
    {
      title: "Home & Living",
      slug: "home-living",
      shops: [
        { id: "h1", name: "Home Decor", images: ["https://picsum.photos/400/500?home1a", "https://picsum.photos/400/500?home1b", "https://picsum.photos/400/500?home1c"], pfp: "https://picsum.photos/100/100?home1pfp", rating: 4.8, reviewCount: 423 },
        { id: "h2", name: "Kitchen Store", images: ["https://picsum.photos/400/500?home2a", "https://picsum.photos/400/500?home2b", "https://picsum.photos/400/500?home2c"], pfp: "https://picsum.photos/100/100?home2pfp", rating: 4.7, reviewCount: 345 },
        { id: "h3", name: "Bed & Bath", images: ["https://picsum.photos/400/500?home3a", "https://picsum.photos/400/500?home3b", "https://picsum.photos/400/500?home3c"], pfp: "https://picsum.photos/100/100?home3pfp", rating: 4.9, reviewCount: 567 },
        { id: "h4", name: "Living Room", images: ["https://picsum.photos/400/500?home4a", "https://picsum.photos/400/500?home4b", "https://picsum.photos/400/500?home4c"], pfp: "https://picsum.photos/100/100?home4pfp", rating: 4.6, reviewCount: 278 },
        { id: "h5", name: "Garden Shop", images: ["https://picsum.photos/400/500?home5a", "https://picsum.photos/400/500?home5b", "https://picsum.photos/400/500?home5c"], pfp: "https://picsum.photos/100/100?home5pfp", rating: 4.8, reviewCount: 389 },
        { id: "h6", name: "Lighting Store", images: ["https://picsum.photos/400/500?home6a", "https://picsum.photos/400/500?home6b", "https://picsum.photos/400/500?home6c"], pfp: "https://picsum.photos/100/100?home6pfp", rating: 4.7, reviewCount: 312 },
        { id: "h7", name: "Furniture Hub", images: ["https://picsum.photos/400/500?home7a", "https://picsum.photos/400/500?home7b", "https://picsum.photos/400/500?home7c"], pfp: "https://picsum.photos/100/100?home7pfp", rating: 4.5, reviewCount: 234 },
        { id: "h8", name: "Rugs & Carpets", images: ["https://picsum.photos/400/500?home8a", "https://picsum.photos/400/500?home8b", "https://picsum.photos/400/500?home8c"], pfp: "https://picsum.photos/100/100?home8pfp", rating: 4.8, reviewCount: 412 },
        { id: "h9", name: "Storage Solutions", images: ["https://picsum.photos/400/500?home9a", "https://picsum.photos/400/500?home9b", "https://picsum.photos/400/500?home9c"], pfp: "https://picsum.photos/100/100?home9pfp", rating: 4.6, reviewCount: 289 },
        { id: "h10", name: "Art & Decor", images: ["https://picsum.photos/400/500?home10a", "https://picsum.photos/400/500?home10b", "https://picsum.photos/400/500?home10c"], pfp: "https://picsum.photos/100/100?home10pfp", rating: 4.9, reviewCount: 534 },
        { id: "h11", name: "Smart Home", images: ["https://picsum.photos/400/500?home11a", "https://picsum.photos/400/500?home11b", "https://picsum.photos/400/500?home11c"], pfp: "https://picsum.photos/100/100?home11pfp", rating: 4.7, reviewCount: 367 },
        { id: "h12", name: "Patio Store", images: ["https://picsum.photos/400/500?home12a", "https://picsum.photos/400/500?home12b", "https://picsum.photos/400/500?home12c"], pfp: "https://picsum.photos/100/100?home12pfp", rating: 4.8, reviewCount: 423 },
        { id: "h13", name: "Organization", images: ["https://picsum.photos/400/500?home13a", "https://picsum.photos/400/500?home13b", "https://picsum.photos/400/500?home13c"], pfp: "https://picsum.photos/100/100?home13pfp", rating: 4.6, reviewCount: 256 },
        { id: "h14", name: "Home Essentials", images: ["https://picsum.photos/400/500?home14a", "https://picsum.photos/400/500?home14b", "https://picsum.photos/400/500?home14c"], pfp: "https://picsum.photos/100/100?home14pfp", rating: 4.7, reviewCount: 345 },
        { id: "h15", name: "Cozy Home", images: ["https://picsum.photos/400/500?home15a", "https://picsum.photos/400/500?home15b", "https://picsum.photos/400/500?home15c"], pfp: "https://picsum.photos/100/100?home15pfp", rating: 4.9, reviewCount: 489 },
      ],
    },
  ];

  return (
    <>
      <div className="min-h-screen bg-background">
        {/* Header - shows search on desktop when scrolled, never on mobile */}
        <Header showSearch={!isMobile && scrolled} />
        
        {/* Main content */}
        <main className="relative min-h-screen">
          {/* Hero section with search - static on mobile (no transitions), fixed on desktop (stays until hidden) */}
          <div className={`${isMobile ? 'relative' : 'fixed'} top-[40vh] left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl px-6 z-10 ${!isMobile && scrolled ? 'opacity-0 pointer-events-none transition-opacity duration-300' : 'opacity-100'}`}>
            <div className="text-center mb-8">
              <h1 className="text-4xl font-medium mb-4">Welcome to Vendly</h1>
              <p className="text-muted-foreground text-lg">
                Discover products from your favourite stores
              </p>
            </div>
            <Search />
          </div>
          
          {/* Favourites Section */}
          <section className="mt-[45vh] md:mt-[45vh] w-full overflow-hidden">
            <h2 className="text-xl font-semibold mb-4 px-6">Favourite Shops</h2>
            <div className="carousel-container relative overflow-x-auto overflow-y-hidden">
              <div className="carousel-track flex gap-6 pb-6 px-6 md:px-6" style={{ width: 'max-content' }}>
                {/* Original items */}
                {shops.map((shop, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-center min-w-[140px] cursor-pointer group shrink-0"
                  >
                    <div className="w-36 h-36 rounded-full overflow-hidden mb-3 group-hover:scale-105 transition-transform shadow-lg">
                      <img
                        src={shop.image}
                        alt={shop.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <span className="text-sm text-center text-muted-foreground group-hover:text-foreground transition-colors">
                      {shop.name}
                    </span>
                  </div>
                ))}
                {/* Duplicate items for seamless loop */}
                {shops.map((shop, index) => (
                  <div
                    key={`duplicate-${index}`}
                    className="flex flex-col items-center min-w-[140px] cursor-pointer group shrink-0"
                  >
                    <div className="w-36 h-36 rounded-full overflow-hidden mb-3 group-hover:scale-105 transition-transform shadow-lg">
                      <img
                        src={shop.image}
                        alt={shop.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <span className="text-sm text-center text-muted-foreground group-hover:text-foreground transition-colors">
                      {shop.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>
          
          {/* Marketplace Sections */}
          <div className="bg-muted/30">
            {marketplaceCategories.map((category) => (
              <MarketplaceSection
                key={category.slug}
                title={category.title}
                slug={category.slug}
                shops={category.shops}
              />
            ))}
          </div>
          
          <section className="py-16 px-6 bg-muted/50">
            <h2 className="text-2xl font-semibold mb-8">Popular Categories</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {["Electronics", "Fashion", "Home", "Sports"].map((cat) => (
                <div key={cat} className="bg-card rounded-lg p-8 text-center border">
                  <div className="w-16 h-16 bg-muted rounded-full mx-auto mb-4"></div>
                  <p className="font-medium">{cat}</p>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    </>
  );
}