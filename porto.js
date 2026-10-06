// === 1. EFEK CANVAS BACKGROUND INTERAKTIF & BINTANG RGB ===
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

const gridSize = 50; 
const mouseColors = ['#38bdf8', '#818cf8', '#c084fc', '#e879f9', '#2dd4bf']; 
const activePixels = [];
const maxMousePixels = 7; 
const fadeDuration = 3000; 

// Konfigurasi Bintang (Pixel Acak)
const maxStars = 50; 
const starFadeDuration = 4000; 

let lastCellX = -1;
let lastCellY = -1;


document.addEventListener('mousemove', (e) => {
    const cellX = Math.floor(e.clientX / gridSize) * gridSize;
    const cellY = Math.floor(e.clientY / gridSize) * gridSize;

    if (cellX !== lastCellX || cellY !== lastCellY) {
        lastCellX = cellX;
        lastCellY = cellY;

        const color = mouseColors[Math.floor(Math.random() * mouseColors.length)];
        
        activePixels.push({
            x: cellX,
            y: cellY,
            color: color,
            createdAt: Date.now(),
            isStar: false
        });

        const mousePixels = activePixels.filter(p => !p.isStar);
        if (mousePixels.length > maxMousePixels) {
            const oldestMouseIdx = activePixels.findIndex(p => !p.isStar);
            if (oldestMouseIdx > -1) activePixels.splice(oldestMouseIdx, 1);
        }
    }
});


function spawnStar() {
    const currentStars = activePixels.filter(p => p.isStar).length;
    
    // Peluang 40% per frame untuk memunculkan bintang baru jika kuota belum penuh
    if (currentStars < maxStars && Math.random() < 0.4) { 
        const cellX = Math.floor(Math.random() * (canvas.width / gridSize)) * gridSize;
        const cellY = Math.floor(Math.random() * (canvas.height / gridSize)) * gridSize;
        
        // Generate warna RGB acak sepenuhnya
        const r = Math.floor(Math.random() * 256);
        const g = Math.floor(Math.random() * 256);
        const b = Math.floor(Math.random() * 256);
        const randomColor = `rgb(${r}, ${g}, ${b})`;

        // Cek agar tidak menimpa pixel yang sedang aktif di kordinat yang sama
        const isOccupied = activePixels.some(p => p.x === cellX && p.y === cellY);
        
        if (!isOccupied) {
            activePixels.push({
                x: cellX,
                y: cellY,
                color: randomColor,
                createdAt: Date.now(),
                isStar: true
            });
        }
    }
}

function animatePixels() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const now = Date.now();

    spawnStar(); // Jalankan fungsi pembuat bintang

    for (let i = activePixels.length - 1; i >= 0; i--) {
        const p = activePixels[i];
        const duration = p.isStar ? starFadeDuration : fadeDuration;
        const age = now - p.createdAt;
        
        if (age >= duration) {
            activePixels.splice(i, 1);
            continue;
        }

        let opacity = 1 - (age / duration);
        
        // Bintang berkedip: memudar masuk (fade-in) lalu memudar keluar (fade-out)
        if (p.isStar) {
            opacity = age < duration / 2 
                ? (age / (duration / 2)) 
                : (1 - ((age - duration / 2) / (duration / 2)));
        }

        ctx.fillStyle = p.color;
        ctx.globalAlpha = opacity * 0.4; 
        ctx.fillRect(p.x, p.y, gridSize, gridSize);
        
        ctx.shadowBlur = p.isStar ? 25 : 15; // Efek glow bintang sedikit lebih besar
        ctx.shadowColor = p.color;
        ctx.globalAlpha = opacity * 0.7;
        ctx.fillRect(p.x, p.y, gridSize, gridSize);
        ctx.shadowBlur = 0; 
    }
    
    ctx.globalAlpha = 1.0;
    requestAnimationFrame(animatePixels);
}
animatePixels();

// === 2. Logika Preloader ===
const greetings = ["Hello.", "هالو.", "こんにちは.", "Bonjour.", "Hola.", "Ciao.", "안녕하세요.", "ฮาโล.", "Привет.", "你好."];
const preloaderText = document.getElementById('preloader-text');
const preloader = document.getElementById('preloader');
const navbar = document.getElementById('navbar');
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function typePreloader() {
    await sleep(900); 
    for (let word of greetings) {
        for (let i = 0; i <= word.length; i++) { preloaderText.textContent = word.substring(0, i); await sleep(45); }
        await sleep(250);
        for (let i = word.length; i >= 0; i--) { preloaderText.textContent = word.substring(0, i); await sleep(20); }
        await sleep(100);
    }
    preloader.style.opacity = '0';
    setTimeout(() => { 
        preloader.style.display = 'none'; 
        navbar.classList.add('visible'); 
        setTimeout(typeMainTitle, 400); 
    }, 1000); 
}
window.addEventListener('load', typePreloader);

// === 3. Typing Title Home ===
const titleStr = "Science";
const titleEl = document.getElementById('typing-title');
let titleIndex = 0;
function typeMainTitle() { 
    if (titleIndex < titleStr.length) { 
        titleEl.textContent += titleStr.charAt(titleIndex); 
        titleIndex++; 
        setTimeout(typeMainTitle, 100); 
    } 
}

// === 4. Animasi Pendulum Terintegrasi ===
const pendulum = document.getElementById('pendulum-container');
if (window.matchMedia("(min-width: 768px)").matches) {
    document.querySelector('.hero-right').addEventListener('mousemove', (e) => {
        const rect = pendulum.getBoundingClientRect();
        const x = e.clientX - rect.left; 
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2; 
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -10; 
        const rotateY = ((x - centerX) / centerX) * 15;
        pendulum.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    document.querySelector('.hero-right').addEventListener('mouseleave', () => { 
        pendulum.style.transform = `perspective(1000px) rotateX(0) rotateY(0)`; 
        pendulum.style.transition = 'transform 0.6s cubic-bezier(0.25, 0.8, 0.25, 1)'; 
    });

    document.querySelector('.hero-right').addEventListener('mouseenter', () => { 
        pendulum.style.transition = 'transform 0.1s ease-out'; 
    });
}

// === 5. Navigasi & Animasi Transisi ===
const transitionOverlay = document.getElementById('page-transition-overlay');
const transitionTextEl = document.getElementById('transition-text');
const allNavLinks = document.querySelectorAll('.nav-btn, .about-cat-btn');
let isTransitioning = false;

const transitionQuestions = [
    "Ready to explore?", "What's next?", "Connecting the dots...", "Hi, this is my portfolio"
];

allNavLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        if (isTransitioning) return;

        const targetId = this.getAttribute('href').substring(1);
        const targetSection = document.getElementById(targetId);
        if (!targetSection) return;

        isTransitioning = true;
        
        const randomQ = transitionQuestions[Math.floor(Math.random() * transitionQuestions.length)];
        transitionTextEl.textContent = randomQ;

        transitionOverlay.style.transformOrigin = "top";
        transitionOverlay.classList.add('transitioning');

        setTimeout(() => {
            transitionTextEl.classList.add('visible');
            
            const offsetPosition = targetSection.getBoundingClientRect().top + window.scrollY - navbar.offsetHeight;
            window.scrollTo({ top: offsetPosition, behavior: "instant" });

            setTimeout(() => {
                transitionTextEl.classList.remove('visible');
                
                setTimeout(() => {
                    transitionOverlay.style.transformOrigin = "bottom";
                    transitionOverlay.classList.remove('transitioning');
                    
                    setTimeout(() => { isTransitioning = false; }, 600);
                }, 400); 
            }, 1200); 

        }, 600);
    });
});

// === 6. LOGIKA LIGHTBOX (ZOOM SERTIFIKAT) ===
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxClose = document.getElementById('lightbox-close');

window.openLightbox = function(imageSrc) {
    lightboxImg.src = imageSrc;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden'; 
};

lightboxClose.addEventListener('click', () => {
    lightbox.classList.remove('active');
    document.body.style.overflow = 'auto';
});

lightbox.addEventListener('click', (e) => {
    if (e.target !== lightboxImg) {
        lightbox.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
});

// === 7. Deteksi Scroll (Reveal Animation & Portfolio Typing) ===
const sections = document.querySelectorAll('.page-section');
const mainNavLinks = document.querySelectorAll('.nav-links a');
const revealElements = document.querySelectorAll('.reveal-up');

let hasTypedPortfolio = false;
const portTitleStr = "Portfolio Showcase";
const portTitleEl = document.getElementById('portfolio-typing-text');
const portCursor = document.getElementById('portfolio-cursor');
let portIndex = 0;

function typePortfolioTitle() {
    if (portIndex < portTitleStr.length) {
        portTitleEl.textContent += portTitleStr.charAt(portIndex);
        portIndex++;
        setTimeout(typePortfolioTitle, 70);
    }
}

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        if (scrollY >= (section.offsetTop - navbar.offsetHeight - 50)) { current = section.getAttribute('id'); }
    });
    mainNavLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) link.classList.add('active');
    });

    const windowHeight = window.innerHeight;
    revealElements.forEach(el => {
        const elementTop = el.getBoundingClientRect().top;
        if (elementTop < windowHeight - 50) { el.classList.add('active'); }
    });

    const portfolioTop = document.getElementById('portfolio').getBoundingClientRect().top;
    if (portfolioTop < windowHeight - 100 && !hasTypedPortfolio) {
        hasTypedPortfolio = true;
        portCursor.style.display = "inline-block";
        setTimeout(typePortfolioTitle, 300);
    }
});
window.dispatchEvent(new Event('scroll'));

// === 8. Logika Tab Portfolio & Trigger dari About ===
const showcaseTabs = document.querySelectorAll('.showcase-tab');
const showcaseContents = document.querySelectorAll('.showcase-content');
const aboutCategoryBtns = document.querySelectorAll('.about-cat-btn');

function switchShowcaseTab(tabName) {
    showcaseTabs.forEach(t => t.classList.remove('active'));
    
    showcaseContents.forEach(c => {
        c.classList.remove('active');
        c.style.display = 'none'; 
    });
    
    const activeTabBtn = document.querySelector(`.showcase-tab[data-tab="${tabName}"]`);
    if (activeTabBtn) activeTabBtn.classList.add('active');
    
    const activeContent = document.getElementById(`content-${tabName}`);
    if (activeContent) {
        activeContent.style.display = (tabName === 'techstack') ? 'block' : 'grid'; 
        activeContent.classList.add('active');
        
        const cards = activeContent.querySelectorAll('.project-card, .tech-card');
        cards.forEach(card => {
            card.style.animation = 'none';
            card.offsetHeight; 
            card.style.animation = null;
        });
    }
}

showcaseTabs.forEach(tab => {
    tab.addEventListener('click', () => { switchShowcaseTab(tab.getAttribute('data-tab')); });
});

aboutCategoryBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        const targetTab = this.getAttribute('data-target');
        setTimeout(() => { switchShowcaseTab(targetTab); }, 800); 
    });
});

// === 9. Like Button Toggle Action ===
const likeBtns = document.querySelectorAll('.like-btn');
likeBtns.forEach(btn => {
    btn.addEventListener('click', function(e) {
        e.preventDefault();
        if(this.style.color === 'rgb(239, 68, 68)') {
            this.style.color = '';
            this.querySelector('svg').style.fill = 'none';
        } else {
            this.style.color = '#ef4444';
            this.querySelector('svg').style.fill = '#ef4444';
        }
    });
});