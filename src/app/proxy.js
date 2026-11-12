import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "./lib/auth";


// This function can be marked `async` if using `await` inside
export async function proxy(request) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  console.log("Session in proxy:", session);
  const user = session?.user;
  if (!user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: ["/add-data" , "/get-data"],
};