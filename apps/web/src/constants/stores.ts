export const categories = [
    "Electronics",
    "Fashion",
    "Home",
    "Beauty",
    "Sports",
    "Toys",
    "Automotive",
    "Books",
    "Health",
    "Grocery"
] as const;

export type Category = typeof categories[number];
