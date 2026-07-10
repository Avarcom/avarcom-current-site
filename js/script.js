document.addEventListener("DOMContentLoaded", () => {
	const body = document.body;

	// ==========================================
	// 1. LAUNCH VISIBILITY GATE
	// ==========================================
	const launchHiddenLinks = document.querySelectorAll('a[href="blog.html"], a[href="../blog.html"]');

	launchHiddenLinks.forEach((link) => {
		const menuItem = link.closest(".menu__item");
		if (menuItem) {
			menuItem.remove();
			return;
		}

		link.remove();
	});

	// ==========================================
	// 2. HEADER SCROLL STATE
	// ==========================================
	const header = document.querySelector(".header");

	function updateHeaderScrollState() {
		if (!header) return;
		header.classList.toggle("scroll", window.scrollY > 10);
	}

	if (header) {
		updateHeaderScrollState();
		window.addEventListener("scroll", updateHeaderScrollState, { passive: true });
	}

	// ==========================================
	// 3. SHARED OVERLAY STATE
	// ==========================================
	const burger = document.querySelector(".header__burger");
	const menuBody = document.querySelector(".header__body");

	const chatButton = document.querySelector(".chat-dropdown__btn");
	const chatDropdown = document.querySelector(".chat-dropdown");
	const chatMenu = document.querySelector(".chat-dropdown__menu");
	const chatCloseButton = document.querySelector(".chat-close-btn");

	const guideButton = document.querySelector(".btn-hero-guide");
	const guideModal = document.querySelector(".guide-modal-wrapper");
	const guideCloseButton = document.querySelector(".guide-close-btn");
	const guideBackdrop = document.querySelector(".guide-backdrop");

	function syncBodyLock() {
		const hasOpenOverlay = Boolean(
			menuBody?.classList.contains("active") ||
			chatDropdown?.classList.contains("active") ||
			guideModal?.classList.contains("active") ||
			document.querySelector(".insurance-modal.active")
		);

		body.classList.toggle("lock", hasOpenOverlay);
	}

	// ==========================================
	// 4. MOBILE MENU
	// ==========================================
	function setMobileMenuOpen(isOpen) {
		if (!burger || !menuBody) return;

		burger.classList.toggle("active", isOpen);
		menuBody.classList.toggle("active", isOpen);
		burger.setAttribute("aria-expanded", String(isOpen));
		burger.setAttribute("aria-label", isOpen ? "Закрити меню" : "Відкрити меню");
		syncBodyLock();
	}

	if (burger && menuBody) {
		burger.addEventListener("click", () => {
			setMobileMenuOpen(!menuBody.classList.contains("active"));
		});

		menuBody.querySelectorAll(".menu__link").forEach((link) => {
			link.addEventListener("click", () => setMobileMenuOpen(false));
		});
	}

	// ==========================================
	// 5. CHAT DIALOG
	// ==========================================
	function setChatOpen(isOpen, restoreFocus = false) {
		if (!chatDropdown) return;

		chatDropdown.classList.toggle("active", isOpen);
		chatButton?.setAttribute("aria-expanded", String(isOpen));
		chatMenu?.setAttribute("aria-hidden", String(!isOpen));
		syncBodyLock();

		if (!isOpen && restoreFocus) chatButton?.focus();
	}

	if (chatButton && chatDropdown) {
		chatButton.addEventListener("click", (event) => {
			event.stopPropagation();
			setGuideOpen(false);
			setChatOpen(!chatDropdown.classList.contains("active"));
		});

		chatCloseButton?.addEventListener("click", (event) => {
			event.stopPropagation();
			setChatOpen(false, true);
		});

		document.addEventListener("click", (event) => {
			if (!chatDropdown.classList.contains("active")) return;
			if (chatButton.contains(event.target)) return;
			if (chatMenu?.contains(event.target)) return;
			setChatOpen(false);
		});

		document.querySelectorAll(".chat-link").forEach((link) => {
			link.addEventListener("click", () => setChatOpen(false));
		});
	}

	// ==========================================
	// 6. GUIDE DIALOG
	// ==========================================
	function setGuideOpen(isOpen, restoreFocus = false) {
		if (!guideModal) return;

		guideModal.classList.toggle("active", isOpen);
		guideModal.setAttribute("aria-hidden", String(!isOpen));
		guideButton?.setAttribute("aria-expanded", String(isOpen));
		syncBodyLock();

		if (!isOpen && restoreFocus) guideButton?.focus();
	}

	if (guideButton && guideModal) {
		guideButton.addEventListener("click", (event) => {
			event.stopPropagation();
			setChatOpen(false);
			setGuideOpen(true);
		});

		guideCloseButton?.addEventListener("click", () => setGuideOpen(false, true));
		guideBackdrop?.addEventListener("click", () => setGuideOpen(false, true));

		document.querySelectorAll(".guide-option-btn").forEach((option) => {
			option.addEventListener("click", () => setGuideOpen(false));
		});
	}

	// ==========================================
	// 7. GLOBAL ESCAPE HANDLER
	// ==========================================
	document.addEventListener("keydown", (event) => {
		if (event.key !== "Escape") return;

		if (menuBody?.classList.contains("active")) setMobileMenuOpen(false);
		if (chatDropdown?.classList.contains("active")) setChatOpen(false, true);
		if (guideModal?.classList.contains("active")) setGuideOpen(false, true);
	});
});
