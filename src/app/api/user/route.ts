import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const user = await db.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
      plan: user.plan,
      role: user.role,
      image: user.image,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    if (password.length < 4) {
      return NextResponse.json({ error: 'Password must be at least 4 characters' }, { status: 400 });
    }

    const existingUser = await db.user.findUnique({ where: { email } });
    if (existingUser) {
      // Return existing user data instead of error for smoother Google demo login
      return NextResponse.json({
        id: existingUser.id,
        name: existingUser.name,
        email: existingUser.email,
        plan: existingUser.plan,
        role: existingUser.role,
        image: existingUser.image,
        message: 'User already exists',
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await db.user.create({
      data: {
        name: name || '',
        email,
        password: hashedPassword,
        plan: 'free',
        role: 'user',
        status: 'active',
        aiCreditsUsed: 0,
        aiCreditsLimit: 5,
      },
    });

    // Handle case where database is not available
    if (!user) {
      // Return mock user for Google sign-in flow when DB is unavailable
      return NextResponse.json({
        id: 'temp-' + email,
        name: name || email.split('@')[0],
        email,
        plan: 'free',
        role: 'user',
        image: null,
        message: 'User created without database',
      }, { status: 201 });
    }

    return NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
      plan: user.plan,
      role: user.role,
      image: user.image,
    }, { status: 201 });
  } catch (error) {
    console.error('User POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
