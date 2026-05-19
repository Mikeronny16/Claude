import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import React, { useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, LogOut, Save, X, Loader2, Image as ImageIcon, AlertTriangle, Upload } from "lucide-react";
import { Logo } from "@/components/sinar/Logo";
import { CATEGORIES } from "@/lib/sinar-products";

export const Route = createFileRoute("/admin")({
  component: AdminPage,
});

type Product = {
  id: string;
  name_en: string;
  name_mm: string;
  category: string;
  sizes: string[];
  status: string;
  image_url: string;
  sold_out: boolean;
  sort_order: number;
  price: number;
};

const ALL_SIZES = ["XS", "S", "M", "L", "XL"];
const STATUSES = ["In Stock", "Preorder"];

function emptyDraft(): Omit<Product, "id"> {
  return {
    name_en: "",
    name_mm: "",
    category: "Tops",
    sizes: ["S", "M"],
    status: "In Stock",
    image_url: "",
    sold_out: false,
    sort_order: 0,
    price: 0,
  };
}

function AdminPage() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [authReady, setAuthReady] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const check = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate({ to: "/auth" });
        return;
      }
      setUserEmail(session.user.email ?? null);
      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id);
      setIsAdmin(!!roles?.some((r) => r.role === "admin"));
      setAuthReady(true);
    };
    check();
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      if (!session) navigate({ to: "/auth" });
    });
    return () => sub.subscription.unsubscribe();
  }, [navigate]);

  const { data: products, isLoading } = useQuery({
    queryKey: ["admin-products"],
    enabled: authReady && isAdmin,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Product[];
    },
  });

  const [editing, setEditing] = useState<Product | null>(null);
  const [creating, setCreating] = useState(false);

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/auth" });
  };

  const refresh = () => qc.invalidateQueries({ queryKey: ["admin-products"] });

  const onDelete = async (p: Product) => {
    if (!confirm(`Delete "${p.name_en}"?`)) return;
    const { error } = await supabase.from("products").delete().eq("id", p.id);
    if (error) return toast.error(error.message);
    toast.success("Product deleted");
    refresh();
  };

  const toggleSoldOut = async (p: Product) => {
    const { error } = await supabase
      .from("products")
      .update({ sold_out: !p.sold_out })
      .eq("id", p.id);
    if (error) return toast.error(error.message);
    refresh();
  };

  if (!authReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <Loader2 className="w-6 h-6 animate-spin text-deep" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream px-4">
        <div className="max-w-md text-center bg-white rounded-3xl border border-hairline p-8">
          <h1 className="font-serif text-2xl text-ink">No admin access</h1>
          <p className="text-sm text-muted mt-3">
            Your account ({userEmail}) is signed in but doesn't have the admin role.
          </p>
          <button onClick={signOut} className="mt-6 inline-flex items-center gap-2 bg-deep text-white px-4 py-2 rounded-full text-sm">
            <LogOut className="w-4 h-4" /> Sign out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      <header className="bg-white border-b border-hairline sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Logo height={36} />
            <div>
              <div className="font-serif text-lg text-ink leading-none">Admin</div>
              <div className="text-[11px] text-muted">{userEmail}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/" className="text-sm text-muted hover:text-deep px-3 py-2">View store</Link>
            <button onClick={signOut} className="inline-flex items-center gap-1.5 text-sm bg-cream hover:bg-hairline border border-hairline px-3 py-2 rounded-full">
              <LogOut className="w-4 h-4" /> Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
          <div>
            <h1 className="font-serif text-3xl text-ink">Products</h1>
            <p className="text-sm text-muted mt-1">{products?.length ?? 0} item(s)</p>
          </div>
          <button onClick={() => setCreating(true)}
            className="inline-flex items-center gap-2 bg-deep hover:bg-deep-hover text-white px-4 py-2.5 rounded-full text-sm font-medium shadow-soft">
            <Plus className="w-4 h-4" /> Add product
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-deep" /></div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {products?.map((p) => (
              <article key={p.id} className="bg-white rounded-2xl border border-hairline overflow-hidden flex flex-col">
                <div className="aspect-[3/4] bg-cream relative overflow-hidden">
                  {p.image_url ? (
                    <img src={p.image_url} alt={p.name_en} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted">
                      <ImageIcon className="w-8 h-8" />
                    </div>
                  )}
                  {p.sold_out && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="bg-white text-ink text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Sold out</span>
                    </div>
                  )}
                </div>
                <div className="p-4 flex-1 flex flex-col">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="font-mm font-semibold text-ink truncate">{p.name_mm || p.name_en}</div>
                      <div className="text-xs text-muted truncate">{p.name_en}</div>
                    </div>
                    <span className={`shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      p.status === "In Stock" ? "bg-sage/20 text-sage" : "bg-amber-100 text-amber-800"
                    }`}>{p.status}</span>
                  </div>
                  <div className="mt-2 text-xs text-muted">
                    {p.category} · {p.sizes.join(", ") || "—"}
                  </div>
                  <div className="mt-3 grid grid-cols-3 gap-1.5">
                    <button onClick={() => setEditing(p)} className="col-span-1 inline-flex items-center justify-center gap-1 text-xs bg-cream hover:bg-hairline border border-hairline py-2 rounded-lg">
                      <Pencil className="w-3 h-3" /> Edit
                    </button>
                    <button onClick={() => toggleSoldOut(p)}
                      className={`col-span-1 text-xs py-2 rounded-lg border ${
                        p.sold_out ? "bg-sage/10 text-sage border-sage/30" : "bg-cream border-hairline hover:bg-hairline"
                      }`}>
                      {p.sold_out ? "Restock" : "Sold out"}
                    </button>
                    <button onClick={() => onDelete(p)} className="col-span-1 inline-flex items-center justify-center gap-1 text-xs text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 py-2 rounded-lg">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

      {(editing || creating) && (
        <ProductEditor
          initial={editing ?? { id: "", ...emptyDraft() }}
          isNew={creating}
          onClose={() => { setEditing(null); setCreating(false); }}
          onSaved={() => { setEditing(null); setCreating(false); refresh(); }}
        />
      )}
    </div>
  );
}

function ProductEditor({
  initial, isNew, onClose, onSaved,
}: {
  initial: Product; isNew: boolean; onClose: () => void; onSaved: () => void;
}) {
  const [draft, setDraft] = useState<Product>(initial);
  const [saving, setSaving] = useState(false);

  const update = <K extends keyof Product>(k: K, v: Product[K]) =>
    setDraft((d) => ({ ...d, [k]: v }));

  const toggleSize = (s: string) => {
    setDraft((d) => ({
      ...d,
      sizes: d.sizes.includes(s) ? d.sizes.filter((x) => x !== s) : [...d.sizes, s],
    }));
  };

  const save = async () => {
    if (!draft.name_en.trim()) return toast.error("English name is required");
    setSaving(true);
    const payload = {
      name_en: draft.name_en.trim(),
      name_mm: draft.name_mm.trim(),
      category: draft.category,
      sizes: draft.sizes,
      status: draft.status,
      image_url: draft.image_url.trim(),
      sold_out: draft.sold_out,
      sort_order: Number(draft.sort_order) || 0,
      price: Number(draft.price) || 0,
    };
    const { error } = isNew
      ? await supabase.from("products").insert(payload)
      : await supabase.from("products").update(payload).eq("id", draft.id);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success(isNew ? "Product added" : "Product updated");
    onSaved();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto" onClick={onClose}>
      <div className="bg-white w-full sm:max-w-2xl rounded-t-3xl sm:rounded-3xl shadow-soft max-h-[95vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 bg-white border-b border-hairline px-6 py-4 flex items-center justify-between">
          <h2 className="font-serif text-xl text-ink">{isNew ? "Add product" : "Edit product"}</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-cream"><X className="w-5 h-5" /></button>
        </div>

        <div className="p-6 space-y-5">
          <Field label="Product photo" hint="Upload directly from your device, or paste an image URL below.">
            <ImageUploader
              currentUrl={draft.image_url}
              onUploaded={(url) => update("image_url", url)}
              onClear={() => update("image_url", "")}
            />
            <div className="mt-3">
              <label className="text-[11px] uppercase tracking-widest text-muted block mb-1">Or paste URL</label>
              <input type="url" value={draft.image_url} onChange={(e) => update("image_url", e.target.value)}
                placeholder="https://..." className={inputCls} />
              <UrlWarning url={draft.image_url} />
            </div>
          </Field>

          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Name (English)">
              <input value={draft.name_en} onChange={(e) => update("name_en", e.target.value)} className={inputCls} />
            </Field>
            <Field label="Name (Myanmar)">
              <input value={draft.name_mm} onChange={(e) => update("name_mm", e.target.value)} className={inputCls} />
            </Field>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Category">
              <select value={draft.category} onChange={(e) => update("category", e.target.value)} className={inputCls}>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </Field>
            <Field label="Status">
              <select value={draft.status} onChange={(e) => update("status", e.target.value)} className={inputCls}>
                {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </Field>
          </div>

          <Field label="Available sizes">
            <div className="flex flex-wrap gap-2">
              {ALL_SIZES.map((s) => {
                const active = draft.sizes.includes(s);
                return (
                  <button key={s} type="button" onClick={() => toggleSize(s)}
                    className={`px-4 py-2 rounded-full text-sm border transition ${
                      active ? "bg-deep text-white border-deep" : "bg-cream text-ink border-hairline hover:bg-hairline"
                    }`}>{s}</button>
                );
              })}
            </div>
          </Field>

          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Price (MMK)" hint="ဈေးနှုန်း — ကျပ်ဖြင့်">
              <input
                type="number"
                min={0}
                step={500}
                value={draft.price}
                onChange={(e) => update("price", Number(e.target.value))}
                className={inputCls}
                placeholder="15000"
              />
            </Field>
            <Field label="Sort order" hint="Lower numbers show first">
              <input type="number" value={draft.sort_order} onChange={(e) => update("sort_order", Number(e.target.value))} className={inputCls} />
            </Field>
            <Field label="Sold out">
              <label className="flex items-center gap-3 mt-2 cursor-pointer">
                <input type="checkbox" checked={draft.sold_out} onChange={(e) => update("sold_out", e.target.checked)} className="w-5 h-5 accent-deep" />
                <span className="text-sm text-ink">Mark this product as sold out</span>
              </label>
            </Field>
          </div>
        </div>

        <div className="sticky bottom-0 bg-white border-t border-hairline px-6 py-4 flex items-center justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2.5 rounded-full text-sm bg-cream hover:bg-hairline border border-hairline">Cancel</button>
          <button onClick={save} disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm bg-deep hover:bg-deep-hover text-white shadow-soft disabled:opacity-50">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {isNew ? "Create" : "Save changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

const inputCls =
  "w-full px-4 py-2.5 rounded-xl border border-hairline bg-cream focus:outline-none focus:ring-2 focus:ring-deep/30 text-sm";

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-xs uppercase tracking-widest text-deep block mb-1.5">{label}</label>
      {children}
      {hint && <p className="text-[11px] text-muted mt-1">{hint}</p>}
    </div>
  );
}

function UrlWarning({ url }: { url: string }) {
  if (!url) return null;
  const u = url.trim().toLowerCase();
  const isPageLink =
    u.includes("facebook.com/") ||
    u.includes("fb.com/") ||
    u.includes("instagram.com/") ||
    u.includes("tiktok.com/") ||
    u.includes("pinterest.com/pin");
  const looksLikeImage =
    /\.(jpe?g|png|webp|gif|avif)(\?|$)/i.test(url) ||
    u.includes("images.unsplash.com") ||
    u.includes("i.imgur.com") ||
    u.includes("scontent") ||
    u.includes("fbcdn.net") ||
    u.includes("cdninstagram") ||
    u.startsWith("data:image/");

  if (isPageLink && !looksLikeImage) {
    return (
      <div className="mt-2 flex gap-2 items-start text-[12px] text-amber-800 bg-amber-50 border border-amber-200 rounded-lg p-2.5">
        <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
        <div>
          <div className="font-semibold">ဒီ link က ပုံ link မဟုတ်ပါ</div>
          <div className="font-mm leading-relaxed">
            Facebook/Instagram page link မဟုတ်ဘဲ <b>ပုံပေါ်တွင် Right-click → "Copy image address"</b> နှိပ်ပြီး
            ရတဲ့ link (.jpg, .png နဲ့ဆုံးတဲ့) ကိုသာ ထည့်ပါ။
          </div>
          <div className="mt-1 text-[11px] text-amber-700">
            အလွယ်ဆုံး — Imgur (imgur.com) မှာ upload လုပ်ပြီး "Copy image link" နှိပ်ပါ။
          </div>
        </div>
      </div>
    );
  }
  return null;
}

function ImageUploader({
  currentUrl, onUploaded, onClear,
}: {
  currentUrl: string;
  onUploaded: (url: string) => void;
  onClear: () => void;
}) {
  const [uploading, setUploading] = useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be smaller than 5MB");
      return;
    }
    setUploading(true);
    const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
    const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const { error } = await supabase.storage
      .from("product-images")
      .upload(path, file, { cacheControl: "3600", upsert: false, contentType: file.type });
    if (error) {
      setUploading(false);
      return toast.error(error.message);
    }
    const { data } = supabase.storage.from("product-images").getPublicUrl(path);
    onUploaded(data.publicUrl);
    setUploading(false);
    toast.success("Photo uploaded");
  };

  return (
    <div className="flex items-start gap-4">
      <div className="w-32 aspect-[3/4] bg-cream rounded-xl overflow-hidden border border-hairline shrink-0 relative">
        {currentUrl ? (
          <img src={currentUrl} alt="preview" className="w-full h-full object-cover"
            onError={(e) => (e.currentTarget.style.display = "none")} />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted">
            <ImageIcon className="w-8 h-8" />
          </div>
        )}
      </div>
      <div className="flex-1 space-y-2">
        <input ref={inputRef} type="file" accept="image/*" className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ""; }} />
        <button type="button" onClick={() => inputRef.current?.click()} disabled={uploading}
          className="inline-flex items-center gap-2 bg-deep hover:bg-deep-hover text-white px-4 py-2 rounded-full text-sm shadow-soft disabled:opacity-50">
          {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
          {uploading ? "Uploading..." : currentUrl ? "Replace photo" : "Upload photo"}
        </button>
        {currentUrl && (
          <button type="button" onClick={onClear}
            className="block text-xs text-muted hover:text-red-600">Remove photo</button>
        )}
        <p className="text-[11px] text-muted">JPG, PNG or WebP · max 5MB</p>
      </div>
    </div>
  );
}
