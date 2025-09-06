// import { auth } from '@/lib/auth';
// import { betterAuth } from 'better-auth';

// const handler = betterAuth(auth.handler);

// export { handler as GET, handler as POST };

// export async function generateStaticParams() {
//   return [
//     { email: 'sign-up' },
//   ];
// }


import { auth } from "@/lib/auth";

async function handler(request: Request) {
  return auth.handler(request);
}

export const GET = handler;
export const POST = handler;

export async function generateStaticParams() {
  return [
    { email: "sign-up" },
  ];
}
