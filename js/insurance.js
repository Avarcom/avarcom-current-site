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
				{
					type: "select",
					name: "vehicleType",
					label: "Тип транспортного засобу *",
					required: true,
					options: [
						"Легковий автомобіль",
						"Вантажний автомобіль",
						"Мотоцикл",
						"Причіп",
						"Інше"
					]
				},
				{
					type: "select",
					name: "region",
					label: "Регіон реєстрації *",
					required: true,
					options: [
						"Київ",
						"Київська область",
						"Обласний центр",
						"Інший населений пункт"
					]
				},
				{
					type: "select",
					name: "engine",
					label: "Об’єм двигуна / тип авто *",
					required: true,
					options: [
						"До 1600 см³",
						"1601–2000 см³",
						"2001–3000 см³",
						"Понад 3000 см³",
						"Електро"
					]
				},
				{
					type: "select",
					name: "benefit",
					label: "Пільга",
					required: false,
					options: [
						"Немає",
						"Пенсіонер",
						"УБД",
						"Особа з інвалідністю",
						"Інше"
					]
				}
			]
		},

		dcv: {
			title: "ДЦВ",
			fields: [
				{
					type: "select",
					name: "basePolicy",
					label: "Автоцивілка *",
					required: true,
					options: [
						"Є чинна автоцивілка",
						"Потрібно оформити разом з автоцивілкою",
						"Потрібна консультація"
					]
				},
				{
					type: "select",
					name: "dcvLimit",
					label: "Бажаний додатковий ліміт",
					required: false,
					options: [
						"100 000 грн",
						"250 000 грн",
						"500 000 грн",
						"1 000 000 грн",
						"Потрібна консультація"
					]
				},
				{
					type: "text",
					name: "insuranceCompany",
					label: "Страхова компанія базового поліса",
					required: false,
					placeholder: "Якщо автоцивілка вже оформлена"
				},
				{
					type: "date",
					name: "startDate",
					label: "Бажана дата початку",
					required: false
				}
			]
		},

		"green-card": {
			title: "Зелена картка",
			fields: [
				{
					type: "text",
					name: "country",
					label: "Країна поїздки *",
					required: true,
					placeholder: "Наприклад: Польща"
				},
				{
					type: "select",
					name: "vehicleType",
					label: "Тип транспортного засобу *",
					required: true,
					options: [
						"Легковий автомобіль",
						"Вантажний автомобіль",
						"Мотоцикл",
						"Причіп",
						"Інше"
					]
				},
				{
					type: "date",
					name: "startDate",
					label: "Дата початку *",
					required: true
				},
				{
					type: "select",
					name: "period",
					label: "Період дії *",
					required: true,
					options: [
						"15 днів",
						"1 місяць",
						"2 місяці",
						"3 місяці",
						"6 місяців",
						"1 рік"
					]
				}
			]
		},

		kasko: {
			title: "КАСКО",
			fields: [
				{
					type: "text",
					name: "brand",
					label: "Марка авто *",
					required: true,
					placeholder: "Наприклад: Toyota"
				},
				{
					type: "text",
					name: "model",
					label: "Модель авто *",
					required: true,
					placeholder: "Наприклад: Camry"
				},
				{
					type: "number",
					name: "year",
					label: "Рік випуску *",
					required: true,
					placeholder: "2020"
				},
				{
					type: "number",
					name: "value",
					label: "Орієнтовна вартість авто",
					required: false,
					placeholder: "грн"
				},
				{
					type: "select",
					name: "risks",
					label: "Бажані ризики",
					required: false,
					options: [
						"Повне КАСКО",
						"ДТП",
						"Викрадення",
						"Скло / окремі ризики",
						"Потрібна консультація"
					]
				}
			]
		},

		property: {
			title: "Страхування майна",
			fields: [
				{
					type: "select",
					name: "propertyType",
					label: "Тип майна *",
					required: true,
					options: [
						"Квартира",
						"Будинок",
						"Комерційне приміщення",
						"Інше"
					]
				},
				{
					type: "text",
					name: "city",
					label: "Місто *",
					required: true,
					placeholder: "Наприклад: Київ"
				},
				{
					type: "number",
					name: "propertyValue",
					label: "Орієнтовна вартість майна",
					required: false,
					placeholder: "грн"
				},
				{
					type: "select",
					name: "propertyRisks",
					label: "Основні ризики",
					required: false,
					options: [
						"Пожежа",
						"Затоплення",
						"Крадіжка",
						"Комплексний захист",
						"Потрібна консультація"
					]
				}
			]
		},

		travel: {
			title: "Туристичне страхування",
			fields: [
				{
					type: "text",
					name: "country",
					label: "Країна поїздки *",
					required: true,
					placeholder: "Наприклад: Німеччина"
				},
				{
					type: "number",
					name: "persons",
					label: "Кількість осіб *",
					required: true,
					placeholder: "1"
				},
				{
					type: "date",
					name: "departureDate",
					label: "Дата виїзду *",
					required: true
				},
				{
					type: "date",
					name: "returnDate",
					label: "Дата повернення *",
					required: true
				},
				{
					type: "select",
					name: "purpose",
					label: "Мета поїздки",
					required: false,
					options: [
						"Туризм",
						"Робота",
						"Навчання",
						"Спорт",
						"Інше"
					]
				}
			]
		},

		other: {
			title: "Інші види страхування",
			fields: [
				{
					type: "text",
					name: "object",
					label: "Що потрібно застрахувати *",
					required: true,
					placeholder: "Коротко опишіть об’єкт"
				},
				{
					type: "number",
					name: "sum",
					label: "Орієнтовна страхова сума",
					required: false,
					placeholder: "грн"
				},
				{
					type: "textarea",
					name: "details",
					label: "Опис ситуації *",
					required: true,
					placeholder: "Що саме потрібно підібрати?"
				}
			]
		}
	};

	let currentProductKey = "avtotsyvilka";

	function normalizeProductKey(productKey) {
		if (productKey === "osago") {
			return "avtotsyvilka";
		}

		if (!productKey || !products[productKey]) {
			return "avtotsyvilka";
		}

		return productKey;
	}

	function openModal(productKey = "avtotsyvilka") {
		const normalizedKey = normalizeProductKey(productKey);

		modal.classList.add("active");
		modal.setAttribute("aria-hidden", "false");
		document.body.classList.add("lock");

		setProduct(normalizedKey);

		const closeButton = modal.querySelector(".insurance-modal__close");

		if (closeButton) {
			closeButton.focus();
		}
	}

	function closeModal() {
		modal.classList.remove("active");
		modal.setAttribute("aria-hidden", "true");
		document.body.classList.remove("lock");
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
		const lines = [];

		lines.push(`Продукт: ${productInput.value}`);
		lines.push("");

		formElements.forEach((element) => {
			if (element.name === "consent") return;
			if (element.type === "hidden") return;

			const label = element.dataset.label || getCommonLabel(element.name);
			const value = element.value.trim();

			if (value) {
				lines.push(`${label}: ${value}`);
			}
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
		document.body.classList.toggle("insurance-focus-mode", catalogConfig.focusMode);
		document.body.classList.toggle("insurance-catalog-open", !catalogConfig.focusMode);

		const cards = document.querySelectorAll(".insurance-card--product");

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

		if (!productsBlock || document.querySelector("[data-insurance-catalog-controls]")) {
			return;
		}

		const controls = document.createElement("section");
		controls.className = "insurance-catalog-controls";
		controls.dataset.insuranceCatalogControls = "true";
		controls.innerHTML = `
			<div class="insurance-catalog-controls__head">
				<div class="insurance-catalog-controls__label">Предмет страхування</div>
				<p class="insurance-catalog-controls__text">
					Основне сортування страхових продуктів: відповідальність, майнове, особисте.
				</p>
			</div>

			<div class="insurance-catalog-controls__main" aria-label="Фільтр за предметом страхування">
				${Object.entries(catalogConfig.subjectFilters).map(([key, label]) => `
					<button type="button" class="insurance-catalog-controls__button insurance-catalog-controls__button--subject" data-insurance-filter="${key}">
						${label}
					</button>
				`).join("")}
			</div>

			<div class="insurance-catalog-controls__service" aria-label="Службові фільтри каталогу">
				${Object.entries(catalogConfig.utilityFilters).map(([key, label]) => `
					<button type="button" class="insurance-catalog-controls__button insurance-catalog-controls__button--service" data-insurance-filter="${key}">
						${label}
					</button>
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
			const shouldShow = filterKey === "all"
				|| subjectKey === filterKey
				|| (filterKey === "favorites" && isFavorite);

			card.hidden = !shouldShow;
		});

		document.querySelectorAll("[data-insurance-filter]").forEach((button) => {
			button.classList.toggle("active", button.dataset.insuranceFilter === filterKey);
		});
	}

	function initSubjectBadges(cards) {
		cards.forEach((card) => {
			const subjectKey = card.dataset.insuranceSubject || "all";
			const label = catalogConfig.subjectBadgeLabels[subjectKey] || catalogConfig.subjectBadgeLabels.all;

			if (card.querySelector("[data-insurance-subject-badge]")) {
				return;
			}

			const badge = document.createElement("span");
			badge.className = "insurance-card__subject-badge";
			badge.dataset.insuranceSubjectBadge = subjectKey;
			badge.textContent = label;
			card.appendChild(badge);
		});
	}

	function initFavoriteButtons(cards) {
		cards.forEach((card) => {
			const top = card.querySelector(".insurance-card__top");
			const productKey = card.dataset.insuranceProduct;

			if (!top || !productKey || card.querySelector("[data-insurance-favorite]")) {
				return;
			}

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
		localStorage.setItem(catalogConfig.favoriteStorageKey, JSON.stringify(productsList));
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
		if (event.target.hasAttribute("data-insurance-close")) {
			closeModal();
		}
	});

	document.addEventListener("keydown", (event) => {
		if (event.key === "Escape" && modal.classList.contains("active")) {
			closeModal();
		}
	});

	form.addEventListener("submit", sendByEmail);

	initInsuranceCatalogArchitecture();
	setProduct(currentProductKey);
});
