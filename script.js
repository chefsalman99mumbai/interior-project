// ===== NAV SCROLL =====
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) { nav.style.boxShadow = '0 10px 35px rgba(230, 230, 250, 1)'; }
    else { nav.style.boxShadow = '0 10px 35px rgba(230, 230, 250, 0.8)'; }
});

// ===== HAMBURGER MENU =====
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
hamburger.addEventListener('click', () => { mobileMenu.classList.toggle('active'); });

// ===== REVEAL ON SCROLL =====
const reveals = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) { entry.target.classList.add('active'); revealObserver.unobserve(entry.target); }
    });
}, { threshold: 0.1 });
reveals.forEach(el => revealObserver.observe(el));

// ===== CONTACT FORM =====
document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const message = document.getElementById('message').value;
    const text = `Hello Fizza Interior! My name is ${name} (${phone}). I have a specific vision for my space: ${message}`;
    window.open(`https://wa.me/919876543210?text=${encodeURIComponent(text)}`, '_blank');
});

// ===== ADMIN LOGIN & PASSWORD CHANGE =====
function getStoredPassword() {
    return localStorage.getItem('fizza_admin_password') || 'admin123';
}
function openAdmin() {
    document.getElementById('adminModal').classList.add('active');
    document.getElementById('passwordChangeSection').style.display = 'none';
    document.getElementById('loginError').style.display = 'none';
    document.getElementById('updateMsg').textContent = '';
    document.getElementById('updateMsg').className = 'update-msg';
    document.getElementById('adminEmail').value = 'admin@fizza.com';
    document.getElementById('adminPass').value = '';
    document.getElementById('newPass').value = '';
}
function closeAdmin() {
    document.getElementById('adminModal').classList.remove('active');
}
function checkLogin() {
    const email = document.getElementById('adminEmail').value.trim();
    const pass = document.getElementById('adminPass').value.trim();
    const storedPass = getStoredPassword();
    if (email === 'admin@fizza.com' && pass === storedPass) {
        document.getElementById('loginError').style.display = 'none';
        document.getElementById('passwordChangeSection').style.display = 'block';
        document.getElementById('adminPass').value = '';
        alert('Welcome Admin! You can now change your password below.');
    } else {
        document.getElementById('loginError').style.display = 'block';
    }
}
function updatePassword() {
    const newPass = document.getElementById('newPass').value.trim();
    const msgEl = document.getElementById('updateMsg');
    if (newPass.length < 4) {
        msgEl.textContent = 'Password must be at least 4 characters.';
        msgEl.className = 'update-msg error';
        return;
    }
    localStorage.setItem('fizza_admin_password', newPass);
    msgEl.textContent = '✅ Password updated successfully! (for this browser only)';
    msgEl.className = 'update-msg';
    document.getElementById('newPass').value = '';
}

// ===== CLIENT FADE (crossfade + fog) =====
const clientNames = [
    "LARSEN & TOUBRO LTD", "OBEROI REALITY", "SATELLITE GROUP", "NEELKANTH GROUP", "SHETH DEVELOPERS PVT. LTD",
    "NAMAN GROUP", "WADHWA GROUP", "PURANIK DEVELOPERS", "YASHRAJ DEVELOPERS", "LOKHANDWALA CONST. PVT.LTD",
    "SHREELAXMI DEVELOPERS", "CITY CORPORATTION LTD", "ASHFORD HSG CORPORATION", "AJMERA GROUP",
    "BAFNA BUILDERS & DEVELOPERS", "ASHAPURA DEVELOPERS", "ASHAPURA & RATAN DEVELOPERS", "KALPATARU ENTERPRISES",
    "TATA HOUSING", "SHETH N CHOPRA DEVELOPERS", "GEE CEE VENTURE PVT LTD"
];
const fadeContainer = document.getElementById('clientsFade');
clientNames.forEach(name => {
    const item = document.createElement('div');
    item.className = 'client-item';
    const logoImg = document.createElement('img');
    logoImg.src = `client-${clientNames.indexOf(name) + 1}.png`;
    logoImg.alt = name;
    logoImg.className = 'client-logo';
    logoImg.onerror = function() {
        this.style.display = 'none';
        const textSpan = document.createElement('span');
        textSpan.className = 'client-text';
        textSpan.textContent = name;
        item.appendChild(textSpan);
    };
    item.appendChild(logoImg);
    fadeContainer.appendChild(item);
});
let currentClient = 0;
const clientItems = document.querySelectorAll('.client-item');
const totalClients = clientItems.length;
const crossfadeBox = document.querySelector('.clients-crossfade');
function showClient(index) {
    clientItems.forEach(item => { item.classList.remove('active', 'exit'); });
    clientItems[index].classList.add('active');
    crossfadeBox.classList.add('fog-up', 'fog-down');
    setTimeout(() => { crossfadeBox.classList.remove('fog-up', 'fog-down'); }, 1200);
}
function nextClient() {
    clientItems[currentClient].classList.add('exit');
    setTimeout(() => {
        currentClient = (currentClient + 1) % totalClients;
        showClient(currentClient);
    }, 800);
}
showClient(0);
setInterval(nextClient, 2500);

// ===== ESC TO CLOSE MODAL =====
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAdmin();
});

// ===== CLOSE MODAL ON BACKDROP CLICK =====
document.getElementById('adminModal').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) closeAdmin();
});
