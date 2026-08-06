# VaultX Ledger

Production-oriented USDT desk website for managing clients, KYC evidence, INR settlements, transaction history and audit activity. The supplied interface uses realistic seeded display data; durable hosted data belongs in D1 and KYC files/video in private R2 object storage.

## Local setup

1. Install Node.js 22.13 or newer.
2. Run `npm ci`.
3. Copy `.env.example` to `.env.local` and create new random keys. Never reuse the examples.
4. Run `npm run db:generate` after schema changes.
5. Run `npm run dev`, then open the printed local address.
6. Run `npm test` before release.

The hosting manifest declares `DB` for structured records and `KYC_BUCKET` for documents/videos. `db/schema.ts` is the source schema and `db/seed.sql` contains non-sensitive demonstration data only.

## Production controls

- **Authentication:** deploy as a private Site and require platform sign-in. Map the stable authenticated user ID to a server-side `users` record. Never trust a role sent by the browser.
- **Authorization:** enforce `ADMIN`, `COMPLIANCE`, `OPERATOR` and `VIEWER` permissions in every write/read handler. Limit KYC downloads to compliance/admin staff and use short-lived signed URLs.
- **Encryption:** TLS 1.3 in transit; storage encryption at rest; AES-256-GCM field encryption for phone, email and wallet addresses. Store encryption keys in managed secrets, version keys, and rotate them. Hash PAN identifiers with a keyed HMAC for duplicate detection.
- **Uploads:** private bucket only; allowlisted MIME types; size limits; randomized object keys; SHA-256 integrity hashes; malware scanning; quarantine until verified. Disable public listing and never put KYC bytes in the database.
- **Validation:** validate all inputs server-side, use integer paise for INR, cap amounts, normalize transaction IDs, parameterize every query, and make completion operations idempotent.
- **Audit:** append-only records for sign-in, view, export, create, update, status changes and file access. Record actor, target, timestamp and a privacy-safe network fingerprint. Export logs to immutable retention storage.
- **Privacy:** collect only necessary KYC information, obtain consent, define retention/deletion policy, mask data in UI/logs, and have local counsel review Indian KYC, PMLA, FIU-IND, tax and data-protection obligations before live use.

## Backup and recovery

Use automated daily database backups plus point-in-time recovery, and enable versioning/lifecycle protection on the object bucket. Copy encrypted backups to a second account/region with separate credentials. Keep 35 daily, 12 monthly, and 7 annual recovery points unless counsel sets another retention period. Back up the database and object manifests together so files can be reconciled.

Quarterly, restore into an isolated environment, verify row counts and sampled SHA-256 file hashes, test key recovery, document elapsed recovery time, and record approval. Target RPO: 15 minutes for database changes and 24 hours for object copies; target RTO: 4 hours. Alerts must cover failed backups, anomalous exports, repeated login failures and audit pipeline failure.

## Release checklist

- Replace all demo records and secrets.
- Apply generated migrations in staging, then production.
- Add server routes for CRUD/upload workflows with authentication, RBAC, CSRF protection, rate limits and structured redacted logs.
- Add unit tests for validation and permissions, integration tests for database/upload flows, and end-to-end tests for transaction search and KYC review.
- Run dependency and secret scanning, penetration testing, access review and a full restore drill.

No system can be guaranteed bug-free. These layers reduce risk and make failures detectable and recoverable.
