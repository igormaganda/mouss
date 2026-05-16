-- PSG3 Database Seed Data
-- This script creates test users and data for the admin portal

-- Insert admin users
INSERT INTO users (id, email, "passwordHash", role, active, "lastPasswordChange", "passwordExpiresAt", "mustChangePassword", createdAt, updatedAt)
VALUES
  ('cuid1', 'admin@psg.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYzW5qHLlHW', 'admin', true, NOW(), NOW() + INTERVAL '6 months', false, NOW(), NOW()),
  ('cuid2', 'm.reynolds@psg.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYzW5qHLlHW', 'admin', true, NOW(), NOW() + INTERVAL '6 months', false, NOW(), NOW()),
  ('cuid3', 'jason.walker@psg.local', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYzW5qHLlHW', 'employee', true, NOW(), NOW() + INTERVAL '6 months', false, NOW(), NOW()),
  ('cuid4', 's.martinez@psg.local', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYzW5qHLlHW', 'employee', true, NOW(), NOW() + INTERVAL '6 months', false, NOW(), NOW())
ON CONFLICT (email) DO NOTHING;

-- Insert employee profiles
INSERT INTO "EmployeeProfile" (
  id, userId, "employeeId", "firstName", "lastName", "preferredName",
  "jobTitle", department, "employmentType", "contractType", "hireDate",
  "workLocation", "payType", "basePay", "nationality", "phone",
  "city", "state", "country", "postalCode", "performanceRating",
  "uniformSize", "equipmentIssued", "licenses", "certifications", "trainingRequired",
  createdAt, updatedAt
)
VALUES
  (
    'cuid1', 'cuid1', 'ADM-001', 'System', 'Administrator', 'Admin',
    'System Administrator', 'IT', 'Full-Time', 'Permanent', '2024-01-01',
    'Remote', 'Salary', 75000, 'US Citizen', '+1 (555) 000-0000',
    'Remote', 'NY', 'USA', '10001', 5,
    'N/A', 'Computer', 'N/A', 'N/A', 'N/A',
    NOW(), NOW()
  ),
  (
    'cuid2', 'cuid2', 'ADM-002', 'Michael', 'Reynolds', 'Mike',
    'Operations Manager', 'Operations', 'Full-Time', 'Permanent', '2024-02-15',
    'NYC Headquarters', 'Salary', 85000, 'US Citizen', '+1 (555) 111-2222',
    'New York', 'NY', 'USA', '10001', 5,
    'L', 'Badge, Radio', 'N/A', 'Management', 'N/A',
    NOW(), NOW()
  ),
  (
    'cuid3', 'cuid3', 'EMP-1001', 'Jason', 'Walker', 'Jay',
    'Security Officer', 'Field Operations', 'Full-Time', 'Permanent', '2024-03-01',
    'Manhattan Branch', 'Hourly', 25, 'US Citizen', '+1 (555) 123-4567',
    'Brooklyn', 'NY', 'USA', '11201', 4,
    'L', 'Badge, Flashlight, Radio, Handcuffs', 'NYS Security License #12345678', 'CPR Certified, First Aid', 'Annual Firearms Training',
    NOW(), NOW()
  ),
  (
    'cuid4', 'cuid4', 'EMP-1002', 'Sofia', 'Martinez', 'Sofi',
    'Security Supervisor', 'Field Operations', 'Full-Time', 'Permanent', '2023-06-15',
    'Brooklyn Branch', 'Salary', 55000, 'US Citizen', '+1 (555) 345-6789',
    'Queens', 'NY', 'USA', '11375', 5,
    'M', 'Badge, Flashlight, Radio, Handcuffs, Vehicle', 'NYS Security License #87654321', 'CPR Certified, First Aid, Defensive Driving', 'Annual Firearms Training',
    NOW(), NOW()
  )
ON CONFLICT (userId) DO NOTHING;

-- Insert sample documents
INSERT INTO "Document" (id, title, category, description, "filePath", "fileName", "fileSize", "mimeType", visibility, "uploaderId", createdAt, updatedAt)
VALUES
  (
    'doc1', 'Employee Handbook 2024', 'Company Policy', 'Complete employee handbook with company policies and procedures',
    '/uploads/admin/employee-handbook-2024.pdf', 'employee-handbook-2024.pdf', 2048576, 'application/pdf', 'admin', 'cuid1', NOW(), NOW()
  ),
  (
    'doc2', 'Safety Protocols', 'Safety', 'Safety procedures and emergency protocols',
    '/uploads/admin/safety-protocols.pdf', 'safety-protocols.pdf', 1048576, 'application/pdf', 'admin', 'cuid1', NOW(), NOW()
  );

-- Insert sample audit logs
INSERT INTO "AuditLog" (id, userId, action, "entityType", "entityId", details, "ipAddress", createdAt)
VALUES
  ('audit1', 'cuid1', 'user.create', 'user', 'cuid3', 'Created employee account for Jason Walker', '127.0.0.1', NOW()),
  ('audit2', 'cuid1', 'document.upload', 'document', 'doc1', 'Uploaded Employee Handbook 2024', '127.0.0.1', NOW()),
  ('audit3', 'cuid3', 'login', NULL, NULL, 'Jason Walker logged in', '192.168.1.100', NOW());

SELECT 'Database seed completed successfully!' as message;
SELECT 'Admin Accounts:' as info;
SELECT '  Email: admin@psg.com' as account, '  Password: Admin#2026!' as password
UNION ALL
SELECT '  Email: m.reynolds@psg.com', '  Password: Admin#2026!'
UNION ALL
SELECT 'Employee Accounts:', ''
UNION ALL
SELECT '  Email: jason.walker@psg.local', '  Password: Employee#2026!'
UNION ALL
SELECT '  Email: s.martinez@psg.local', '  Password: Employee#2026!';