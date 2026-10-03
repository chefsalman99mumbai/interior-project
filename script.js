/* =========================================================
   TRUSTED-BY — 3D ORBIT RING
   ========================================================= */

(function(){
    'use strict';

    var section = document.querySelector('.clients-band');
    if(!section) return;

    var reduceMotion = window.matchMedia &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if(reduceMotion) return;

    var ring = document.getElementById('clientsRing');
    if(!ring) return;

    var items = Array.prototype.slice.call(
        ring.querySelectorAll('.client-item')
    );
    if(!items.length) return;

    function radiusFor(width){
        if(width < 520) return 420;
        if(width < 850) return 620;
        return 880;
    }

    function init(){
        if(!window.gsap || !window.ScrollTrigger) return;

        var gs = window.gsap;
        gs.registerPlugin(window.ScrollTrigger);

        var total   = items.length;
        var step    = 360 / total;
        var radius  = radiusFor(window.innerWidth);
        var progressFill = document.getElementById('clientsProgress');

        /* ---- position each item around the circle ---- */
        function layoutItems(){
            items.forEach(function(item, i){
                var angle = i * step;
                item.style.transform =
                    'rotateY(' + angle + 'deg) translateZ(' + radius + 'px)';
            });
        }

        layoutItems();

        /* ---- activate orbit mode (hides the fallback grid) ---- */
        section.classList.add('orbit-active');

        /* ---- per-item visibility based on facing ---- */
        function paintFacing(rotDeg){
            items.forEach(function(item, i){
                var a = (i * step + rotDeg) % 360;
                if(a < 0) a += 360;

                var rad = a * Math.PI / 180;
                var facing = Math.cos(rad);        /* 1 = front, -1 = back */

                var op = 0.15 + 0.85 * ((facing + 1) / 2);
                item.style.opacity = op.toFixed(3);

                var blur = Math.max(0, -facing) * 2.4;
                item.style.filter = blur > 0.05
                    ? 'blur(' + blur.toFixed(2) + 'px)'
                    : 'none';
            });
        }

        /* initial paint so nothing is invisible on first frame */
        paintFacing(0);

        /* ---- scroll-driven rotation ---- */
        var TOTAL_ROTATION = 360 * 2; /* two full revolutions over the pin */

        ScrollTrigger.create({
            trigger: section,
            start: 'top top',
            end: '+=2000',
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: function(self){
                var rot = -self.progress * TOTAL_ROTATION;
                gs.set(ring, { rotationY: rot, force3D: true });

                if(progressFill){
                    gs.set(progressFill, { scaleX: self.progress });
                }

                paintFacing(rot);
            }
        });

        /* ---- re-layout on resize ---- */
        var resizeTimer;
        window.addEventListener('resize', function(){
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(function(){
                radius = radiusFor(window.innerWidth);
                layoutItems();
                ScrollTrigger.refresh();
            }, 180);
        });
    }

    /* ---- wait for GSAP to be ready ---- */
    var tries = 0;
    var timer = setInterval(function(){
        tries++;
        if(window.gsap && window.ScrollTrigger){
            clearInterval(timer);
            init();
        } else if(tries > 60){
            clearInterval(timer);
            /* GSAP never loaded — leave the fallback grid visible */
        }
    }, 100);
})();
