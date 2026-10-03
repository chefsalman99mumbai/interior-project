/* =========================================================
   NAVIGATION & UI
   ========================================================= */

(function(){
    'use strict';

    const panel  = () => document.getElementById('indexPanel');
    const button = () => document.querySelector('.index-btn');

    window.toggleIndex = function(){
        const el  = panel();
        const btn = button();
        if(!el) return;
        const isOpen = el.classList.toggle('open');
        if(btn) btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    };

    window.closeIndex = function(){
        const el  = panel();
        const btn = button();
        if(el) el.classList.remove('open');
        if(btn) btn.setAttribute('aria-expanded','false');
    };

    window.toggleSubmenu = function(btn){
        const item = btn.closest('.index-item');
        if(!item) return;
        const isOpen = item.classList.toggle('open');
        btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    };

    document.addEventListener('click', function(event){
        const el  = panel();
        const btn = button();
        if(!el || !el.classList.contains('open')) return;
        if(el.contains(event.target) || (btn && btn.contains(event.target))) return;
        closeIndex();
    });

    document.addEventListener('keydown', function(event){
        if(event.key === 'Escape') closeIndex();
    });

    window.indexNav = function(evt, elem){
        if(evt){
            evt.preventDefault();
            evt.stopPropagation();
        }

        const hash = (elem && elem.getAttribute)
            ? elem.getAttribute('href')
            : '';

        const el  = panel();
        const btn = button();
        if(el)  el.classList.remove('open');
        if(btn) btn.setAttribute('aria-expanded','false');

        if(!hash || hash.charAt(0) !== '#') return;

        requestAnimationFrame(function(){
            const target = document.querySelector(hash);
            if(!target) return;

            target.scrollIntoView({behavior:'smooth', block:'start'});

            if(history && history.replaceState){
                history.replaceState(null, '', hash);
            } else {
                location.hash = hash;
            }
        });
    };
})();


function submitForm(e){
    e.preventDefault();
    const toast = document.getElementById('toast');
    if(!toast) return;
    toast.classList.add('show');
    setTimeout(function(){ toast.classList.remove('show'); }, 3600);
    e.target.reset();
}


(function(){
    const el = document.getElementById('currentYear');
    if(el) el.textContent = new Date().getFullYear();
})();


/* =========================================================
   GSAP HEADING REVEALS + NATIVE FALLBACK
   ========================================================= */

(function(){
    'use strict';

    const reduceMotion = window.matchMedia &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const mobileQuery = window.matchMedia('(max-width: 768px)');

    function showAll(){
        document.querySelectorAll('h1,h2,h3,.hero-content').forEach(function(el){
            el.style.opacity = '1';
            el.style.transform = 'none';
            el.style.willChange = 'auto';
        });
    }

    if(reduceMotion){ showAll(); return; }

    function loadScript(src){
        return new Promise(function(resolve, reject){
            const existing = document.querySelector('script[src="' + src + '"]');
            if(existing){
                if(src.indexOf('ScrollTrigger') !== -1 && window.ScrollTrigger) return resolve();
                if(src.indexOf('gsap') !== -1 && window.gsap) return resolve();
            }
            const script = document.createElement('script');
            script.src = src;
            script.async = false;
            script.onload = function(){ resolve(); };
            script.onerror = function(){ reject(new Error('Failed: ' + src)); };
            document.head.appendChild(script);
        });
    }

    async function ensureGSAP(){
        if(window.gsap && window.ScrollTrigger) return true;
        const pairs = [
            ['https://cdn.jsdelivr.net/npm/gsap@3.12.7/dist/gsap.min.js','https://cdn.jsdelivr.net/npm/gsap@3.12.7/dist/ScrollTrigger.min.js'],
            ['https://unpkg.com/gsap@3.12.7/dist/gsap.min.js','https://unpkg.com/gsap@3.12.7/dist/ScrollTrigger.min.js']
        ];
        for(const pair of pairs){
            try{
                if(!window.gsap) await loadScript(pair[0]);
                if(!window.ScrollTrigger) await loadScript(pair[1]);
                if(window.gsap && window.ScrollTrigger) return true;
            }catch(err){ /* try next CDN */ }
        }
        return false;
    }

    function nativeFallback(){
        const headings = Array.from(document.querySelectorAll(
            'main h1, main h2, main h3, section h1, section h2, section h3'
        )).filter(function(el, i, arr){ return arr.indexOf(el) === i; });

        const heroContent = document.querySelector('.hero-content');
        const items = heroContent
            ? [heroContent].concat(headings.filter(function(h){ return !h.closest('.hero'); }))
            : headings.filter(function(h){ return !h.closest('.hero'); });

        items.forEach(function(el){
            el.style.willChange = 'transform, opacity';
            el.style.opacity = '0';
        });

        function update(){
            const vh = window.innerHeight || document.documentElement.clientHeight;
            const mobile = mobileQuery.matches;
            const start = mobile ? vh * 0.98 : vh * 0.92;
            const end   = mobile ? vh * 0.60 : vh * 0.55;

            items.forEach(function(el){
                const r = el.getBoundingClientRect();
                let progress = (start - r.top) / (start - end);
                if(el === heroContent){
                    progress = (start - r.top) / Math.max(1, start - vh * 0.45);
                }
                progress = Math.max(0, Math.min(1, progress));
                const x = (mobile ? -26 : -38) * (1 - progress);
                el.style.opacity = String(progress);
                el.style.transform = 'translate3d(' + x + '%,0,0)';
            });
        }

        let ticking = false;
        function requestUpdate(){
            if(ticking) return;
            ticking = true;
            requestAnimationFrame(function(){ ticking = false; update(); });
        }

        window.addEventListener('scroll', requestUpdate, {passive:true});
        window.addEventListener('resize', requestUpdate, {passive:true});
        window.addEventListener('orientationchange', function(){ setTimeout(update, 250); });
        update();
    }

    function initGSAP(){
        if(!window.gsap){ nativeFallback(); return; }

        try{
            const gs = window.gsap;
            const isMobile = window.matchMedia('(max-width: 850px)').matches;
            const headings = Array.from(document.querySelectorAll(
                'main h1, main h2, main h3, section h1, section h2, section h3'
            )).filter(function(el, i, arr){ return arr.indexOf(el) === i; });

            const heroContent = document.querySelector('.hero-content');
            if(heroContent){
                gs.fromTo(heroContent,
                    {xPercent:isMobile ? -18 : -28, opacity:0},
                    {xPercent:0, opacity:1, duration:1.15, ease:'power4.out', overwrite:'auto'}
                );
            }

            const played = new WeakSet();
            let ticking = false;

            headings.forEach(function(heading){
                heading.classList.add('gsap-heading');
                heading.style.visibility = 'visible';
                heading.style.opacity = '1';
                heading.style.willChange = 'transform';
                gs.set(heading, { xPercent: isMobile ? -30 : -42, y: 0, force3D: true });
            });

            function reveal(heading){
                if(!heading || played.has(heading)) return;
                played.add(heading);
                gs.killTweensOf(heading);
                gs.to(heading, {
                    xPercent: 0, y: 0,
                    duration: isMobile ? 0.92 : 1.02,
                    ease: 'power4.out',
                    overwrite: 'auto',
                    force3D: true,
                    onComplete: function(){ heading.style.willChange = 'auto'; }
                });
            }

            function revealVisibleHeadings(){
                ticking = false;
                const vh = window.innerHeight || document.documentElement.clientHeight || 800;
                const trigger = isMobile ? vh * 0.90 : vh * 0.86;
                headings.forEach(function(heading){
                    if(played.has(heading)) return;
                    const rect = heading.getBoundingClientRect();
                    if(rect.top <= trigger && rect.bottom >= -120) reveal(heading);
                });
            }

            function requestHeadingCheck(){
                if(ticking) return;
                ticking = true;
                requestAnimationFrame(revealVisibleHeadings);
            }

            window.addEventListener('scroll', requestHeadingCheck, {passive:true});
            window.addEventListener('resize', requestHeadingCheck, {passive:true});
            window.addEventListener('orientationchange', function(){
                setTimeout(requestHeadingCheck, 100);
                setTimeout(requestHeadingCheck, 450);
            }, {passive:true});

            if('IntersectionObserver' in window){
                const observer = new IntersectionObserver(function(entries){
                    entries.forEach(function(entry){
                        if(entry.isIntersecting) reveal(entry.target);
                    });
                }, {
                    root: null,
                    rootMargin: isMobile ? '0px 0px -8% 0px' : '0px 0px -12% 0px',
                    threshold: 0
                });
                headings.forEach(function(heading){ observer.observe(heading); });
            }

            requestAnimationFrame(requestHeadingCheck);
            setTimeout(requestHeadingCheck, 120);
            setTimeout(requestHeadingCheck, 400);
            setTimeout(requestHeadingCheck, 850);

            if(document.fonts && document.fonts.ready){
                document.fonts.ready.then(function(){
                    requestHeadingCheck();
                    setTimeout(requestHeadingCheck, 180);
                }).catch(function(){});
            }

            window.addEventListener('load', function(){
                requestHeadingCheck();
                setTimeout(requestHeadingCheck, 250);
            }, {once:true});

            if(window.ScrollTrigger){
                try{
                    gs.registerPlugin(window.ScrollTrigger);
                    window.ScrollTrigger.config({ ignoreMobileResize:true, limitCallbacks:true });
                }catch(e){ /* noop */ }
            }
        }catch(err){
            console.warn('FIZZA INTERIOR: GSAP heading fallback engaged.', err);
            showAll();
        }
    }

    (async function(){
        const ready = await ensureGSAP();
        if(ready){ requestAnimationFrame(initGSAP); }
        else{ nativeFallback(); }
    })();
})();


/* =========================================================
   SCROLL-DRIVEN LOGO COLOR CYCLING
   ========================================================= */

(function(){
    'use strict';

    var stops = [
        '#D4AF37',
        '#F0D77C',
        '#E8B93C',
        '#D4943C',
        '#B87333',
        '#9C5A3C',
        '#B76E79',
        '#F5E6D3',
        '#E0F2E9',
        '#A7E3C2',
        '#6FBF9A',
        '#3DA88C',
        '#1E8A78',
        '#0F6E5E',
        '#D4AF37'
    ];

    function hexToRgb(hex){
        var value = hex.replace('#','');
        return {
            r:parseInt(value.slice(0,2),16),
            g:parseInt(value.slice(2,4),16),
            b:parseInt(value.slice(4,6),16)
        };
    }

    var rgbStops = stops.map(hexToRgb);

    function colorAt(progress){
        var scaled = progress * (rgbStops.length - 1);
        var index  = Math.min(rgbStops.length - 2, Math.floor(scaled));
        var local  = scaled - index;
        local = local * local * (3 - 2 * local);

        var a  = rgbStops[index];
        var b  = rgbStops[Math.min(index + 1, rgbStops.length - 1)];

        var r  = Math.round(a.r + (b.r - a.r) * local);
        var g  = Math.round(a.g + (b.g - a.g) * local);
        var bl = Math.round(a.b + (b.b - a.b) * local);

        return 'rgb(' + r + ',' + g + ',' + bl + ')';
    }

    function clamp(v,min,max){ return Math.max(min,Math.min(max,v)); }

    var raf = 0;

    function render(){
        raf = 0;
        var maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
        var progress  = clamp(window.scrollY / maxScroll, 0, 1);
        var color     = colorAt(progress);

        document.documentElement.style.setProperty('--logo-color', color);
    }

    function requestRender(){
        if(raf) return;
        raf = window.requestAnimationFrame(render);
    }

    render();

    window.addEventListener('scroll', requestRender, {passive:true});
    window.addEventListener('resize', requestRender, {passive:true});
    window.addEventListener('orientationchange', function(){
        setTimeout(requestRender, 100);
        setTimeout(requestRender, 450);
    }, {passive:true});

    if(window.visualViewport){
        window.visualViewport.addEventListener('resize', requestRender, {passive:true});
    }

    window.addEventListener('load', requestRender, {once:true});
})();
