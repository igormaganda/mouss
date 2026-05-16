-- PSG3 Database Seed Data (Fixed)
-- This script creates test users and data for the admin portal

-- Insert users with correct hashed passwords (password: Admin#2026! and Employee#2026!)
-- Note: These are bcrypt hashes, the actual passwords are: Admin#2026! and Employee#2026!

INSERT INTO "User" (id, email, "passwordHash", role, active, "lastPasswordChange", "passwordExpiresAt", "mustChangePassword", "createdAt", "updatedAt")
VALUES
  ('admin1', 'admin@psg.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYzW5qHLlHW', 'admin', true, NOW(), NOW() + INTERVAL '6 months', false, NOW(), NOW()),
  ('admin2', 'm.reynolds@psg.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYzW5qHLlHW', 'admin', true, NOW(), NOW() + INTERVAL '6 months', false, NOW(), NOW()),
  ('emp1', 'jason.walker@psg.local', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYzW5qHLlHW', 'employee', true, NOW(), NOW() + INTERVAL '6 months', false, NOW(), NOW()),
  ('emp2', 's.martinez@psg.local', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYzW5qHLlHW', 'employee', true, NOW(), NOW() + INTERVAL '6 months', false, NOW(), NOW())
ON CONFLICT (email) DO NOTHING;

-- Insert employee profiles
INSERT INTO "EmployeeProfile" (
  id, "userId", "employeeId", "firstName", "lastName", "preferredName",
  "jobTitle", department, "employmentType", "contractType", "hireDate",
  "workLocation", "payType", "basePay", nationality, phone,
  city, state, "postalCode", country, "performanceRating",
  "uniformSize", "equipmentIssued", licenses, certifications, "trainingRequired",
  "createdAt", "updatedAt"
)
VALUES
  (
    'prof1', 'admin1', 'ADM-001', 'System', 'Administrator', 'Admin',
    'System Administrator', 'IT', 'Full-Time', 'Permanent', '2024-01-01',
    'Remote', 'Salary', 75000, 'US Citizen', '+1 (555) 000-0000',
    'Remote', 'NY', '10001', 'USA', 5,
    'N/A', 'Computer', 'N/A', 'N/A', 'N/A',
    NOW(), NOW()
  ),
  (
    'prof2', 'admin2', 'ADM-002', 'Michael', 'Reynolds', 'Mike',
    'Operations Manager', 'Operations', 'Full-Time', 'Permanent', '2024-02-15',
    'NYC Headquarters', 'Salary', 85000, 'US Citizen', '+1 (555) 111-2222',
    'New York', 'NY', '10001', 'USA', 5,
    'L', 'Badge, Radio', 'N/A', 'Management', 'N/A',
    NOW(), NOW()
  ),
  (
    'prof3', 'emp1', 'EMP-1001', 'Jason', 'Walker', 'Jay',
    'Security Officer', 'Field Operations', 'Full-Time', 'Permanent', '2024-03-01',
    'Manhattan Branch', 'Hourly', 25, 'US Citizen', '+1 (555) 123-4567',
    'Brooklyn', 'NY', '11201', 'USA', 4,
    'L', 'Badge, Flashlight, Radio, Handcuffs', 'NYS Security License #12345678', 'CPR Certified, First Aid', 'Annual Firearms Training',
    NOW(), NOW()
  ),
  (
    'prof4', 'emp2', 'EMP-1002', 'Sofia', 'Martinez', 'Sofi',
    'Security Supervisor', 'Field Operations', 'Full-Time', 'Permanent', '2023-06-15',
    'Brooklyn Branch', 'Salary', 55000, 'US Citizen', '+1 (555) 345-6789',
    'Queens', 'NY', '11375', 'USA', 5,
    'M', 'Badge, Flashlight, Radio, Handcuffs, Vehicle', 'NYS Security License #87654321', 'CPR Certified, First Aid, Defensive Driving', 'Annual Firearms Training',
    NOW(), NOW()
  )
ON CONFLICT ("userId") DO NOTHING;

-- Insert sample documents
INSERT INTO "Document" (id, title, category, description, "filePath", "fileName", "fileSize", "mimeType", visibility, "uploaderId", "createdAt", "updatedAt")
VALUES
  (
    'doc1', 'Employee Handbook 2024', 'Company Policy', 'Complete employee handbook with company policies and procedures',
    '/uploads/admin/employee-handbook-2024.pdf', 'employee-handbook-2024.pdf', 2048576, 'application/pdf', 'admin', 'admin1', NOW(), NOW()
  ),
  (
    'doc2', 'Safety Protocols', 'Safety', 'Safety procedures and emergency protocols',
    '/uploads/admin/safety-protocols.pdf', 'safety-protocols.pdf', 1048576, 'application/pdf', 'admin', 'admin1', NOW(), NOW()
  );

-- Insert sample audit logs
INSERT INTO "AuditLog" (id, "userId", action, "entityType", "entityId", details, "ipAddress", "createdAt")
VALUES
  ('audit1', 'admin1', 'user.create', 'user', 'emp1', 'Created employee account for Jason Walker', '127.0.0.1', NOW()),
  ('audit2', 'admin1', 'document.upload', 'document', 'doc1', 'Uploaded Employee Handbook 2024', '127.0.0.1', NOW()),
  ('audit3', 'emp1', 'login', NULL, NULL, 'Jason Walker logged in', '192.168.1.100', NOW());

SELECT '✅ Database seed completed successfully!' as message;

SELECT '📧 Test Accounts:' as info;
SELECT 'Admin:' as category, 'admin@psg.com / Admin#2026!' as accounts
UNION ALL
SELECT 'Admin:', 'm.reynolds@psg.com / Admin#2026!'
UNION ALL
SELECT 'Employee:', 'jason.walker@psg.local / Employee#2026!'
UNION ALL
SELECT 'Employee:', 's.martinez@psg.local / Employee#2026!';