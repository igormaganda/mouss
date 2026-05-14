import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const ALLOWED_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'text/csv',
  'image/png',
  'image/jpeg',
  'image/webp',
  'text/plain',
]

const MAX_SIZE = 10 * 1024 * 1024 // 10 MB

function getFileCategory(mimeType: string, fileName: string): string {
  if (mimeType.includes('pdf')) return 'pdf'
  if (mimeType.includes('word') || mimeType.includes('document')) return 'word'
  if (mimeType.includes('excel') || mimeType.includes('sheet') || mimeType.includes('csv')) return 'spreadsheet'
  if (mimeType.startsWith('image/')) return 'image'
  return 'other'
}

function getFileIcon(category: string): string {
  switch (category) {
    case 'pdf': return 'file-text'
    case 'word': return 'file-type'
    case 'spreadsheet': return 'sheet'
    case 'image': return 'image'
    default: return 'file'
  }
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} o`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} Ko`
  return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`
}

// GET: list documents in a folder
export async function GET(request: NextRequest) {
  const folderId = request.nextUrl.searchParams.get('folderId')
  if (!folderId) return NextResponse.json({ documents: [] })

  try {
    const documents = await prisma.marketDocument.findMany({
      where: { folderId },
      orderBy: { createdAt: 'desc' },
    })

    const formatted = documents.map((d) => ({
      ...d,
      category: getFileCategory(d.fileType, d.fileName),
      icon: getFileIcon(getFileCategory(d.fileType, d.fileName)),
      fileSizeFormatted: formatFileSize(d.fileSize),
    }))

    return NextResponse.json({ documents: formatted })
  } catch (err) {
    console.error('GET market-documents error:', err)
    return NextResponse.json({ documents: [] })
  }
}

// POST: upload document to folder
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const folderId = formData.get('folderId') as string | null
    const userId = formData.get('userId') as string | null
    const tags = formData.get('tags') as string | null
    const notes = formData.get('notes') as string | null

    if (!file || !folderId || !userId) {
      return NextResponse.json({ error: 'file, folderId et userId sont requis' }, { status: 400 })
    }

    if (!ALLOWED_TYPES.includes(file.type) && !file.name.match(/\.(pdf|doc|docx|xls|xlsx|csv|png|jpg|jpeg|webp|txt)$/i)) {
      return NextResponse.json(
        { error: 'Type de fichier non supporté. Utilisez PDF, Word, Excel, CSV, image ou texte.' },
        { status: 400 }
      )
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: 'Fichier trop volumineux. Maximum 10 Mo.' }, { status: 400 })
    }

    // Verify folder belongs to user
    const folder = await prisma.marketFolder.findFirst({ where: { id: folderId, userId } })
    if (!folder) {
      return NextResponse.json({ error: 'Dossier introuvable.' }, { status: 404 })
    }

    const category = getFileCategory(file.type, file.name)
    const arrayBuffer = await file.arrayBuffer()
    const base64Content = Buffer.from(arrayBuffer).toString('base64')

    const document = await prisma.marketDocument.create({
      data: {
        userId,
        folderId,
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        fileUrl: `data:${file.type};base64,${base64Content}`,
        category,
        tags: tags ? tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
        notes: notes || null,
      },
    })

    return NextResponse.json({
      document: {
        ...document,
        icon: getFileIcon(category),
        fileSizeFormatted: formatFileSize(document.fileSize),
      },
    })
  } catch (err) {
    console.error('POST market-documents error:', err)
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 })
  }
}

// DELETE: remove a document
export async function DELETE(request: NextRequest) {
  const id = request.nextUrl.searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'id requis' }, { status: 400 })

  try {
    await prisma.marketDocument.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('DELETE market-documents error:', err)
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 })
  }
}
