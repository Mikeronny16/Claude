import { Truck } from "lucide-react";

export function DeliveryBanner() {
  return (
    <section className="py-10 bg-deep text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-15">
        <div className="absolute top-0 left-1/4 w-64 h-64 rounded-full bg-white blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-72 h-72 rounded-full bg-accent blur-3xl" />
      </div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 text-center sm:text-left">
        <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur flex items-center justify-center shrink-0">
          <Truck className="w-7 h-7" />
        </div>
        <div>
          <p className="font-mm text-lg sm:text-xl font-semibold">
            မြန်မာတစ်နိုင်ငံလုံးကို ကားဂိတ်မှ ပို့ဆောင်ပေးပါတယ်
          </p>
          <p className="text-sm opacity-90 mt-0.5">Nationwide delivery via highway bus stations</p>
        </div>
      </div>
    </section>
  );
}
