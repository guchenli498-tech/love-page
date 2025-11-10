(() => {
	'use strict';

	const root = document.documentElement;
	const canvas = document.getElementById('loveCanvas');
	if (!canvas) {
		console.error('Canvas element #loveCanvas not found.');
		return;
	}
	const ctx = canvas.getContext('2d');
	if (!ctx) {
		console.error('2D context not available.');
		return;
	}
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

	// 目标文案
	const phrase = '杨淇超我爱你';

	// 主题持久化
	const persisted = localStorage.getItem('love-theme');
	if (persisted === 'light') root.setAttribute('data-theme', 'light');
	toggleTheme.addEventListener('click', () => {
		const isLight = root.getAttribute('data-theme') === 'light';
		if (isLight) {
			root.removeAttribute('data-theme');
			localStorage.setItem('love-theme', 'dark');
		} else {
			root.setAttribute('data-theme', 'light');
			localStorage.setItem('love-theme', 'light');
		}
	});

	// 打字机效果
	async function typeText(text) {
		typeTarget.textContent = '';
		for (let i = 0; i < text.length; i++) {
			typeTarget.textContent += text[i];
			await new Promise(r => setTimeout(r, 160 + Math.random() * 60));
		}
	}

	// 画布自适应
	function resize() {
		const { width, height } = canvas.getBoundingClientRect();
		const dpr = Math.min(2, window.devicePixelRatio || 1);
		canvas.width = Math.floor(width * dpr);
		canvas.height = Math.floor(height * dpr);
		ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
	}
	if (typeof ResizeObserver !== 'undefined') {
		const ro = new ResizeObserver(resize);
		ro.observe(canvas);
	} else {
		window.addEventListener('resize', resize);
	}
	resize();

	// 粒子系统
	class Particle {
		constructor(x, y, vx, vy, life, color, size, shape = 'heart') {
			this.x = x; this.y = y;
			this.vx = vx; this.vy = vy;
			this.life = life; this.maxLife = life;
			this.color = color; this.size = size;
			this.shape = shape;
		}
		update(dt) {
			this.vy += 400 * dt * 0.001; // 重力
			this.x += this.vx * dt * 0.001;
			this.y += this.vy * dt * 0.001;
			this.life -= dt;
		}
		draw(ctx) {
			const t = Math.max(0, this.life / this.maxLife);
			ctx.save();
			ctx.globalAlpha = Math.pow(t, 1.5);
			ctx.translate(this.x, this.y);
			ctx.rotate((1 - t) * 0.6);
			if (this.shape === 'heart') {
				drawHeart(ctx, this.size, this.color);
			} else {
				ctx.fillStyle = this.color;
				ctx.beginPath();
				ctx.arc(0, 0, this.size, 0, Math.PI * 2);
				ctx.fill();
			}
			ctx.restore();
		}
	}

	function drawHeart(ctx, s, color) {
		ctx.fillStyle = color;
		ctx.beginPath();
		// 心形近似贝塞尔路径
		ctx.moveTo(0, -0.3 * s);
		ctx.bezierCurveTo(0.5 * s, -1.1 * s, 1.6 * s, -0.1 * s, 0, 1.15 * s);
		ctx.bezierCurveTo(-1.6 * s, -0.1 * s, -0.5 * s, -1.1 * s, 0, -0.3 * s);
		ctx.closePath();
		ctx.fill();
	}

	const particles = [];
	let last = performance.now();
	function loop(now) {
		const dt = Math.min(32, now - last);
		last = now;
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		for (let i = particles.length - 1; i >= 0; i--) {
			const p = particles[i];
			p.update(dt);
			p.draw(ctx);
			if (p.life <= 0) particles.splice(i, 1);
		}
		requestAnimationFrame(loop);
	}
	requestAnimationFrame(loop);

	function burst(x, y, amount = 80) {
		const palette = ['#ff4d9d', '#ff7aa2', '#ffd166', '#9d7dff', '#30ffa3'];
		for (let i = 0; i < amount; i++) {
			const a = Math.random() * Math.PI * 2;
			const speed = 120 + Math.random() * 420;
			const vx = Math.cos(a) * speed;
			const vy = Math.sin(a) * speed - 200;
			const life = 900 + Math.random() * 600;
			const color = palette[Math.floor(Math.random() * palette.length)];
			const size = 3 + Math.random() * 8;
			particles.push(new Particle(x, y, vx, vy, life, color, size, 'heart'));
		}
	}

	// 点击撒爱心（全局），canvas 置顶且不拦截事件
	document.addEventListener('pointerdown', (e) => {
		const rect = canvas.getBoundingClientRect();
		burst(e.clientX - rect.left, e.clientY - rect.top, 120);
	}, { passive: true });
	burstBtn.addEventListener('click', () => {
		const rect = canvas.getBoundingClientRect();
		burst(rect.width * 0.5, rect.height * 0.55, 160);
	});

	// ===== 恋爱时长计时 =====
	function readStartDate() {
		let iso = localStorage.getItem('love-start-date');
		if (!iso) {
			// 若用户未设置，则以“当前日期 - 198 天”为默认起始
			const now = new Date();
			const startMs = now.getTime() - 198 * 24 * 60 * 60 * 1000;
			const d = new Date(startMs);
			iso = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}T00:00:00`;
			localStorage.setItem('love-start-date', iso);
		}
		return iso;
	}
	function setStartDate(isoDate) {
		localStorage.setItem('love-start-date', isoDate);
	}
	function formatDateCHN(d) {
		return `${d.getFullYear()}年${String(d.getMonth()+1).padStart(2,'0')}月${String(d.getDate()).padStart(2,'0')}日`;
	}
	function updateCounter() {
		const iso = readStartDate();
		const start = new Date(iso);
		const now = new Date();
		let diff = Math.max(0, now.getTime() - start.getTime());
		const dayMs = 24*60*60*1000;
		const days = Math.floor(diff / dayMs);
		diff -= days * dayMs;
		const hours = Math.floor(diff / (60*60*1000));
		diff -= hours * 60*60*1000;
		const minutes = Math.floor(diff / (60*1000));
		diff -= minutes * 60*1000;
		const seconds = Math.floor(diff / 1000);
		cDaysEl.textContent = String(days);
		cHoursEl.textContent = String(hours).padStart(2,'0');
		cMinutesEl.textContent = String(minutes).padStart(2,'0');
		cSecondsEl.textContent = String(seconds).padStart(2,'0');
		startDateTextEl.textContent = formatDateCHN(start);
	}
	// 初始化 counter
	updateCounter();
	setInterval(updateCounter, 1000);
	// 设置起始日交互
	setStartBtn.addEventListener('click', () => {
		const iso = readStartDate();
		const [dateOnly] = iso.split('T');
		startDateInput.value = dateOnly;
		startDateInput.onchange = () => {
			if (startDateInput.value) {
				setStartDate(`${startDateInput.value}T00:00:00`);
				updateCounter();
				const rect = canvas.getBoundingClientRect();
				burst(rect.width * 0.5, rect.height * 0.55, 160);
			}
		};
		startDateInput.click();
	});

	// 初始动效
	typeText(phrase).then(() => {
		const rect = canvas.getBoundingClientRect();
		burst(rect.width * 0.5, rect.height * 0.6, 120);
	});
})(); 


