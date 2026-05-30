export const SITE = {
  name: "Sinar",
  tagline: "ချစ်စရာ ဝတ်စုံလေးများ",
  facebookPageId: "14anQs8AyMd",
  facebookUrl: "https://www.facebook.com/share/14anQs8AyMd/",
  phone: "+959790543312",
  viber: "+959790543312",
  whatsapp: "+959790543312",
}

export function messengerUrl(productName: string) {
  const msg = encodeURIComponent(`မင်္ဂလာပါ! "${productName}" အကြောင်း မေးမြန်းချင်ပါတယ် 🛍️`)
  return `https://m.me/${SITE.facebookPageId}?text=${msg}`
}

export function viberUrl(productName: string) {
  const msg = encodeURIComponent(`မင်္ဂလာပါ! "${productName}" အကြောင်း မေးမြန်းချင်ပါတယ် 🛍️`)
  return `viber://chat?number=${encodeURIComponent(SITE.viber)}&text=${msg}`
}

export function whatsappUrl(productName: string) {
  const msg = encodeURIComponent(`မင်္ဂလာပါ! "${productName}" အကြောင်း မေးမြန်းချင်ပါတယ် 🛍️`)
  const num = SITE.whatsapp.replace(/\D/g, "")
  return `https://wa.me/${num}?text=${msg}`
}
