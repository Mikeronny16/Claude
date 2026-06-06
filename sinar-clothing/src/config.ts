export const SITE = {
  name: "Sinar",
  tagline: "ချစ်စရာ ဝတ်စုံလေးများ",
  facebookPageId: "61584569241849",
  facebookUrl: "https://www.facebook.com/profile.php?id=61584569241849",
  phone: "+959790543312",
  viber: "+959790543312",
  whatsapp: "+959790543312",
}

export function messengerUrl(productName: string) {
  const msg = encodeURIComponent(`မင်္ဂလာပါ! "${productName}" အကြောင်း မေးမြန်းချင်ပါတယ် 🛍️`)
  return `https://m.me/${SITE.facebookPageId}?text=${msg}`
}

export function openMessenger(_productName: string) {
  // m.me opens existing conversation (not new thread)
  window.open(`https://m.me/${SITE.facebookPageId}`, "_blank")
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
