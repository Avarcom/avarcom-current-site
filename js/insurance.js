document.addEventListener("DOMContentLoaded", () => {
	const modal = document.getElementById("insuranceModal");
	const openButtons = document.querySelectorAll(".insurance-open-modal");
	const closeButtons = document.querySelectorAll("[data-insurance-close]");
	const tabs = document.querySelectorAll("[data-product-tab]");
	const modalTitle = document.getElementById("insuranceModalTitle");
	const productInput = document.getElementById("insuranceProductInput");
	const dynamicFields = document.getElementById("insuranceDynamicFields");
	const form = document.getElementById("insuranceForm");

	const CONTACT_EMAIL = "vip.strahuvannya@gmail.com";

	const catalogConfig = {
		focusMode: true,
		focusProductKey: "avtotsyvilka",
		favoriteStorageKey: "avarcom.insurance.favoriteProducts",
		subjectFilters: {
			liability: "Відповідальність",
			property: "Майнове",
			personal: "Особисте"
		},
		utilityFilters: {
			all: "Усі продукти",
			favorites: "Мій список"
		},
		subjectBadgeLabels: {
			liability: "Відповідальність",
			property: "Майнове",
			personal: "Особисте",
			all: "Під запит"
		},
		productSubjects: {
			avtotsyvilka: "liability",
			dcv: "liability",
			"green-card": "liability",
			kasko: "property",
			property: "property",
			travel: "personal",
			other: "all"
		}
	};

	const products = {
		avtotsyvilka: {
			title: "Автоцивілка",
			fields: [
				selectField("vehicleType", "Тип транспортного засобу *", true, ["Легковий автомобіль", "Вантажний автомобіль", "Мотоцикл", "Причіп", "Інше"]),
				selectField("region", "Регіон реєстрації *", true, ["Київ", "Київська область", "Обласний центр", "Інший населений пункт"]),
				selectField("engine", "Об’єм двигуна / тип авто *", true, ["До 1600 см³", "1601–2000 см³", "2001–3000 см³", "Понад 3000 см³", "Електро"]),
				selectField("benefit", "Пільга", false, ["Немає", "Пенсіонер", "УБД", "Особа з інвалідністю", "Інше"])
			]
		},
		dcv: {
			title: "ДЦВ",
			fields: [
				selectField("basePolicy", "Автоцивілка *", true, ["Є чинна автоцивілка", "Потрібно оформити разом з автоцивілкою", "Потрібна консультація"]),
				selectField("dcvLimit", "Бажаний додатковий ліміт", false, ["100 000 грн", "250 000 грн", "500 000 грн", "1 000 000 грн", "Потрібна консультація"]),
				textField("insuranceCompany", "Страхова компанія базового поліса", false, "Якщо автоцивілка вже оформлена"),
				dateField("startDate", "Бажана дата початку", false)
			]
		},
		"green-card": {
			title: "Зелена картка",
			fields: [
				textField("country", "Країна поїздки *", true, "Наприклад: Польща"),
				selectField("vehicleType", "Тип транспортного засобу *", true, ["Легковий автомобіль", "Вантажний автомобіль", "Мотоцикл", "Причіп", "Інше"]),
				dateField("startDate", "Дата початку *", true),
				selectField("period", "Період дії *", true, ["15 днів", "1 місяць", "2 місяці", "3 місяці", "6 місяців", "1 рік"])
			]
		},
		kasko: {
			title: "КАСКО",
			fields: [
				textField("brand", "Марка авто *", true, "Наприклад: Toyota"),
				textField("model", "Модель авто *", true, "Наприклад: Camry"),
				numberField("year", "Рік випуску *", true, "2020"),
				numberField("value", "Орієнтовна вартість авто", false, "грн"),
				selectField("risks", "Бажані ризики", false, ["Повне КАСКО", "ДТП", "Викрадення", "Скло / окремі ризики", "Потрібна консультація"])
			]
		},
		property: {
			title: "Страхування майна",
			fields: [
				selectField("propertyType", "Тип майна *", true, ["Квартира", "Будинок", "Комерційне приміщення", "Інше"]),
				textField("city", "Місто *", true, "Наприклад: Київ"),
				numberField("propertyValue", "Орієнтовна вартість майна", false, "грн"),
				selectField("propertyRisks", "Основні ризики", false, ["Пожежа", "Затоплення", "Крадіжка", "Комплексний захист", "Потрібна консультація"])
			]
		},
		travel: {
			title: "Туристичне страхування",
			fields: [
				textField("country", "Країна поїздки *", true, "Наприклад: Німеччина"),
				numberField("persons", "Кількість осіб *", true, "1"),
				dateField("departureDate", "Дата виїзду *", true),
				dateField("returnDate", "Дата повернення *", true),
				selectField("purpose", "Мета поїздки", false, ["Туризм", "Робота", "Навчання", "Спорт", "Інше"])
			]
		},
		other: {
			title: "Інші види страхування",
			fields: [
				textField("object", "Що потрібно застрахувати *", true, "Коротко опишіть об’єкт"),
				numberField("sum", "Орієнтовна страхова сума", false, "грн"),
				textareaField("details", "Опис ситуації *", true, "Що саме потрібно підібрати?")
			]
		}
	};

	let currentProductKey = "avtotsyvilka";
	let lastFocusedElement = null;

	function selectField(name, label, required, options) {
		return { type: "select", name, label, required, options };
	}

	function textField(name, label, required, placeholder = "") {
		return { type: "text", name, label, required, placeholder };
	}

	function numberField(name, label, required, placeholder = "") {
		return { type: "number", name, label, required, placeholder };
	}

	function dateField(name, label, required) {
		return { type: "date", name, label, required };
	}

	function textareaField(name, label, required, placeholder = "") {
		return { type: "textarea", name, label, required, placeholder };
	}

	function normalizeProductKey(productKey) {
		if (productKey === "osago") return "avtotsyvilka";
		if (!productKey || !products[productKey]) return "avtotsyvilka";
		return productKey;
	}

	function ensureCatalogStylesheet() {
		if (document.querySelector('link[data-insurance-catalog-css="true"]')) return;

		const link = document.createElement("link");
		const isNestedInsurancePage = window.location.pathname.includes("/insurance/");

		link.rel = "stylesheet";
		link.href = isNestedInsurancePage ? "../css/insurance-catalog.css" : "css/insurance-catalog.css";
		link.dataset.insuranceCatalogCss = "true";
		document.head.appendChild(link);
	}

	function openModal(productKey = "avtotsyvilka") {
		const normalizedKey = normalizeProductKey(productKey);

		lastFocusedElement = document.activeElement instanceof HTMLElement ? document.activeElement : null;
		modal.classList.add("active");
		modal.setAttribute("aria-hidden", "false");
		document.body.classList.add("lock");
		setProduct(normalizedKey);

		const closeButton = modal.querySelector(".insurance-modal__close");
		if (closeButton) closeButton.focus();
	}

	function closeModal() {
		modal.classList.remove("active");
		modal.setAttribute("aria-hidden", "true");
		document.body.classList.remove("lock");

		if (lastFocusedElement?.isConnected) lastFocusedElement.focus();
		lastFocusedElement = null;
	}

	function setProduct(productKey) {
		const normalizedKey = normalizeProductKey(productKey);
		const product = products[normalizedKey];

		currentProductKey = normalizedKey;
		modalTitle.textContent = product.title;
		productInput.value = product.title;

		tabs.forEach((tab) => {
			const tabKey = normalizeProductKey(tab.dataset.productTab);
			tab.classList.toggle("active", tabKey === normalizedKey);
		});

		dynamicFields.innerHTML = product.fields.map(createField).join("");
	}

	function createField(field) {
		const required = field.required ? "required" : "";
		const placeholder = field.placeholder ? `placeholder="${escapeHtml(field.placeholder)}"` : "";
		const cleanLabel = field.label.replace(" *", "");

		if (field.type === "select") {
			const options = field.options
				.map((option) => `<option value="${escapeHtml(option)}">${escapeHtml(option)}</option>`)
				.join("");

			return `
				<label class="insurance-field">
					<span>${escapeHtml(field.label)}</span>
					<select name="${escapeHtml(field.name)}" data-label="${escapeHtml(cleanLabel)}" ${required}>
						<option value="">Оберіть варіант</option>
						${options}
					</select>
				</label>
			`;
		}

		if (field.type === "textarea") {
			return `
				<label class="insurance-field insurance-field--wide">
					<span>${escapeHtml(field.label)}</span>
					<textarea name="${escapeHtml(field.name)}" data-label="${escapeHtml(cleanLabel)}" rows="3" ${required} ${placeholder}></textarea>
				</label>
			`;
		}

		return `
			<label class="insurance-field">
				<span>${escapeHtml(field.label)}</span>
				<input type="${escapeHtml(field.type)}" name="${escapeHtml(field.name)}" data-label="${escapeHtml(cleanLabel)}" ${required} ${placeholder}>
			</label>
		`;
	}

	function getReadableFormData() {
		const formElements = form.querySelectorAll("input, select, textarea");
		const lines = [`Продукт: ${productInput.value}`, ""];

		formElements.forEach((element) => {
			if (element.name === "consent" || element.type === "hidden") return;

			const label = element.dataset.label || getCommonLabel(element.name);
			const value = element.value.trim();
			if (value) lines.push(`${label}: ${value}`);
		});

		return lines.join("\n");
	}

	function getCommonLabel(name) {
		const labels = {
			name: "Ім’я",
			email: "Email",
			phone: "Телефон",
			comment: "Коментар"
		};

		return labels[name] || name;
	}

	function sendByEmail(event) {
		event.preventDefault();

		if (!form.checkValidity()) {
			form.reportValidity();
			return;
		}

		const subject = encodeURIComponent(`Заявка на страхування: ${productInput.value}`);
		const body = encodeURIComponent(getReadableFormData());

		window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
	}

	function escapeHtml(value) {
		return String(value)
			.replace(/&/g, "&amp;")
			.replace(/</g, "&lt;")
			.replace(/>/g, "&gt;")
			.replace(/"/g, "&quot;")
			.replace(/'/g, "&#039;");
	}

	function initInsuranceCatalogArchitecture() {
		const productsBlock = document.querySelector(".insurance-products");
		if (!productsBlock) return;

		ensureCatalogStylesheet();
		document.body.classList.toggle("insurance-focus-mode", catalogConfig.focusMode);
		document.body.classList.toggle("insurance-catalog-open", !catalogConfig.focusMode);

		const cards = productsBlock.querySelectorAll(".insurance-card--product");

		cards.forEach((card) => {
			const productButton = card.querySelector(".insurance-open-modal[data-product]");
			const rawProductKey = productButton ? productButton.dataset.product : "";
			const productKey = normalizeProductKey(rawProductKey);
			const subjectKey = catalogConfig.productSubjects[productKey] || "all";

			card.dataset.insuranceProduct = productKey;
			card.dataset.insuranceSubject = subjectKey;
		});

		initSubjectBadges(cards);

		if (catalogConfig.focusMode) {
			applyCatalogFocusMode(cards);
			return;
		}

		buildCatalogControls(cards);
		applyCatalogFilter("all", cards);
	}

	function applyCatalogFocusMode(cards) {
		cards.forEach((card) => {
			card.hidden = card.dataset.insuranceProduct !== catalogConfig.focusProductKey;
		});

		tabs.forEach((tab) => {
			const tabKey = normalizeProductKey(tab.dataset.productTab);
			tab.hidden = tabKey !== catalogConfig.focusProductKey;
		});
	}

	function buildCatalogControls(cards) {
		const productsBlock = document.querySelector(".insurance-products");
		if (!productsBlock || document.querySelector("[data-insurance-catalog-controls]")) return;

		const controls = document.createElement("section");
		controls.className = "insurance-catalog-controls";
		controls.dataset.insuranceCatalogControls = "true";
		controls.innerHTML = `
			<div class="insurance-catalog-controls__head">
				<div class="insurance-catalog-controls__label">Предмет страхування</div>
				<p class="insurance-catalog-controls__text">Основне сортування страхових продуктів: відповідальність, майнове, особисте.</p>
			</div>
			<div class="insurance-catalog-controls__main" aria-label="Фільтр за предметом страхування">
				${Object.entries(catalogConfig.subjectFilters).map(([key, label]) => `
					<button type="button" class="insurance-catalog-controls__button insurance-catalog-controls__button--subject" data-insurance-filter="${key}">${label}</button>
				`).join("")}
			</div>
			<div class="insurance-catalog-controls__service" aria-label="Службові фільтри каталогу">
				${Object.entries(catalogConfig.utilityFilters).map(([key, label]) => `
					<button type="button" class="insurance-catalog-controls__button insurance-catalog-controls__button--service" data-insurance-filter="${key}">${label}</button>
				`).join("")}
			</div>
			<div class="insurance-cabinet-shell" data-insurance-cabinet-shell>
				<strong>Кабінет клієнта:</strong> контур підготовлено. На наступному етапі тут можна буде зберігати обрані продукти, заявки та документи клієнта.
			</div>
		`;

		productsBlock.parentNode.insertBefore(controls, productsBlock);

		controls.querySelectorAll("[data-insurance-filter]").forEach((button) => {
			button.addEventListener("click", () => {
				applyCatalogFilter(button.dataset.insuranceFilter || "all", cards);
			});
		});

		initFavoriteButtons(cards);
	}

	function applyCatalogFilter(filterKey, cards) {
		const favorites = getFavoriteProducts();

		cards.forEach((card) => {
			const productKey = card.dataset.insuranceProduct;
			const subjectKey = card.dataset.insuranceSubject;
			const isFavorite = favorites.includes(productKey);
			const shouldShow = filterKey === "all" || subjectKey === filterKey || (filterKey === "favorites" && isFavorite);

			card.hidden = !shouldShow;
		});

		document.querySelectorAll("[data-insurance-filter]").forEach((button) => {
			button.classList.toggle("active", button.dataset.insuranceFilter === filterKey);
		});
	}

	function initSubjectBadges(cards) {
		cards.forEach((card) => {
			const heading = card.querySelector(".insurance-card__heading");
			const subjectKey = card.dataset.insuranceSubject || "all";
			const label = catalogConfig.subjectBadgeLabels[subjectKey] || catalogConfig.subjectBadgeLabels.all;

			if (!heading || card.querySelector("[data-insurance-subject-badge]")) return;

			const badge = document.createElement("span");
			badge.className = "insurance-card__subject-badge";
			badge.dataset.insuranceSubjectBadge = subjectKey;
			badge.textContent = label;
			heading.appendChild(badge);
		});
	}

	function initFavoriteButtons(cards) {
		cards.forEach((card) => {
			const top = card.querySelector(".insurance-card__top");
			const productKey = card.dataset.insuranceProduct;

			if (!top || !productKey || card.querySelector("[data-insurance-favorite]")) return;

			const button = document.createElement("button");
			button.type = "button";
			button.className = "insurance-card__favorite";
			button.dataset.insuranceFavorite = productKey;
			button.setAttribute("aria-label", "Додати продукт до мого списку");

			button.addEventListener("click", () => {
				toggleFavoriteProduct(productKey);
				updateFavoriteButtons(cards);
			});

			top.appendChild(button);
		});

		updateFavoriteButtons(cards);
	}

	function getFavoriteProducts() {
		try {
			return JSON.parse(localStorage.getItem(catalogConfig.favoriteStorageKey)) || [];
		} catch (error) {
			return [];
		}
	}

	function setFavoriteProducts(productsList) {
		try {
			localStorage.setItem(catalogConfig.favoriteStorageKey, JSON.stringify(productsList));
		} catch (error) {
			// У приватному режимі або забороненому сховищі список просто не зберігається.
		}
	}

	function toggleFavoriteProduct(productKey) {
		const favorites = getFavoriteProducts();
		const nextFavorites = favorites.includes(productKey)
			? favorites.filter((key) => key !== productKey)
			: [...favorites, productKey];

		setFavoriteProducts(nextFavorites);
	}

	function updateFavoriteButtons(cards) {
		const favorites = getFavoriteProducts();

		cards.forEach((card) => {
			const productKey = card.dataset.insuranceProduct;
			const button = card.querySelector("[data-insurance-favorite]");
			const isFavorite = favorites.includes(productKey);

			if (!button) return;

			button.textContent = isFavorite ? "★" : "☆";
			button.classList.toggle("active", isFavorite);
			button.setAttribute("aria-pressed", String(isFavorite));
		});
	}

	if (!modal || !form || !modalTitle || !productInput || !dynamicFields) {
		initInsuranceCatalogArchitecture();
		return;
	}

	openButtons.forEach((button) => {
		button.addEventListener("click", () => {
			openModal(button.dataset.product || "avtotsyvilka");
		});
	});

	tabs.forEach((tab) => {
		tab.addEventListener("click", () => {
			setProduct(tab.dataset.productTab || "avtotsyvilka");
		});
	});

	closeButtons.forEach((button) => {
		button.addEventListener("click", closeModal);
	});

	modal.addEventListener("click", (event) => {
		if (event.target.hasAttribute("data-insurance-close")) closeModal();
	});

	document.addEventListener("keydown", (event) => {
		if (event.key === "Escape" && modal.classList.contains("active")) closeModal();
	});

	form.addEventListener("submit", sendByEmail);

	initInsuranceCatalogArchitecture();
	setProduct(currentProductKey);
});
