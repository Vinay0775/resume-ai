# Database Quick Start

## TL;DR - 3 Steps to Setup Database

### Step 1: Set Database URL
Add to `.env.local` or `.env`:
```env
DATABASE_URL="postgresql://postgres.[project-id]:[password]@[region].pooler.supabase.com:6543/postgres"
DATABASE_URL_UNPOOLED="postgresql://postgres.[project-id]:[password]@[region].supabase.co:5432/postgres"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### Step 2: Initialize Database
```bash
npm.cmd run db:setup
```

### Step 3: Login
- **Email:** admin@resumeai.com
- **Password:** admin1234

---

## Database Commands Cheat Sheet

```bash
# Setup everything (push schema + seed data)
npm run db:setup

# Manually push schema only
npm run db:push

# Seed database with initial data
npm run db:seed

# Regenerate Prisma Client
npm run db:generate

# Create migration (with version history)
npm run db:migrate

# Reset database completely (⚠️ destructive)
npm run db:reset
```

---

## Connection Issues?

See `docs/DATABASE_TROUBLESHOOTING.md` for detailed guides.

---

## Database Models

- **User** - Authentication & user data
- **Resume** - User resumes
- **Template** - Resume templates  
- **Payment** - Payment history
- **SiteSetting** - Configuration

See `prisma/schema.prisma` for full schema.
