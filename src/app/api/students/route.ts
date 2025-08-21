import { prisma } from '@/lib/db';
export async function GET(){const students=await prisma.student.findMany({orderBy:{name:'asc'}});return Response.json(students);} 
export async function POST(req:Request){const body=await req.json();try{const s=await prisma.student.create({data:{name:body.name,barcode:body.barcode,email1:body.email1||null,email2:body.email2||null,grade:body.grade||null}});return Response.json(s);}catch(e:any){return new Response(e?.message||'Error',{status:400});}}
