import { NextResponse } from 'next/server'
import { getSoldCount } from '@/lib/analytics-db'

// El HTML de /prompts2 llama a este endpoint con cache: 'no-store' para
// hidratar el contador "van X/100". Respondemos también con no-store para
// que el edge de Vercel no lo cachee y cada visita vea el valor fresco.
// El offset suma a las compras reales un seed narrativo (p.ej. 21) — se
// controla con la env PROMPTS2_COUNTER_OFFSET. Bájalo a 0 cuando las
// compras orgánicas superen el seed.
export const dynamic = 'force-dynamic'
export const revalidate = 0

const PRODUCT = 'prompts_111_v2'

export async function GET() {
  try {
    const offset = Number(process.env.PROMPTS2_COUNTER_OFFSET ?? 0)
    const count = await getSoldCount(PRODUCT)
    const sold = count + offset

    return NextResponse.json(
      { sold },
      { headers: { 'Cache-Control': 'no-store, max-age=0' } }
    )
  } catch (err) {
    console.error('[/api/counter]', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
