const modeToggle = document.getElementById('modeToggle');
        const modeIcon = document.getElementById('modeIcon');
        // Usa el elemento <html>:
        const html = document.documentElement;

        function setInitialMode() {
            const savedMode = localStorage.getItem('theme');
            if (savedMode === 'dark') {
                enableDarkMode();
            } else if (savedMode === 'light') {
                disableDarkMode();
            } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                enableDarkMode();
            } else {
                disableDarkMode();
            }
            // Sincroniza el ícono con el modo actual
            if (html.classList.contains('dark')) {
                modeIcon.classList.remove('fa-moon');
                modeIcon.classList.add('fa-sun');
            } else {
                modeIcon.classList.remove('fa-sun');
                modeIcon.classList.add('fa-moon');
            }
        }   

        modeToggle.addEventListener('click', () => {
            if (html.classList.contains('dark')) {
                disableDarkMode();
                localStorage.setItem('theme', 'light');
            } else {
                enableDarkMode();
                localStorage.setItem('theme', 'dark');
            }
        });

        function enableDarkMode() {
            html.classList.add('dark');
            modeIcon.classList.remove('fa-moon');
            modeIcon.classList.add('fa-sun');
        }

        function disableDarkMode() {
            html.classList.remove('dark');
            modeIcon.classList.remove('fa-sun');
            modeIcon.classList.add('fa-moon');
        }

        setInitialMode();

        // Animación para las tarjetas al cargar la página
        document.addEventListener('DOMContentLoaded', function() {
            const cards = document.querySelectorAll('.section-card');
            cards.forEach((card, index) => {
                setTimeout(() => {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 100);
                }, index * 100);
            });
        });

        // Modal de contacto
        const contactBtn = document.getElementById('contactBtn');
        const contactModal = document.getElementById('contactModal');
        const closeModal = document.getElementById('closeModal');
        const recruiterForm = document.getElementById('recruiterForm');
        const formSuccess = document.getElementById('formSuccess');

        contactBtn.addEventListener('click', function(e) {
            e.preventDefault();
            contactModal.classList.remove('hidden');
        });

        closeModal.addEventListener('click', function() {
            contactModal.classList.add('hidden');
            recruiterForm.reset();
            formSuccess.classList.add('hidden');
            recruiterForm.classList.remove('hidden');
        });

        contactModal.addEventListener('click', function(e) {
            if (e.target === contactModal) {
                contactModal.classList.add('hidden');
                recruiterForm.reset();
                formSuccess.classList.add('hidden');
                recruiterForm.classList.remove('hidden');
            }
        });

        recruiterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            recruiterForm.classList.add('hidden');
            formSuccess.classList.remove('hidden');
        });

const SUPPORTED_LANGS = ["es", "en", "fr", "pt", "it", "de","cs","gsw","hi","ja","ko","pt","ru","tr","zh"];
let currentLang = "es";
let translations = {};

// Carga el archivo de traducción según el idioma
async function loadTranslations(lang) {
    if (!SUPPORTED_LANGS.includes(lang)) lang = "es";
    try {
        const response = await fetch(`static/lang/${lang}.json`);
        if (!response.ok) throw new Error("No translation file");
        translations = await response.json();
        currentLang = lang;
        localStorage.setItem("lang", lang);
        applyTranslations();
        await loadGalleryProjects(); // <--- Añade esto
    } catch (e) {
        if (lang !== "es") {
            await loadTranslations("es");
        }
    }
}

// Aplica las traducciones a los elementos con data-i18n y data-i18n-placeholder
function applyTranslations() {
    document.querySelectorAll("[data-i18n]").forEach(el => {
        const keys = el.getAttribute("data-i18n").split(".");
        let value = translations;
        for (const k of keys) value = value?.[k];
        if (typeof value === "string") el.textContent = value;
    });
    document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
        const keys = el.getAttribute("data-i18n-placeholder").split(".");
        let value = translations;
        for (const k of keys) value = value?.[k];
        if (typeof value === "string") el.placeholder = value;
    });

    // Renderiza listas de experiencia si existe el elemento y la traducción
    const expList = document.getElementById("experience-list");
    if (expList && translations.experience?.items) {
        expList.innerHTML = "";
        translations.experience.items.forEach(item => {
            const li = document.createElement("li");
            li.textContent = item;
            expList.appendChild(li);
        });
    }
}

// Detecta el idioma preferido del navegador
function detectBrowserLang() {
    const navLang = (navigator.language || "es").split('-')[0];
    return SUPPORTED_LANGS.includes(navLang) ? navLang : "es";
}

// Modal de selección de idioma
function setupLangModal() {
    // Botón flotante
    const langBtn = document.createElement("button");
    langBtn.id = "langBtn";
    langBtn.className = "fixed bottom-6 left-6 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 p-3 rounded-full shadow-lg hover:bg-gray-300 dark:hover:bg-gray-600 z-40"; // z-40 para estar debajo del modal (z-50)
    langBtn.innerHTML = '<i class="fas fa-globe"></i>';
    document.body.appendChild(langBtn);

    // Modal
    const langModal = document.createElement("div");
    langModal.id = "langModal";
    langModal.className = "fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 hidden";
    langModal.innerHTML = `
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 w-full max-w-xs relative">
            <button id="closeLangModal" class="absolute top-3 right-3 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 text-2xl">&times;</button>
            <h2 class="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100" data-i18n="langModal.title">Selecciona idioma</h2>
            <div class="space-y-2">
                <button class="lang-option w-full py-2 rounded bg-blue-600 text-white" data-lang="es">Español</button>
                <button class="lang-option w-full py-2 rounded bg-blue-600 text-white" data-lang="en">English</button>
                <button class="lang-option w-full py-2 rounded bg-blue-600 text-white" data-lang="fr">Français</button>
                <button class="lang-option w-full py-2 rounded bg-blue-600 text-white" data-lang="pt">Português</button>
                <button class="lang-option w-full py-2 rounded bg-blue-600 text-white" data-lang="it">Italiano</button>
                <button class="lang-option w-full py-2 rounded bg-blue-600 text-white" data-lang="de">Deutsch</button>
                <button class="lang-option w-full py-2 rounded bg-blue-600 text-white" data-lang="zh">中文</button>
                <button class="lang-option w-full py-2 rounded bg-blue-600 text-white" data-lang="ja">日本語</button>
                <button class="lang-option w-full py-2 rounded bg-blue-600 text-white" data-lang="hi">हिन्दी</button>
                <button class="lang-option w-full py-2 rounded bg-blue-600 text-white" data-lang="ru">Русский</button>
                <button class="lang-option w-full py-2 rounded bg-blue-600 text-white" data-lang="gsw">Schweizerdeutsch</button>
                <button class="lang-option w-full py-2 rounded bg-blue-600 text-white" data-lang="cs">Čeština</button>
                <button class="lang-option w-full py-2 rounded bg-blue-600 text-white" data-lang="ko">한국어</button>
                <button class="lang-option w-full py-2 rounded bg-blue-600 text-white" data-lang="tr">Türkçe</button>
            </div>
        </div>
    `;
    document.body.appendChild(langModal);

    // Eventos
    langBtn.onclick = () => langModal.classList.remove("hidden");
    document.getElementById("closeLangModal").onclick = () => langModal.classList.add("hidden");
    langModal.querySelectorAll(".lang-option").forEach(btn => {
        btn.onclick = async () => {
            const lang = btn.getAttribute("data-lang");
            await loadTranslations(lang);
            langModal.classList.add("hidden");
            // Si el modal de proyecto está abierto, recárgalo
            const galeriaModal = document.getElementById("galeriaModal");
            if (galeriaModal && !galeriaModal.classList.contains("hidden") && lastProjectModalData) {
                openProjectModal(lastProjectModalData);
            }
        };
    });
    langModal.addEventListener("click", function(e) {
    if (e.target === langModal) {
        langModal.classList.add("hidden");
    }
});
}

// Cambia el tema (oscuro/claro) y guarda preferencia en localStorage
function toggleTheme() {
    const html = document.documentElement;
    const isDark = html.classList.toggle("dark");
    localStorage.setItem("theme", isDark ? "dark" : "light");
}

// Aplica el tema guardado o detecta preferencia del sistema
function applySavedTheme() {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
        document.documentElement.classList.add("dark");
    } else {
        document.documentElement.classList.remove("dark");
    }
}

// Botón flotante para cambiar tema
function setupThemeToggle() {
    const themeBtn = document.createElement("button");
    themeBtn.id = "themeBtn";
    themeBtn.className = "fixed bottom-6 right-6 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 p-3 rounded-full shadow-lg hover:bg-gray-300 dark:hover:bg-gray-600 z-50";
    themeBtn.innerHTML = '<i class="fas fa-moon"></i>';
    document.body.appendChild(themeBtn);

    themeBtn.onclick = () => {
        toggleTheme();
        // Cambia el icono según el tema
        themeBtn.innerHTML = document.documentElement.classList.contains("dark")
            ? '<i class="fas fa-sun"></i>'
            : '<i class="fas fa-moon"></i>';
    };

    // Inicializa el icono correcto
    themeBtn.innerHTML = document.documentElement.classList.contains("dark")
        ? '<i class="fas fa-sun"></i>'
        : '<i class="fas fa-moon"></i>';
}

// Accesibilidad: Navegación rápida con teclas
function setupAccessibilityShortcuts() {
    document.addEventListener("keydown", e => {
        if (e.altKey && e.key === "l") {
            // Alt+L: abre modal de idioma
            const langModal = document.getElementById("langModal");
            if (langModal) langModal.classList.remove("hidden");
        }
        if (e.altKey && e.key === "t") {
            // Alt+T: cambia tema
            toggleTheme();
        }
    });
}

// Inicialización automática extendida
document.addEventListener("DOMContentLoaded", async () => {
    setupLangModal();
    setupAccessibilityShortcuts();
    applySavedTheme();
    const savedLang = localStorage.getItem("lang");
    await loadGalleryProjects();
    await loadTranslations(savedLang || detectBrowserLang());
});
let currentPage = 1;
const CARDS_PER_PAGE = 9; // 3x3 grid

async function loadGalleryProjects(page = 1) {
    const thumbs = document.getElementById("galeria-thumbs");
    if (thumbs) {
        thumbs.innerHTML = "";
        thumbs.className = "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6";
    }

    let projects = [];
    try {
        const res = await fetch("static/gallery/index.json");
        projects = await res.json();
    } catch {
        projects = [];
    }

    // PAGINACIÓN
    const totalPages = Math.ceil(projects.length / CARDS_PER_PAGE);
    currentPage = Math.max(1, Math.min(page, totalPages));
    const start = (currentPage - 1) * CARDS_PER_PAGE;
    const end = start + CARDS_PER_PAGE;
    const pageProjects = projects.slice(start, end);

    for (const projectName of pageProjects) {
        try {
            // Carga datos generales del proyecto
            const [projectRes, assetsRes] = await Promise.all([
                fetch(`static/gallery/${projectName.replace(".json","")}/${projectName}`),
                fetch(`static/gallery/${projectName.replace(".json","")}/assets.json`)
            ]);
            const projectData = await projectRes.json();
            const assetsData = await assetsRes.json();

            // Carga textos traducidos del proyecto
            let lang = localStorage.getItem("lang") || detectBrowserLang();
            if (!SUPPORTED_LANGS.includes(lang)) lang = "es";
            let texts = {};
            try {
                const langRes = await fetch(`static/gallery/${projectName.replace(".json","")}/lang/${lang}.json`);
                if (langRes.ok) {
                    texts = await langRes.json();
                } else {
                    const fallbackRes = await fetch(`static/gallery/${projectName.replace(".json","")}/lang/es.json`);
                    texts = await fallbackRes.json();
                }
            } catch {
                const fallbackRes = await fetch(`static/gallery/${projectName.replace(".json","")}/lang/es.json`);
                texts = await fallbackRes.json();
            }

            // Extrae el thumbnail del proyecto desde assets.json > thumbnail (puede ser lista)
            let thumbnail = null;
            if (Array.isArray(assetsData.thumbnail) && assetsData.thumbnail.length > 0) {
                thumbnail = assetsData.thumbnail[0];
            } else if (assetsData.thumbnail && typeof assetsData.thumbnail === "object") {
                thumbnail = assetsData.thumbnail;
            }

            // Unifica los datos para la tarjeta y el modal
// Normaliza las imágenes para que siempre sean objetos {url, thumbnail, alt}
let images = [];
if (Array.isArray(assetsData.images)) {
    images = assetsData.images.map(img => {
        if (typeof img === "string") {
            return { url: img, thumbnail: img, alt: projectData.name || "" };
        } else if (typeof img === "object" && img !== null) {
            return {
                url: img.url || img.thumbnail || "placeholder.jpg",
                thumbnail: img.thumbnail || img.url || "placeholder.jpg",
                alt: img.alt || projectData.name || ""
            };
        }
        return { url: "placeholder.jpg", thumbnail: "placeholder.jpg", alt: projectData.name || "" };
    });
}

// Unifica los datos para la tarjeta y el modal
const data = {
    ...projectData,
    ...texts,
    images,
    thumbnail
};
createGalleryCard(data);
        } catch (e) {
            console.error("Error loading project", projectName, e);
        }
    }

    // Renderiza controles de paginación
    renderPagination(totalPages);
}

function renderPagination(totalPages) {
    let pagination = document.getElementById("gallery-pagination");
    if (!pagination) {
        pagination = document.createElement("div");
        pagination.id = "gallery-pagination";
        pagination.className = "flex justify-center gap-2 mt-6";
        document.getElementById("galeria-thumbs").after(pagination);
    }
    pagination.innerHTML = "";

    for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement("button");
        btn.textContent = i;
        btn.className = "px-3 py-1 rounded " + (i === currentPage ? "bg-violet-600 text-white font-bold" : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100");
        btn.onclick = () => loadGalleryProjects(i);
        pagination.appendChild(btn);
    }
}
function createGalleryCard(data) {
    const card = document.createElement("div");
    card.className = "relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden cursor-pointer transform transition duration-300 hover:scale-105 hover:shadow-2xl group w-full aspect-square";
    card.tabIndex = 0;
    card.setAttribute("role", "button");
    card.setAttribute("aria-label", data.name);

    // Usa el thumbnail de la primera imagen, o el thumbnail directo, o placeholder
    let imgSrc = "placeholder.jpg";
    if (data.thumbnail && typeof data.thumbnail === "string") {
        imgSrc = data.thumbnail;
    } else if (data.images?.[0]?.thumbnail) {
        imgSrc = data.images[0].thumbnail;
    } else if (data.images?.[0]?.url) {
        imgSrc = data.images[0].url;
    }

    const img = document.createElement("img");
    img.src = imgSrc;
    img.alt = data.images?.[0]?.alt || data.name;
    img.className = "w-full h-full object-cover rounded-2xl";
    card.appendChild(img);

    // Overlay de texto encima de la imagen
    const overlay = document.createElement("div");
    overlay.className = "absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex flex-col justify-end p-4 pointer-events-none";
    const title = document.createElement("div");
    title.className = "font-bold text-white text-lg mb-1 drop-shadow";
    title.textContent = data.name;
    overlay.appendChild(title);

    if (data.short) {
        const desc = document.createElement("div");
        desc.className = "text-gray-200 text-sm mb-1 drop-shadow";
        desc.textContent = data.short;
        overlay.appendChild(desc);
    }
    card.appendChild(overlay);

    card.onclick = () => openProjectModal(data);
    card.onkeydown = (e) => { if (e.key === "Enter" || e.key === " ") openProjectModal(data); };

    document.getElementById("galeria-thumbs").appendChild(card);
}
let lastProjectModalData = null; // Global

function openProjectModal(data) {
    lastProjectModalData = data; // Guarda el último proyecto abierto
    // Si el modal no existe, créalo y agrégalo al body
let modal = document.getElementById("galeriaModal");
if (!modal) return; // No crear uno nuevo, debe estar en el HTML

    // Rellena el contenido del modal
    const content = document.getElementById("galeriaModalContent");
    // Grid de imágenes (sin thumbnail)
    // Muestra todas las imágenes en el grid, usando su thumbnail para el grid y la imagen original en el modal
    const images = (data.images || []);

    content.innerHTML = `
        <h2 class="text-2xl font-bold mb-2 text-gray-900 dark:text-gray-100 text-center">${data.name}</h2>
        <div class="flex-1 overflow-y-auto mb-2">
            <div class="grid grid-cols-2 sm:grid-cols-3 gap-3 justify-items-center" id="projectImagesGrid">
                ${images.map((img, idx) => `
                    <div class="relative group cursor-pointer aspect-square w-full">
                        <picture>
                            <img src="${img.thumbnail}" alt="${img.alt || data.name}" 
                                class="w-full h-full object-cover rounded-xl shadow transition duration-300 hover:scale-105"
                                loading="lazy"
                                data-img-idx="${idx}"
                            >
                        </picture>
                        <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition rounded-xl"></div>
                    </div>
                `).join("")}
            </div>
        </div>
        <div class="mb-4 text-gray-700 dark:text-gray-300 text-center">${data.description || ""}</div>
        ${data.links ? `<div class="flex flex-wrap gap-2 mt-2 justify-center">
            ${Object.entries(data.links).map(([label, url]) =>
                `<a href="${url}" target="_blank" rel="noopener"
                    class="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-400 dark:from-blue-700 dark:to-blue-500 text-white font-semibold rounded-full shadow hover:from-blue-700 hover:to-blue-500 dark:hover:from-blue-800 dark:hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition-all duration-200 text-sm min-w-[96px] text-center"
                >
                    <i class="fas fa-external-link-alt text-xs opacity-70"></i>
                    ${label}
                </a>`
            ).join("")}
        </div>` : ""}
    `;

    // Modal para ver imagen ampliada (solo se crea una vez)
    let imgModal = document.getElementById("projectImgModal");
    if (!imgModal) {
        imgModal = document.createElement("div");
        imgModal.id = "projectImgModal";
        imgModal.className = "fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 hidden";
        imgModal.innerHTML = `
            <div class="relative max-w-3xl w-full flex items-center justify-center">
                <button id="closeProjectImgModal" class="absolute top-2 right-2 text-white text-3xl z-10">&times;</button>
                <img id="projectImgModalImg" src="" alt="" class="max-h-[80vh] max-w-full rounded-xl shadow-lg border-4 border-white dark:border-gray-800">
            </div>
        `;
        document.body.appendChild(imgModal);
        document.getElementById("closeProjectImgModal").onclick = () => imgModal.classList.add("hidden");
        imgModal.onclick = (e) => { if (e.target === imgModal) imgModal.classList.add("hidden"); };
    }

    // Evento para abrir imagen en modal (usa la url original, no el thumbnail)
    content.querySelectorAll('img[data-img-idx]').forEach(imgEl => {
        imgEl.onclick = () => {
            const idx = imgEl.getAttribute('data-img-idx');
            document.getElementById("projectImgModalImg").src = images[idx].url;
            document.getElementById("projectImgModalImg").alt = images[idx].alt || data.name;
            imgModal.classList.remove("hidden");
        };
    });
    modal.classList.remove("hidden");

    // Evento para cerrar el modal
    document.getElementById("closeGaleriaModal").onclick = () => {
        modal.classList.add("hidden");
    };
    // Cierra el modal si se hace click fuera del contenido
    modal.onclick = (e) => {
        if (e.target === modal) {
            modal.classList.add("hidden");
        }
    };
}

