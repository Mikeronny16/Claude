import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { supabase, type Product } from "@/lib/supabase"
import { SITE } from "@/config"
import { FALLBACK_IMG } from "@/lib/products"
import { Plus, Pencil, Trash2, X, Loader2, LogOut, Upload, Eye } from "lucide-react"
import { toast } from "sonner"

type FormData = {
  name_mm: string
  name_en: string
  category: string
  price: number
  sizes: string
  status: string
  image_url: string
  sold_out: boolean
  sort_order: number
}

const CATEGORIES = ["Tops", "Cardigans", "Dresses", "Jeans", "Sweaters"]
const STATUSES = ["In Stock", "Low Stock", "Out of Stock"]

const inputCls = "w-full bg-forest border border-hairline focus:border-pink rounded-xl px-3 py-2.5 text-sm text-cream placeholder-muted focus:outline-none transition-colors"
const labelCls = "text-[10px] font-medium text-muted uppercase tracking-widest block mb-1.5"

function ProductForm({
  initial,
  onClose,
  onSave,
}: {
  initial?: Product | null
  onClose: () => void
  onSave: (data: FormData & { id?: string }) => Promise<void>
}) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    defaultValues: initial
      ? {
          name_mm: initial.name_mm,
          name_en: initial.name_en,
          category: initial.category,
          price: initial.price,
          sizes: initial.sizes.join(", "),
          status: initial.status,
          image_url: initial.image_url,
          sold_out: initial.sold_out,
          sort_order: initial.sort_order,
        }
      : { status: "In Stock", sold_out: false, sort_order: 99, price: 0 },
  })

  const [uploading, setUploading] = useState(false)
  const [imagePreview, setImagePreview] = useState(initial?.image_url || "")

  async function uploadImage(file: File) {
    setUploading(true)
    try {
      const ext = file.name.split(".").pop()
      const path = `${Date.now()}.${ext}`
      const { error } = await supabase.storage.from("product-images").upload(path, file)
      if (error) throw error
      const { data } = supabase.storage.from("product-images").getPublicUrl(path)
      setImagePreview(data.publicUrl)
      return data.publicUrl
    } catch {
      toast.error("Image upload မအောင်မြင်ပါ")
      return null
    } finally {
      setUploading(false)
    }
  }

  async function onSubmit(data: FormData) {
    await onSave({ ...data, id: initial?.id, image_url: imagePreview || data.image_url })
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-forest-mid rounded-2xl border border-hairline w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-hairline">
          <h2 className="font-serif text-xl text-cream">
            {initial ? "ပစ္စည်း ပြင်ဆင်ရန်" : "ပစ္စည်း အသစ်ထည့်ရန်"}
          </h2>
          <button onClick={onClose} className="text-muted hover:text-cream p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          {/* Image */}
          <div>
            <label className={labelCls}>ပုံ</label>
            {imagePreview && (
              <img
                src={imagePreview}
                onError={(e) => { (e.currentTarget as HTMLImageElement).src = FALLBACK_IMG }}
                alt=""
                className="w-full h-40 object-cover rounded-xl mb-2 border border-hairline"
              />
            )}
            <div className="flex gap-2">
              <input
                {...register("image_url")}
                placeholder="Image URL (https://...)"
                className={inputCls + " flex-1"}
                onChange={(e) => setImagePreview(e.target.value)}
              />
              <label className={`flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-medium border border-hairline cursor-pointer hover:border-pink text-muted hover:text-cream transition-colors ${uploading ? "opacity-50 cursor-not-allowed" : ""}`}>
                {uploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                Upload
                <input type="file" accept="image/*" className="hidden" disabled={uploading} onChange={async (e) => {
                  const file = e.target.files?.[0]
                  if (file) { const url = await uploadImage(file); if (url) setImagePreview(url) }
                }} />
              </label>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>မြန်မာနာမည် *</label>
              <input {...register("name_mm", { required: "လိုအပ်သည်" })} className={inputCls + " font-mm"} placeholder="ဝတ်စုံနာမည်" />
              {errors.name_mm && <p className="text-pink text-xs mt-1">{errors.name_mm.message}</p>}
            </div>
            <div>
              <label className={labelCls}>English Name *</label>
              <input {...register("name_en", { required: "Required" })} className={inputCls} placeholder="Product name" />
              {errors.name_en && <p className="text-pink text-xs mt-1">{errors.name_en.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Category *</label>
              <select {...register("category", { required: true })} className={inputCls}>
                <option value="">ရွေးချယ်ပါ</option>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Status</label>
              <select {...register("status")} className={inputCls}>
                {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>ဈေးနှုန်း (ကျပ်)</label>
              <input type="number" {...register("price", { valueAsNumber: true, min: 0 })} className={inputCls} placeholder="18000" />
            </div>
            <div>
              <label className={labelCls}>Sort Order</label>
              <input type="number" {...register("sort_order", { valueAsNumber: true })} className={inputCls} />
            </div>
          </div>

          <div>
            <label className={labelCls}>Sizes (comma separated)</label>
            <input {...register("sizes")} placeholder="S, M, L, XL or 28, 29, 30" className={inputCls} />
          </div>

          <div className="flex items-center gap-3 py-1">
            <input type="checkbox" {...register("sold_out")} id="sold_out" className="w-4 h-4 accent-pink rounded" />
            <label htmlFor="sold_out" className="text-sm font-mm text-cream">Sold Out ဖြစ်သည်</label>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 border border-hairline text-muted hover:text-cream py-2.5 rounded-xl text-sm font-medium hover:border-pink transition-colors font-mm">
              ဖျက်သိမ်းမည်
            </button>
            <button type="submit" disabled={isSubmitting || uploading} className="flex-1 bg-pink text-white py-2.5 rounded-xl text-sm font-semibold hover:shadow-pink transition-shadow disabled:opacity-50 flex items-center justify-center gap-2 font-mm">
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
              သိမ်းဆည်းမည်
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function Admin() {
  const navigate = useNavigate()
  const qc = useQueryClient()
  const [editing, setEditing] = useState<Product | null | "new">(null)
  const [deleting, setDeleting] = useState<string | null>(null)

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["admin-products"],
    queryFn: async () => {
      const { data, error } = await supabase.from("products").select("*").order("sort_order").order("created_at", { ascending: false })
      if (error) throw error
      return data as Product[]
    },
  })

  const saveMutation = useMutation({
    mutationFn: async (payload: FormData & { id?: string }) => {
      const sizesArray = payload.sizes
        ? (payload.sizes as unknown as string).split(",").map((s) => s.trim()).filter(Boolean)
        : []
      const row = { ...payload, sizes: sizesArray }
      if (payload.id) {
        const { error } = await supabase.from("products").update(row).eq("id", payload.id)
        if (error) throw error
      } else {
        const { error } = await supabase.from("products").insert(row)
        if (error) throw error
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-products"] })
      qc.invalidateQueries({ queryKey: ["products"] })
      toast.success("သိမ်းဆည်းပြီးပါပြီ!")
      setEditing(null)
    },
    onError: (e: Error) => toast.error(e.message),
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("products").delete().eq("id", id)
      if (error) throw error
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-products"] })
      qc.invalidateQueries({ queryKey: ["products"] })
      toast.success("ဖျက်ပြီးပါပြီ!")
      setDeleting(null)
    },
    onError: (e: Error) => toast.error(e.message),
  })

  async function handleLogout() {
    await supabase.auth.signOut()
    navigate("/auth", { replace: true })
  }

  return (
    <div className="min-h-screen bg-forest">
      {/* Header */}
      <header className="bg-forest-mid border-b border-hairline sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-serif text-xl font-black tracking-widest text-cream">{SITE.name.toUpperCase()}</span>
            <span className="text-[10px] bg-pink/20 text-pink px-2.5 py-1 rounded-full font-bold tracking-widest uppercase">Admin</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="/" target="_blank" className="flex items-center gap-1.5 text-sm text-muted hover:text-cream transition-colors">
              <Eye className="w-4 h-4" />
              <span className="hidden sm:inline">Website</span>
            </a>
            <button onClick={handleLogout} className="flex items-center gap-1.5 text-sm text-muted hover:text-pink transition-colors">
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-5 sm:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-serif text-2xl text-cream">ကုန်ပစ္စည်း စီမံခန့်ခွဲရန်</h1>
            <p className="text-muted text-sm mt-1 font-mm">ပစ္စည်း {products.length} ခု</p>
          </div>
          <button
            onClick={() => setEditing("new")}
            className="flex items-center gap-2 bg-pink text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:shadow-pink transition-shadow"
          >
            <Plus className="w-4 h-4" />
            <span className="font-mm">ပစ္စည်းအသစ်</span>
          </button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-pink" />
          </div>
        ) : (
          <div className="bg-forest-mid rounded-2xl border border-hairline overflow-hidden">
            {/* Desktop table */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-hairline">
                    <th className="text-left px-5 py-3.5 text-[10px] font-bold text-muted uppercase tracking-widest">ပုံ</th>
                    <th className="text-left px-5 py-3.5 text-[10px] font-bold text-muted uppercase tracking-widest">ပစ္စည်း</th>
                    <th className="text-left px-5 py-3.5 text-[10px] font-bold text-muted uppercase tracking-widest">Category</th>
                    <th className="text-left px-5 py-3.5 text-[10px] font-bold text-muted uppercase tracking-widest">ဈေးနှုန်း</th>
                    <th className="text-left px-5 py-3.5 text-[10px] font-bold text-muted uppercase tracking-widest">Status</th>
                    <th className="text-left px-5 py-3.5 text-[10px] font-bold text-muted uppercase tracking-widest">Sizes</th>
                    <th className="px-5 py-3.5" />
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p.id} className="border-b border-hairline last:border-0 hover:bg-forest transition-colors">
                      <td className="px-5 py-3">
                        <img src={p.image_url || FALLBACK_IMG} alt={p.name_en} onError={(e) => { (e.currentTarget as HTMLImageElement).src = FALLBACK_IMG }} className="w-12 h-12 rounded-xl object-cover border border-hairline" />
                      </td>
                      <td className="px-5 py-3">
                        <p className="font-mm font-semibold text-sm text-cream">{p.name_mm}</p>
                        <p className="text-xs text-muted">{p.name_en}</p>
                        {p.sold_out && <span className="text-[9px] bg-pink/20 text-pink px-2 py-0.5 rounded-full font-bold mt-0.5 inline-block uppercase tracking-wider">Sold Out</span>}
                      </td>
                      <td className="px-5 py-3 text-sm text-muted">{p.category}</td>
                      <td className="px-5 py-3 text-sm font-mm font-bold text-pink">{p.price > 0 ? `${p.price.toLocaleString()} ကျပ်` : "—"}</td>
                      <td className="px-5 py-3">
                        <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider ${
                          p.status === "In Stock" ? "bg-emerald-dim text-emerald" : "bg-yellow-500/20 text-yellow-400"
                        }`}>
                          {p.status}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex gap-1 flex-wrap">
                          {p.sizes.map((s) => (
                            <span key={s} className="text-[10px] border border-hairline text-muted px-1.5 py-0.5 rounded font-bold">{s}</span>
                          ))}
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2 justify-end">
                          <button onClick={() => setEditing(p)} className="p-1.5 text-muted hover:text-cream transition-colors hover:bg-forest rounded-lg">
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button onClick={() => setDeleting(p.id)} className="p-1.5 text-muted hover:text-pink transition-colors hover:bg-forest rounded-lg">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="sm:hidden divide-y divide-hairline">
              {products.map((p) => (
                <div key={p.id} className="p-4 flex items-center gap-4">
                  <img src={p.image_url || FALLBACK_IMG} alt={p.name_en} onError={(e) => { (e.currentTarget as HTMLImageElement).src = FALLBACK_IMG }} className="w-16 h-16 rounded-xl object-cover border border-hairline flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-mm font-semibold text-sm text-cream truncate">{p.name_mm}</p>
                    <p className="text-xs text-muted">{p.category} · {p.status}</p>
                    {p.price > 0 && <p className="font-mm text-xs font-bold text-pink mt-0.5">{p.price.toLocaleString()} ကျပ်</p>}
                  </div>
                  <div className="flex flex-col gap-2">
                    <button onClick={() => setEditing(p)} className="p-1.5 text-muted hover:text-cream"><Pencil className="w-4 h-4" /></button>
                    <button onClick={() => setDeleting(p.id)} className="p-1.5 text-muted hover:text-pink"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              ))}
            </div>

            {products.length === 0 && (
              <div className="text-center py-16">
                <p className="text-muted font-mm">ပစ္စည်းမရှိသေးပါ</p>
                <button onClick={() => setEditing("new")} className="mt-4 text-pink text-sm font-mm underline">ပထမဆုံးပစ္စည်းထည့်ပါ</button>
              </div>
            )}
          </div>
        )}
      </main>

      {editing !== null && (
        <ProductForm
          initial={editing === "new" ? null : editing}
          onClose={() => setEditing(null)}
          onSave={async (data) => { await saveMutation.mutateAsync(data as FormData & { id?: string }) }}
        />
      )}

      {deleting && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-forest-mid rounded-2xl border border-hairline p-6 max-w-sm w-full text-center">
            <Trash2 className="w-10 h-10 text-pink mx-auto mb-3" />
            <h3 className="font-serif text-lg text-cream mb-2">ဖျက်ရန် သေချာပါသလား?</h3>
            <p className="text-muted text-sm font-mm mb-6">ဤ action ကို ပြန်မဖြစ်နိုင်ပါ</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleting(null)} className="flex-1 border border-hairline text-muted hover:text-cream py-2.5 rounded-xl text-sm font-mm hover:border-pink transition-colors">
                မဖျက်တော့ပါ
              </button>
              <button
                onClick={() => deleteMutation.mutate(deleting)}
                disabled={deleteMutation.isPending}
                className="flex-1 bg-pink text-white py-2.5 rounded-xl text-sm font-semibold hover:shadow-pink disabled:opacity-50 flex items-center justify-center gap-2 font-mm"
              >
                {deleteMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                ဖျက်မည်
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
