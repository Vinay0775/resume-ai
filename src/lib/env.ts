/**
 * Environment Variable Validation
 * This file validates that all required environment variables are set
 * Call this at application startup
 */

const requiredEnvVars = [
  'DATABASE_URL',
  'NEXT_PUBLIC_APP_URL',
];

const devOnlyEnvVars = [
  // Add dev-only env vars here if needed
];

export function validateEnv() {
  const missingVars: string[] = [];
  
  // Check required env vars
  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      missingVars.push(envVar);
    }
  }

  // In development, dev-only vars are optional
  if (process.env.NODE_ENV === 'production') {
    for (const envVar of devOnlyEnvVars) {
      if (!process.env[envVar]) {
        missingVars.push(envVar);
      }
    }
  }

  if (missingVars.length > 0) {
    const message = `Missing required environment variables: ${missingVars.join(', ')}`;
    console.error(`\n❌ Configuration Error: ${message}\n`);
    throw new Error(message);
  }

  console.log('✅ Environment variables validated successfully');
}

/**
 * Get a required environment variable with a fallback
 */
export function getEnv(key: string, fallback?: string): string {
  const value = process.env[key] || fallback;
  if (!value) {
    throw new Error(`Environment variable ${key} is required but not set`);
  }
  return value;
}
