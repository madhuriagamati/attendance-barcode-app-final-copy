import { prisma } from '@/lib/db';
import { notFound } from 'next/navigation';
import PrintButton from './ui/PrintButton';
export default async function PrintableBarcode({params}:{params:{id:string}}){const s=await prisma.student.findUnique({where:{id:params.id}});if(!s)return notFound();return(<><style>{`@media print{.no-print{display:none;}body{background:white;}}`}</style><div className="bg-white text-black rounded-2xl shadow p-8 max-w-lg w-full mx-auto grid gap-4"><div className="text-center"><div className="text-xl font-semibold">{s.name}</div><div className="text-sm text-gray-600">{s.barcode}</div></div><img src={`/api/barcode/${encodeURIComponent(s.barcode)}`} alt="Barcode" className="w-full"/><div className="no-print flex justify-center"><PrintButton/></div></div></>);} 
