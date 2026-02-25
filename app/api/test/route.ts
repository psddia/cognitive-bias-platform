import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  const { text } = await req.json()

  const entry = await prisma.testEntry.create({
    data: { text }
  })

  return Response.json(entry)
}

export async function GET() {
  const entries = await prisma.testEntry.findMany({
    orderBy: { createdAt: 'desc' }
  })

  return Response.json(entries)
}