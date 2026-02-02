// Fonction pour charger un composant HTML
async function loadComponent(file, placeholderId) {
    try {
        const response = await fetch(file);
        const html = await response.text();
        document.getElementById(placeholderId).innerHTML = html;
    } catch (error) {
        console.error(`Erreur lors du chargement de ${file}:`, error);
    }
}

// Charger les composants communs (nav et footer)
document.addEventListener('DOMContentLoaded', async function() {
    // Initialiser l'animation rideau jungle
    initJungleCurtain();

    // Charger la navigation et le pied de page
    await loadComponent('components/navigation.html', 'nav-placeholder');
    await loadComponent('components/pied-de-page.html', 'footer-placeholder');

    // Initialiser le smooth scroll après le chargement des composants
    initSmoothScroll();

    // Initialiser le carousel (si présent)
    initCarousel();

    // Initialiser les animations des lianes
    initVineAnimations();

    // Initialiser les animations au scroll
    initScrollAnimations();
});

// Animation rideau jungle
function initJungleCurtain() {
    const curtain = document.getElementById('jungleCurtain');
    if (!curtain) return;

    // Ajouter la classe fade-out pour déclencher la disparition
    curtain.classList.add('fade-out');

    // Supprimer le rideau du DOM après l'animation
    setTimeout(() => {
        curtain.classList.add('hidden');
    }, 1500);
}

// Smooth scroll pour la navigation
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Carousel pour les modules
function initCarousel() {
    const track = document.querySelector('.carousel-track');
    const slides = document.querySelectorAll('.carousel-slide');
    const prevBtn = document.querySelector('.carousel-prev');
    const nextBtn = document.querySelector('.carousel-next');
    const indicators = document.querySelectorAll('.carousel-indicator');

    if (!track || slides.length === 0) return;

    let currentIndex = 0;
    const totalSlides = slides.length;

    // Fonction pour mettre à jour la position du carousel
    function updateCarousel() {
        const offset = -currentIndex * 100;
        track.style.transform = `translateX(${offset}%)`;

        // Mettre à jour les indicateurs
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === currentIndex);
        });

        // Mettre à jour l'état des boutons
        prevBtn.style.opacity = currentIndex === 0 ? '0.5' : '1';
        nextBtn.style.opacity = currentIndex === totalSlides - 1 ? '0.5' : '1';
        prevBtn.style.cursor = currentIndex === 0 ? 'not-allowed' : 'pointer';
        nextBtn.style.cursor = currentIndex === totalSlides - 1 ? 'not-allowed' : 'pointer';
    }

    // Navigation avec les boutons
    prevBtn.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            updateCarousel();
        }
    });

    nextBtn.addEventListener('click', () => {
        if (currentIndex < totalSlides - 1) {
            currentIndex++;
            updateCarousel();
        }
    });

    // Navigation avec les indicateurs
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            currentIndex = index;
            updateCarousel();
        });
    });

    // Navigation au clavier
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft' && currentIndex > 0) {
            currentIndex--;
            updateCarousel();
        } else if (e.key === 'ArrowRight' && currentIndex < totalSlides - 1) {
            currentIndex++;
            updateCarousel();
        }
    });

    // Support tactile (swipe)
    let touchStartX = 0;
    let touchEndX = 0;

    track.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });

    track.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });

    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0 && currentIndex < totalSlides - 1) {
                currentIndex++;
                updateCarousel();
            } else if (diff < 0 && currentIndex > 0) {
                currentIndex--;
                updateCarousel();
            }
        }
    }

    // Initialisation
    updateCarousel();
}

// Animation des lianes et fougères
function initVineAnimations() {
    const vineLeft = document.querySelector('.vine-left');
    const vineRight = document.querySelector('.vine-right');
    const fernLeft = document.querySelector('.fern-top-left');
    const fernRight = document.querySelector('.fern-top-right');
    const hero = document.querySelector('.hero');

    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;
    let bgTargetX = 0;
    let bgTargetY = 0;

    // Écouter le mouvement de la souris
    document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth - 0.5) * 2; // -1 à 1
        mouseY = (e.clientY / window.innerHeight - 0.5) * 2; // -1 à 1
    });

    // Animation fluide avec requestAnimationFrame
    function animateVines() {
        // Interpolation douce
        targetX += (mouseX - targetX) * 0.05;
        targetY += (mouseY - targetY) * 0.05;

        // Effet parallax sur le background du hero
        if (hero) {
            bgTargetX += (mouseX - bgTargetX) * 0.03;
            bgTargetY += (mouseY - bgTargetY) * 0.03;

            const bgOffsetX = bgTargetX * 30;
            const bgOffsetY = bgTargetY * 20;

            hero.style.backgroundPosition = `calc(50% + ${bgOffsetX}px) calc(50% + ${bgOffsetY}px)`;
        }

        requestAnimationFrame(animateVines);
    }

    animateVines();

    // Animation au scroll (effet parallax)
    let lastScrollY = 0;
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        const scrollDelta = scrollY - lastScrollY;

        // Effet de balancement subtil au scroll
        if (vineLeft) {
            const swayAmount = Math.sin(scrollY * 0.01) * 3;
            vineLeft.style.transform += ` skewX(${swayAmount}deg)`;
        }

        if (vineRight) {
            const swayAmount = Math.sin(scrollY * 0.01 + Math.PI) * 3;
            vineRight.style.transform += ` skewX(${swayAmount}deg)`;
        }

        lastScrollY = scrollY;
    });

    // Animation de balancement automatique (comme le vent)
    let windTime = 0;
    let autoSwayLeft = 0;
    let autoSwayRight = 0;

    function windAnimation() {
        windTime += 0.015;

        // Calcul du vent avec plusieurs fréquences pour un effet naturel
        const wind1 = Math.sin(windTime) * 3;
        const wind2 = Math.sin(windTime * 0.7 + 1) * 2;
        const wind3 = Math.sin(windTime * 1.3 + 2) * 1.5;
        const windStrength = wind1 + wind2 + wind3;

        // Balancement automatique des lianes entières
        autoSwayLeft = Math.sin(windTime * 0.8) * 4 + Math.sin(windTime * 1.2) * 2;
        autoSwayRight = Math.sin(windTime * 0.8 + Math.PI * 0.3) * 4 + Math.sin(windTime * 1.2 + 1) * 2;

        if (vineLeft) {
            const baseRotate = targetX * 5;
            const baseTranslate = targetY * 10;
            vineLeft.style.transform = `rotate(${baseRotate + autoSwayLeft}deg) translateY(${baseTranslate}px) translateX(${autoSwayLeft * 0.5}px)`;
        }

        if (vineRight) {
            const baseRotate = -targetX * 5;
            const baseTranslate = targetY * 10;
            vineRight.style.transform = `rotate(${baseRotate + autoSwayRight}deg) translateY(${baseTranslate}px) translateX(${-autoSwayRight * 0.5}px)`;
        }

        // Balancement des fougères
        if (fernLeft) {
            const fernSway = Math.sin(windTime * 0.6) * 3 + Math.sin(windTime * 1.1) * 1.5;
            const baseRotate = targetX * 3 + targetY * 2;
            fernLeft.style.transform = `rotate(${baseRotate + fernSway}deg)`;
        }

        if (fernRight) {
            const fernSway = Math.sin(windTime * 0.6 + 0.5) * 3 + Math.sin(windTime * 1.1 + 1) * 1.5;
            const baseRotate = -targetX * 3 + targetY * 2;
            fernRight.style.transform = `rotate(${baseRotate + fernSway}deg)`;
        }

        // Animation des feuilles individuelles
        document.querySelectorAll('.vine-decoration svg path').forEach((path, index) => {
            const delay = index * 0.2;
            const sway = Math.sin(windTime * 1.5 + delay) * windStrength * 0.4;
            const swayY = Math.sin(windTime * 1.2 + delay + 1) * windStrength * 0.2;
            path.style.transform = `translateX(${sway}px) translateY(${swayY}px)`;
        });

        document.querySelectorAll('.fern-decoration svg path').forEach((path, index) => {
            const delay = index * 0.15;
            const sway = Math.sin(windTime + delay) * (windStrength * 0.3);
            const swayY = Math.sin(windTime * 0.9 + delay) * (windStrength * 0.15);
            path.style.transform = `translateX(${sway}px) translateY(${swayY}px)`;
        });

        requestAnimationFrame(windAnimation);
    }

    windAnimation();
}

// Animations au scroll
function initScrollAnimations() {
    // Sélectionner les éléments à animer
    const animatedElements = document.querySelectorAll(
        '.section-number, .constat-problem, .constat-issue, .principle-box, ' +
        '.belief-item, .promesse-hero, .promesse-item, .value-card, ' +
        '.service-card, .limite-card, .benefit-card, .resume-quote, ' +
        '.cloture-content, .highlight-text, .philosophie-result, ' +
        '.resultats-audience, .services-approach'
    );

    // Ajouter la classe initiale
    animatedElements.forEach(el => {
        el.classList.add('fade-in-up');
    });

    // Observer les éléments
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optionnel: arrêter d'observer après animation
                // observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    animatedElements.forEach(el => observer.observe(el));

    // Animation spéciale pour les cartes en cascade
    const staggerContainers = document.querySelectorAll(
        '.issue-cards, .belief-items, .promesse-grid, .values-grid, ' +
        '.services-grid, .limites-grid, .benefits-grid, .result-items'
    );

    staggerContainers.forEach(container => {
        const items = container.children;
        Array.from(items).forEach((item, index) => {
            item.classList.add('stagger-item');
            item.style.transitionDelay = `${index * 0.1}s`;
        });
    });

    const staggerObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const items = entry.target.children;
                Array.from(items).forEach(item => {
                    item.classList.add('visible');
                });
            }
        });
    }, {
        threshold: 0.2
    });

    staggerContainers.forEach(container => staggerObserver.observe(container));

    // Animation du compteur pour les numéros de section
    const sectionNumbers = document.querySelectorAll('.section-number');
    const numberObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'none';
                entry.target.offsetHeight; // Trigger reflow
                entry.target.style.animation = null;
            }
        });
    }, { threshold: 0.5 });

    sectionNumbers.forEach(num => numberObserver.observe(num));
}
