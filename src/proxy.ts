import { NextResponse, type NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

export async function proxy(request: NextRequest) {
  // Env vars not configured yet — don't break local dev before Supabase is wired up.
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return NextResponse.next();
  }

  const { response, user, supabase } = await updateSession(request);
  const path = request.nextUrl.pathname;

  if (path.startsWith('/admin')) {
    if (!user) {
      return NextResponse.redirect(new URL(`/login?redirect=${path}`, request.url));
    }
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();
    if (profile?.role !== 'admin') {
      const url = new URL('/', request.url);
      url.searchParams.set('error', 'not-authorized');
      return NextResponse.redirect(url);
    }
  }

  if ((path === '/checkout' || path.startsWith('/orders')) && !user) {
    return NextResponse.redirect(new URL(`/login?redirect=${path}`, request.url));
  }

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};
