document.addEventListener("DOMContentLoaded", function () {

	// ==========================================
	// 1. ЕФЕКТ СКРОЛУ ДЛЯ ШАПКИ
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
	// 2. БУРГЕР-МЕНЮ (МОБІЛЬНЕ)
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

		// Закриття меню при кліку на посилання
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
	// 3. ЛОГІКА ДЛЯ КНОПОК HERO-СЕКЦІЇ
	// ==========================================

	// --- Елементи ЧАТУ ---
	const chatBtn = document.querySelector('.chat-dropdown__btn');
	const chatDropdown = document.querySelector('.chat-dropdown');
	const chatCloseBtn = document.querySelector('.chat-close-btn');

	// --- Елементи МОДАЛКИ ІНСТРУКЦІЙ (Гнила вишня) ---
	const guideBtn = document.querySelector('.btn-hero-guide');
	const guideModalWrapper = document.querySelector('.guide-modal-wrapper');
	const guideCloseBtn = document.querySelector('.guide-close-btn');
	const guideBackdrop = document.querySelector('.guide-backdrop');

	// --- Допоміжні функції закриття ---
	function closeChat() {
		if (chatDropdown) chatDropdown.classList.remove('active');
	}
	function closeGuide() {
		if (guideModalWrapper) guideModalWrapper.classList.remove('active');
	}

	// --- А. ЛОГІКА ЧАТУ ---
	if (chatBtn && chatDropdown) {

		// 1. Клік по кнопці "Написати в чат"
		chatBtn.addEventListener('click', function (e) {
			e.stopPropagation();
			// Якщо відкрита модалка інструкцій - закриваємо її
			closeGuide();
			// Перемикаємо стан чату
			chatDropdown.classList.toggle('active');
		});

		// 2. Клік по кнопці "Закрити" всередині чату
		if (chatCloseBtn) {
			chatCloseBtn.addEventListener('click', function (e) {
				e.stopPropagation();
				closeChat();
			});
		}

		// 3. Закриття чату при кліку поза межами
		document.addEventListener('click', function (e) {
			// Якщо чат відкритий і клік був НЕ по кнопці виклику
			if (chatDropdown.classList.contains('active') && !chatBtn.contains(e.target)) {
				const menuBox = document.querySelector('.chat-dropdown__menu');
				// Якщо клікнули поза меню - закриваємо
				if (menuBox && !menuBox.contains(e.target)) {
					closeChat();
				}
			}
		});

		// 4. Закриття при виборі месенджера
		const chatLinks = document.querySelectorAll('.chat-link');
		chatLinks.forEach(link => {
			link.addEventListener('click', closeChat);
		});
	}

	// --- Б. ЛОГІКА МОДАЛКИ ІНСТРУКЦІЙ ---
	if (guideBtn && guideModalWrapper) {

		// 1. Відкриття при кліку на кнопку "Сталась ДТП?"
		guideBtn.addEventListener('click', function (e) {
			e.stopPropagation();
			// Якщо відкритий чат - закриваємо його
			closeChat();
			// Відкриваємо модалку
			guideModalWrapper.classList.add('active');
		});

		// 2. Закриття на хрестик
		if (guideCloseBtn) {
			guideCloseBtn.addEventListener('click', function () {
				closeGuide();
			});
		}

		// 3. Закриття при кліку на темний фон (Backdrop)
		if (guideBackdrop) {
			guideBackdrop.addEventListener('click', function () {
				closeGuide();
			});
		}

		// 4. Закриття при виборі опції (щоб користувач перейшов за посиланням і вікно зникло)
		const guideOptions = document.querySelectorAll('.guide-option-btn');
		guideOptions.forEach(opt => {
			opt.addEventListener('click', closeGuide);
		});
	}

});

// ==========================================
// 5. ГЛОБАЛЬНІ ПОДІЇ (ЗАКРИТТЯ ПО ESC)
// ==========================================
document.addEventListener('keydown', function (e) {
	if (e.key === 'Escape') {
		const body = document.body;

		// 1. Закриваємо БУРГЕР-МЕНЮ (якщо відкрито)
		const burger = document.querySelector('.header__burger');
		const menuBody = document.querySelector('.header__body');
		const header = document.querySelector('.header');

		if (burger && burger.classList.contains('active')) {
			burger.classList.remove('active');
			menuBody.classList.remove('active');
			header.classList.remove('menu-open'); // Повертаємо логотип назад
			body.classList.remove('lock');
		}

		// 2. Закриваємо ЧАТ (якщо відкрито)
		const chatDropdown = document.querySelector('.chat-dropdown');
		if (chatDropdown && chatDropdown.classList.contains('active')) {
			chatDropdown.classList.remove('active');
			// Для чату ми зазвичай не блокуємо скрол, але якщо блокували - знімаємо
		}

		// 3. Закриваємо МОДАЛКУ ІНСТРУКЦІЙ (якщо відкрито)
		const guideModal = document.querySelector('.guide-modal-wrapper');
		if (guideModal && guideModal.classList.contains('active')) {
			guideModal.classList.remove('active');
			body.classList.remove('lock'); // Розблоковуємо скрол сторінки
		}
	}
});