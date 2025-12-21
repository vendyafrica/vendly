export type FavouriteShop = {
  name: string;
  image: string;
};

export function useFavouriteShops(): FavouriteShop[] {
  // TODO: fetch personalised/curated favourite shops.
  return [
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
}
