'use strict';

function initNav() {
    const topbar = document.getElementById('topbar');
    const mainNav = document.getElementById('mainNav');
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    const scrollBtn = document.getElementById('scrollTop');

    if (!mainNav || !hamburger || !navLinks) return;
    if (mainNav.dataset.navInit === 'true') {
        updateActive();
        return;
    }
    mainNav.dataset.navInit = 'true';

    const mq = window.matchMedia('(max-width:1240px)');
    let lastY = window.scrollY;

    function resetMenu() {
        navLinks.classList.remove('open');
        hamburger.querySelectorAll('span').forEach(span => {
            span.style.transform = '';
            span.style.opacity = '';
        });
        document.body.style.overflow = '';
    }

    function updateActive() {
        const page = window.location.pathname.split('/').pop() || 'index.html';
        document.querySelectorAll('.nav-link[href]').forEach(link => {
            const href = link.getAttribute('href').split('#')[0];
            link.classList.toggle('active', href === page);
        });
    }

    function onScroll() {
        const scrollY = window.scrollY;
        if (topbar) {
            if (scrollY > 60 && scrollY > lastY) topbar.classList.add('hidden');
            else topbar.classList.remove('hidden');
            mainNav.classList.toggle('topbar-hidden', topbar.classList.contains('hidden'));
        }
        mainNav.classList.toggle('scrolled', scrollY > 20);
        if (scrollBtn) scrollBtn.classList.toggle('visible', scrollY > 400);
        lastY = scrollY;
        updateActive();
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    updateActive();

    hamburger.addEventListener('click', event => {
        event.stopPropagation();
        const isOpen = navLinks.classList.toggle('open');
        document.body.style.overflow = isOpen ? 'hidden' : '';
        const spans = hamburger.querySelectorAll('span');
        if (isOpen) {
            spans[0].style.transform = 'rotate(45deg) translate(5px,5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(5px,-5px)';
        } else {
            spans.forEach(span => {
                span.style.transform = '';
                span.style.opacity = '';
            });
        }
    });

    navLinks.querySelectorAll('a').forEach(link => link.addEventListener('click', resetMenu));
    document.addEventListener('click', event => {
        if (!navLinks.contains(event.target) && !hamburger.contains(event.target)) resetMenu();
    });

    mq.addEventListener('change', event => {
        if (!event.matches) resetMenu();
    });

    if (scrollBtn) {
        scrollBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    onScroll();
}

window.initializeSiteChrome = function() {
    initNav();
};

function initParticles() {
    const container = document.getElementById('heroParticles');
    if (!container) return;

    for (let i = 0; i < 35; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        const size = 2 + Math.random() * 3;
        particle.style.cssText = `
            left:${Math.random() * 100}%;
            top:${Math.random() * 100}%;
            width:${size}px;
            height:${size}px;
            --dur:${7 + Math.random() * 10}s;
            --delay:${Math.random() * 9}s;
            --dx:${(Math.random() - 0.5) * 60}px;
        `;
        container.appendChild(particle);
    }
}

function initScrollReveal() {
    const elements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
    if (!elements.length) return;

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    elements.forEach(element => observer.observe(element));
}

function animateCounter(element) {
    const target = parseInt(element.dataset.target, 10);
    const suffix = element.dataset.suffix || '';
    const steps = 2000 / 16;
    let current = 0;

    const timer = setInterval(() => {
        current += target / steps;
        if (current >= target) {
            clearInterval(timer);
            current = target;
        }

        element.textContent = target >= 1000
            ? `${Math.round(current / 1000)}K+`
            : `${Math.round(current)}${suffix}`;
    }, 16);
}

function initCounters() {
    const counters = document.querySelectorAll('.counter');
    if (!counters.length) return;

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => observer.observe(counter));
}

function initTabs() {
    document.querySelectorAll('.tab-btn').forEach(button => {
        button.addEventListener('click', () => {
            document.querySelectorAll('.tab-btn').forEach(tab => tab.classList.remove('active'));
            button.classList.add('active');
        });
    });
}

function initFAQ() {
    const list = document.getElementById('faqList');
    if (!list) return;

    const closeAll = () => {
        list.querySelectorAll('.faq-item').forEach(item => {
            const answer = item.querySelector('.faq-a');
            item.classList.remove('open');
            answer.classList.remove('open');
            answer.style.maxHeight = '0px';
        });
    };

    list.querySelectorAll('.faq-q').forEach(button => {
        button.addEventListener('click', () => {
            const item = button.closest('.faq-item');
            const answer = item.querySelector('.faq-a');
            const isOpen = item.classList.contains('open');

            closeAll();

            if (!isOpen) {
                item.classList.add('open');
                answer.classList.add('open');
                answer.style.maxHeight = `${answer.scrollHeight}px`;
            }
        });
    });

    window.addEventListener('resize', () => {
        const openAnswer = list.querySelector('.faq-item.open .faq-a');
        if (openAnswer) openAnswer.style.maxHeight = `${openAnswer.scrollHeight}px`;
    }, { passive: true });
}

function initButtons() {
    function flash(button, message) {
        if (!button) return;

        const original = button.innerHTML;
        button.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20,6 9,17 4,12"/></svg> ${message}`;
        button.style.background = '#10b981';

        setTimeout(() => {
            button.innerHTML = original;
            button.style.background = '';
        }, 3500);
    }

    const quoteButton = document.getElementById('quoteBtn');
    const submitButton = document.getElementById('submitBtn');

    if (quoteButton) quoteButton.addEventListener('click', () => flash(quoteButton, 'Booking Request Sent!'));
    if (submitButton) submitButton.addEventListener('click', () => flash(submitButton, 'Message Sent!'));
}

function initNewsletter() {
    const button = document.querySelector('.fn-btn');
    const input = document.querySelector('.fn-input');
    if (!button || !input) return;

    button.addEventListener('click', () => {
        if (!input.value.trim()) {
            input.style.borderColor = '#ef4444';
            setTimeout(() => {
                input.style.borderColor = '';
            }, 2000);
            return;
        }

        button.textContent = 'Subscribed!';
        button.style.background = '#10b981';
        input.value = '';

        setTimeout(() => {
            button.textContent = 'Subscribe';
            button.style.background = '';
        }, 3500);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    window.initializeSiteChrome();
    initParticles();
    initScrollReveal();
    initCounters();
    initTabs();
    initFAQ();
    initButtons();
    initNewsletter();
});

