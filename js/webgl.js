/* Moorpankh WebGL: (1) hero image transition with a fabric-ripple shader, (2) floating 3D gold jewellery */
window.MP_GL = (function(){
  const ok = () => { try { const c=document.createElement("canvas"); return !!(window.THREE && (c.getContext("webgl")||c.getContext("experimental-webgl"))); } catch(e){ return false; } };

  /* ---------- HERO: textured plane with wipe + cloth-wave transition ---------- */
  function hero(canvas, urls, onChange){
    if(!ok()) return null;
    const R = new THREE.WebGLRenderer({canvas, antialias:true, alpha:false});
    R.setPixelRatio(Math.min(devicePixelRatio,1.75));
    const scene = new THREE.Scene(), cam = new THREE.OrthographicCamera(-1,1,1,-1,0,1);
    const loader = new THREE.TextureLoader(); loader.crossOrigin="anonymous";
    const tex = urls.map(u=>{ const t=loader.load(u,()=>{ if(!t.image) return; t._size=new THREE.Vector2(t.image.width,t.image.height); u0(); }); t.minFilter=THREE.LinearFilter; t.generateMipmaps=false; return t; });
    const mat = new THREE.ShaderMaterial({
      uniforms:{ t0:{value:tex[0]}, t1:{value:tex[1]||tex[0]}, s0:{value:new THREE.Vector2(1,1)}, s1:{value:new THREE.Vector2(1,1)}, prog:{value:0}, time:{value:0}, res:{value:new THREE.Vector2(1,1)}, mouse:{value:new THREE.Vector2(.5,.5)} },
      vertexShader:"varying vec2 vUv;void main(){vUv=uv;gl_Position=vec4(position,1.);}",
      fragmentShader:`
        precision highp float; varying vec2 vUv;
        uniform sampler2D t0,t1; uniform vec2 s0,s1,res,mouse; uniform float prog,time;
        vec2 cover(vec2 uv, vec2 img, float z){
          float ra=res.x/res.y, ia=img.x/img.y; vec2 s = ra>ia ? vec2(1.,ia/ra) : vec2(ra/ia,1.);
          return ((uv-.5)/z)*s+.5; }
        void main(){
          float wave = sin(vUv.y*10.+time*1.4+vUv.x*4.)*.035*sin(prog*3.14159);
          float wave2 = sin(vUv.y*22.-time*2.)*.012*sin(prog*3.14159);
          float edge = 1.-vUv.y;                 // wipe from the top down, like a drape falling
          float m = smoothstep(0.,.32, prog*1.4 - edge*.7 - vUv.x*.1);
          vec2 d = (mouse-.5)*.012;
          vec2 u0 = cover(vUv+vec2(wave+wave2,wave*.4)+d, s0, 1.04+prog*.1);
          vec2 u1 = cover(vUv-vec2(wave+wave2,wave*.4)+d, s1, 1.14-prog*.1);
          vec4 a = texture2D(t0,u0), b = texture2D(t1,u1);
          vec4 c = mix(a,b,m);
          c.rgb += (1.-abs(m-.5)*2.)*.06*sin(prog*3.14159);  // soft light along the fold
          gl_FragColor = vec4(c.rgb,1.);
        }`
    });
    scene.add(new THREE.Mesh(new THREE.PlaneBufferGeometry(2,2), mat));
    let cur=0, busy=false, raf=0, visible=true, mx=.5,my=.5, tm=0;
    function u0(){ [["t0","s0"],["t1","s1"]].forEach(([t,s])=>{ const x=mat.uniforms[t].value; if(x._size) mat.uniforms[s].value.copy(x._size); }); }
    function size(){ const r=canvas.parentElement.getBoundingClientRect(); R.setSize(r.width,r.height,false); mat.uniforms.res.value.set(r.width,r.height); }
    addEventListener("resize",size); size();
    function go(to){
      if(busy||tex.length<2) return; busy=true;
      mat.uniforms.t0.value=tex[cur]; mat.uniforms.t1.value=tex[to]; u0();
      const o={p:0};
      gsap.to(o,{p:1,duration:1.9,ease:"power2.inOut",onUpdate:()=>mat.uniforms.prog.value=o.p,onComplete:()=>{ cur=to; mat.uniforms.t0.value=tex[cur]; mat.uniforms.prog.value=0; u0(); busy=false; }});
      onChange&&onChange(to);
    }
    const next=()=>go((cur+1)%tex.length);
    const io=new IntersectionObserver(e=>{visible=e[0].isIntersecting},{threshold:0}); io.observe(canvas);
    addEventListener("mousemove",e=>{mx=e.clientX/innerWidth;my=1-e.clientY/innerHeight;});
    (function loop(t){ raf=requestAnimationFrame(loop); if(!visible) return; mat.uniforms.time.value=t/1000;
      mat.uniforms.mouse.value.x+= (mx-mat.uniforms.mouse.value.x)*.05; mat.uniforms.mouse.value.y+=(my-mat.uniforms.mouse.value.y)*.05;
      R.render(scene,cam); })(0);
    return {next, go, count:tex.length, get index(){return cur}};
  }

  /* ---------- JEWELLERY 3D ---------- */
  function jewel(canvas, section){
    if(!ok()) return null;
    const R=new THREE.WebGLRenderer({canvas,antialias:true,alpha:true});
    R.setPixelRatio(Math.min(devicePixelRatio,1.75)); R.toneMapping=THREE.ACESFilmicToneMapping; R.toneMappingExposure=1.15; R.outputEncoding=THREE.sRGBEncoding;
    const scene=new THREE.Scene(); const cam=new THREE.PerspectiveCamera(38,1,.1,100); cam.position.set(0,0,9);

    // studio environment drawn on a canvas so the gold has something to reflect
    const ec=document.createElement("canvas"); ec.width=1024; ec.height=512; const g=ec.getContext("2d");
    const gr=g.createLinearGradient(0,0,0,512); gr.addColorStop(0,"#fff4d6"); gr.addColorStop(.45,"#d49a52"); gr.addColorStop(.55,"#7a4420"); gr.addColorStop(1,"#2a120a");
    g.fillStyle=gr; g.fillRect(0,0,1024,512);
    g.fillStyle="#fff"; [[120,90,170,70],[470,60,220,60],[800,110,150,80]].forEach(r=>g.fillRect(...r));
    g.fillStyle="#ffd9a0"; g.fillRect(0,250,1024,14);
    const eq=new THREE.CanvasTexture(ec); eq.mapping=THREE.EquirectangularReflectionMapping;
    const pm=new THREE.PMREMGenerator(R); const env=pm.fromEquirectangular(eq).texture; scene.environment=env;

    const gold=new THREE.MeshStandardMaterial({color:0xe3a22c,metalness:1,roughness:.26,envMapIntensity:1.4});
    const pearl=new THREE.MeshStandardMaterial({color:0xf3ece0,metalness:.1,roughness:.18,envMapIntensity:1.1});
    const ruby=new THREE.MeshStandardMaterial({color:0x9b0f2a,metalness:.2,roughness:.08,envMapIntensity:1.6});
    scene.add(new THREE.AmbientLight(0xffe7c2,.35)); const dl=new THREE.DirectionalLight(0xffffff,1.2); dl.position.set(3,4,5); scene.add(dl);

    const items=[];
    // pearl-and-gold pendant necklace
    const neck=new THREE.Group(); const N=48;
    for(let i=0;i<N;i++){ const a=Math.PI*(.12+.76*i/(N-1)); const p=new THREE.Mesh(new THREE.SphereGeometry(.085,24,24),i%6===3?gold:pearl); p.position.set(Math.cos(a+Math.PI)*1.5,Math.sin(a+Math.PI)*1.15+.4,0); neck.add(p); }
    const pend=new THREE.Mesh(new THREE.OctahedronGeometry(.28,0),ruby); pend.position.set(0,-.75+.4,0); pend.scale.y=1.4; neck.add(pend);
    const ring=new THREE.Mesh(new THREE.TorusGeometry(.38,.035,24,64),gold); ring.position.copy(pend.position); ring.scale.y=1.4; neck.add(ring);
    neck.position.set(3.3,1.9,0); items.push({o:neck,s:.5,f:.8,r:.35,ph:0});
    // interlocked gold bangles
    const bang=new THREE.Group();
    [[0,0,0],[.9,.6,.5],[-.9,-.5,.9]].forEach((r,i)=>{ const t=new THREE.Mesh(new THREE.TorusGeometry(.95,.1,32,96),gold); t.rotation.set(r[0]+i*.9,r[1],r[2]); bang.add(t); });
    bang.position.set(3.9,-1.5,0); items.push({o:bang,s:.7,f:.6,r:.5,ph:2});
    // jhumka earring (lathe bell + bead drops)
    function jhumka(){ const gp=new THREE.Group(); const pts=[]; for(let i=0;i<=20;i++){ const t=i/20; pts.push(new THREE.Vector2(Math.sin(t*Math.PI*.95)*.55*(1-.25*t),(1-t)*.9)); }
      const bell=new THREE.Mesh(new THREE.LatheGeometry(pts,48),gold); bell.rotation.x=Math.PI; bell.position.y=-.2; gp.add(bell);
      for(let i=0;i<14;i++){ const a=i/14*Math.PI*2; const b=new THREE.Mesh(new THREE.SphereGeometry(.045,12,12),pearl); b.position.set(Math.cos(a)*.5,-1.1,Math.sin(a)*.5); gp.add(b); }
      const cap=new THREE.Mesh(new THREE.SphereGeometry(.2,24,24),gold); cap.position.y=.78; gp.add(cap);
      const st=new THREE.Mesh(new THREE.SphereGeometry(.09,16,16),ruby); st.position.y=.98; gp.add(st); return gp; }
    const j1=jhumka(); j1.position.set(1.7,-2.4,1); items.push({o:j1,s:.75,f:1.0,r:.6,ph:1});
    const j2=jhumka(); j2.position.set(1.4,2.3,-.5); j2.scale.setScalar(.7); items.push({o:j2,s:.6,f:.9,r:-.5,ph:3});
    items.forEach(i=>{ i.base=i.o.position.clone(); i.o.scale.multiplyScalar(i.s); scene.add(i.o); });

    let mx=0,my=0,scroll=0,visible=false,w=1,h=1;
    function size(){ w=innerWidth; h=innerHeight; R.setSize(w,h,false); cam.aspect=w/h; cam.fov=w<700?52:38; cam.updateProjectionMatrix(); }
    addEventListener("resize",size); size();
    addEventListener("mousemove",e=>{mx=e.clientX/innerWidth-.5;my=e.clientY/innerHeight-.5});
    new IntersectionObserver(e=>visible=e[0].isIntersecting).observe(section);
    addEventListener("scroll",()=>{const r=section.getBoundingClientRect(); scroll=-r.top/ (r.height+innerHeight)*6;},{passive:true});
    (function loop(t){ requestAnimationFrame(loop); if(!visible) return; t/=1000;
      items.forEach(i=>{ i.o.position.y=i.base.y+Math.sin(t*i.f+i.ph)*.18+scroll*.15*i.s; i.o.rotation.y=t*i.r*.6+mx*1.2+scroll*i.r; i.o.rotation.x=Math.sin(t*.4+i.ph)*.25+my*.6; });
      cam.position.x+=(mx*1.1-cam.position.x)*.04; cam.position.y+=(-my*.8-cam.position.y)*.04; cam.lookAt(0,0,0);
      R.render(scene,cam); })(0);
    return true;
  }
  return {hero, jewel, ok};
})();
