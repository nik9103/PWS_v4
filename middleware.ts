import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  await supabase.auth.getClaims();
  const { data } = await supabase.auth.getSession();
  const isLoggedIn = !!data.session;
  const path = request.nextUrl.pathname;

  const appPaths = [
    "/competitions",
    "/users",
    "/applications",
    "/documents",
    "/my-competitions",
    "/my-applications",
  ];
  const isAppPath = appPaths.some((p) => path === p || path.startsWith(p + "/"));

  if (path === "/") {
    if (isLoggedIn) {
      const userId = data.session?.user?.id;
      let redirectUrl = new URL("/competitions", request.url);
      if (userId) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", userId)
          .single();
        if (profile?.role === "admin") {
          redirectUrl = new URL("/admin", request.url);
        }
      }
      return NextResponse.redirect(redirectUrl);
    }
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  if (isAppPath && !isLoggedIn) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  if (path.startsWith("/admin")) {
    if (!isLoggedIn) {
      const loginUrl = new URL("/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
    const userId = data.session?.user?.id;
    if (userId) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", userId)
        .single();
      if (profile?.role !== "admin") {
        const appUrl = new URL("/competitions", request.url);
        return NextResponse.redirect(appUrl);
      }
    } else {
      const loginUrl = new URL("/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  if ((path === "/login" || path === "/signup") && isLoggedIn) {
    const userId = data.session?.user?.id;
    let redirectUrl = new URL("/competitions", request.url);
    if (userId) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", userId)
        .single();
      if (profile?.role === "admin") {
        redirectUrl = new URL("/admin", request.url);
      }
    }
    return NextResponse.redirect(redirectUrl);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
