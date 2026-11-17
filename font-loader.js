/* Load the identity typeface independently of the gallery and other UI code. */
(function(){
  const family='AdimAlexandria';
  function status(ok){
    document.documentElement.dataset.font=ok?'alexandria-loaded':'font-load-failed';
    const paint=()=>{const label=document.getElementById('font-status');if(label){label.textContent=ok?'Alexandria ✓':'FONT NOT LOADED';label.dataset.loaded=String(ok);}};
    if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',paint,{once:true});else paint();
  }
  window.adimFontReady=(async()=>{
    try{
      if(!('FontFace' in window)||!document.fonts){status(false);return false;}
      let source;
      if(window.ADIM_FONT){
        const binary=atob(window.ADIM_FONT),bytes=new Uint8Array(binary.length);
        for(let i=0;i<binary.length;i++)bytes[i]=binary.charCodeAt(i);
        source=bytes.buffer;
      }else source='url("assets/Alexandria.ttf")';
      const face=new FontFace(family,source,{weight:'100 900',style:'normal',display:'block'});
      await face.load();document.fonts.add(face);
      await document.fonts.load('400 18px "'+family+'"','أديم العمران Adim Alumran');
      const loaded=face.status==='loaded'&&document.fonts.check('400 18px "'+family+'"','أديم العمران');
      status(loaded);return loaded;
    }catch(error){status(false);console.error('Adim brand font could not load.',error);return false;}
  })();
})();
