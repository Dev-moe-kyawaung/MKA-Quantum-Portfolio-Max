// ================================================
// ULTIMATE PREMIUM PRO MAX - APP.JS
// Version 5.0 - Complete
// ================================================

document.addEventListener('DOMContentLoaded', () => {
    // Initialize everything
    initPreloader();
    initTheme();
    initNavigation();
    initTypingEffect();
    initAOS();
    initProjects();
    initSkillsTabs();
    initTimeline();
    initContactForm();
    initBackToTop();
    initChatWidget();
    initParticles();
    initCounters();
    initSmoothScroll();
    initCursor();
});

// ================================================
// 1. PRELOADER
// ================================================
function initPreloader() {
    const loadingScreen = document.getElementById('loadingScreen');
    const fill = document.getElementById('loadingFill');
    const percent = document.getElementById('loadingPercent');
    
    let progress = 0;
    const totalTime = 2000;
    const startTime = Date.now();
    
    const loadingInterval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        progress = Math.min((elapsed / totalTime) * 100, 100);
        
        fill.style.width = `${progress}%`;
        percent.textContent = `${Math.round(progress)}%`;
        
        if (progress >= 100) {
            clearInterval(loadingInterval);
            setTimeout(() => {
                loadingScreen.classList.add('hidden');
                document.body.classList.remove('lock-scroll');
            }, 300);
        }
    }, 50);
    
    document.body.classList.add('lock-scroll');
}

// ================================================
// 2. THEME TOGGLE
// ================================================
function initTheme() {
    const themeToggle = document.getElementById('themeToggle');
    const savedTheme = localStorage.getItem('theme') || 'dark';
    
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
    
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
        
        // Reinitialize particles for new theme
        initParticles();
    });
}

function updateThemeIcon(theme) {
    const sunIcon = document.querySelector('.theme-toggle .fa-sun');
    const moonIcon = document.querySelector('.theme-toggle .fa-moon');
    
    if (sunIcon && moonIcon) {
        sunIcon.style.display = theme === 'light' ? 'block' : 'none';
        moonIcon.style.display = theme === 'dark' ? 'block' : 'none';
    }
}

// ================================================
// 3. NAVIGATION
// ================================================
function initNavigation() {
    const header = document.getElementById('mainHeader');
    const mobileToggle = document.getElementById('mobileToggle');
    const mobileNav = document.getElementById('mobileNav');
    const mobileClose = document.getElementById('mobileClose');
    
    // Header scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    
    // Mobile menu toggle
    mobileToggle.addEventListener('click', () => {
        mobileToggle.classList.toggle('active');
        mobileNav.classList.toggle('active');
        document.body.classList.toggle('lock-scroll');
    });
    
    mobileClose.addEventListener('click', () => {
        mobileToggle.classList.remove('active');
        mobileNav.classList.remove('active');
        document.body.classList.remove('lock-scroll');
    });
    
    // Close mobile nav when clicking links
    document.querySelectorAll('[data-mobile-link]').forEach(link => {
        link.addEventListener('click', () => {
            mobileToggle.classList.remove('active');
            mobileNav.classList.remove('active');
            document.body.classList.remove('lock-scroll');
        });
    });
    
    // Active nav link on scroll
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const currentId = entry.target.id;
                navLinks.forEach(link => {
                    link.classList.toggle('active', link.dataset.nav === currentId);
                });
            }
        });
    }, { rootMargin: '-50% 0px -50% 0px' });
    
    sections.forEach(section => navObserver.observe(section));
}

// ================================================
// 4. TYPING EFFECT
// ================================================
function initTypingEffect() {
    const typedTextElement = document.getElementById('typedText');
    const roles = [
        'Senior Android Developer',
        'Kotlin Expert',
        'Jetpack Compose Master',
        'Clean Architecture Advocate',
        'AI/ML Enthusiast',
        'Full-Stack Developer'
    ];
    
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let isWaiting = false;
    
    function type() {
        const currentRole = roles[roleIndex];
        
        if (isWaiting) {
            setTimeout(() => {
                isWaiting = false;
                isDeleting = true;
                type();
            }, 2000);
            return;
        }
        
        if (isDeleting) {
            const displayText = currentRole.substring(0, charIndex - 1);
            typedTextElement.textContent = displayText;
            charIndex--;
            
            if (charIndex <= 0) {
                isDeleting = false;
                roleIndex = (roleIndex + 1) % roles.length;
                charIndex = 0;
                setTimeout(type, 200);
                return;
            }
            
            setTimeout(type, 30);
        } else {
            const displayText = currentRole.substring(0, charIndex + 1);
            typedTextElement.textContent = displayText;
            charIndex++;
            
            if (charIndex === currentRole.length) {
                isWaiting = true;
                setTimeout(type, 100);
                return;
            }
            
            setTimeout(type, 60);
        }
    }
    
    setTimeout(type, 500);
}

// ================================================
// 5. AOS INITIALIZATION
// ================================================
function initAOS() {
    if (window.AOS) {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out-cubic',
            once: true,
            offset: 50,
            delay: 50
        });
    }
}

// ================================================
// 6. PROJECTS RENDERING
// ================================================
function initProjects() {
    const grid = document.getElementById('projectGrid');
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    if (!grid) return;
    
    renderProjects('all');
    
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filter = btn.dataset.filter;
            renderProjects(filter);
        });
    });
}

function renderProjects(category) {
    const grid = document.getElementById('projectGrid');
    
    if (!grid) return;
    
    const projects = category === 'all' 
        ? ProjectsData 
        : ProjectsData.filter(p => p.category === category);
    
    grid.innerHTML = '';
    
    projects.forEach((project, index) => {
        const card = document.createElement('article');
        card.className = 'project-card';
        card.style.animationDelay = `${index * 0.1}s`;
        
        card.innerHTML = `
            <div class="project-image">
                <img src="${project.image}" alt="${project.title}" loading="lazy">
                <div class="project-overlay">
                    <a href="${project.github}" target="_blank" class="btn btn-primary btn-small">
                        <i class="fab fa-github"></i> View Code
                    </a>
                </div>
            </div>
            <div class="project-content">
                <h3>${project.title}</h3>
                <p>${project.description}</p>
                <div class="project-tech">
                    ${project.tech.map(tech => `<span>${tech}</span>`).join('')}
                </div>
                <div class="project-links">
                    <a href="${project.github}" target="_blank" class="btn btn-small btn-outline">
                        <i class="fab fa-github"></i>
                    </a>
                    <span class="project-year">${project.year}</span>
                </div>
            </div>
        `;
        
        grid.appendChild(card);
    });
}

// ================================================
// 7. SKILLS TABS
// ================================================
function initSkillsTabs() {
    const tabs = document.querySelectorAll('.skill-tab');
    const panels = document.querySelectorAll('.skill-panel');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabId = tab.dataset.tab;
            
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            panels.forEach(panel => {
                panel.classList.remove('active');
                if (panel.id === `panel-${tabId}`) {
                    panel.classList.add('active');
                    // Animate skill bars
                    animateSkillBars(panel);
                }
            });
        });
    });
    
    // Animate first panel
    animateSkillBars(document.querySelector('.skill-panel.active'));
}

function animateSkillBars(panel) {
    if (!panel) return;
    
    const bars = panel.querySelectorAll('.skill-bar-fill');
    bars.forEach(bar => {
        const width = bar.style.width;
        bar.style.width = '0%';
        
        setTimeout(() => {
            bar.style.width = width;
        }, 100);
    });
}

// ================================================
// 8. TIMELINE
// ================================================
function initTimeline() {
    const container = document.getElementById('timelineContainer');
    
    if (!container) return;
    
    TimelineData.forEach((item, index) => {
        const div = document.createElement('div');
        div.className = 'timeline-item';
        
        div.innerHTML = `
            <div class="timeline-dot"></div>
            <div class="timeline-date">${item.year}</div>
            <div class="timeline-content">
                <h3>${item.title}</h3>
                <p class="timeline-company">${item.company}</p>
                <p>${item.description}</p>
                <ul>
                    ${item.achievements.map(a => `<li>${a}</li>`).join('')}
                </ul>
                <div class="timeline-tech">
                    ${item.tech.map(t => `<span>${t}</span>`).join('')}
                </div>
            </div>
        `;
        
        container.appendChild(div);
    });
}

// ================================================
// 9. CONTACT FORM
// ================================================
function initContactForm() {
    const form = document.getElementById('contactForm');
    
    if (!form) return;
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const subject = document.getElementById('subject').value.trim();
        const message = document.getElementById('message').value.trim();
        const budget = document.getElementById('budget').value;
        
        // Validation
        if (!name || !email || !message) {
            showToast('Please fill required fields', 'error');
            return;
        }
        
        if (!isValidEmail(email)) {
            showToast('Please enter a valid email address', 'error');
            return;
        }
        
        // Simulate loading
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        
        setTimeout(() => {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
            
            showToast('Message sent successfully! I\'ll get back to you soon.', 'success');
            form.reset();
        }, 1500);
    });
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ================================================
// 10. BACK TO TOP
// ================================================
function initBackToTop() {
    const btn = document.getElementById('backToTop');
    
    if (!btn) return;
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            btn.classList.add('visible');
        } else {
            btn.classList.remove('visible');
        }
    });
    
    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ================================================
// 11. AI CHAT WIDGET
// ================================================
function initChatWidget() {
    const toggle = document.getElementById('chatToggle');
    const panel = document.getElementById('chatPanel');
    const closeBtn = document.getElementById('chatClose');
    const sendBtn = document.getElementById('chatSend');
    const input = document.getElementById('chatInput');
    const messages = document.getElementById('chatMessages');
    
    if (!toggle) return;
    
    // Toggle chat
    toggle.addEventListener('click', () => {
        const isOpen = panel.classList.contains('active');
        
        if (isOpen) {
            panel.classList.remove('active');
            toggle.querySelector('.fa-times').style.display = 'none';
            toggle.querySelector('.fa-robot').style.display = 'block';
        } else {
            panel.classList.add('active');
            toggle.querySelector('.fa-times').style.display = 'block';
            toggle.querySelector('.fa-robot').style.display = 'none';
            
            // Welcome message if first time
            if (messages.children.length === 0) {
                addBotMessage("Hello! 👋 I'm MKA's AI assistant. Ask me about my projects, skills, experience, or anything else!");
            }
        }
    });
    
    closeBtn.addEventListener('click', () => {
        panel.classList.remove('active');
        toggle.querySelector('.fa-times').style.display = 'none';
        toggle.querySelector('.fa-robot').style.display = 'block';
    });
    
    // Send message
    const handleSend = () => {
        const message = input.value.trim();
        
        if (!message) return;
        
        addUserMessage(message);
        input.value = '';
        
        setTimeout(() => {
            addBotMessage(getBotResponse(message));
        }, 500);
    };
    
    sendBtn.addEventListener('click', handleSend);
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSend();
    });
}

function addUserMessage(message) {
    const messages = document.getElementById('chatMessages');
    const div = document.createElement('div');
    div.className = 'message user-message';
    div.innerHTML = `
        <div class="message-content">${message}</div>
    `;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
}

function addBotMessage(message) {
    const messages = document.getElementById('chatMessages');
    const div = document.createElement('div');
    div.className = 'message bot-message';
    div.innerHTML = `
        <div class="message-avatar">🤖</div>
        <div class="message-content">${message}</div>
    `;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
}

function getBotResponse(message) {
    const lowerMsg = message.toLowerCase();
    
    // Projects
    if (lowerMsg.includes('project') || lowerMsg.includes('work') || lowerMsg.includes('portfolio')) {
        return "I've built 40+ projects including POS systems, social dashboards, weather apps, and more! Check out the Projects section above, or visit my GitHub: https://github.com/Dev-moe-kyawaung";
    }
    
    // Skills
    if (lowerMsg.includes('skill') || lowerMsg.includes('tech') || lowerMsg.includes('stack')) {
        return "My main stack is Android/Kotlin development with Jetpack Compose. I also work with Firebase, REST APIs, Python, and AI/ML tools like TensorFlow and Claude API.";
    }
    
    // Experience
    if (lowerMsg.includes('experience') || lowerMsg.includes('career')) {
        return "I have 3+ years of experience. Started as web developer in 2022, transitioned to Android, and now work as a Senior Android Developer. I've earned 82+ certifications along the way!";
    }
    
    // Certifications
    if (lowerMsg.includes('certificate') || lowerMsg.includes('cert') || lowerMsg.includes('credential')) {
        return "I have 82+ certifications in 9 tech domains from Programming Hub, covering Kotlin, Compose, Clean Architecture, ML, and more!";
    }
    
    // Contact
    if (lowerMsg.includes('contact') || lowerMsg.includes('email') || lowerMsg.includes('hire')) {
        return "You can reach me at moekyawaung@technologist.com or call +95 9 889 000 889. I'm open to new opportunities!";
    }
    
    // Resume
    if (lowerMsg.includes('resume') || lowerMsg.includes('cv')) {
        return "You can download my resume by clicking the 'Resume' button in the hero section, or use the contact form to request one directly.";
    }
    
    // Location
    if (lowerMsg.includes('location') || lowerMsg.includes('where') || lowerMsg.includes('based')) {
        return "I'm based between Tachileik, Myanmar and Bangkok, Thailand. I'm available for both remote and on-site opportunities!";
    }
    
    // Greetings
    if (lowerMsg.includes('hello') || lowerMsg.includes('hi') || lowerMsg.includes('hey')) {
        return "Hello! 👋 Great to meet you. Ask me anything about my work, skills, or experience!";
    }
    
    // Default
    return "That's an interesting question! I'm a portfolio assistant. Try asking about my projects, skills, experience, or how to contact me.";
}

// ================================================
// 12. BACKGROUND PARTICLES
// ================================================
function initParticles() {
    const canvas = document.getElementById('particleCanvas');
    
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationId;
    
    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        createParticles();
    }
    
    function createParticles() {
        const count = Math.min(window.innerWidth * 0.05, 100);
        particles = [];
        
        for (let i = 0; i < count; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 2,
                vy: (Math.random() - 0.5) * 2,
                size: Math.random() * 3 + 1,
                color: Math.random() > 0.5 ? '#00f0ff' : '#a855f7',
                alpha: Math.random() * 0.5 + 0.2,
                pulseSpeed: Math.random() * 0.02 + 0.01,
                pulsePhase: Math.random() * Math.PI * 2
            });
        }
    }
    
    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach((particle, index) => {
            // Update position
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Update pulse
            particle.pulsePhase += particle.pulseSpeed;
            const alpha = particle.alpha + Math.sin(particle.pulsePhase) * 0.2;
            
            // Bounce edges
            if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
            if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;
            
            // Draw particle
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fillStyle = particle.color;
            ctx.globalAlpha = Math.max(0.1, Math.min(1, alpha));
            ctx.fill();
            
            // Draw connections
            for (let j = index + 1; j < particles.length; j++) {
                const other = particles[j];
                const dx = particle.x - other.x;
                const dy = particle.y - other.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                if (dist < 100) {
                    ctx.beginPath();
                    ctx.moveTo(particle.x, particle.y);
                    ctx.lineTo(other.x, other.y);
                    ctx.strokeStyle = `rgba(0, 240, 255, ${0.2 * (1 - dist / 100)})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        });
        
        ctx.globalAlpha = 1;
        animationId = requestAnimationFrame(draw);
    }
    
    window.addEventListener('resize', resize);
    resize();
    draw();
}

// ================================================
// 13. ANIMATED COUNTERS
// ================================================
function initCounters() {
    const counters = document.querySelectorAll('[data-count]');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const targetValue = parseInt(target.dataset.count);
                animateCounter(target, targetValue);
                observer.unobserve(target);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => observer.observe(counter));
}

function animateCounter(element, target) {
    const duration = 2000;
    const start = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - start;
        const progress = Math.min(elapsed / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 3);
        const value = Math.floor(target * ease);
        
        element.textContent = value;
        
        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            element.textContent = target;
        }
    }
    
    requestAnimationFrame(update);
}

// ================================================
// 14. SMOOTH SCROLL
// ================================================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href');
            
            if (targetId === '#') return;
            
            const target = document.querySelector(targetId);
            
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

// ================================================
// 15. CUSTOM CURSOR
// ================================================
function initCursor() {
    const outer = document.getElementById('cursorOuter');
    const inner = document.getElementById('cursorInner');
    
    if (!outer || !inner) return;
    
    // Check if touch device
    if (window.matchMedia('(hover: none)').matches) {
        outer.style.display = 'none';
        inner.style.display = 'none';
        return;
    }
    
    let mouseX = -100;
    let mouseY = -100;
    let currentX = -100;
    let currentY = -100;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        inner.style.left = `${mouseX - 3}px`;
        inner.style.top = `${mouseY - 3}px`;
    });
    
    // Smooth outer cursor
    function animate() {
        const dx = mouseX - currentX;
        const dy = mouseY - currentY;
        
        currentX += dx * 0.15;
        currentY += dy * 0.15;
        
        outer.style.left = `${currentX - 20}px`;
        outer.style.top = `${currentY - 20}px`;
        
        requestAnimationFrame(animate);
    }
    animate();
    
    // Hover effect
    document.addEventListener('mouseover', (e) => {
        if (e.target.closest('a, button, input, textarea, .project-card')) {
            outer.classList.add('hovered');
        }
    });
    
    document.addEventListener('mouseout', (e) => {
        if (e.target.closest('a, button, input, textarea, .project-card')) {
            outer.classList.remove('hovered');
        }
    });
}

// ================================================
// TOAST SYSTEM
// ================================================
function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    
    if (!container) return;
    
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
        <span>${message}</span>
    `;
    
    container.appendChild(toast);
    
    // Add animation
    toast.style.animation = 'slideInRight 0.3s ease';
    
    // Auto dismiss
    setTimeout(() => {
        toast.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// ================================================
// RESUME DOWNLOAD
// ================================================
function downloadResume() {
    const resume = `
        ========================================
        MOE KYAW AUNG - RESUME
        ========================================
        
        Senior Android Developer
        
        CONTACT:
        - Email: moekyawaung@technologist.com
        - Phone: +95 9 889 000 889
        - Location: Tachileik, Myanmar ↔ Bangkok, Thailand
        
        SKILLS:
        - Android: Kotlin, Jetpack Compose, MVVM, Clean Architecture
        - Backend: Firebase, REST APIs, Retrofit, Room
        - AI/ML: TensorFlow, TFLite, Claude API
        - Tools: Git, Docker, GitHub Actions, Linux
        
        EXPERIENCE:
        2024-Present: Senior Android Developer (Freelance)
        2023-2024: Android Developer
        2022-2023: Web & Mobile Developer
        
        CERTIFICATIONS:
        82+ Programming Hub certificates in 9 domains
        
        PROJECTS:
        40+ production-quality applications
    `;
    
    const blob = new Blob([resume], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Moe_Kyaw_Aung_Resume.txt';
    a.click();
    URL.revokeObjectURL(url);
    
    showToast('Resume downloaded successfully!', 'success');
}

// ================================================
// DATA (To be placed in data.js)
// ================================================
const ProjectsData = [
    {
        id: 1,
        title: "💰 POS Ultimate Pro",
        description: "Enterprise POS system with AI analytics and offline support",
        image: "https://res.cloudinary.com/dye5qpwii/image/upload/v1778795829/copilot_image_1778795000722_okryxj.png",
        github: "https://github.com/moekyawaung-tech/POS-Ultimate-Pro-Max",
        category: "android",
        tech: ["Kotlin", "Firebase", "MVVM"],
        year: 2024
    },
    {
        id: 2,
        title: "📱 Social Dashboard",
        description: "AI-powered social media management dashboard",
        image: "https://res.cloudinary.com/dye5qpwii/image/upload/v1778747384/image-1_f6zlmk.jpg",
        github: "https://github.com/moekyawaung-tech/social-dashboard",
        category: "android",
        tech: ["Kotlin", "Compose", "ML Kit"],
        year: 2024
    },
    {
        id: 3,
        title: "🌤️ Weather App",
        description: "Real-time weather with beautiful animations",
        image: "https://res.cloudinary.com/dye5qpwii/image/upload/v1778795825/cloud-icon-poster-1_2_opl7sy.png",
        github: "https://github.com/moekyawaung-tech/Weather-app",
        category: "android",
        tech: ["Kotlin", "Retrofit", "Room"],
        year: 2024
    },
    {
        id: 4,
        title: "🎮 Game Collection",
        description: "Classic games with advanced physics",
        image: "https://res.cloudinary.com/dye5qpwii/image/upload/v1778795847/copilot_image_1778795115579_acfm5j.png",
        github: "https://github.com/moekyawaung-tech/game-collection",
        category: "game",
        tech: ["Kotlin", "Canvas", "Physics"],
        year: 2024
    },
    {
        id: 5,
        title: "🎬 Video Player",
        description: "Premium video player with gesture controls",
        image: "https://res.cloudinary.com/dye5qpwii/image/upload/v1778795853/copilot_image_1778794781671_kytvkc.png",
        github: "https://github.com/moekyawaung-tech/video-player",
        category: "android",
        tech: ["Kotlin", "ExoPlayer"],
        year: 2024
    },
    {
        id: 6,
        title: "💼 Job Portal",
        description: "AI job matching platform with resume builder",
        image: "https://res.cloudinary.com/dye5qpwii/image/upload/v1778795859/copilot_image_1778794430377_n7xlmz.png",
        github: "https://github.com/moekyawaung-tech/Job-Portal-App",
        category: "android",
        tech: ["Kotlin", "Firestore", "ML"],
        year: 2023
    },
    {
        id: 7,
        title: "✈️ Thailand Travel",
        description: "Travel companion with local guides and maps",
        image: "https://res.cloudinary.com/dye5qpwii/image/upload/v1778795856/copilot_image_1778795675037_heh9xk.png",
        github: "https://github.com/moekyawaung-tech/thailand-travel",
        category: "android",
        tech: ["Kotlin", "Maps", "Compose"],
        year: 2023
    },
    {
        id: 8,
        title: "🏥 Hospital Locator",
        description: "Find hospitals in emergency situations",
        image: "https://res.cloudinary.com/dye5qpwii/image/upload/v1778747388/image-1_1_khsx9s.png",
        github: "https://github.com/Moekyawaung-cyber/Hospital-Lists",
        category: "web",
        tech: ["JavaScript", "API", "Bootstrap"],
        year: 2023
    }
];

const TimelineData = [
    {
        year: "2024 - Present",
        title: "Senior Android Developer",
        company: "Freelance",
        description: "Building production-quality Android apps with modern architecture",
        tech: ["Kotlin", "Compose", "Clean Architecture"],
        achievements: [
            "40+ production apps",
            "AI/ML integration",
            "CI/CD pipelines",
            "Team mentoring"
        ]
    },
    {
        year: "2023 - 2024",
        title: "Android Developer",
        company: "Various Projects",
        description: "Mastered modern Android development practices",
        tech: ["Kotlin", "Firebase", "Room"],
        achievements: [
            "82+ certifications",
            "Full POS system",
            "Game development",
            "Open source contributions"
        ]
    },
    {
        year: "2022 - 2023",
        title: "Web & Mobile Developer",
        company: "Foundation",
        description: "Started coding journey with web development",
        tech: ["JavaScript", "HTML", "CSS"],
        achievements: [
            "Core programming",
            "Web development",
            "Mobile basics",
            "First apps"
        ]
    }
];
