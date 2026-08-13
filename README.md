# VaultX Ledger — secure Railway deployment

This version replaces demonstration-only actions with PostgreSQL-backed client and transaction records, private S3-compatible KYC uploads, administrator password + TOTP MFA, encrypted sensitive fields, role checks, secure sessions, validation and append-only audit events.

## Railway setup

### 1. Add PostgreSQL

In the Railway project canvas select **Create → Database → PostgreSQL**. In the website service’s Variables tab add a reference variable named `DATABASE_URL` pointing to the Postgres service’s `DATABASE_URL`.

### 2. Add a private bucket

Select **Create → Bucket** in the same Railway project. Keep the bucket private. Copy/reference the credentials from its Credentials tab into the website service using the names in `.env.example`: `S3_ENDPOINT`, `S3_REGION`, `S3_BUCKET`, `S3_ACCESS_KEY_ID`, and `S3_SECRET_ACCESS_KEY`.

### 3. Generate secrets locally

Generate independent random values; never reuse passwords:

```powershell
# 32-byte base64 encryption key
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))

# session and HMAC secrets (run twice and use separate outputs)
[Convert]::ToHexString((1..48 | ForEach-Object { Get-Random -Maximum 256 }))
```

Add them to Railway as `FIELD_ENCRYPTION_KEY`, `SESSION_SECRET`, and `AUDIT_HMAC_KEY`. Rotating the encryption key requires a controlled data re-encryption migration; do not simply replace it after records exist.

### 4. Create the first administrator

Add temporary Railway variables:

- `ADMIN_EMAIL`: your private administrator email.
- `ADMIN_INITIAL_PASSWORD`: a unique password of at least 14 characters.
- `ADMIN_TOTP_SECRET`: a Base32 secret entered into Google Authenticator, Microsoft Authenticator, 1Password, etc.

Deploy the service, then run `npm run db:seed` once from the Railway shell. Confirm login works and immediately delete `ADMIN_INITIAL_PASSWORD` and `ADMIN_TOTP_SECRET` from Railway. The encrypted TOTP secret remains in PostgreSQL.

### 5. Deploy

Railway should use:

- Build command: `npm run build`
- Start command: `npm run start`
- Health check path: `/login`

The start command applies pending Prisma migrations before starting the website.

## Upload safety

Uploads accept PDF, JPG, PNG, MP4, and WebM up to 100 MB. Files receive randomized keys, SHA-256 fingerprints and private storage encryption, and initially remain `QUARANTINED`. This code intentionally does **not** mark files verified automatically. Connect a malware-scanning service or isolated ClamAV worker before allowing normal operational use; only Compliance/Admin personnel should release a quarantined file after scanning.

## Backups and recovery

In the PostgreSQL service open **Backups** and enable daily, weekly and monthly schedules. For stronger recovery, enable Railway Point-in-Time Recovery; it archives WAL changes into a separate Railway bucket and restores into a new sibling database. Enable object versioning/retention policy for the KYC bucket if your plan supports it. Perform a quarterly isolated restore and verify database counts against sampled KYC SHA-256 fingerprints.

Suggested objectives: database RPO ≤ 15 minutes with PITR, object RPO ≤ 24 hours, and RTO ≤ 4 hours. Keep an offline recovery-key procedure and two authorized people for production key recovery.

## Security operations

- Keep GitHub private and never commit `.env` files or real documents.
- Use separate Admin, Compliance, Operator, and Viewer accounts; never share logins.
- Review audit events and failed logins weekly.
- Apply dependency updates in staging first.
- Add malware scanning, alerting, and a documented incident-response process before real KYC use.
- Obtain professional Indian legal/compliance review for KYC collection, consent, retention, FIU-IND/PMLA obligations, breach response and deletion requirements.

No software is bug-free. Before real use, run permission tests, upload tests, a security assessment and a full restore drill.
