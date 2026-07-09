(function initPageTransitionStylesheet() {
	if (document.querySelector('link[data-page-transition-css="true"]')) return;

	const link = document.createElement('link');
	const isNestedInsurancePage = window.location.pathname.includes('/insurance/');

	link.rel = 'stylesheet';
	link.href = isNestedInsurancePage ? '../css/page-transition.css' : 'css/page-transition.css';
	link.dataset.pageTransitionCss = 'true';
	document.head.appendChild(link);
})();

document.addEventListener("DOMContentLoaded", function () {

	// ==========================================
	// 1. ПЛАВНИЙ ПЕРЕХІД МІЖ СТОРІНКАМИ
	// ==========================================
	const PAGE_TRANSITION_DELAY = 180;
	const header = document.querySelector('.header');
	const body = document.body;

	body.classList.add('page-transition-enabled');

	requestAnimationFrame(() => {
		body.classList.add('page-ready');
	});

	window.addEventListener('pageshow', () => {
		body.classList.remove('page-leaving');
		requestAnimationFrame(() => {
			body.classList.add('page-ready');
		});
	});

	document.addEventListener('click', function (event) {
		const link = event.target.closest('a[href]');

		if (!link) return;
		if (event.defaultPrevented) return;
		if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
		if (link.target && link.target !== '_self') return;
		if (link.hasAttribute('download')) return;

		const url = new URL(link.getAttribute('href'), window.location.href);
		const isHttpLink = url.protocol === 'http:' || url.protocol === 'https:';
		const isSameOrigin = url.origin === window.location.origin;
		const isSamePageAnchor = url.pathname === window.location.pathname && url.hash;

		if (!isHttpLink || !isSameOrigin || isSamePageAnchor) return;

		event.preventDefault();
		body.classList.remove('page-ready');
		body.classList.add('page-leaving');

		window.setTimeout(() => {
			window.location.href = url.href;
		}, PAGE_TRANSITION_DELAY);
	});

	// ==========================================
	// 2. ЕФЕКТ СКРОЛУ ДЛЯ ШАПКИ
	// ==========================================
	function checkScroll() {
		let scrollPos = window.scrollY;
		if (scrollPos > 10) { header.classList.add('scroll'); }
		else { header.classList.remove('scroll'); }
	}
	if (header) {
		checkScroll();
		window.addEventListener('scroll', checkScroll);
	}

	// ==========================================
	// 3. БУРГЕР-МЕНЮ (МОБІЛЬНЕ)
	// ==========================================
	const burger = document.querySelector('.header__burger');
	const menuBody = document.querySelector('.header__body');

	if (burger && menuBody) {
		burger.addEventListener("click", function () {
			burger.classList.toggle('active');
			menuBody.classList.toggle('active');
			body.classList.toggle('lock');
		});

		const menuLinks = menuBody.querySelectorAll('.menu__link, .header__button');
		menuLinks.forEach(link => {
			link.addEventListener('click', () => {
				burger.classList.remove('active');
				menuBody.classList.remove('active');
				body.classList.remove('lock');
			});
		});
	}

	// ==========================================
	// 4. УТОЧНЕННЯ ПУБЛІЧНИХ МАРКЕТИНГОВИХ ФОРМУЛЮВАНЬ
	// ==========================================
	const guideDescriptions = document.querySelectorAll('.opt-desc');
	guideDescriptions.forEach((description) => {
		if (description.textContent.trim() === 'Як гарантовано отримати гроші') {
			description.textContent = 'Як діяти для отримання страхової виплати';
		}
	});

	// ==========================================
	// 5. ЛОГІКА ДЛЯ КНОПОК HERO-СЕКЦІЇ
	// ==========================================

	const chatBtn = document.querySelector('.chat-dropdown__btn');
	const chatDropdown = document.querySelector('.chat-dropdown');
	const chatCloseBtn = document.querySelector('.chat-close-btn');

	const guideBtn = document.querySelector('.btn-hero-guide');
	const guideModalWrapper = document.querySelector('.guide-modal-wrapper');
	const guideCloseBtn = document.querySelector('.guide-close-btn');
	const guideBackdrop = document.querySelector('.guide-backdrop');

	function closeChat() {
		if (chatDropdown) chatDropdown.classList.remove('active');
	}

	function closeGuide() {
		if (guideModalWrapper) guideModalWrapper.classList.remove('active');
	}

	if (chatBtn && chatDropdown) {
		chatBtn.addEventListener('click', function (e) {
			e.stopPropagation();
			closeGuide();
			chatDropdown.classList.toggle('active');
		});

		if (chatCloseBtn) {
			chatCloseBtn.addEventListener('click', function (e) {
				e.stopPropagation();
				closeChat();
			});
		}

		document.addEventListener('click', function (e) {
			if (chatDropdown.classList.contains('active') && !chatBtn.contains(e.target)) {
				const menuBox = document.querySelector('.chat-dropdown__menu');
				if (menuBox && !menuBox.contains(e.target)) {
					closeChat();
				}
			}
		});

		const chatLinks = document.querySelectorAll('.chat-link');
		chatLinks.forEach(link => {
			link.addEventListener('click', closeChat);
		});
	}

	if (guideBtn && guideModalWrapper) {
		guideBtn.addEventListener('click', function (e) {
			e.stopPropagation();
			closeChat();
			guideModalWrapper.classList.add('active');
		});

		if (guideCloseBtn) {
			guideCloseBtn.addEventListener('click', function () {
				closeGuide();
			});
		}

		if (guideBackdrop) {
			guideBackdrop.addEventListener('click', function () {
				closeGuide();
			});
		}

		const guideOptions = document.querySelectorAll('.guide-option-btn');
		guideOptions.forEach(opt => {
			opt.addEventListener('click', closeGuide);
		});
	}

});

// ==========================================
// 6. ГЛОБАЛЬНІ ПОДІЇ (ЗАКРИТТЯ ПО ESC)
// ==========================================
document.addEventListener('keydown', function (e) {
	if (e.key === 'Escape') {
		const body = document.body;

		const burger = document.querySelector('.header__burger');
		const menuBody = document.querySelector('.header__body');
		const header = document.querySelector('.header');

		if (burger && burger.classList.contains('active')) {
			burger.classList.remove('active');
			menuBody.classList.remove('active');
			if (header) header.classList.remove('menu-open');
			body.classList.remove('lock');
		}

		const chatDropdown = document.querySelector('.chat-dropdown');
		if (chatDropdown && chatDropdown.classList.contains('active')) {
			chatDropdown.classList.remove('active');
		}

		const guideModal = document.querySelector('.guide-modal-wrapper');
		if (guideModal && guideModal.classList.contains('active')) {
			guideModal.classList.remove('active');
			body.classList.remove('lock');
		}
	}
});
