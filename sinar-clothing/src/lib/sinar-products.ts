export const CATEGORIES = ["Tops", "Cardigans", "Dresses", "Jeans", "Sweaters"] as const;
export type Category = (typeof CATEGORIES)[number];
export type Status = "In Stock" | "Preorder";

export type Product = {
  id: string;
  name_mm: string;
  name_en: string;
  category: Category;
  status: Status;
  sizes: string[];
  image_url: string;
  price?: number;
  sold_out?: boolean;
};

const u = (id: string) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=600&h=800&q=80`;

export const PRODUCTS: Product[] = [
  { id: "1",  name_en: "Pink Off-Shoulder Top",     name_mm: "ပန်းရောင် Off-Shoulder ဝတ်စုံ",  category: "Tops",      sizes: ["S","M"],     status: "In Stock", price: 15000, image_url: u("1485518882345-15568b007407") },
  { id: "2",  name_en: "Gray Ribbed Long Sleeve",   name_mm: "မီးခိုးရောင် ရိုးရိုး အင်္ကျီ",    category: "Tops",      sizes: ["S","M","L"], status: "In Stock", price: 14000, image_url: u("1503342217505-b0a15ec3261c") },
  { id: "3",  name_en: "Beige Knit Cardigan",       name_mm: "အဝါနု အနွေးထည်",              category: "Cardigans", sizes: ["S","M"],     status: "In Stock", price: 22000, image_url: u("1551232864-3f0890e580d9") },
  { id: "4",  name_en: "Black V-Neck Top",          name_mm: "အနက်ရောင် V-Neck",           category: "Tops",      sizes: ["S","M"],     status: "Preorder", price: 13000, image_url: u("1483985988355-763728e1935b") },
  { id: "5",  name_en: "Lilac Fitted Long Sleeve",  name_mm: "ခရမ်းနု အင်္ကျီ",              category: "Tops",      sizes: ["S","M"],     status: "In Stock", price: 14000, image_url: u("1539109136881-3be0616acf4b") },
  { id: "6",  name_en: "Pink Gold Button Cardigan", name_mm: "ပန်းရောင် ရွှေခလုပ် ကာဒီဂန်", category: "Cardigans", sizes: ["S","M"],     status: "In Stock", price: 25000, image_url: u("1582142306909-195724d33ffc") },
  { id: "7",  name_en: "White Lace Top",            name_mm: "အဖြူရောင် ဇာ အင်္ကျီ",         category: "Tops",      sizes: ["S","M"],     status: "Preorder", price: 16000, image_url: u("1469334031218-e382a71b716b") },
  { id: "8",  name_en: "Brown Plaid Wrap Top",      name_mm: "အညိုရောင် ဇကာ အင်္ကျီ",        category: "Tops",      sizes: ["S","M"],     status: "In Stock", price: 15000, image_url: u("1487222477894-8943e31ef7b2") },
  { id: "9",  name_en: "Flare Blue Jeans",          name_mm: "ပြာရောင် Flare ဂျင်း",          category: "Jeans",     sizes: ["S","M","L"], status: "In Stock", price: 28000, image_url: u("1541099649105-f69ad21f3246") },
  { id: "10", name_en: "Red Off-Shoulder Top",      name_mm: "အနီရောင် Off-Shoulder",      category: "Tops",      sizes: ["S","M"],     status: "In Stock", price: 15000, image_url: u("1496747611176-843222e1e57c") },
  { id: "11", name_en: "Gray Oversized Sweater",    name_mm: "မီးခိုး ဆွယ်တာ",                category: "Sweaters",  sizes: ["M","L"],     status: "Preorder", price: 20000, image_url: u("1576566588028-4147f3842f27") },
  { id: "12", name_en: "Pastel Pink Knit Top",      name_mm: "ပန်းနု အနွေးထည်",               category: "Tops",      sizes: ["S","M"],     status: "In Stock", price: 16000, image_url: u("1564257631407-4deb1f99d992") },
];

export const FALLBACK_IMG =
  "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=600&h=800&q=80";
