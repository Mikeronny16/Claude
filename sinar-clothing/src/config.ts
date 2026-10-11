export const SITE = {
  name: "Sinar",
  tagline: "ချစ်စရာ ဝတ်စုံလေးများ",
  facebookPageId: "61584569241849",
  facebookUrl: "https://www.facebook.com/profile.php?id=61584569241849",
  phone: "+959790543312",
  viber: "+959896208413",
  whatsapp: "+959790543312",
}

// msng.link opens the Messenger app on iOS + Android (m.me with ?text= caused send errors)
export const MESSENGER_URL = `https://msng.link/o/?${SITE.facebookPageId}=fm`

export const VIBER_URL = `https://msng.link/o/?${SITE.viber.replace(/\D/g, "")}=vi`

export const PHONE_URL = `tel:${SITE.phone}`

// WhatsApp is the only app that reliably accepts pre-filled text
export function whatsappUrl(text: string) {
  const num = SITE.whatsapp.replace(/\D/g, "")
  return `https://wa.me/${num}?text=${encodeURIComponent(text)}`
}
