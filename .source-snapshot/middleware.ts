import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const GTM_CONTAINER_ID = process.env.NEXT_PUBLIC_GTM_ID || "GTM-WWBXMJK";
const GTM_ENV = process.env.GTM_ENV || "prod";

const GTM_HEAD_SNIPPET = `<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_CONTAINER_ID}');</script>
<!-- End Google Tag Manager -->`;

const GTM_BODY_SNIPPET = `<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=${GTM_CONTAINER_ID}"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->`;

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Only inject GTM on HTML responses
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("text/html")) {
    // We'll handle this via the layout.tsx instead for static export compatibility
    // This middleware approach works for dynamic routes
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};