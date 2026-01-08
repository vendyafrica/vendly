export type Store = {
  id: string;
  slug: string;
  name: string;
  logoUrl: string;
  rating: number;
  category: "Women" | "Men" | "Beauty" | "Gifts" | "Home" | "Accessories";
  images: string[];
};

export const stores: Store[] = [
  // Women Category
  {
    id: "1",
    slug: "comfrt",
    name: "Comfrt",
    logoUrl: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=64&h=64&fit=crop&crop=face",
    rating: 4.8,
    category: "Women",
    images: [
      "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1578632292335-df3abbb0d586?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=400&h=500&fit=crop"
    ]
  },
  {
    id: "2",
    slug: "fenty",
    name: "Fenty",
    logoUrl: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=64&h=64&fit=crop&crop=face",
    rating: 4.6,
    category: "Women",
    images: [
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=500&fit=crop"
    ]
  },
  {
    id: "3",
    slug: "everlane",
    name: "Everlane",
    logoUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=64&h=64&fit=crop&crop=face",
    rating: 4.5,
    category: "Women",
    images: [
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400&h=500&fit=crop"
    ]
  },
  {
    id: "4",
    slug: "reformation",
    name: "Reformation",
    logoUrl: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=64&h=64&fit=crop&crop=face",
    rating: 4.7,
    category: "Women",
    images: [
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&h=500&fit=crop"
    ]
  },
  {
    id: "5",
    slug: "ganni",
    name: "Ganni",
    logoUrl: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=64&h=64&fit=crop&crop=face",
    rating: 4.9,
    category: "Women",
    images: [
      "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=400&h=500&fit=crop"
    ]
  },
  {
    id: "6",
    slug: "sandy-liang",
    name: "Sandy Liang",
    logoUrl: "https://images.unsplash.com/photo-1510227272981-87123e46972e?w=64&h=64&fit=crop&crop=face",
    rating: 4.4,
    category: "Women",
    images: [
      "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1578632292335-df3abbb0d586?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=400&h=500&fit=crop"
    ]
  },
  {
    id: "7",
    slug: "jacquemus",
    name: "Jacquemus",
    logoUrl: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=64&h=64&fit=crop&crop=face",
    rating: 4.8,
    category: "Women",
    images: [
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=500&fit=crop"
    ]
  },
  {
    id: "8",
    slug: "sezane",
    name: "Sézane",
    logoUrl: "https://images.unsplash.com/photo-1521312192469-aad252074224?w=64&h=64&fit=crop&crop=face",
    rating: 4.6,
    category: "Women",
    images: [
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop"
    ]
  },
  {
    id: "9",
    slug: "staud",
    name: "Staud",
    logoUrl: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=64&h=64&fit=crop&crop=face",
    rating: 4.5,
    category: "Women",
    images: [
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1578632292335-df3abbb0d586?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400&h=500&fit=crop"
    ]
  },

  // Men Category
  {
    id: "10",
    slug: "noah",
    name: "Noah",
    logoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face",
    rating: 4.7,
    category: "Men",
    images: [
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1521312192469-aad252074224?w=400&h=500&fit=crop"
    ]
  },
  {
    id: "11",
    slug: "aime-leon-dore",
    name: "Aimé Leon Dore",
    logoUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face",
    rating: 4.8,
    category: "Men",
    images: [
      "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1578935090563-4b8223b6b9b1?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?w=400&h=500&fit=crop"
    ]
  },
  {
    id: "12",
    slug: "patagonia",
    name: "Patagonia",
    logoUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=64&h=64&fit=crop&crop=face",
    rating: 4.6,
    category: "Men",
    images: [
      "https://images.unsplash.com/photo-1544966503-7e3c4c4c9b94?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1578935090563-4b8223b6b9b1?w=400&h=500&fit=crop"
    ]
  },
  {
    id: "13",
    slug: "carhartt",
    name: "Carhartt",
    logoUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=64&h=64&fit=crop&crop=face",
    rating: 4.5,
    category: "Men",
    images: [
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1521312192469-aad252074224?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=500&fit=crop"
    ]
  },
  {
    id: "14",
    slug: "our-legacy",
    name: "Our Legacy",
    logoUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=64&h=64&fit=crop&crop=face",
    rating: 4.9,
    category: "Men",
    images: [
      "https://images.unsplash.com/photo-1578935090563-4b8223b6b9b1?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1544966503-7e3c4c4c9b94?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=500&fit=crop"
    ]
  },
  {
    id: "15",
    slug: "wacko-maria",
    name: "Wacko Maria",
    logoUrl: "https://images.unsplash.com/photo-1539571696357-5b694e4c7eb5?w=64&h=64&fit=crop&crop=face",
    rating: 4.4,
    category: "Men",
    images: [
      "https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1521312192469-aad252074224?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=500&fit=crop"
    ]
  },
  {
    id: "16",
    slug: "stone-island",
    name: "Stone Island",
    logoUrl: "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=64&h=64&fit=crop&crop=face",
    rating: 4.7,
    category: "Men",
    images: [
      "https://images.unsplash.com/photo-1544966503-7e3c4c4c9b94?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1578935090563-4b8223b6b9b1?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=500&fit=crop"
    ]
  },
  {
    id: "17",
    slug: "nanamica",
    name: "nanamica",
    logoUrl: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=64&h=64&fit=crop&crop=face",
    rating: 4.6,
    category: "Men",
    images: [
      "https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1521312192469-aad252074224?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=500&fit=crop"
    ]
  },
  {
    id: "18",
    slug: "cav-empt",
    name: "Cav Empt",
    logoUrl: "https://images.unsplash.com/photo-1521119989659-a83eee488004?w=64&h=64&fit=crop&crop=face",
    rating: 4.8,
    category: "Men",
    images: [
      "https://images.unsplash.com/photo-1578935090563-4b8223b6b9b1?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1544966503-7e3c4c4c9b94?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=500&fit=crop"
    ]
  },

  // Beauty Category
  {
    id: "19",
    slug: "glossier",
    name: "Glossier",
    logoUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=64&h=64&fit=crop&crop=face",
    rating: 4.5,
    category: "Beauty",
    images: [
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=500&fit=crop"
    ]
  },
  {
    id: "20",
    slug: "fenty-beauty",
    name: "Fenty Beauty",
    logoUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=64&h=64&fit=crop&crop=face",
    rating: 4.8,
    category: "Beauty",
    images: [
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=400&h=500&fit=crop"
    ]
  },
  {
    id: "21",
    slug: "drunk-elephant",
    name: "Drunk Elephant",
    logoUrl: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=64&h=64&fit=crop&crop=face",
    rating: 4.6,
    category: "Beauty",
    images: [
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=400&h=500&fit=crop"
    ]
  },
  {
    id: "22",
    slug: "summer-fridays",
    name: "Summer Fridays",
    logoUrl: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=64&h=64&fit=crop&crop=face",
    rating: 4.7,
    category: "Beauty",
    images: [
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=400&h=500&fit=crop"
    ]
  },
  {
    id: "23",
    slug: "sol-de-janeiro",
    name: "Sol de Janeiro",
    logoUrl: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=64&h=64&fit=crop&crop=face",
    rating: 4.9,
    category: "Beauty",
    images: [
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=500&fit=crop"
    ]
  },
  {
    id: "24",
    slug: "tatcha",
    name: "Tatcha",
    logoUrl: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=64&h=64&fit=crop&crop=face",
    rating: 4.5,
    category: "Beauty",
    images: [
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=400&h=500&fit=crop"
    ]
  },
  {
    id: "25",
    slug: "kora-organics",
    name: "Kora Organics",
    logoUrl: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=64&h=64&fit=crop&crop=face",
    rating: 4.6,
    category: "Beauty",
    images: [
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=500&fit=crop"
    ]
  },
  {
    id: "26",
    slug: "ilk",
    name: "ILK",
    logoUrl: "https://images.unsplash.com/photo-1510227272981-87123e46972e?w=64&h=64&fit=crop&crop=face",
    rating: 4.4,
    category: "Beauty",
    images: [
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&h=500&fit=crop"
    ]
  },
  {
    id: "27",
    slug: "beauty-counter",
    name: "Beautycounter",
    logoUrl: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=64&h=64&fit=crop&crop=face",
    rating: 4.7,
    category: "Beauty",
    images: [
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&h=500&fit=crop"
    ]
  },

  // Gifts Category
  {
    id: "28",
    slug: "goodee",
    name: "Goodee",
    logoUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=64&h=64&fit=crop&crop=face",
    rating: 4.8,
    category: "Gifts",
    images: [
      "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=400&h=500&fit=crop"
    ]
  },
  {
    id: "29",
    slug: "uncommon-goods",
    name: "Uncommon Goods",
    logoUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=64&h=64&fit=crop&crop=face",
    rating: 4.5,
    category: "Gifts",
    images: [
      "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=400&h=500&fit=crop"
    ]
  },
  {
    id: "30",
    slug: "mista",
    name: "Mista",
    logoUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=64&h=64&fit=crop&crop=face",
    rating: 4.6,
    category: "Gifts",
    images: [
      "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=400&h=500&fit=crop"
    ]
  },
  {
    id: "31",
    slug: "areaware",
    name: "Areaware",
    logoUrl: "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=64&h=64&fit=crop&crop=face",
    rating: 4.7,
    category: "Gifts",
    images: [
      "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=400&h=500&fit=crop"
    ]
  },
  {
    id: "32",
    slug: "food52",
    name: "Food52",
    logoUrl: "https://images.unsplash.com/photo-1539571696357-5b694e4c7eb5?w=64&h=64&fit=crop&crop=face",
    rating: 4.9,
    category: "Gifts",
    images: [
      "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=400&h=500&fit=crop"
    ]
  },
  {
    id: "33",
    slug: "schoolhouse",
    name: "Schoolhouse",
    logoUrl: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=64&h=64&fit=crop&crop=face",
    rating: 4.4,
    category: "Gifts",
    images: [
      "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=400&h=500&fit=crop"
    ]
  },
  {
    id: "34",
    slug: "craftjam",
    name: "Craftjam",
    logoUrl: "https://images.unsplash.com/photo-1521119989659-a83eee488004?w=64&h=64&fit=crop&crop=face",
    rating: 4.6,
    category: "Gifts",
    images: [
      "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=400&h=500&fit=crop"
    ]
  },
  {
    id: "35",
    slug: "the-moment",
    name: "The Moment",
    logoUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=64&h=64&fit=crop&crop=face",
    rating: 4.5,
    category: "Gifts",
    images: [
      "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=400&h=500&fit=crop"
    ]
  },
  {
    id: "36",
    slug: "verishop",
    name: "Verishop",
    logoUrl: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=64&h=64&fit=crop&crop=face",
    rating: 4.7,
    category: "Gifts",
    images: [
      "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=400&h=500&fit=crop"
    ]
  },

  // Home Category
  {
    id: "37",
    slug: "west-elm",
    name: "West Elm",
    logoUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=64&h=64&fit=crop&crop=face",
    rating: 4.5,
    category: "Home",
    images: [
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1544966503-7e3c4c4c9b94?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=500&fit=crop"
    ]
  },
  {
    id: "38",
    slug: "cb2",
    name: "CB2",
    logoUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=64&h=64&fit=crop&crop=face",
    rating: 4.6,
    category: "Home",
    images: [
      "https://images.unsplash.com/photo-1544966503-7e3c4c4c9b94?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1544966503-7e3c4c4c9b94?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=500&fit=crop"
    ]
  },
  {
    id: "39",
    slug: "article",
    name: "Article",
    logoUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=64&h=64&fit=crop&crop=face",
    rating: 4.8,
    category: "Home",
    images: [
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1544966503-7e3c4c4c9b94?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=500&fit=crop"
    ]
  },
  {
    id: "40",
    slug: "the-inside",
    name: "The Inside",
    logoUrl: "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=64&h=64&fit=crop&crop=face",
    rating: 4.7,
    category: "Home",
    images: [
      "https://images.unsplash.com/photo-1544966503-7e3c4c4c9b94?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1544966503-7e3c4c4c9b94?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=500&fit=crop"
    ]
  },
  {
    id: "41",
    slug: "burrow",
    name: "Burrow",
    logoUrl: "https://images.unsplash.com/photo-1539571696357-5b694e4c7eb5?w=64&h=64&fit=crop&crop=face",
    rating: 4.6,
    category: "Home",
    images: [
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1544966503-7e3c4c4c9b94?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=500&fit=crop"
    ]
  },
  {
    id: "42",
    slug: "medley",
    name: "Medley",
    logoUrl: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=64&h=64&fit=crop&crop=face",
    rating: 4.9,
    category: "Home",
    images: [
      "https://images.unsplash.com/photo-1544966503-7e3c4c4c9b94?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1544966503-7e3c4c4c9b94?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=500&fit=crop"
    ]
  },
  {
    id: "43",
    slug: "sixpenny",
    name: "Sixpenny",
    logoUrl: "https://images.unsplash.com/photo-1521119989659-a83eee488004?w=64&h=64&fit=crop&crop=face",
    rating: 4.5,
    category: "Home",
    images: [
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1544966503-7e3c4c4c9b94?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=500&fit=crop"
    ]
  },
  {
    id: "44",
    slug: "revival",
    name: "Revival",
    logoUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=64&h=64&fit=crop&crop=face",
    rating: 4.4,
    category: "Home",
    images: [
      "https://images.unsplash.com/photo-1544966503-7e3c4c4c9b94?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1544966503-7e3c4c4c9b94?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=500&fit=crop"
    ]
  },
  {
    id: "45",
    slug: "honey-comb",
    name: "Honey Comb",
    logoUrl: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=64&h=64&fit=crop&crop=face",
    rating: 4.7,
    category: "Home",
    images: [
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1544966503-7e3c4c4c9b94?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=500&fit=crop"
    ]
  }
];

export const categories = ["Women", "Men", "Beauty", "Gifts", "Home","Accessories"] as const;
export type Category = typeof categories[number];
