import { NextRequest, NextResponse } from 'next/server';
export const config={matcher:['/admin','/admin/:path*']};
export default function middleware(req:NextRequest){const admin=req.cookies.get('admin')?.value;if(admin==='1')return NextResponse.next();const url=req.nextUrl.clone();url.pathname='/login';return NextResponse.redirect(url);} 
