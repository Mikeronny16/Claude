export const SITE = {
  name: "Sinar",
  tagline: "ချစ်စရာ ဝတ်စုံလေးများ",
  facebookPageId: "YOUR_FACEBOOK_PAGE_ID",
  facebookUrl: "https://www.facebook.com/YOUR_PAGE",
  phone: "+959XXXXXXXXX",
}

export function messengerUrl(productName: string) {
  const msg = encodeURIComponent(`မင်္ဂလာပါ! "${productName}" အကြောင်း မေးမြန်းချင်ပါတယ် 🛍️`)
  return `https://m.me/${SITE.facebookPageId}?text=${msg}`
}
