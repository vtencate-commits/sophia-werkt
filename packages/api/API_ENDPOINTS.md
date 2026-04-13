# Sophia Werkt API - Endpoints Reference

## Base URL
```
http://localhost:3001/api/v1
```

## Authentication Endpoints
`POST /auth/register` - Register new user (CLIENT role)
`POST /auth/login` - Login user (returns access + refresh tokens)
`POST /auth/refresh` - Refresh access token
`POST /auth/logout` - Logout user (requires auth)
`POST /auth/forgot-password` - Request password reset
`POST /auth/reset-password` - Reset password with token

## Cases Endpoints
`GET /cases/list` - Get user's cases (CLIENT/LAWYER)
`POST /cases/create` - Create new case (CLIENT only)
`GET /cases/:id` - Get case details
`PATCH /cases/:id` - Update case (LAWYER/ADMIN)
`PATCH /cases/:id/assign` - Assign lawyer to case (ADMIN only)
`PATCH /cases/:id/status` - Update case status (LAWYER/ADMIN)
`GET /cases/:id/timeline` - Get case timeline/history
`GET /cases/:id/fee-summary` - Get fee and time tracking summary

## Documents Endpoints
`GET /documents/cases/:caseId` - List case documents
`POST /documents/cases/:caseId/upload` - Upload document (multipart)
`GET /documents/:documentId/download` - Get presigned download URL
`DELETE /documents/:documentId` - Delete document

## Messages Endpoints
`GET /messages/cases/:caseId` - Get case messages
`POST /messages/cases/:caseId/send` - Send message
`PATCH /messages/:messageId/read` - Mark message as read
`PATCH /messages/cases/:caseId/mark-read` - Mark all case messages as read

## AI Endpoints
`POST /ai/cases/:caseId/analyze` - Analyze case with Claude (LAWYER/ADMIN)
`GET /ai/cases/:caseId/analysis` - Get case analysis result
`PATCH /ai/:analysisId` - Update analysis HTML
`GET /ai/skills` - List available skills (with optional category filter)
`POST /ai/skills` - Create new skill (ADMIN only)
`GET /ai/skills/:skillId` - Get skill details
`PUT /ai/skills/:skillId` - Update skill (ADMIN only)

## Invoices Endpoints
`GET /invoices/cases/:caseId` - List case invoices
`POST /invoices/cases/:caseId/create` - Create invoice (LAWYER/ADMIN)
`GET /invoices/:invoiceId` - Get invoice details
`PATCH /invoices/:invoiceId/status` - Update invoice status (LAWYER/ADMIN)
`GET /invoices/:invoiceId/pdf` - Get invoice PDF

## Notifications Endpoints
`GET /notifications/list` - Get user notifications
`PATCH /notifications/:notificationId/read` - Mark notification as read
`POST /notifications/mark-all-read` - Mark all as read
`GET /notifications/unread-count` - Get unread notification count

## Users/Time Entries Endpoints
`GET /users/me` - Get current user profile
`GET /users/cases/:caseId/time-entries` - List case time entries
`POST /users/cases/:caseId/time-entries` - Create time entry
`PUT /users/time-entries/:timeEntryId` - Update time entry
`DELETE /users/time-entries/:timeEntryId` - Delete time entry

## Admin Endpoints
`GET /admin/users` - List all users (paginated)
`POST /admin/users` - Create user (ADMIN only)
`PATCH /admin/users/:userId` - Update user (ADMIN only)
`PATCH /admin/users/:userId/role` - Change user role (ADMIN only)
`PATCH /admin/users/:userId/deactivate` - Deactivate user (ADMIN only)
`PATCH /admin/users/:userId/activate` - Activate user (ADMIN only)
`GET /admin/stats` - Get platform statistics
`GET /admin/audit-log` - Get audit log entries

## Health Check
`GET /health` - Health check endpoint

## Documentation
`GET /swagger` - Swagger UI documentation

## Environment Variables

Required for full functionality:
- `DATABASE_URL` - PostgreSQL connection string
- `REDIS_URL` - Redis connection string
- `JWT_SECRET` - Secret key for JWT signing
- `ANTHROPIC_API_KEY` - Claude API key
- `S3_ENDPOINT` - MinIO/S3 endpoint
- `S3_ACCESS_KEY` - S3 access key
- `S3_SECRET_KEY` - S3 secret key
- `S3_BUCKET` - S3 bucket name
- `RESEND_API_KEY` - Email service API key

Optional (defaults provided):
- `JWT_ACCESS_EXPIRY` (default: 15m)
- `JWT_REFRESH_EXPIRY` (default: 7d)
- `BCRYPT_ROUNDS` (default: 12)
- `RATE_LIMIT_MAX` (default: 100)
- `PORT` (default: 3001)
- `NODE_ENV` (default: development)

## Features

- JWT Authentication with refresh token rotation
- Account lockout after 5 failed login attempts (30 minutes)
- Role-based authorization (CLIENT, LAWYER, ADMIN)
- Zod validation on all inputs
- Text anonymization for AI processing
- S3/MinIO document storage
- Invoice generation with auto-numbering
- Case reference number tracking
- Time entry tracking with billable flag
- Employer conflict detection
- Claude AI integration for case analysis
- Email notifications
- Comprehensive error handling
- Rate limiting and CORS support
