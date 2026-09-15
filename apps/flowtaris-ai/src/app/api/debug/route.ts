import { NextResponse } from 'next/server';
import { getSiteConfig } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const config = await getSiteConfig();
    return NextResponse.json({
      success: true,
      hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      urlValue: process.env.NEXT_PUBLIC_SUPABASE_URL,
      config: config
    });
  } catch(err: any) {
    return NextResponse.json({
      success: false,
      hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      urlValue: process.env.NEXT_PUBLIC_SUPABASE_URL,
      error: err.message,
      stack: err.stack
    });
  }
}
