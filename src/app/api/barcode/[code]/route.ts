import type { NextRequest } from 'next/server';
import bwipjs from '@bwip-js/node';
export async function GET(_req:NextRequest,{params}:{params:{code:string}}){try{const png=await bwipjs.toBuffer({bcid:'code128',text:decodeURIComponent(params.code),height:10,scale:3,includetext:true,textxalign:'center'});return new Response(png,{headers:{'Content-Type':'image/png'}});}catch(e){return new Response('error',{status:500});}}
