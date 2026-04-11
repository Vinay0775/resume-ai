@echo off
REM Database Setup Script for ResumeAI (Windows)
REM This script sets up the PostgreSQL database with Prisma

echo 🚀 Starting database setup...

REM Check if DATABASE_URL is set
if "!DATABASE_URL!"=="" (
  echo ❌ ERROR: DATABASE_URL environment variable is not set
  echo Please set DATABASE_URL in .env.local or .env file
  exit /b 1
)

echo 📦 Installing Prisma dependencies...
npm.cmd install @prisma/client prisma

echo 🔄 Pushing schema to database...
npm.cmd exec prisma db push --skip-generate

echo 🌱 Running database seed...
npm.cmd exec prisma db seed

echo ✅ Database setup complete!
echo.
echo 📋 Default credentials:
echo    Email: admin@resumeai.com
echo    Password: admin1234
echo.
