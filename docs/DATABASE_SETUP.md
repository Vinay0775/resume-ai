# Database Setup Guide

## Prerequisites

- PostgreSQL database (Recommended: Supabase)
- `.env.local` or `.env` file with database credentials

## Environment Variables

Add the following to your `.env.local` or `.env` file:

```env
DATABASE_URL="postgresql://[user]:[password]@[host]:[port]/[database]"
DATABASE_URL_UNPOOLED="postgresql://[user]:[password]@[host]:[port]/[database]"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### For Supabase:
1. Create a new Supabase project
2. Go to "Settings" → "Database" 
3. Find the connection string and copy it
4. Replace placeholders in `DATABASE_URL`

## Setup Steps

### Option 1: Automatic Setup (Recommended)

#### On Windows:
```bash
npm.cmd run db:setup
```

#### On macOS/Linux:
```bash
npm run db:setup
```

This command will:
1. Push the schema to the database
2. Run the seed script to create initial data

### Option 2: Manual Setup

If automatic setup fails, run these commands in order:

#### 1. Push Schema to Database
```bash
npm.cmd run db:push
```

#### 2. Generate Prisma Client
```bash
npm.cmd run db:generate
```

#### 3. Seed Database (Optional)
```bash
npm.cmd run db:seed
```

## Available Database Commands

```bash
# Push schema changes to database (without migrations)
npm run db:push

# Seed database with initial data
npm run db:seed

# Complete setup (push + seed)
npm run db:setup

# Generate Prisma Client
npm run db:generate

# Create migration files (with version history)
npm run db:migrate

# Reset database (destructive - deletes all data)
npm run db:reset
```

## Default Admin Account (After Seeding)

After running `db:seed`, use this account to login:

- **Email:** `admin@resumeai.com`
- **Password:** `admin1234`

⚠️ **Change this password immediately in production!**

## Troubleshooting

### Error: "Can't reach database server"
- Check if `DATABASE_URL` is correct
- Verify network connectivity to database
- Check firewall rules for database connection

### Error: "relation 'User' does not exist"
- Run `npm run db:push` to create tables
- Make sure database is empty before first setup

### Error: "prisma db seed failed"
- Delete the admin user manually if it already exists
- Make sure Prisma Client is generated: `npm run db:generate`

### Connection Pool Issues
- If using connection pooling, ensure `DATABASE_URL_UNPOOLED` is set for migrations

## Database Schema

See `prisma/schema.prisma` for the complete database schema.

### Models:
- **User** - User accounts and authentication
- **Resume** - User resumes
- **Template** - Resume templates
- **Payment** - Payment records
- **SiteSetting** - Site configuration settings

## Database Backups

For Supabase, backups are automatic. To backup manually:

```bash
# Export database (you'll need PostgreSQL tools installed)
pg_dump $DATABASE_URL_UNPOOLED > backup.sql
```

## Production Deployment

1. Set `DATABASE_URL` to your production database
2. Run migrations: `npm run db:push`
3. Optional: Run seed script: `npm run db:seed`
4. Monitor logs for any errors

---

**Need help?** Check the main README.md for more information.
