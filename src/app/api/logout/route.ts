import { cookies } from 'next/headers';
export async function POST(){cookies().set('admin','',{path:'/',maxAge:0});return new Response('ok');}
