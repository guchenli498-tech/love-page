// 更新倒计时函数
function updateCountdown() {
    const startDate = new Date('2025-05-02');
    const now = new Date();
    const diff = now - startDate;

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    document.getElementById('days').textContent = days.toString().padStart(2, '0');
    document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
    document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
    document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
}

// 打字机效果
function typeWriter() {
    const text = "杨淇超我爱你"; 
    const element = document.getElementById('typing-text');
    element.innerHTML = ''; // 清空之前的内容
    let i = 0;
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, 200);
        }
    }
    type();
}

// 心形粒子效果
function createHeartParticles(event) {
    const heart = document.createElement('div');
    heart.classList.add('heart');
    heart.style.left = `${event.clientX}px`;
    heart.style.top = `${event.clientY}px`;
    document.body.appendChild(heart);
    
    setTimeout(() => {
        heart.remove();
    }, 1000);
}

// 主题切换
function toggleTheme() {
    document.body.classList.toggle('dark-theme');
    localStorage.setItem('theme', document.body.classList.contains('dark-theme') ? 'dark' : 'light');
}

// 页面加载时初始化
document.addEventListener('DOMContentLoaded', () => {
    // 检查之前保存的主题
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
    }

    // 立即执行一次，之后每秒更新
    updateCountdown();
    typeWriter();
    
    // 每秒更新倒计时
    setInterval(updateCountdown, 1000);

    // 添加事件监听器
    document.getElementById('heart-btn').addEventListener('click', createHeartParticles);
    document.getElementById('theme-toggle').addEventListener('click', toggleTheme);
    document.body.addEventListener('click', createHeartParticles);
});
  