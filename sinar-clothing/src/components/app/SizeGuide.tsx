import { useLang } from "@/lib/lang"
import Sheet from "./Sheet"

const SIZE_DATA = [
  { size: "S", bust: "80–84", waist: "60–64", hip: "86–90", height: "155–160" },
  { size: "M", bust: "86–90", waist: "66–70", hip: "92–96", height: "160–165" },
  { size: "L", bust: "92–96", waist: "72–76", hip: "98–102", height: "163–168" },
  { size: "XL", bust: "98–102", waist: "78–82", hip: "104–108", height: "165–170" },
]

export default function SizeGuide({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t } = useLang()

  const cols = [
    t("အရွယ်", "Size"),
    t("ရင်ဝိုင်း", "Bust"),
    t("ခါးလုံး", "Waist"),
    t("တင်ပါးလုံး", "Hip"),
    t("အရပ်", "Height"),
  ]

  return (
    <Sheet open={open} onClose={onClose} title={t("Size ဇယား", "Size guide")}>
      <p className="font-mm -mt-1 mb-4 text-sm text-candy-muted">{t("တိုင်းတာမှု cm ဖြင့်", "All measurements in cm")}</p>

      <div className="overflow-hidden rounded-3xl bg-white shadow-soft">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-candy-soft">
              {cols.map((c) => (
                <th key={c} className="font-mm px-2 py-3 text-center text-xs font-bold text-candy-muted first:pl-4 first:text-left">
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {SIZE_DATA.map((row) => (
              <tr key={row.size} className="border-t border-candy-soft">
                <td className="py-3.5 pl-4 font-display text-lg font-bold text-candy-pink">{row.size}</td>
                <td className="px-2 py-3.5 text-center font-semibold tabular-nums">{row.bust}</td>
                <td className="px-2 py-3.5 text-center font-semibold tabular-nums">{row.waist}</td>
                <td className="px-2 py-3.5 text-center font-semibold tabular-nums">{row.hip}</td>
                <td className="px-2 py-3.5 text-center font-semibold tabular-nums">{row.height}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ul className="font-mm mt-4 flex flex-col gap-2 rounded-3xl bg-candy-butter p-4 text-sm leading-relaxed text-[#5C3B00]">
        <li>• {t("ရင်ဝိုင်း — ရင်ဘတ် အကျယ်ဆုံးနေရာ", "Bust — the fullest part of your chest")}</li>
        <li>• {t("ခါးလုံး — ခါး အသေးဆုံးနေရာ", "Waist — the narrowest part of your waist")}</li>
        <li>• {t("တင်ပါးလုံး — တင်ပါး အကျယ်ဆုံးနေရာ", "Hip — the fullest part of your hips")}</li>
        <li>• {t("Size နှစ်ခုကြား ဖြစ်နေရင် အကြီးကို ရွေးပါ", "Between two sizes? Pick the bigger one")}</li>
      </ul>

      <p className="font-mm mt-4 text-center text-xs text-candy-muted">
        {t("မသေချာရင် Chat ထဲမှာ မေးလို့ရပါတယ်", "Still unsure? Ask us in chat")}
      </p>
    </Sheet>
  )
}
