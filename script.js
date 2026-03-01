/* ═══════════════════════════════════════════
   AYUSHMAN DALVI PORTFOLIO — script.js
═══════════════════════════════════════════ */

// ─── CANVAS PARTICLE BACKGROUND ───
(function initCanvas() {
    const canvas = document.getElementById('bg-canvas');
    const ctx = canvas.getContext('2d');
    let W, H, particles = [], animId;

    function resize() {
        W = canvas.width = window.innerWidth;
        H = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    class Particle {
        constructor() { this.reset(true); }
        reset(init) {
            this.x = Math.random() * W;
            this.y = init ? Math.random() * H : H + 10;
            this.r = Math.random() * 1.5 + 0.4;
            this.vx = (Math.random() - 0.5) * 0.3;
            this.vy = -(Math.random() * 0.5 + 0.2);
            this.alpha = Math.random() * 0.5 + 0.15;
            const palette = ['#6366f1', '#a855f7', '#22d3ee', '#818cf8'];
            this.color = palette[Math.floor(Math.random() * palette.length)];
        }
        update() {
            this.x += this.vx;
            this.y += this.vy;
            if (this.y < -5) this.reset(false);
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.globalAlpha = this.alpha;
            ctx.fill();
        }
    }

    for (let i = 0; i < 120; i++) particles.push(new Particle());

    function drawConnections() {
        ctx.globalAlpha = 1;
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 100) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(99,102,241,${0.06 * (1 - dist / 100)})`;
                    ctx.lineWidth = 0.6;
                    ctx.stroke();
                }
            }
        }
    }

    function loop() {
        ctx.clearRect(0, 0, W, H);
        particles.forEach(p => { p.update(); p.draw(); });
        drawConnections();
        ctx.globalAlpha = 1;
        animId = requestAnimationFrame(loop);
    }
    loop();
})();


// ─── CURSOR GLOW ───
const cursorGlow = document.getElementById('cursor-glow');
document.addEventListener('mousemove', e => {
    cursorGlow.style.left = e.clientX + 'px';
    cursorGlow.style.top = e.clientY + 'px';
});


// ─── NAVBAR SCROLL ───
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
    updateActiveNav();
});


// ─── HAMBURGER MENU ───
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');
hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    const spans = hamburger.querySelectorAll('span');
    hamburger.classList.toggle('active');
    if (hamburger.classList.contains('active')) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
        spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    }
});
navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        hamburger.classList.remove('active');
        hamburger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    });
});


// ─── ACTIVE NAV LINK ───
const sections = document.querySelectorAll('section[id]');
function updateActiveNav() {
    const scrollY = window.scrollY;
    sections.forEach(sec => {
        const top = sec.offsetTop - 100;
        const bottom = top + sec.offsetHeight;
        const link = document.querySelector(`.nav-link[href="#${sec.id}"]`);
        if (link) {
            link.classList.toggle('active', scrollY >= top && scrollY < bottom);
        }
    });
}


// ─── TYPEWRITER EFFECT ───
const roles = [
    'scalable backends.',
    'desktop applications.',
    'AI-powered tools.',
    'REST APIs.',
    'automation systems.',
    'real-world solutions.'
];
let roleIdx = 0, charIdx = 0, deleting = false;
const typedEl = document.getElementById('typed-text');

function typewrite() {
    const current = roles[roleIdx];
    if (!deleting) {
        typedEl.textContent = current.substring(0, charIdx + 1);
        charIdx++;
        if (charIdx === current.length) {
            deleting = true;
            setTimeout(typewrite, 2200);
            return;
        }
    } else {
        typedEl.textContent = current.substring(0, charIdx - 1);
        charIdx--;
        if (charIdx === 0) {
            deleting = false;
            roleIdx = (roleIdx + 1) % roles.length;
        }
    }
    setTimeout(typewrite, deleting ? 50 : 80);
}
typewrite();


// ─── COUNTER ANIMATION ───
function animateCounter(el) {
    const target = parseInt(el.dataset.target);
    let current = 0;
    const step = Math.max(1, Math.ceil(target / 60));
    const timer = setInterval(() => {
        current = Math.min(current + step, target);
        el.textContent = current;
        if (current >= target) clearInterval(timer);
    }, 25);
}

// ─── SCROLL REVEAL ───
const revealEls = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
const counters = document.querySelectorAll('.stat-number');
let countersStarted = false;

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

revealEls.forEach(el => observer.observe(el));

// Counter observer
const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !countersStarted) {
            countersStarted = true;
            counters.forEach(animateCounter);
        }
    });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) counterObserver.observe(heroStats);


// ─── CODE CARD 3D TILT ───
const codeCard = document.getElementById('code-card');
if (codeCard) {
    codeCard.addEventListener('mousemove', e => {
        const rect = codeCard.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        codeCard.style.transform = `perspective(800px) rotateX(${-y * 8}deg) rotateY(${x * 8}deg) translateY(-8px)`;
    });
    codeCard.addEventListener('mouseleave', () => {
        codeCard.style.transform = '';
    });
}


// ─── SMOOTH SCROLL FOR NAV ───
document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
        const target = document.querySelector(link.getAttribute('href'));
        if (target) {
            e.preventDefault();
            const offset = 80;
            const top = target.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({ top, behavior: 'smooth' });
        }
    });
});


// ─── CONTACT FORM ───
function handleFormSubmit(e) {
    e.preventDefault();
    const btn = document.getElementById('submit-btn');
    const successMsg = document.getElementById('form-success');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    btn.disabled = true;
    setTimeout(() => {
        btn.innerHTML = originalText;
        btn.disabled = false;
        successMsg.classList.remove('hidden');
        e.target.reset();
        setTimeout(() => successMsg.classList.add('hidden'), 5000);
    }, 1500);
}


// ─── PROJECT CARD HOVER GLOW ───
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const glow = card.querySelector('.project-glow');
        if (glow) {
            glow.style.left = (x - 125) + 'px';
            glow.style.top = (y - 125) + 'px';
        }
    });
});


// ─── SKILL PILL HOVER RIPPLE ───
document.querySelectorAll('.skill-pill').forEach(pill => {
    pill.addEventListener('click', e => {
        const ripple = document.createElement('span');
        ripple.style.cssText = `
      position:absolute; border-radius:50%;
      width:60px; height:60px;
      background:rgba(255,255,255,0.15);
      transform:translate(-50%,-50%) scale(0);
      animation:ripple-anim 0.5s linear;
      left:${e.offsetX}px; top:${e.offsetY}px;
      pointer-events:none;
    `;
        pill.style.position = 'relative';
        pill.style.overflow = 'hidden';
        pill.appendChild(ripple);
        setTimeout(() => ripple.remove(), 500);
    });
});

// Add ripple animation
const style = document.createElement('style');
style.textContent = `
  @keyframes ripple-anim {
    to { transform: translate(-50%,-50%) scale(3); opacity: 0; }
  }
`;
document.head.appendChild(style);


// ─── STAGGER ANIMATION FOR SKILLS ───
document.querySelectorAll('.skill-pill').forEach((pill, i) => {
    pill.style.transitionDelay = (i * 0.04) + 's';
});


// ─── PAGE LOAD ENTRANCE ───
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            document.body.style.opacity = '1';
        });
    });
    // Trigger immediate reveals for hero section
    setTimeout(() => {
        document.querySelectorAll('.hero .reveal-up, .hero .reveal-left, .hero .reveal-right').forEach(el => {
            el.classList.add('visible');
        });
    }, 100);
});


// ─── CONSOLE EASTER EGG ───
console.log('%c👋 Hey! Welcome to Ayushman Dalvi\'s portfolio!', 'color:#6366f1; font-size:16px; font-weight:bold;');
console.log('%c🚀 Built with passion using HTML, CSS & Vanilla JS', 'color:#a855f7; font-size:12px;');
console.log('%c📧 Reach out: ayushman1452004@gmail.com', 'color:#22d3ee; font-size:12px;');
