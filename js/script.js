document.addEventListener("DOMContentLoaded", function () {

	// ==========================================
	// 1. LAUNCH VISIBILITY GATE
	// ==========================================
	const launchHiddenLinks = document.querySelectorAll('a[href="blog.html"], a[href="../blog.html"]');

	launchHiddenLinks.forEach((link) => {
		const menuItem = link.closest('.menu__item');
		if (menuItem) {
			menuItem.remove();
			return;
		}

		link.remove();
	});

	const launchTextReplacements = [
		{
			selector: '.glass-card-slim__desc',
			from: 'Автоцивілка, КАСКО, Зелена картка',
			to: 'Автоцивілка та додатковий захист ДЦВ'
		},
		{
			selector: '.service-item__text',
			from: 'автоцивілка, КАСКО, Зелена картка, туристичне страхування та інші напрями.',
			to: 'автоцивілка та додатковий захист ДЦВ.'
		}
	];

	launchTextReplacements.forEach(({ selector, from, to }) => {
		document.querySelectorAll(selector).forEach((element) => {
			element.textContent = element.textContent.replace(from, to);
		});
	});

	// ==========================================
	// 2. РОЗМІЩЕННЯ БЕЙДЖА ПРЕДМЕТА СТРАХУВАННЯ
	// ==========================================
	const insuranceProductsGrid = document.querySelector('.insurance-products__grid');

	function placeInsuranceSubjectBadges() {
		document.querySelectorAll('.insurance-card--product').forEach((card) => {
			const heading = card.querySelector('.insurance-card__heading');
			const badge = card.querySelector('[data-insurance-subject-badge]');

			if (!heading || !badge || badge.parentElement === heading) return;
			heading.appendChild(badge);
		});
	}

	if (insuranceProductsGrid) {
		const badgeObserver = new MutationObserver(placeInsuranceSubjectBadges);
		badgeObserver.observe(insuranceProductsGrid, { childList: true, subtree: true });
		placeInsuranceSubjectBadges();
		requestAnimationFrame(placeInsuranceSubjectBadges);
	}

	// ==========================================
	// 3. ЕФЕКТ СКРОЛУ ДЛЯ ШАПКИ
	// ==========================================
	const header = document.querySelector('.header');
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
	// 4. БУРГЕР-МЕНЮ (МОБІЛЬНЕ)
	// ==========================================
	const burger = document.querySelector('.header__burger');
	const menuBody = document.querySelector('.header__body');
	const body = document.body;

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
	// 5. УТОЧНЕННЯ ПУБЛІЧНИХ МАРКЕТИНГОВИХ ФОРМУЛЮВАНЬ
	// ==========================================
	const guideDescriptions = document.querySelectorAll('.opt-desc');
	guideDescriptions.forEach((description) => {
		if (description.textContent.trim() === 'Як гарантовано отримати гроші') {
			description.textContent = 'Як діяти для отримання страхової виплати';
		}
	});

	// ==========================================
	// 6. ЛОГІКА ДЛЯ КНОПОК HERO-СЕКЦІЇ
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
// 7. ГЛОБАЛЬНІ ПОДІЇ (ЗАКРИТТЯ ПО ESC)
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
