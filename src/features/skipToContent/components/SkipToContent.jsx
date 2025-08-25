export default function SkipToContent(){
  return (
    <a href="#main" style={{
      position:'absolute', left:-9999, top:-9999
    }} onFocus={(e)=>{ e.target.style.left='8px'; e.target.style.top='8px'; }}>
      Saltar al contenido
    </a>
  );
}
