import { NextResponse } from 'next/server'
import { z } from 'zod'
import { createLicense, findLicense } from '@/lib/db'

const createSchema = z.object({
  userId: z.string().uuid(),
  productName: z.string().trim().min(1).max(120),
  maximumTerminals: z.number().int().min(1).max(100),
  expiresAt: z.string().datetime().nullable().optional(),
})

export async function GET(request: Request) {
  const key = new URL(request.url).searchParams.get('key')
  if (!key || key.length > 64) return NextResponse.json({ error: 'License key is required.' }, { status: 400 })

  const license = await findLicense(key)
  if (!license) return NextResponse.json({ error: 'License not found.' }, { status: 404 })
  return NextResponse.json({ license })
}

export async function POST(request: Request) {
  const parsed = createSchema.safeParse(await request.json())
  if (!parsed.success) return NextResponse.json({ error: 'Invalid license details.' }, { status: 400 })

  try {
    const license = await createLicense(parsed.data)
    return NextResponse.json({ license }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Unable to create license.' }, { status: 500 })
  }
}
