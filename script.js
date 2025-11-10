(() => {
	const root = document.documentElement;
	const canvas = document.getElementById('loveCanvas');
	if (!canvas) return;
	const ctx = canvas.getContext('2d');
	if (!ctx) return;
  
	const typeTarget = document.getElementById('typeTarget');
	const burstBtn = document.getElementById('burstBtn');
	const toggleTheme = document.getElementById('toggleTheme');
	const setStartBtn = document.getElementById('setStartBtn');
	const startDateInput = document.getElementById('startDateInput');
	const cDaysEl = document.getElementById('cDays');
	const cHoursEl = document.getElementById('cHours');
	const cMinutesEl = document.getElementById('cMinutes');
	const cSecondsEl = document.getElementById('cSeconds');
	const startDateTextEl = document.getElementById('startDateText');
  
	const phrase = '杨淇超我爱你';
  
	// 主题切换
	const persisted = localStorage.getItem('love-theme');
	if (persisted === 'light') root.setAttribute('data-theme','light');
	toggleTheme.addEventListener('click', ()=>{
	  const isLight = root.getAttribute('data-theme')==='light';
	  if(isLight){ root.removeAttribute('data-theme'); localStorage.setItem('love-theme','dark'); }
	  else{ root.setAttribute('data-theme','light'); localStorage.setItem('love-theme','light'); }
	});
  
	// 打字机
	async function typeText(text){
	  typeTarget.textContent='';
	  for(let i=0;i<text.length;i++){
		typeTarget.textContent+=text[i];
		await new Promise(r=>setTimeout(r,160+Math.random()*60));
	  }
	}
  
	// canvas 自适应
	function resize(){
	  const {width,height} = canvas.getBoundingClientRect();
	  const dpr = Math.min(2, window.devicePixelRatio||1);
	  canvas.width = Math.floor(width*dpr);
	  canvas.height = Math.floor(height*dpr);
	  ctx.setTransform(dpr,0,0,dpr,0,0);
	}
	if(typeof ResizeObserver!=='undefined'){
	  const ro = new ResizeObserver(resize);
	  ro.observe(canvas);
	}else window.addEventListener('resize',resize);
	resize();
  
	// 粒子系统
	class Particle{
	  constructor(x,y,vx,vy,life,color,size,shape='heart'){
		Object.assign(this,{x,y,vx,vy,life,maxLife:life,color,size,shape});
	  }
	  update(dt){ this.vy+=400*dt*0.001; this.x+=this.vx*dt*0.001; this.y+=this.vy*dt*0.001; this.life-=dt; }
	  draw(ctx){
		const t=Math.max(0,this.life/this.maxLife);
		ctx.save();
		ctx.globalAlpha=Math.pow(t,1.5);
		ctx.translate(this.x,this.y);
		ctx.rotate((1-t)*0.6);
		if(this.shape==='heart'){ drawHeart(ctx,this.size,this.color);}
		else{ctx.fillStyle=this.color;ctx.beginPath();ctx.arc(0,0,this.size,0,Math.PI*2);ctx.fill();}
		ctx.restore();
	  }
	}
  
	function drawHeart(ctx,s,color){
	  ctx.fillStyle=color;
	  ctx.beginPath();
	  ctx.moveTo(0,-0.3*s);
	  ctx.bezierCurveTo(0.5*s,-1.1*s,1.6*s,-0.1*s,0,1.15*s);
	  ctx.bezierCurveTo(-1.6*s,-0.1*s,-0.5*s,-1.1*s,0,-0.3*s);
	  ctx.closePath();
	  ctx.fill();
	}
  
	const particles=[];
	let last=performance.now();
	function loop(now){
	  const dt=Math.min(32,now-last);
	  last=now;
	  ctx.clearRect(0,0,canvas.width,canvas.height);
	  for(let i=particles.length-1;i>=0;i--){
		const p=particles[i];
		p.update(dt);
		p.draw(ctx);
		if(p.life<=0) particles.splice(i,1);
	  }
	  requestAnimationFrame(loop);
	}
	requestAnimationFrame(loop);
  
	function burst(x,y,amount=80){
	  const palette=['#ff4d9d','#ff7aa2','#ffd166','#9d7dff','#30ffa3'];
	  for(let i=0;i<amount;i++){
		const a=Math.random()*Math.PI*2;
		const speed=120+Math.random()*420;
		const vx=Math.cos(a)*speed;
		const vy=Math.sin(a)*speed-200;
		const life=900+Math.random()*600;
		const color=palette[Math.floor(Math.random()*palette.length)];
		const size=3+Math.random()*8;
		particles.push(new Particle(x,y,vx,vy,life,color,size,'heart'));
	  }
	}
  
	document.addEventListener('pointerdown',(e)=>{
	  const rect=canvas.getBoundingClientRect();
	  burst(e.clientX-rect.left,e.clientY-rect.top,120);
	},{passive:true});
	burstBtn.addEventListener('click',()=>{
	  const rect=canvas.getBoundingClientRect();
	  burst(rect.width*0.5,rect.height*0.55,160);
	});
  
	// ==== 计时器 ====
	function readStartDate(){
	  // 默认纪念日
	  return localStorage.getItem('loveStartDate') || '2025-05-02';
	}
	function setStartDate(iso){ localStorage.setItem('loveStartDate',iso); }
	function formatDateCHN(d){ return `${d.getFullYear()}年${String(d.getMonth()+1).padStart(2,'0')}月${String(d.getDate()).padStart(2,'0')}日`; }
  
	function updateCounter(){
	  const iso=readStartDate();
	  const start=new Date(iso);
	  startDateTextEl.textContent=formatDateCHN(start);
	  const now=new Date();
	  const diff=Math.max(0,now-start);
	  const s=Math.floor(diff/1000);
	  const days=Math.floor(s/86400);
	  const hours=Math.floor((s%86400)/3600);
	  const minutes=Math.floor((s%3600)/60);
	  const seconds=s%60;
	  cDaysEl.textContent=days;
	  cHoursEl.textContent=String(hours).padStart(2,'0');
	  cMinutesEl.textContent=String(minutes).padStart(2,'0');
	  cSecondsEl.textContent=String(seconds).padStart(2,'0');
	}
  
	setInterval(updateCounter,1000);
	updateCounter();
  
	setStartBtn.addEventListener('click',()=>{
	  startDateInput.click();
	});
	startDateInput.addEventListener('change',()=>{
	  if(startDateInput.value){
		setStartDate(startDateInput.value);
		updateCounter();
	  }
	});
  
	typeText(phrase);
  
 })();
  