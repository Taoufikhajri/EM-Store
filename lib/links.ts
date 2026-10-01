export const isValidToken=(token:string)=>/^AQCpiI[A-Za-z0-9_\-=]+$/.test(token)&&token.length<=4096;
export type Row = {id:number; original:string; token:string; status:'queued'|'refreshing'|'success'|'invalid'|'error'; url?:string; message?:string};
export function parseLinks(text:string) {
 const seen=new Set<string>(); let duplicates=0;
 const rows:Row[]=text.split(/\r?\n/).map(x=>x.trim()).filter(Boolean).map((original,id)=>{
  let token=original;
  if (/^https?:/i.test(original)) {try {const u=new URL(original); if(u.protocol!=='https:'||u.hostname!=='serviceactivation.google.com'||!u.pathname.startsWith('/subscription/new/')) throw Error();token=decodeURIComponent(u.pathname.slice('/subscription/new/'.length));}catch {token='';}}
  const valid=isValidToken(token);
  return {id:id+1,original,token,status:valid?'queued':'invalid',message:valid?undefined:'Not a Google activation link or token'} as Row;
 }).filter(row=>{if(row.token&&seen.has(row.token)){duplicates++;return false;}if(row.token)seen.add(row.token);return true;});
 return {rows,duplicates};
}
