import {createServerClient, type CookieOptions} from "@supabase/ssr";
import {NextResponse, type NextRequest} from "next/server";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({name, value, ...options});
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({name, value, ...options});
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({name, value: "", ...options});
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({name, value: "", ...options});
        },
      },
    },
  );

  const {
    data: {user},
  } = await supabase.auth.getUser();

  // PROTEKSI: Jika akses halaman dashboard tapi tidak ada user
  if (!user && request.nextUrl.pathname.startsWith("/customer")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // OPSIONAL: Jika sudah login tapi mau ke /login, lempar ke dashboard
  if (user && request.nextUrl.pathname.startsWith("/login")) {
    return NextResponse.redirect(new URL("/customer", request.url));
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
