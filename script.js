// Menu Mobile
const hamburger = document.querySelector('.hamburger');
const gorillaHead = document.querySelector('.g-head');
const gorillaMenuLinks = document.querySelectorAll('.g-menu-item');

if (gorillaHead) {
    gorillaHead.addEventListener('click', (e) => {
        e.stopPropagation();
        hamburger.classList.toggle('active');
    });
}

gorillaMenuLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.stopPropagation();
        setTimeout(() => {
            hamburger.classList.remove('active');
        }, 150);
    });
});

document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && hamburger.classList.contains('active')) {
        hamburger.classList.remove('active');
    }
});

// Scroll Suave - Usando CSS scroll-behavior e scroll-padding-top
// Os links âncora funcionam nativamente com o offset definido no CSS

// Header no Scroll
const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.style.background = 'rgba(20, 20, 20, 0.9)';
        header.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.4)';
    } else {
        header.style.background = 'rgba(20, 20, 20, 0.7)';
        header.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.3)';
    }
});

// Formulário de Contato
const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    showNotification('Mensagem enviada com sucesso! Entraremos em contato em breve.');
    contactForm.reset();
});

// Notificações
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        background: ${type === 'success' ? '#00ff88' : '#ff4444'};
        color: white;
        border-radius: 5px;
        box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
        z-index: 9999;
        animation: slideIn 0.3s ease;
    `;
    document.body.appendChild(notification);
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

// Animação ao Scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

const fadeInStyle = document.createElement('style');
fadeInStyle.textContent = `
    @keyframes fadeInUp {
        from { opacity: 0; transform: translateY(30px); }
        to { opacity: 1; transform: translateY(0); }
    }
    .service-card, .about-content, .contact-content { opacity: 0; }
`;
document.head.appendChild(fadeInStyle);

document.addEventListener('DOMContentLoaded', () => {
    const elements = document.querySelectorAll('.service-card, .about-content, .contact-content');
    elements.forEach(element => observer.observe(element));
    initCarousel();
});

// Carrossel de Produtos
function initCarousel() {
    const track = document.getElementById('carouselTrack');
    const dotsContainer = document.getElementById('carouselDots');
    if (!track) return;
    
    const originalCards = Array.from(track.querySelectorAll('.product-card'));
    const totalOriginalCards = originalCards.length;
    
    originalCards.forEach(card => {
        const clone = card.cloneNode(true);
        clone.setAttribute('aria-hidden', 'true');
        track.appendChild(clone);
    });
    
    originalCards.forEach(card => {
        const clone = card.cloneNode(true);
        clone.setAttribute('aria-hidden', 'true');
        track.appendChild(clone);
    });
    
    let cardWidth = originalCards[0].offsetWidth + 12;
    let totalOriginalWidth = cardWidth * totalOriginalCards;
    let isHovering = false;
    let isDragging = false;
    let scrollSpeed = 0.8;
    let animationId = null;
    let startX = 0;
    let scrollStart = 0;
    
    function updateMeasurements() {
        cardWidth = originalCards[0].offsetWidth + 12;
        totalOriginalWidth = cardWidth * totalOriginalCards;
    }
    
    function animateScroll() {
        if (!isHovering && !isDragging) {
            track.scrollLeft += scrollSpeed;
            if (track.scrollLeft >= totalOriginalWidth * 2) {
                track.scrollLeft = totalOriginalWidth;
            } else if (track.scrollLeft <= 0) {
                track.scrollLeft = totalOriginalWidth;
            }
        }
        animationId = requestAnimationFrame(animateScroll);
    }
    
    track.scrollLeft = totalOriginalWidth;
    
    function checkLoop() {
        if (track.scrollLeft >= totalOriginalWidth * 2) {
            track.scrollLeft = totalOriginalWidth;
        } else if (track.scrollLeft <= cardWidth) {
            track.scrollLeft = totalOriginalWidth + cardWidth;
        }
    }
    
    track.addEventListener('scroll', checkLoop);
    track.addEventListener('mouseenter', () => isHovering = true);
    track.addEventListener('mouseleave', () => isHovering = false);
    
    track.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.pageX;
        scrollStart = track.scrollLeft;
        track.style.cursor = 'grabbing';
    });
    
    track.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const walk = (startX - e.pageX) * 1.5;
        track.scrollLeft = scrollStart + walk;
    });
    
    track.addEventListener('mouseup', () => {
        isDragging = false;
        track.style.cursor = 'grab';
    });
    
    track.addEventListener('mouseleave', () => {
        if (isDragging) {
            isDragging = false;
            track.style.cursor = 'grab';
        }
    });
    
    track.addEventListener('touchstart', (e) => {
        isHovering = true;
        startX = e.touches[0].pageX;
        scrollStart = track.scrollLeft;
    }, { passive: true });
    
    track.addEventListener('touchmove', (e) => {
        const walk = (startX - e.touches[0].pageX) * 1.5;
        track.scrollLeft = scrollStart + walk;
    }, { passive: true });
    
    track.addEventListener('touchend', () => {
        setTimeout(() => isHovering = false, 3000);
    });
    
    window.addEventListener('resize', updateMeasurements);
    
    if (dotsContainer) {
        const dotsCount = Math.min(totalOriginalCards, 5);
        for (let i = 0; i < dotsCount; i++) {
            const dot = document.createElement('button');
            dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
            dot.setAttribute('aria-label', `Grupo ${i + 1}`);
            dot.addEventListener('click', () => {
                const targetScroll = totalOriginalWidth + (i * cardWidth * Math.ceil(totalOriginalCards / dotsCount));
                track.scrollTo({ left: targetScroll, behavior: 'smooth' });
            });
            dotsContainer.appendChild(dot);
        }
        
        track.addEventListener('scroll', () => {
            const dots = dotsContainer.querySelectorAll('.carousel-dot');
            const relativeScroll = (track.scrollLeft - totalOriginalWidth + totalOriginalWidth) % totalOriginalWidth;
            const activeIndex = Math.floor(relativeScroll / (totalOriginalWidth / dots.length));
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === Math.min(activeIndex, dots.length - 1));
            });
        });
    }
    
    track.style.cursor = 'grab';
    animateScroll();
}

// Efeito Hover nos Cards
const serviceCards = document.querySelectorAll('.service-card');
serviceCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.querySelector('.service-icon').style.transform = 'scale(1.1) rotate(5deg)';
    });
    card.addEventListener('mouseleave', function() {
        this.querySelector('.service-icon').style.transform = 'scale(1) rotate(0deg)';
    });
});

// WhatsApp Chat
const whatsappBtn = document.getElementById('whatsappBtn');
const whatsappChat = document.getElementById('whatsappChat');
const chatClose = document.getElementById('chatClose');
const step1 = document.getElementById('step1');
const step2 = document.getElementById('step2');
const step3 = document.getElementById('step3');
const serviceOptions = document.querySelectorAll('.service-option');
const storeOptions = document.querySelectorAll('.store-option');
const backToStep1 = document.getElementById('backToStep1');
const backToStep2 = document.getElementById('backToStep2');
const confirmSend = document.getElementById('confirmSend');
const selectedServiceText = document.getElementById('selectedServiceText');
const selectedStoreText = document.getElementById('selectedStoreText');
const summaryService = document.getElementById('summaryService');
const summaryStore = document.getElementById('summaryStore');

let selectedService = null;
let selectedServiceName = null;
let selectedPhone = null;
let selectedStoreName = null;

const serviceMessages = {
    'conserto': { name: 'Conserto de Celular', message: 'Olá! Gostaria de um orçamento para conserto de celular.' },
    'computador': { name: 'Manutenção de Computadores', message: 'Olá! Gostaria de um orçamento para manutenção de computador.' },
    'acessorios': { name: 'Acessórios para Celular', message: 'Olá! Gostaria de saber sobre os acessórios disponíveis.' },
    'outro': { name: 'Outro Assunto', message: 'Olá! Gostaria de mais informações.' }
};

function showStep(step) {
    step1.style.display = 'none';
    step2.style.display = 'none';
    step3.style.display = 'none';
    step.style.display = 'block';
}

function resetChat() {
    selectedService = null;
    selectedServiceName = null;
    selectedPhone = null;
    selectedStoreName = null;
    showStep(step1);
}

whatsappBtn.addEventListener('click', () => {
    const isOpen = whatsappChat.classList.contains('active');
    if (isOpen) {
        whatsappChat.classList.remove('active');
        whatsappBtn.classList.remove('active');
    } else {
        resetChat();
        whatsappChat.classList.add('active');
        whatsappBtn.classList.add('active');
    }
});

chatClose.addEventListener('click', () => {
    whatsappChat.classList.remove('active');
    whatsappBtn.classList.remove('active');
});

document.addEventListener('click', (e) => {
    if (!whatsappChat.contains(e.target) && !whatsappBtn.contains(e.target)) {
        whatsappChat.classList.remove('active');
        whatsappBtn.classList.remove('active');
    }
});

serviceOptions.forEach(option => {
    option.addEventListener('click', () => {
        selectedService = option.dataset.service;
        selectedServiceName = serviceMessages[selectedService].name;
        selectedServiceText.textContent = selectedServiceName;
        showStep(step2);
    });
});

storeOptions.forEach(option => {
    option.addEventListener('click', () => {
        selectedPhone = option.dataset.phone;
        selectedStoreName = option.dataset.store;
        selectedStoreText.textContent = selectedStoreName;
        summaryService.textContent = selectedServiceName;
        summaryStore.textContent = selectedStoreName;
        showStep(step3);
    });
});

backToStep1.addEventListener('click', () => showStep(step1));
backToStep2.addEventListener('click', () => showStep(step2));

confirmSend.addEventListener('click', () => {
    if (!selectedPhone || !selectedService) return;
    const message = serviceMessages[selectedService].message;
    const whatsappUrl = `https://wa.me/${selectedPhone}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    whatsappChat.classList.remove('active');
    whatsappBtn.classList.remove('active');
});

setInterval(() => {
    if (!whatsappBtn.classList.contains('active')) {
        whatsappBtn.style.animation = 'pulse 1s ease';
        setTimeout(() => whatsappBtn.style.animation = '', 1000);
    }
}, 4000);

const pulseStyle = document.createElement('style');
pulseStyle.textContent = `
    @keyframes pulse {
        0% { box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3); }
        50% { box-shadow: 0 5px 30px rgba(37, 211, 102, 0.8); }
        100% { box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3); }
    }
`;
document.head.appendChild(pulseStyle);

// Ano dinâmico no footer
const yearSpan = document.querySelector('.footer-bottom p');
const currentYear = new Date().getFullYear();
yearSpan.innerHTML = yearSpan.innerHTML.replace('2024', currentYear);

// Partículas do Hero
function initParticles() {
    const particlesContainer = document.getElementById('particles');
    if (!particlesContainer) return;
    const particleCount = window.innerWidth < 768 ? 15 : 25;
    for (let i = 0; i < particleCount; i++) {
        createParticle(particlesContainer);
    }
}

function createParticle(container) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    const size = Math.random() * 4 + 2;
    const left = Math.random() * 100;
    const delay = Math.random() * 8;
    const duration = Math.random() * 4 + 6;
    const opacity = Math.random() * 0.5 + 0.2;
    particle.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        left: ${left}%;
        animation: particleFloat ${duration}s ease-in-out infinite;
        animation-delay: ${delay}s;
        opacity: 0;
    `;
    particle.style.setProperty('--opacity', opacity);
    container.appendChild(particle);
}

const particleStyle = document.createElement('style');
particleStyle.textContent = `
    @keyframes particleFloat {
        0% { opacity: 0; transform: translateY(100vh) scale(0); }
        10% { opacity: var(--opacity, 0.3); }
        90% { opacity: var(--opacity, 0.3); }
        100% { opacity: 0; transform: translateY(-20vh) scale(1); }
    }
`;
document.head.appendChild(particleStyle);

// Animações de Scroll
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('[data-aos]');
    const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('aos-animate');
        });
    }, observerOptions);
    animatedElements.forEach(el => {
        el.classList.add('aos-init');
        observer.observe(el);
    });
}

const aosStyle = document.createElement('style');
aosStyle.textContent = `
    [data-aos] { opacity: 0; transition: opacity 0.8s ease, transform 0.8s ease; }
    [data-aos="fade-up"] { transform: translateY(30px); }
    [data-aos="zoom-in"] { transform: scale(0.9); }
    [data-aos].aos-animate { opacity: 1; transform: translateY(0) scale(1); }
`;
document.head.appendChild(aosStyle);

const heroWhatsAppBtn = document.getElementById('heroWhatsApp');
if (heroWhatsAppBtn) {
    heroWhatsAppBtn.addEventListener('click', () => {
        whatsappChat.classList.add('active');
        whatsappBtn.classList.add('active');
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initParticles();
    initScrollAnimations();
});

// Mapa
function initMap() {
    const stores = [
        {
            name: 'Loja 1 - Pilares',
            address: 'Rua Soares Meireles, 176',
            neighborhood: 'Pilares, Rio de Janeiro - RJ',
            fullAddress: 'Rua Soares Meireles, 176 - Pilares, Rio de Janeiro, RJ',
            coords: [-22.879068253764505, -43.29310563124443],
            pinNumber: '1',
            pinClass: 'pin-1'
        },
        {
            name: 'Loja 2 - Engenho da Rainha',
            address: 'Rua Carlos Gonçalves Penna, 192',
            neighborhood: 'Engenho da Rainha, Rio de Janeiro - RJ',
            fullAddress: 'Rua Carlos Gonçalves Penna, 192 - Engenho da Rainha, Rio de Janeiro, RJ',
            coords: [-22.869596723316267, -43.298062461034725],
            pinNumber: '2',
            pinClass: 'pin-2'
        }
    ];

    const centerLat = (stores[0].coords[0] + stores[1].coords[0]) / 2;
    const centerLng = (stores[0].coords[1] + stores[1].coords[1]) / 2;

    const map = L.map('storeMap', {
        center: [centerLat, centerLng],
        zoom: 14,
        zoomControl: true,
        scrollWheelZoom: false
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 19
    }).addTo(map);

    stores.forEach((store) => {
        const customIcon = L.divIcon({
            className: 'custom-pin-wrapper',
            html: `<div class="custom-pin ${store.pinClass}"><span>${store.pinNumber}</span></div>`,
            iconSize: [44, 56],
            iconAnchor: [22, 56],
            popupAnchor: [0, -56]
        });

        const encodedAddress = encodeURIComponent(store.fullAddress);
        const popupContent = `
            <div class="popup-content">
                <h4>🦍 ${store.name}</h4>
                <p>${store.address}<br>${store.neighborhood}</p>
                <a href="https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}" target="_blank" class="popup-btn">Como chegar</a>
            </div>
        `;

        L.marker(store.coords, { icon: customIcon })
            .addTo(map)
            .bindPopup(popupContent, { maxWidth: 250, className: 'custom-popup' });
    });

    const bounds = L.latLngBounds(stores.map(s => s.coords));
    map.fitBounds(bounds, { padding: [60, 60] });
}

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('storeMap') && typeof L !== 'undefined') {
        initMap();
    }
});
