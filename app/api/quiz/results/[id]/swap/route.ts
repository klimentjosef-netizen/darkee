import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { swapPick } from '@/lib/quiz-run'

// "Tenhle ne": vymění jeden tip ve výsledku za jiný
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const { productId } = z.object({ productId: z.string().min(1).max(40) }).parse(await request.json())
    const result = await swapPick(id, productId)
    if ('error' in result) return NextResponse.json({ error: result.error }, { status: result.status })
    return NextResponse.json(result)
  } catch (error) {
    console.error('Swap error:', error)
    return NextResponse.json({ error: 'Tip se nepodařilo vyměnit' }, { status: 500 })
  }
}
