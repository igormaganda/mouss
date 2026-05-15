import { VercelRequest, VercelResponse } from '@vercel/node';
import { prisma } from '../../../src/lib/prisma';
import { authenticateToken, isAdmin, auditLog, getIpAddress } from '../../../src/lib/vercel-middleware';
import { randomUUID } from 'crypto';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '25mb',
    },
  },
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.substring(7);
    const user = await authenticateToken(token);
    if (!user || !isAdmin(user)) {
      return res.status(403).json({ error: 'Admin access required' });
    }

    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    const formData = await req.formData();
    const title = formData.get('title') as string;
    const category = formData.get('category') as string;
    const description = formData.get('description') as string;
    const file = formData.get('file') as File;

    if (!title || !category || !file) {
      return res.status(400).json({ error: 'Title, category, and file are required' });
    }

    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'image/jpeg',
      'image/png',
      'image/gif'
    ];

    if (!allowedTypes.includes(file.type)) {
      return res.status(400).json({ error: 'Invalid file type' });
    }

    if (file.size > 25 * 1024 * 1024) {
      return res.status(400).json({ error: 'File size exceeds 25MB limit' });
    }

    const now = new Date();
    const uploadDir = `uploads/${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, '0')}`;
    
    const fileExtension = file.name.split('.').pop();
    const uniqueFilename = `${Date.now()}-${randomUUID().substring(0, 8)}.${fileExtension}`;
    const filePath = `${uploadDir}/${uniqueFilename}`;

    const fileSize = file.size;

    const document = await prisma.document.create({
      data: {
        title,
        category,
        description: description || null,
        filePath,
        fileName: file.name,
        fileSize,
        mimeType: file.type,
        visibility: 'admin',
        uploaderId: user.id
      }
    });

    await auditLog(
      user.id,
      'document.upload',
      'document',
      document.id,
      `Uploaded document: ${title}`,
      getIpAddress(req)
    );

    return res.status(201).json({ document });
  } catch (error) {
    console.error('Document upload error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
