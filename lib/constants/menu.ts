export const MENU_CATEGORIES = [
  "Classic Pizzas",
  "Vegetarian Pizzas",
  "Meat Lovers",
  "Specialty / Gourmet Pizzas",
  "Sides & Appetizers",
  "Beverages & Desserts",
] as const

export const ALL_CATEGORIES = "all"
export const ALL_LOCATIONS = "all"

export const PRICE_SORT_OPTIONS = [
  { value: "Low to High", label: "Price: Low to High" },
  { value: "High to Low", label: "Price: High to Low" },
] as const

export type PriceSort = (typeof PRICE_SORT_OPTIONS)[number]["value"]
