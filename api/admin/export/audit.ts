import { VercelRequest, VercelResponse } from '@vercel/node';
import { prisma } from '../../../src/lib/prisma';
import { authenticateToken, isAdmin } from '../../../src/lib/vercel-middleware';
import { arrayToCSV, generateTimestamp } from '../../../src/lib/export';

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

    if (req.method !== 'GET') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    const { 
      action = '', 
      from = '',
      to = '',
      limit = '1000',
      format = 'csv'
    } = req.query;

    const limitNum = parseInt(limit as string);

    const where: any = {};

    if (action) {
      where.action = action;
    }

    if (from || to) {
      where.createdAt = {};
      if (from) {
        where.createdAt.gte = new Date(from as string);
      }
      if (to) {
        where.createdAt.lte = new Date(to as string);
      }
    }

    const auditLogs = await prisma.auditLog.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            profile: {
              select: {
                firstName: true,
                lastName: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: limitNum
    });

    const exportData = auditLogs.map(log => ({
      'Date': log.createdAt ? new Date(log.createdAt).toLocaleString() : '',
      'User': log.user?.profile?.firstName && log.user?.profile?.lastName 
        ? `${log.user.profile.firstName} ${log.user.profile.lastName}` 
        : log.user?.email || 'Unknown',
      'Action': log.action,
      'Entity Type': log.entityType || '',
      'Entity ID': log.entityId || '',
      'Details': log.details || '',
      'IP Address': log.ipAddress || ''
    }));

    const headers = ['Date', 'User', 'Action', 'Entity Type', 'Entity ID', 'Details', 'IP Address'];
    const csv = arrayToCSV(exportData, headers);
    const filename = `audit-log-${generateTimestamp()}.csv`;

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    return res.send(csv);
  } catch (error) {
    console.error('Audit export error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
