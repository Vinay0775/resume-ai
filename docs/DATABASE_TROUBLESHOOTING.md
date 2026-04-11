# Database Connection Troubleshooting

## Current Issue
Database server unreachable at: `aws-1-ap-northeast-1.supabase.co:5432`

## Step 1: Verify Supabase Project

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Check if your project exists and is **not paused**
3. If paused, click "Resume" to restart it

## Step 2: Verify Database Credentials

1. In Supabase, go to **Settings** → **Database**
2. Find the connection section
3. Verify the connection string format:
   ```
   postgresql://[user].[project-id]:[password]@[region].supabase.co:5432/postgres
   ```

4. Copy the **Connection pooling** string (recommended for applications)
5. Update `DATABASE_URL` in `.env.local`:
   ```env
   DATABASE_URL="postgresql://postgres.[project-id]:[password]@[region].pooler.supabase.com:6543/postgres"
   DATABASE_URL_UNPOOLED="postgresql://postgres.[project-id]:[password]@[region].supabase.co:5432/postgres"
   ```

## Step 3: Network Connectivity Test

Open PowerShell and test connectivity:

```pwsh
# Test if domain resolves
[System.Net.Dns]::GetHostAddresses("aws-1-ap-northeast-1.supabase.co")

# Test port connectivity (install if needed)
Test-NetConnection -ComputerName "aws-1-ap-northeast-1.supabase.co" -Port 5432
```

## Step 4: Validate Environment Variables

Check that environment variables are loaded correctly:

```bash
npm.cmd exec -c 'echo $env:DATABASE_URL' 
```

Should output your database connection string.

## Step 5: Create New Supabase Project (If needed)

If your project is deleted:

1. Go to [Supabase](https://supabase.com)
2. Click "New Project"
3. Fill in project details
4. Wait for database initialization (2-3 minutes)
5. Copy the connection string
6. Update `.env.local` with new credentials

## Step 6: Retry Database Push

After fixing the connection:

```bash
npm.cmd run db:push -- --skip-generate
```

## Getting Help

If none of these steps work:
1. Check Supabase Status Page
2. Check your project activity logs
3. Contact Supabase Support

---

**Once connected:** Run `npm run db:setup` to initialize tables and seed data.
