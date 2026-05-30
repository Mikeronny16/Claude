import type { Product } from "./supabase"

export type Category = "Tops" | "Cardigans" | "Dresses" | "Jeans" | "Sweaters"

export const FALLBACK_IMG = "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=600&q=80"

export const FALLBACK_PRODUCTS: Omit<Product, "created_at" | "updated_at">[] = [
  { id: "1", name_en: "Floral Linen Top", name_mm: "ပန်းပွင့် Linen အပေါ်ဆောင်း", category: "Tops", sizes: ["S","M","L"], status: "In Stock", image_url: "https://images.unsplash.com/photo-1594938298603-c8148c4b4956?w=600&q=80", sold_out: false, sort_order: 1, price: 18000, badge: "new" },
  { id: "2", name_en: "Beige Knit Cardigan", name_mm: "Beige ရင့် Cardigan", category: "Cardigans", sizes: ["S","M","L","XL"], status: "In Stock", image_url: "https://images.unsplash.com/photo-1616150638538-3dc7b7d4adf1?w=600&q=80", sold_out: false, sort_order: 2, price: 20000, original_price: 25000, badge: "sale" },
  { id: "3", name_en: "Pastel Midi Dress", name_mm: "Pastel Midi ဂါဝန်", category: "Dresses", sizes: ["S","M"], status: "In Stock", image_url: "https://images.unsplash.com/photo-1612336307429-8a898d10e223?w=600&q=80", sold_out: false, sort_order: 3, price: 28000, badge: "hot" },
  { id: "4", name_en: "High Waist Jeans", name_mm: "High Waist ဂျင်း", category: "Jeans", sizes: ["28","29","30","31"], status: "Low Stock", image_url: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&q=80", sold_out: false, sort_order: 4, price: 22000, badge: "low" },
  { id: "5", name_en: "Ivory Knit Sweater", name_mm: "Ivory Knit ဆွယ်တာ", category: "Sweaters", sizes: ["S","M","L"], status: "In Stock", image_url: "https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?w=600&q=80", sold_out: false, sort_order: 5, price: 23000 },
  { id: "6", name_en: "Striped Cotton Top", name_mm: "Striped Cotton အပေါ်ဆောင်း", category: "Tops", sizes: ["S","M","L"], status: "In Stock", image_url: "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=600&q=80", sold_out: false, sort_order: 6, price: 15000 },
  { id: "7", name_en: "Flowy Maxi Dress", name_mm: "Flowy Maxi ဂါဝန်", category: "Dresses", sizes: ["S","M","L"], status: "In Stock", image_url: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600&q=80", sold_out: true, sort_order: 7, price: 32000 },
  { id: "8", name_en: "Oversized Cardigan", name_mm: "Oversized Cardigan", category: "Cardigans", sizes: ["M","L","XL"], status: "In Stock", image_url: "https://images.unsplash.com/photo-1588099768531-a72d4a198538?w=600&q=80", sold_out: false, sort_order: 8, price: 27000, badge: "hot" },
  { id: "9", name_en: "Slim Fit Jeans", name_mm: "Slim Fit ဂျင်း", category: "Jeans", sizes: ["27","28","29","30"], status: "Low Stock", image_url: "https://images.unsplash.com/photo-1475178626620-a4d074967452?w=600&q=80", sold_out: false, sort_order: 9, price: 20000, badge: "low" },
  { id: "10", name_en: "Cozy Turtleneck", name_mm: "Cozy Turtleneck ဆွယ်တာ", category: "Sweaters", sizes: ["S","M"], status: "In Stock", image_url: "https://images.unsplash.com/photo-1520367745676-56196632073f?w=600&q=80", sold_out: false, sort_order: 10, price: 24000 },
  { id: "11", name_en: "Wrap Blouse", name_mm: "Wrap Blouse", category: "Tops", sizes: ["S","M","L"], status: "In Stock", image_url: "https://images.unsplash.com/photo-1548624313-0396a54d01f0?w=600&q=80", sold_out: false, sort_order: 11, price: 17000, badge: "new" },
  { id: "12", name_en: "Summer Sundress", name_mm: "Summer Sundress", category: "Dresses", sizes: ["S","M","L","XL"], status: "In Stock", image_url: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80", sold_out: false, sort_order: 12, price: 26000 },
]
