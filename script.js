// ============================================================
//  GeoSphere – script.js
//  Handles JS for: index.html | home.html | about.html |
//                  planet pages | contact.html
// ============================================================


// ── INDEX.HTML: "Launching 🚀" overlay on Explore Now click ─
const exploreBtn = document.getElementById('explore-btn');
if (exploreBtn) {
    exploreBtn.addEventListener('click', function (e) {
        e.preventDefault();

        const dest = this.getAttribute('href');

        // Inject fade-in keyframe
        const ks = document.createElement('style');
        ks.textContent = '@keyframes fadeInOverlay { from { opacity:0 } to { opacity:1 } }';
        document.head.appendChild(ks);

        // Build fullscreen overlay
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed; inset: 0; z-index: 9999;
            background: rgba(0, 0, 10, 0.92);
            display: flex; flex-direction: column;
            align-items: center; justify-content: center;
            gap: 20px;
            animation: fadeInOverlay 0.4s ease;
        `;

        const msg = document.createElement('p');
        msg.textContent = 'Launching 🚀';
        msg.style.cssText = `
            font-family: 'Orbitron', sans-serif;
            font-size: clamp(2rem, 6vw, 3.5rem);
            font-weight: 700;
            color: #fff;
            letter-spacing: 4px;
            text-shadow: 0 0 40px rgba(33, 148, 243, 0.9);
            margin: 0;
        `;

        overlay.appendChild(msg);
        document.body.appendChild(overlay);

        // Navigate after 2 seconds
        setTimeout(function () { window.location.href = dest; }, 500);
    });
}



// ── SCROLL-UP BUTTON (home, about, all planet pages) ────────
// Inject button styles once into <head>
const scrollBtnStyle = document.createElement('style');
scrollBtnStyle.textContent = `
    #scroll-up-btn {
        position: fixed;
        bottom: 30px;
        right: 30px;
        z-index: 999;
        background: linear-gradient(135deg, #1a6fc4, #2194f3);
        color: #fff;
        border: none;
        border-radius: 50%;
        width: 46px;
        height: 46px;
        font-size: 1.4rem;
        display: none;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 18px rgba(33, 148, 243, 0.5);
        cursor: pointer;
        transition: transform 0.25s, box-shadow 0.25s, opacity 0.3s;
        opacity: 0.88;
    }
    #scroll-up-btn.visible {
        display: flex;
    }
    #scroll-up-btn:hover {
        transform: translateY(-4px) scale(1.1);
        box-shadow: 0 8px 28px rgba(33, 148, 243, 0.7);
        opacity: 1;
    }
`;
document.head.appendChild(scrollBtnStyle);

// Create and inject the scroll-up button into <body>
const scrollUpBtn = document.createElement('button');
scrollUpBtn.id = 'scroll-up-btn';
scrollUpBtn.title = 'Back to top';
scrollUpBtn.innerHTML = '&#8679;';
document.body.appendChild(scrollUpBtn);

// Show when user scrolls more than 300px, hide otherwise
window.addEventListener('scroll', function () {
    if (window.scrollY > 300) {
        scrollUpBtn.classList.add('visible');
    } else {
        scrollUpBtn.classList.remove('visible');
    }
});

// Smooth scroll to top on click
scrollUpBtn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});


// ── HOME.HTML: Navbar background on scroll ──────────────────
const navbar = document.querySelector('.navbar');
if (navbar) {
    window.addEventListener('scroll', function () {
        if (window.scrollY > 60) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}


// ── HOME.HTML: Animated Counter for Stat Numbers ────────────
const statsStrip = document.querySelector('.stats-strip');
if (statsStrip) {
    const statNumbers = document.querySelectorAll('.stat-number');

    function animateCounter(el, target, duration) {
        let startTime = null;
        let isNumeric = !isNaN(parseFloat(target)) && target !== '∞';
        if (!isNumeric) {
            el.textContent = target;
            return;
        }
        let end = parseFloat(target);
        let suffix = target.replace(/[\d.]/g, '');

        function step(timestamp) {
            if (!startTime) startTime = timestamp;
            let progress = Math.min((timestamp - startTime) / duration, 1);
            let value = Math.floor(progress * end);
            el.textContent = value + suffix;
            if (progress < 1) {
                requestAnimationFrame(step);
            } else {
                el.textContent = target;
            }
        }
        requestAnimationFrame(step);
    }

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                statNumbers.forEach(function (el) {
                    animateCounter(el, el.textContent.trim(), 1500);
                });
                observer.unobserve(statsStrip);
            }
        });
    }, { threshold: 0.4 });

    observer.observe(statsStrip);
}


// ── CONTACT.HTML: Form Validation ───────────────────────────
const form = document.querySelector('.contact-form');
if (form) {
    const msgBox = document.createElement('div');
    msgBox.id = 'form-msg';
    msgBox.style.cssText = `
        display: none;
        margin-top: 18px;
        padding: 14px 20px;
        border-radius: 10px;
        font-size: 0.92rem;
        letter-spacing: 0.3px;
        text-align: center;
    `;
    form.appendChild(msgBox);

    form.addEventListener('submit', function (event) {
        event.preventDefault();

        const name    = document.getElementById('name').value.trim();
        const email   = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();

        // Name: letters and spaces only — no digits, no special characters
        const namePattern  = /^[A-Za-z\s]+$/;
        // Email: must contain @ and follow standard format
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        msgBox.style.display = 'block';

        if (name === '') {
            showMessage('⚠️ Please enter your name.', 'error');
        } else if (!namePattern.test(name)) {
            showMessage('⚠️ Name must contain only letters and spaces — no digits or special characters.', 'error');
        } else if (email === '') {
            showMessage('⚠️ Please enter your email address.', 'error');
        } else if (!email.includes('@') || !emailPattern.test(email)) {
            showMessage('⚠️ Please enter a valid email address including "@" (e.g. you@example.com).', 'error');
        } else if (message === '') {
            showMessage('⚠️ Please write a message before sending.', 'error');
        } else {
            showMessage('✅ Message sent successfully! We will reach out to you soon.', 'success');
            form.reset();
        }
    });

    function showMessage(text, type) {
        msgBox.textContent = text;
        if (type === 'success') {
            msgBox.style.background = 'rgba(30, 180, 100, 0.15)';
            msgBox.style.border     = '1px solid rgba(30, 180, 100, 0.4)';
            msgBox.style.color      = '#5de8a0';
        } else {
            msgBox.style.background = 'rgba(220, 60, 60, 0.12)';
            msgBox.style.border     = '1px solid rgba(220, 60, 60, 0.4)';
            msgBox.style.color      = '#f08080';
        }
    }

    const inputs = document.querySelectorAll('.contact-form input, .contact-form textarea, .contact-form select');
    inputs.forEach(function (input) {
        input.addEventListener('focus', function () {
            this.style.borderColor = 'rgba(126, 200, 255, 0.7)';
            this.style.boxShadow   = '0 0 0 3px rgba(126, 200, 255, 0.12)';
        });
        input.addEventListener('blur', function () {
            this.style.borderColor = '';
            this.style.boxShadow   = '';
        });
    });
}


// ── GALLERY.HTML: NASA Space Slideshow ──────────────────────
const slideshowFrame = document.getElementById('slideshow-frame');
if (slideshowFrame) {
    const slides      = document.querySelectorAll('.slide');
    const dots        = document.querySelectorAll('.dot');
    const prevBtn     = document.getElementById('slide-prev');
    const nextBtn     = document.getElementById('slide-next');
    const currentSpan = document.getElementById('slide-current');
    let current = 0;

    // Show the slide at the given index; hide all others
    function goToSlide(index) {
        slides[current].classList.remove('active');
        dots[current].classList.remove('active');

        current = (index + slides.length) % slides.length;

        slides[current].classList.add('active');
        dots[current].classList.add('active');
        currentSpan.textContent = current + 1;
    }

    // Arrow buttons
    prevBtn.addEventListener('click', function () {
        goToSlide(current - 1);
    });

    nextBtn.addEventListener('click', function () {
        goToSlide(current + 1);
    });

    // Dot clicks
    dots.forEach(function (dot) {
        dot.addEventListener('click', function () {
            goToSlide(parseInt(this.dataset.index, 10));
        });
    });
}
