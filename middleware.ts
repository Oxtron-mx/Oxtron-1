import { NextRequest, NextResponse } from 'next/server';
import { PUBLIC_ROUTES, ROOT } from '@/lib/routes';
import { auth } from '@/auth';

export async function middleware(request: NextRequest) {
  const { nextUrl } = request;
  const pathname = nextUrl.pathname;

  // Skip middleware for assets and files
  if (
    pathname.startsWith('/_next') ||
    pathname === '/favicon.ico' ||
    pathname === '/SwrveWorker.js' ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }
  const session = await auth();
  const isAuthenticated = !!session?.user;

  // Define el idioma predeterminado
  const defaultLang = 'en';
  
  // Extrae el prefijo de idioma de la URL
  const segments = nextUrl.pathname.split('/');
  const lang = segments[1] || defaultLang; // Si no hay idioma, se usa el predeterminado

  // Si la URL es la raíz `/` sin idioma, redirige al idioma predeterminado
  if (nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL(`/${defaultLang}`, request.url));
  }

  // Si la URL no tiene idioma (por ejemplo: /register), redirige al idioma predeterminado
  if (!segments[1] || !['en', 'es', 'ja', 'hi', 'fr', 'de'].includes(segments[1])) {
    return NextResponse.redirect(new URL(`/${defaultLang}${nextUrl.pathname}`, request.url));
  }

  // Elimina el prefijo de idioma de la ruta para hacer las comparaciones
  const pathnameWithoutLang = segments.slice(2).join('/') || '/';
  const isPublicRoute = PUBLIC_ROUTES.some(route => pathnameWithoutLang.startsWith(route)) || pathnameWithoutLang === ROOT;

  // Redirige a la página de login si no está autenticado y la ruta no es pública
  // if (!isAuthenticated && !isPublicRoute) {
  //   if (!nextUrl.pathname.startsWith(`/${lang}/login`)) {
  //     return NextResponse.redirect(new URL(`/${lang}/login`, request.url));
  //   }
  // }

  // Redirige al dashboard si está autenticado y la ruta es pública
  if (isAuthenticated && isPublicRoute && pathnameWithoutLang === '/') {
    return NextResponse.redirect(new URL(`/${lang}/dashboard`, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
