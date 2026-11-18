const navigationLinks = Array.from(document.querySelectorAll('nav a[href^="#"]'))
    .filter(link => {
        const sectionId = link.getAttribute('href').slice(1);
        return sectionId && document.getElementById(sectionId);
    });

function setActiveLink(sectionId) {
    navigationLinks.forEach(link => {
        const isActive = link.getAttribute('href') === `#${sectionId}`;
        link.classList.toggle('active', isActive);

        if (isActive) {
            link.setAttribute('aria-current', 'location');
        } else {
            link.removeAttribute('aria-current');
        }
    });
}

navigationLinks.forEach(link => {
    link.addEventListener('click', () => {
        setActiveLink(link.getAttribute('href').slice(1));
    });
});

const sections = [...new Set(navigationLinks
    .map(link => document.getElementById(link.getAttribute('href').slice(1)))
    .filter(Boolean))];

if ('IntersectionObserver' in window) {
    const sectionObserver = new IntersectionObserver(entries => {
        const mostVisibleSection = entries
            .filter(entry => entry.isIntersecting)
            .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (mostVisibleSection) {
            setActiveLink(mostVisibleSection.target.id);
        }
    }, {
        rootMargin: '-20% 0px -60% 0px',
        threshold: [0, 0.25, 0.5, 0.75]
    });

    sections.forEach(section => sectionObserver.observe(section));
}

const hashSection = window.location.hash
    ? document.getElementById(window.location.hash.slice(1))
    : null;
const initialSection = hashSection || document.getElementById('hero');

if (initialSection) {
    setActiveLink(initialSection.id);
}

const contactForm = document.querySelector('#contacts form');
const formStatus = document.getElementById('form-status');

if (contactForm && formStatus) {
    contactForm.addEventListener('submit', event => {
        event.preventDefault();
        formStatus.textContent =
            'Your message is ready, but has not been sent. This site is not connected to a form service yet.';
    });
}

const authOptions = document.querySelectorAll('[data-auth-mode]');
const registerForm = document.getElementById('register-form');
const loginForm = document.getElementById('login-form');
const authStatus = document.getElementById('auth-status');

if (authOptions.length && registerForm && loginForm && authStatus) {
    authOptions.forEach(option => {
        option.addEventListener('click', () => {
            const isRegister = option.getAttribute('data-auth-mode') === 'register';
            registerForm.hidden = !isRegister;
            loginForm.hidden = isRegister;
            authOptions.forEach(authOption => {
                const isSelected = authOption === option;
                authOption.classList.toggle('is-selected', isSelected);
                authOption.setAttribute('aria-pressed', String(isSelected));
            });
            authStatus.textContent = '';
        });
    });

    [registerForm, loginForm].forEach(form => {
        form.addEventListener('submit', event => {
            event.preventDefault();
            authStatus.textContent =
                'This sign-in page is a preview and is not connected to an account service yet.';
        });
    });
}
