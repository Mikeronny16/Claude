import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const pass = searchParams.get("pass");

  if (pass !== (process.env.ADMIN_PASSWORD || "cdm_admin_2025")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token     = process.env.VERCEL_TOKEN;
  const projectId = process.env.VERCEL_PROJECT_ID;

  if (!token)     return NextResponse.json({ error: "no_token" });
  if (!projectId) return NextResponse.json({ error: "no_project" });

  const to   = new Date();
  const from = new Date(to.getTime() - 7 * 24 * 60 * 60 * 1000);

  const base = "https://vercel.com/api/web/insights";
  const qs   = new URLSearchParams({ projectId, from: from.toISOString(), to: to.toISOString(), environment: "production" });
  const qs5  = new URLSearchParams({ ...Object.fromEntries(qs), limit: "5" });
  const headers = { Authorization: `Bearer ${token}` };

  try {
    const [statsRes, countriesRes, referrersRes] = await Promise.all([
      fetch(`${base}/stats?${qs}`,                    { headers, cache: "no-store" }),
      fetch(`${base}/breakdown/country?${qs5}`,       { headers, cache: "no-store" }),
      fetch(`${base}/breakdown/referrer?${qs5}`,      { headers, cache: "no-store" }),
    ]);

    const [stats, countries, referrers] = await Promise.all([
      statsRes.json(), countriesRes.json(), referrersRes.json(),
    ]);

    if (!statsRes.ok) return NextResponse.json({ error: "api_error", detail: stats });

    return NextResponse.json({
      visitors:    stats.data?.visitors   ?? stats.visitors   ?? 0,
      pageviews:   stats.data?.pageViews  ?? stats.pageViews  ?? 0,
      bounce_rate: stats.data?.bounceRate ?? stats.bounceRate ?? 0,
      countries:   countries.data         ?? countries        ?? [],
      referrers:   referrers.data         ?? referrers        ?? [],
    });
  } catch (err) {
    return NextResponse.json({ error: "fetch_error", detail: String(err) });
  }
}
