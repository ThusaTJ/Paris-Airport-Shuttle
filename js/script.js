/* ═══════════════════════════════════════════════════════
   PARIS AIRPORT SHUTTLE — script.js
════════════════════════════════════════════════════════ */
'use strict';

/* ─── GOOGLE TRANSLATE ──────────────────────────────── */
window.googleTranslateElementInit = function () {
    new google.translate.TranslateElement(
        { pageLanguage:'en', autoDisplay:false, includedLanguages:'en,es,fr,de,zh-CN,ar' },
        'google_translate_element'
    );
};

(function loadGT() {
    if (document.getElementById('gt-script')) return;
    const s = document.createElement('script');
    s.id    = 'gt-script';
    s.async = true;
    s.src   = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    document.head.appendChild(s);
})();

function doTranslate(lang) {
    let tries = 0;
    const t = setInterval(() => {
        tries++;
        const sel = document.querySelector('.goog-te-combo');
        if (sel) {
            clearInterval(t);
            sel.value = lang;
            sel.dispatchEvent(new Event('change', { bubbles:true }));
            sel.dispatchEvent(new Event('input',  { bubbles:true }));
        }
        if (tries > 60) clearInterval(t);
    }, 100);
}

function resetToEnglish() {
    ['', '.' + location.hostname].forEach(d => {
        document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${d};`;
    });
    localStorage.removeItem('pas_lang');
    localStorage.removeItem('pas_lang_label');
    location.replace(location.href.replace(/#googtrans\([^)]*\)/g, ''));
}

function restoreLang() {
    const lang  = localStorage.getItem('pas_lang');
    const label = localStorage.getItem('pas_lang_label');
    if (!lang || lang === 'en') return;
    const el = document.getElementById('currentLang');
    if (el) el.textContent = label || lang.toUpperCase();
    document.querySelectorAll('.lang-opt').forEach(b => {
        b.classList.toggle('active', b.dataset.lang === lang);
    });
    setTimeout(() => doTranslate(lang), 900);
}


/* ─── 1. NAVBAR ─────────────────────────────────────── */
function initNav() {
    const topbar    = document.getElementById('topbar');
    const mainNav   = document.getElementById('mainNav');
    const hamburger = document.getElementById('hamburger');
    const navLinks  = document.getElementById('navLinks');
    const scrollBtn = document.getElementById('scrollTop');

    if (!mainNav || !hamburger || !navLinks) return;
    if (mainNav.dataset.navInit === 'true') { updateActive(); return; }
    mainNav.dataset.navInit = 'true';

    const mq = window.matchMedia('(max-width:1150px)');
    let lastY = window.scrollY;

    function resetMenu() {
        navLinks.classList.remove('open');
        hamburger.querySelectorAll('span').forEach(s => { s.style.transform=''; s.style.opacity=''; });
        document.body.style.overflow = '';
    }

    function onScroll() {
        const sy = window.scrollY;
        if (topbar) {
            if (sy > 60 && sy > lastY) topbar.classList.add('hidden');
            else topbar.classList.remove('hidden');
            mainNav.classList.toggle('topbar-hidden', topbar.classList.contains('hidden'));
        }
        mainNav.classList.toggle('scrolled', sy > 20);
        if (scrollBtn) scrollBtn.classList.toggle('visible', sy > 400);
        lastY = sy;
        updateActive();
    }

    function updateActive() {
        const page = window.location.pathname.split('/').pop() || 'index.html';
        document.querySelectorAll('.nav-link[href]').forEach(a => {
            const href = a.getAttribute('href').split('#')[0];
            a.classList.toggle('active', href === page);
        });
    }

    window.addEventListener('scroll', onScroll, { passive:true });
    updateActive();

    hamburger.addEventListener('click', function(e) {
        e.stopPropagation();
        const isOpen = navLinks.classList.toggle('open');
        document.body.style.overflow = isOpen ? 'hidden' : '';
        const spans = hamburger.querySelectorAll('span');
        if (isOpen) {
            spans[0].style.transform = 'rotate(45deg) translate(5px,5px)';
            spans[1].style.opacity   = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(5px,-5px)';
        } else spans.forEach(s => { s.style.transform=''; s.style.opacity=''; });
    });

    navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', resetMenu));
    document.addEventListener('click', e => {
        if (!navLinks.contains(e.target) && !hamburger.contains(e.target)) resetMenu();
    });

    mq.addEventListener('change', e => { if (!e.matches) resetMenu(); });

    if (scrollBtn) scrollBtn.addEventListener('click', () => window.scrollTo({ top:0, behavior:'smooth' }));
    onScroll();
}


/* ─── 2. TRANSLATE WIDGET ───────────────────────────── */
function initTranslate() {
    const wrap  = document.getElementById('translateWrap');
    const btn   = document.getElementById('translateBtn');
    const dd    = document.getElementById('translateDropdown');
    const label = document.getElementById('currentLang');

    if (!wrap || !btn || !dd) return;
    if (wrap.dataset.trInit === 'true') return;
    wrap.dataset.trInit = 'true';

    btn.addEventListener('click', e => { e.stopPropagation(); wrap.classList.toggle('open'); });
    document.addEventListener('click', e => { if (!wrap.contains(e.target)) wrap.classList.remove('open'); });

    dd.querySelectorAll('.lang-opt').forEach(pill => {
        pill.addEventListener('click', function() {
            const lang = pill.dataset.lang;
            const lbl  = pill.dataset.label || lang.toUpperCase();
            dd.querySelectorAll('.lang-opt').forEach(p => p.classList.remove('active'));
            pill.classList.add('active');
            if (label) label.textContent = lbl;
            wrap.classList.remove('open');
            if (lang === 'en') {
                resetToEnglish();
            } else {
                localStorage.setItem('pas_lang', lang);
                localStorage.setItem('pas_lang_label', lbl);
                doTranslate(lang);
            }
        });
    });

    restoreLang();
}


/* ─── SITE CHROME ENTRY POINT ───────────────────────── */
window.initializeSiteChrome = function() {
    initNav();
    initTranslate();
};


/* ─── 3. PARTICLES ──────────────────────────────────── */
function initParticles() {
    const c = document.getElementById('heroParticles');
    if (!c) return;
    for (let i = 0; i < 35; i++) {
        const p = document.createElement('div');
        p.className = 'particle';
        const size = 2 + Math.random() * 3;
        p.style.cssText = `
            left:${Math.random()*100}%;
            top:${Math.random()*100}%;
            width:${size}px; height:${size}px;
            --dur:${7+Math.random()*10}s;
            --delay:${Math.random()*9}s;
            --dx:${(Math.random()-.5)*60}px;
        `;
        c.appendChild(p);
    }
}


/* ─── 4. SCROLL REVEAL ──────────────────────────────── */
function initScrollReveal() {
    const els = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
    if (!els.length) return;
    const io = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
        });
    }, { threshold:.1, rootMargin:'0px 0px -40px 0px' });
    els.forEach(el => io.observe(el));
}


/* ─── 5. COUNTERS ───────────────────────────────────── */
function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    const suffix = el.dataset.suffix || '';
    const steps  = 2000 / 16;
    let cur = 0;
    const timer = setInterval(() => {
        cur += target / steps;
        if (cur >= target) { clearInterval(timer); cur = target; }
        el.textContent = target >= 1000
            ? Math.round(cur/1000) + 'K+'
            : Math.round(cur) + suffix;
    }, 16);
}

function initCounters() {
    const els = document.querySelectorAll('.counter');
    if (!els.length) return;
    const io = new IntersectionObserver((entries) => {
        entries.forEach(e => { if (e.isIntersecting) { animateCounter(e.target); io.unobserve(e.target); } });
    }, { threshold:.5 });
    els.forEach(c => io.observe(c));
}


/* ─── 6. BOOKING TABS ───────────────────────────────── */
function initTabs() {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });
}


/* ─── 7. FAQ ACCORDION ──────────────────────────────── */
function initFAQ() {
    const list = document.getElementById('faqList');
    if (!list) return;

    const closeAll = () => {
        list.querySelectorAll('.faq-item').forEach(item => {
            const ans = item.querySelector('.faq-a');
            item.classList.remove('open');
            ans.classList.remove('open');
            ans.style.maxHeight = '0px';
        });
    };

    list.querySelectorAll('.faq-q').forEach(btn => {
        btn.addEventListener('click', () => {
            const item   = btn.closest('.faq-item');
            const answer = item.querySelector('.faq-a');
            const isOpen = item.classList.contains('open');
            closeAll();
            if (!isOpen) {
                item.classList.add('open');
                answer.classList.add('open');
                answer.style.maxHeight = answer.scrollHeight + 'px';
            }
        });
    });

    window.addEventListener('resize', () => {
        const open = list.querySelector('.faq-item.open .faq-a');
        if (open) open.style.maxHeight = open.scrollHeight + 'px';
    }, { passive:true });
}


/* ─── 8. FORM FLASH ─────────────────────────────────── */
function initButtons() {
    function flash(btn, msg) {
        if (!btn) return;
        const orig = btn.innerHTML;
        btn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20,6 9,17 4,12"/></svg> ${msg}`;
        btn.style.background = '#10b981';
        setTimeout(() => { btn.innerHTML = orig; btn.style.background = ''; }, 3500);
    }
    const qBtn = document.getElementById('quoteBtn');
    const sBtn = document.getElementById('submitBtn');
    if (qBtn) qBtn.addEventListener('click', () => flash(qBtn, 'Booking Request Sent!'));
    if (sBtn) sBtn.addEventListener('click', () => flash(sBtn, 'Message Sent!'));
}


/* ─── 9. NEWSLETTER ─────────────────────────────────── */
function initNewsletter() {
    const btn   = document.querySelector('.fn-btn');
    const input = document.querySelector('.fn-input');
    if (!btn || !input) return;
    btn.addEventListener('click', () => {
        if (!input.value.trim()) {
            input.style.borderColor = '#ef4444';
            setTimeout(() => input.style.borderColor = '', 2000);
            return;
        }
        btn.textContent      = '✓ Subscribed!';
        btn.style.background = '#10b981';
        input.value          = '';
        setTimeout(() => { btn.textContent = 'Subscribe'; btn.style.background = ''; }, 3500);
    });
}


/* ─── 10. SUPPRESS GOOGLE BAR ───────────────────────── */
(function suppressGoogleBar() {
    function kill() {
        document.querySelectorAll('.goog-te-banner-frame, iframe.goog-te-banner-frame').forEach(el => { el.style.display = 'none'; });
        document.body.style.top = '0';
        document.body.style.position = '';
        document.documentElement.style.marginTop = '0';
    }
    const obs = new MutationObserver(kill);
    function start() {
        kill();
        obs.observe(document.documentElement, { childList:true, subtree:true });
        let t = 0;
        const iv = setInterval(() => { kill(); if (++t > 20) clearInterval(iv); }, 300);
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
    else start();
})();


/* ─── BOOT ───────────────────────────────────────────── */
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