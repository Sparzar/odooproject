# Expense Management Frontend

Environment variables:
- NEXT_PUBLIC_API_BASE: Base URL of your expense-management-backend (e.g., http://localhost:4000)
- API_BASE (server-side alternative): If set, server proxy uses this when available.

Key routes:
- /api/countries -> proxies restcountries to provide `{ name, code, currency }`
- /api/rates?base=USD -> proxies exchangerate-api to provide `{ rates }`
- /api/_proxy/... -> forwards to your backend (auth headers forwarded)

API adapter expectations (update `lib/api.ts` to match your backend as needed):
- POST /auth/signup, POST /auth/login, GET /auth/me
- POST /companies, GET /companies/me
- GET /users, PATCH /users/:id, POST /users
- POST /expenses (multipart), GET /expenses?mine=true
- GET /approvals/pending, POST /approvals/:expenseId
- GET /rules, POST /rules (or PUT /rules/:id)

OCR:
- Uses `tesseract.js` client-side. Parsing heuristics in `lib/ocr.ts` are adjustable.
