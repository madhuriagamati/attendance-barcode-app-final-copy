import { cookies } from 'next/headers';
export async function POST(req: Request){const { password } = await req.json();const ok=password&&process.env.OWNER_PASSWORD&&password===process.env.OWNER_PASSWORD;if(!ok)return new Response('Unauthorized',{status:401});cookies().set('admin','1',{httpOnly:true,sameSite:'lax',path:'/'});return new Response('ok');}
