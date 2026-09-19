/* =========================================================
   FIZZA INTERIOR — FINAL SCRIPT
   Glass Navigation + Mobile Persistence + Interactions
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

    /* =====================================================
       ELEMENT REFERENCES
       ===================================================== */

    const nav = document.getElementById('nav');
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');
    const contactForm = document.getElementById('contactForm');
    const adminModal = document.getElementById('adminModal');
    const adminClose = document.querySelector('.admin-close');

    /* =====================================================
       GLASS NAVIGATION
       -----------------------------------------------------
       Important:
       - Removes the old lavender scroll-shadow behaviour.
       - Keeps the navigation fixed.
       - Prevents mobile browsers from visually dropping it.
       ===================================================== */

    function maintainGlassNav() {

        if (!nav) return;

        nav.style.boxShadow = 'none';

        nav.style.transform = 'translate3d(0,0,0)';
        nav.style.webkitTransform = 'translate3d(0,0,0)';

        const isMobile = window.matchMedia(
            '(max-width: 768px)'
        ).matches;

        if (isMobile) {

            nav.style.position = 'fixed';
            nav.style.top = '0';
            nav.style.left = '0';
            nav.style.right = '0';
            nav.style.width = '100%';
            nav.style.visibility = 'visible';
            nav.style.opacity = '1';
        }
    }

    maintainGlassNav();

    window.addEventListener(
        'scroll',
        maintainGlassNav,
        { passive: true }
    );

    window.addEventListener(
        'resize',
        maintainGlassNav,
        { passive: true }
    );

    window.addEventListener(
        'orientationchange',
        maintainGlassNav,
        { passive: true }
    );


    /* =====================================================
       HAMBURGER / MOBILE MENU
       ===================================================== */

    function setMobileMenu(open) {

        if (!mobileMenu || !hamburger) return;

        mobileMenu.classList.toggle('active', open);

        hamburger.classList.toggle('active', open);

        hamburger.setAttribute(
            'aria-expanded',
            open ? 'true' : 'false'
        );

        document.body.classList.toggle(
            'mobile-menu-open',
            open
        );
    }


    if (hamburger && mobileMenu) {

        hamburger.addEventListener('click', () => {

            const isOpen =
                mobileMenu.classList.contains('active');

            setMobileMenu(!isOpen);
        });


        /* Close mobile menu after selecting a section */

        const mobileLinks =
            mobileMenu.querySelectorAll('a');

        mobileLinks.forEach(link => {

            link.addEventListener('click', () => {
                setMobileMenu(false);
            });

        });
    }


    /* Close menu when switching back to desktop */

    window.addEventListener('resize', () => {

        if (
            window.innerWidth > 768 &&
            mobileMenu &&
            mobileMenu.classList.contains('active')
        ) {
            setMobileMenu(false);
        }

    });


    /* =====================================================
       REVEAL ON SCROLL
       ===================================================== */

    const reveals =
        document.querySelectorAll('.reveal');


    if ('IntersectionObserver' in window) {

        const revealObserver =
            new IntersectionObserver(
                (entries, observer) => {

                    entries.forEach(entry => {

                        if (entry.isIntersecting) {

                            entry.target.classList.add(
                                'active'
                            );

                            observer.unobserve(
                                entry.target
                            );
                        }

                    });

                },
                {
                    threshold: 0.1,
                    rootMargin: '0px 0px -40px 0px'
                }
            );


        reveals.forEach(element => {

            revealObserver.observe(element);

        });

    } else {

        /* Fallback for older browsers */

        reveals.forEach(element => {

            element.classList.add('active');

        });

    }


    /* =====================================================
       CONTACT FORM → WHATSAPP
       ===================================================== */

    if (contactForm) {

        contactForm.addEventListener(
            'submit',
            function (event) {

                event.preventDefault();

                const name =
                    document.getElementById('name')?.value.trim() || '';

                const phone =
                    document.getElementById('phone')?.value.trim() || '';

                const message =
                    document.getElementById('message')?.value.trim() || '';


                const text =
                    `Hello Fizza Interior! My name is ${name} (${phone}). ` +
                    `I have a specific vision for my space: ${message}`;


                const whatsappURL =
                    `https://wa.me/919876543210?text=${encodeURIComponent(text)}`;


                window.open(
                    whatsappURL,
                    '_blank',
                    'noopener,noreferrer'
                );

            }
        );

    }


    /* =====================================================
       ADMIN LOGIN
       ===================================================== */

    function getStoredPassword() {

        return (
            localStorage.getItem(
                'fizza_admin_password'
            ) || 'admin123'
        );

    }


    window.openAdmin = function () {

        if (!adminModal) return;

        adminModal.classList.add('active');

        const passwordSection =
            document.getElementById(
                'passwordChangeSection'
            );

        const loginError =
            document.getElementById(
                'loginError'
            );

        const updateMsg =
            document.getElementById(
                'updateMsg'
            );

        const adminEmail =
            document.getElementById(
                'adminEmail'
            );

        const adminPass =
            document.getElementById(
                'adminPass'
            );

        const newPass =
            document.getElementById(
                'newPass'
            );


        if (passwordSection) {
            passwordSection.style.display = 'none';
        }

        if (loginError) {
            loginError.style.display = 'none';
        }

        if (updateMsg) {

            updateMsg.textContent = '';

            updateMsg.className =
                'update-msg';
        }

        if (adminEmail) {
            adminEmail.value =
                'admin@fizza.com';
        }

        if (adminPass) {
            adminPass.value = '';
        }

        if (newPass) {
            newPass.value = '';
        }

        document.body.classList.add(
            'admin-modal-open'
        );
    };


    window.closeAdmin = function () {

        if (!adminModal) return;

        adminModal.classList.remove('active');

        document.body.classList.remove(
            'admin-modal-open'
        );
    };


    window.checkLogin = function () {

        const email =
            document.getElementById(
                'adminEmail'
            )?.value.trim() || '';

        const pass =
            document.getElementById(
                'adminPass'
            )?.value.trim() || '';

        const storedPass =
            getStoredPassword();


        const loginError =
            document.getElementById(
                'loginError'
            );

        const passwordSection =
            document.getElementById(
                'passwordChangeSection'
            );

        const adminPass =
            document.getElementById(
                'adminPass'
            );


        if (
            email === 'admin@fizza.com' &&
            pass === storedPass
        ) {

            if (loginError) {
                loginError.style.display =
                    'none';
            }

            if (passwordSection) {
                passwordSection.style.display =
                    'block';
            }

            if (adminPass) {
                adminPass.value = '';
            }

            alert(
                'Welcome Admin! You can now change your password below.'
            );

        } else {

            if (loginError) {
                loginError.style.display =
                    'block';
            }

        }

    };


    window.updatePassword = function () {

        const newPass =
            document.getElementById(
                'newPass'
            )?.value.trim() || '';

        const msgEl =
            document.getElementById(
                'updateMsg'
            );


        if (newPass.length < 4) {

            if (msgEl) {

                msgEl.textContent =
                    'Password must be at least 4 characters.';

                msgEl.className =
                    'update-msg error';
            }

            return;
        }


        localStorage.setItem(
            'fizza_admin_password',
            newPass
        );


        if (msgEl) {

            msgEl.textContent =
                'Password updated successfully! (for this browser only)';

            msgEl.className =
                'update-msg';
        }


        const passwordInput =
            document.getElementById(
                'newPass'
            );

        if (passwordInput) {
            passwordInput.value = '';
        }

    };


    /* =====================================================
       ADMIN MODAL — CLOSE BUTTON
       ===================================================== */

    if (adminClose) {

        adminClose.addEventListener(
            'click',
            window.closeAdmin
        );


        adminClose.addEventListener(
            'keydown',
            event => {

                if (
                    event.key === 'Enter' ||
                    event.key === ' '
                ) {

                    event.preventDefault();

                    window.closeAdmin();
                }

            }
        );

    }


    /* =====================================================
       ADMIN MODAL — ESCAPE KEY
       ===================================================== */

    document.addEventListener(
        'keydown',
        event => {

            if (event.key === 'Escape') {

                if (
                    adminModal &&
                    adminModal.classList.contains('active')
                ) {

                    window.closeAdmin();

                }

                if (
                    mobileMenu &&
                    mobileMenu.classList.contains('active')
                ) {

                    setMobileMenu(false);

                }

            }

        }
    );


    /* =====================================================
       ADMIN MODAL — BACKDROP CLICK
       ===================================================== */

    if (adminModal) {

        adminModal.addEventListener(
            'click',
            event => {

                if (
                    event.target ===
                    event.currentTarget
                ) {

                    window.closeAdmin();

                }

            }
        );

    }


    /* =====================================================
       CLIENTELE CROSSFADE
       ===================================================== */

    const totalClients = 12;

    const fadeContainer =
        document.getElementById(
            'clientsFade'
        );


    if (fadeContainer) {

        for (
            let i = 1;
            i <= totalClients;
            i++
        ) {

            const item =
                document.createElement(
                    'div'
                );

            item.className =
                'client-item';


            const logoImg =
                document.createElement(
                    'img'
                );

            logoImg.src =
                `client-${i}.png`;

            logoImg.alt =
                `Client ${i}`;

            logoImg.className =
                'client-logo';


            /*
             * Prevent broken-image icons from
             * disturbing the crossfade layout.
             */

            logoImg.addEventListener(
                'error',
                () => {

                    logoImg.style.display =
                        'none';

                }
            );


            item.appendChild(
                logoImg
            );

            fadeContainer.appendChild(
                item
            );

        }


        let currentClient = 0;

        const clientItems =
            document.querySelectorAll(
                '.client-item'
            );

        const crossfadeBox =
            document.querySelector(
                '.clients-crossfade'
            );


        function showClient(index) {

            if (!clientItems.length) return;

            clientItems.forEach(item => {

                item.classList.remove(
                    'active',
                    'exit'
                );

            });


            if (clientItems[index]) {

                clientItems[index].classList.add(
                    'active'
                );

            }


            if (crossfadeBox) {

                crossfadeBox.classList.add(
                    'fog-up',
                    'fog-down'
                );


                window.setTimeout(
                    () => {

                        crossfadeBox.classList.remove(
                            'fog-up',
                            'fog-down'
                        );

                    },
                    1200
                );

            }

        }


        function nextClient() {

            if (!clientItems.length) return;


            if (clientItems[currentClient]) {

                clientItems[currentClient]
                    .classList.add('exit');

            }


            window.setTimeout(
                () => {

                    currentClient =
                        (
                            currentClient + 1
                        ) %
                        clientItems.length;

                    showClient(
                        currentClient
                    );

                },
                800
            );

        }


        showClient(0);


        /*
         * Pause the carousel when the browser tab
         * is hidden. This reduces unnecessary work
         * on mobile devices.
         */

        let clientInterval = null;


        function startClientRotation() {

            if (clientInterval) return;

            clientInterval =
                window.setInterval(
                    nextClient,
                    2500
                );

        }


        function stopClientRotation() {

            if (!clientInterval) return;

            window.clearInterval(
                clientInterval
            );

            clientInterval = null;

        }


        if (
            document.visibilityState ===
            'visible'
        ) {

            startClientRotation();

        }


        document.addEventListener(
            'visibilitychange',
            () => {

                if (
                    document.visibilityState ===
                    'visible'
                ) {

                    startClientRotation();

                } else {

                    stopClientRotation();

                }

            }
        );

    }


    /* =====================================================
       PREVENT MOBILE MENU BODY SCROLL
       ===================================================== */

    const mobileMenuStyle =
        document.createElement('style');

    mobileMenuStyle.textContent = `
        body.mobile-menu-open {
            overflow: hidden;
        }

        body.admin-modal-open {
            overflow: hidden;
        }
    `;

    document.head.appendChild(
        mobileMenuStyle
    );


    /* =====================================================
       INITIAL ARIA STATE
       ===================================================== */

    if (hamburger) {

        hamburger.setAttribute(
            'aria-expanded',
            mobileMenu &&
            mobileMenu.classList.contains('active')
                ? 'true'
                : 'false'
        );

    }


    /* =====================================================
       FINAL NAV VISIBILITY CHECK
       ===================================================== */

    maintainGlassNav();

});
