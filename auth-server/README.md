# SafeEats Auth Server

Express backend for SafeEats authentication with OTP verification, password login, JWT access/refresh tokens, and SQLite persistence.

## Features

- Email OTP send and verify endpoints
- User registration with hashed passwords (bcrypt)
- Login with OTP verification token + password
- Refresh token rotation and logout revocation
- Protected profile endpoint (`/auth/me`)
- Basic API hardening (`helmet`, rate limit, request logging)

## Setup

1. Install dependencies:

```bash
npm install
```

2. Configure environment:

```bash
cp .env.example .env
```

3. Update secrets in `.env`:

- `JWT_ACCESS_SECRET`
- `JWT_REFRESH_SECRET`
- `JWT_EMAIL_VERIFY_SECRET`

4. Start server:

```bash
npm run dev
```

Server defaults to `http://localhost:4000`.

## API Overview

### `POST /auth/send-otp`
Body:

```json
{ "email": "user@example.com" }
```

### `POST /auth/verify-otp`
Body:

```json
{ "email": "user@example.com", "token": "123456" }
```

Returns a short-lived `verificationToken`.

### `POST /auth/register`
Body:

```json
{
  "email": "user@example.com",
  "password": "strongpassword",
  "displayName": "SafeEats User",
  "verificationToken": "<from verify-otp>"
}
```

### `POST /auth/login`
Body:

```json
{
  "email": "user@example.com",
  "password": "strongpassword",
  "verificationToken": "<from verify-otp>"
}
```

Returns `accessToken`, `refreshToken`, and `user`.

### `POST /auth/refresh`
Body:

```json
{ "refreshToken": "<refresh-token>" }
```

### `POST /auth/logout`
Body:

```json
{ "refreshToken": "<refresh-token>" }
```

### `GET /auth/me`
Header:

```text
Authorization: Bearer <access-token>
```

## Notes

- When SMTP is not configured and `ALLOW_DEV_OTP_RESPONSE=true`, OTP is returned in the API response for local development only.
- Database file is created automatically at `AUTH_DB_PATH` (default: `data/auth.db`).
