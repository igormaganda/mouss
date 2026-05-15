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
      search = '', 
      role = '', 
      status = '', 
      department = '',
      format = 'csv'
    } = req.query;

    const where: any = {};

    if (search) {
      where.OR = [
        { email: { contains: search as string, mode: 'insensitive' as const } },
        { profile: { firstName: { contains: search as string, mode: 'insensitive' as const } } },
        { profile: { lastName: { contains: search as string, mode: 'insensitive' as const } } },
        { profile: { employeeId: { contains: search as string, mode: 'insensitive' as const } } }
      ];
    }

    if (role) {
      where.role = role;
    }

    if (status !== '') {
      where.active = status === 'true';
    }

    if (department) {
      where.profile = { ...where.profile, department };
    }

    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        email: true,
        role: true,
        active: true,
        createdAt: true,
        profile: true
      },
      orderBy: { createdAt: 'desc' }
    });

    const exportData = users.map(user => ({
      'Employee ID': user.profile?.employeeId || '',
      'First Name': user.profile?.firstName || '',
      'Last Name': user.profile?.lastName || '',
      'Email': user.email,
      'Role': user.role,
      'Status': user.active ? 'Active' : 'Inactive',
      'Department': user.profile?.department || '',
      'Job Title': user.profile?.jobTitle || '',
      'Hire Date': user.profile?.hireDate ? new Date(user.profile.hireDate).toLocaleDateString() : '',
      'Phone': user.profile?.phone || '',
      'City': user.profile?.city || '',
      'Created': user.createdAt ? new Date(user.createdAt).toLocaleDateString() : ''
    }));

    const headers = ['Employee ID', 'First Name', 'Last Name', 'Email', 'Role', 'Status', 'Department', 'Job Title', 'Hire Date', 'Phone', 'City', 'Created'];

    if (format === 'csv') {
      const csv = arrayToCSV(exportData, headers);
      const filename = `users-export-${generateTimestamp()}.csv`;
      
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      return res.send(csv);
    }

    return res.status(400).json({ error: 'Invalid format' });
  } catch (error) {
    console.error('Export error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
