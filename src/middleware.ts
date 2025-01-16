import { type NextRequest } from "next/server";
// import { createMongoConnection } from "./config/mongodb";
import { updateSession } from "./utils/supabase/middleware";

export async function middleware(request: NextRequest) {
  // Only check auth for API routes
  // if (request.nextUrl.pathname.startsWith("/api")) {
  //   try {
  //     await createMongoConnection();
  //   } catch {
  //     return NextResponse.json(
  //       { error: "Database connection failed" },
  //       { status: 500 } // Unauthorized
  //     );
  //   }
  //   // return NextResponse.json(
  //   //   { error: "Unauthorized" },
  //   //   { status: 401 } // Unauthorized
  //   // );
  // }
  // update user's auth session
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
