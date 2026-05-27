(function() {
    'use strict';

    // ============================================================
    //  MOBILE UX ENHANCEMENTS
    // ============================================================

    let isMobile = false;
    let sidebarExpanded = false;
    let touchStartY = 0;
    let touchStartX = 0;
    let currentLang = 'en';

    const uiText = {
        appTitle: { en: 'Islamic History', bn: 'ইসলামের ইতিহাস', de: 'Islamische Geschichte' },
        appSubtitle: { en: 'Interactive Choropleth & Timeline', bn: 'ইন্টারঅ্যাকটিভ মানচিত্র ও সময়রেখা', de: 'Interaktive Choroplethenkarte & Zeitlinie' },
        historicalMap: { en: 'Historical', bn: 'ঐতিহাসিক', de: 'Historisch' },
        neutralMap: { en: 'Neutral', bn: 'নিরপেক্ষ', de: 'Neutral' },
        modernMap: { en: 'Modern', bn: 'আধুনিক', de: 'Modern' },
        era: { en: 'Era', bn: 'যুগ', de: 'Epoche' },
        historicalContext: { en: 'Historical Context', bn: 'ঐতিহাসিক প্রেক্ষাপট', de: 'Historischer Kontext' },
        events: { en: 'Events', bn: 'ঘটনা', de: 'Ereignisse' },
        scholars: { en: 'Scholars', bn: 'মনীষী', de: 'Gelehrte' },
        greekInfluence: { en: 'Greek Influence', bn: 'গ্রিক প্রভাব', de: 'Griechischer Einfluss' },
        noEvents: { en: 'No major events recorded for this era.', bn: 'এই যুগের জন্য বড় কোনো ঘটনা যুক্ত করা হয়নি।', de: 'Keine größeren Ereignisse für diese Epoche aufgezeichnet.' },
        noScholars: { en: 'No major scholars recorded for this era.', bn: 'এই যুগের জন্য বড় কোনো মনীষী যুক্ত করা হয়নি।', de: 'Keine bedeutenden Gelehrten für diese Epoche aufgezeichnet.' },
        noGreek: { en: 'No notable Greek influences identified for this era.', bn: 'এই যুগের জন্য উল্লেখযোগ্য গ্রিক প্রভাব যুক্ত করা হয়নি।', de: 'Keine nennenswerten griechischen Einflüsse für diese Epoche identifiziert.' },
        backToList: { en: 'Back to List', bn: 'তালিকায় ফিরুন', de: 'Zurück zur Liste' },
        years: { en: 'years', bn: 'বছর', de: 'Jahre' },
        fields: { en: 'Fields', bn: 'বিষয়', de: 'Fachbereiche' },
        born: { en: 'Born', bn: 'জন্ম', de: 'Geboren' },
        active: { en: 'Active', bn: 'কর্মক্ষেত্র', de: 'Aktiv' },
        notableWorks: { en: 'Notable Works', bn: 'উল্লেখযোগ্য রচনা', de: 'Bedeutende Werke' },
        lifeJourneys: { en: 'Life Journeys', bn: 'জীবনপথ', de: 'Lebenswege' },
        intellectualConnections: { en: 'Intellectual Connections', bn: 'জ্ঞানগত সম্পর্ক', de: 'Intellektuelle Verbindungen' },
        noWorks: { en: 'No works recorded.', bn: 'কোনো রচনা যুক্ত করা হয়নি।', de: 'Keine Werke aufgezeichnet.' },
        noJourneys: { en: 'No major journeys recorded.', bn: 'কোনো প্রধান জীবনপথ যুক্ত করা হয়নি।', de: 'Keine größeren Reisen aufgezeichnet.' },
        noneRecorded: { en: 'None recorded', bn: 'কিছু যুক্ত করা হয়নি', de: 'Nichts aufgezeichnet' },
        birthplace: { en: 'Birthplace', bn: 'জন্মস্থান', de: 'Geburtsort' },
        journey: { en: 'Journey', bn: 'জীবনপথ', de: 'Reise' },
        activePlace: { en: 'Active', bn: 'কর্মক্ষেত্র', de: 'Aktivitätsort' },
        influence: { en: 'Influence', bn: 'প্রভাব', de: 'Einfluss' },
        viewDetails: { en: 'View details for', bn: 'বিস্তারিত দেখুন', de: 'Details anzeigen für' },
        viewOnMap: { en: 'View on Map', bn: 'মানচিত্রে দেখুন', de: 'Auf der Karte anzeigen' },
        accuracyHigh: { en: 'High Accuracy', bn: 'উচ্চ নির্ভুলতা', de: 'Hohe Genauigkeit' },
        accuracyMedium: { en: 'Medium Accuracy', bn: 'মাঝারি নির্ভুলতা', de: 'Mittlere Genauigkeit' },
        accuracyLow: { en: 'Low Accuracy', bn: 'কম নির্ভুলতা', de: 'Geringe Genauigkeit' },
        historicalRegion: { en: 'Historical Region', bn: 'ঐতিহাসিক অঞ্চল', de: 'Historische Region' },
        hoverRegion: { en: 'Hover over a region', bn: 'অঞ্চলের ওপর স্পর্শ করুন', de: 'Bewegen Sie den Mauszeiger über eine Region' },
        regions: { en: 'Regions', bn: 'অঞ্চল', de: 'Regionen' },
        recommendedReading: { en: 'Recommended Reading', bn: 'প্রস্তাবিত পাঠ', de: 'Leseempfehlungen' },
        watchLearn: { en: 'Watch & Learn', bn: 'দেখুন ও শিখুন', de: 'Ansehen & Lernen' },
        noReferences: { en: 'No references recorded.', bn: 'কোনো তথ্যসূত্র যুক্ত করা হয়নি।', de: 'Keine Referenzen aufgezeichnet.' },
        noVideos: { en: 'No videos recorded.', bn: 'কোনো ভিডিও যুক্ত করা হয়নি।', de: 'Keine Videos aufgezeichnet.' }
    };

        const eraMeta = [
        {
            name: { en: 'Classical Period', bn: 'ধ্রুপদী যুগ', de: 'Antike' },
            period: { en: '-500 to 500 CE', bn: '৫০০ খ্রিষ্টপূর্বাব্দ - ৫০০ খ্রিষ্টাব্দ', de: '-500 bis 500 CE' },
            summary: { en: 'Greek philosophy, Roman expansion, rise of Christianity', bn: 'গ্রিক দর্শন, রোমান বিস্তার ও খ্রিস্টধর্মের উত্থান', de: 'Griechische Philosophie, römische Expansion, Aufstieg des Christentums' }
        },
        {
            name: { en: 'Prophet Muhammad', bn: 'নবী মুহাম্মদ', de: 'Prophet Mohammed' },
            period: { en: '570-632 CE', bn: '৫৭০-৬৩২ খ্রিষ্টাব্দ', de: '570-632 CE' },
            summary: { en: 'Birth of Islam, revelation of the Quran, unification of Arabia', bn: 'ইসলামের জন্ম, কুরআন অবতরণ ও আরবের ঐক্য', de: 'Geburt des Islams, Offenbarung des Korans, Vereinigung Arabiens' }
        },
        {
            name: { en: 'Rashidun Caliphate', bn: 'রাশিদুন খিলাফত', de: 'Rechtgeleitetes Kalifat' },
            period: { en: '632-661 CE', bn: '৬৩২-৬৬১ খ্রিষ্টাব্দ', de: '632-661 CE' },
            summary: { en: 'First four Caliphs, rapid expansion into Persia and Byzantium', bn: 'প্রথম চার খলিফা এবং পারস্য ও বাইজেন্টাইনে দ্রুত বিস্তার', de: 'Die ersten vier Kalifen, schnelle Expansion nach Persien und Byzanz' }
        },
        {
            name: { en: 'Umayyad & Abbasid', bn: 'উমাইয়া ও আব্বাসীয়', de: 'Umayyaden & Abbasiden' },
            period: { en: '661-1258 CE', bn: '৬৬১-১২৫৮ খ্রিষ্টাব্দ', de: '661-1258 CE' },
            summary: { en: 'Golden Age, House of Wisdom, scientific revolution', bn: 'স্বর্ণযুগ, বাইতুল হিকমা ও বৈজ্ঞানিক অগ্রগতি', de: 'Goldenes Zeitalter, Haus der Weisheit, wissenschaftliche Revolution' }
        },
        {
            name: { en: 'Regional Dynasties', bn: 'আঞ্চলিক রাজবংশ', de: 'Regionale Dynastien' },
            period: { en: '900-1600 CE', bn: '৯০০-১৬০০ খ্রিষ্টাব্দ', de: '900-1600 CE' },
            summary: { en: 'Fragmentation, Crusades, Mongol invasions, scholarly excellence', bn: 'আঞ্চলিক শক্তি, ক্রুসেড, মঙ্গোল আক্রমণ ও জ্ঞানচর্চা', de: 'Fragmentierung, Kreuzzüge, Mongoleninvasionen, wissenschaftliche Exzellenz' }
        },
        {
            name: { en: 'Gunpowder Empires', bn: 'গানপাউডার সাম্রাজ্য', de: 'Pulverreiche' },
            period: { en: '1400-1922 CE', bn: '১৪০০-১৯২২ খ্রিষ্টাব্দ', de: '1400-1922 CE' },
            summary: { en: 'Ottoman, Safavid, Mughal empires at their height', bn: 'অটোমান, সাফাভি ও মুঘল সাম্রাজ্যের উৎকর্ষ', de: 'Osmanisches, Safawidisches und Mogulreich auf ihrem Höhepunkt' }
        },
        {
            name: { en: 'Modern Era', bn: 'আধুনিক যুগ', de: 'Moderne Ära' },
            period: { en: '1900-2026 CE', bn: '১৯০০-২০২৬ খ্রিষ্টাব্দ', de: '1900-2026 CE' },
            summary: { en: 'Colonial independence, nation-states, contemporary Islam', bn: 'উপনিবেশ-পরবর্তী স্বাধীনতা, জাতিরাষ্ট্র ও সমকালীন ইসলাম', de: 'Koloniale Unabhängigkeit, Nationalstaaten, zeitgenössischer Islam' }
        }
    ];

    function t(key) {
        return uiText[key]?.[currentLang] || uiText[key]?.en || key;
    }

    function localize(value) {
        if (!value || typeof value !== 'object') return value || '';
        return value[currentLang] || value.en || value.bn || '';
    }

    function getYoutubeEmbedUrl(url) {
        if (!url) return '';
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        if (match && match[2].length === 11) {
            return `https://www.youtube.com/embed/${match[2]}`;
        }
        return url;
    }
    
    function checkMobile() {
        isMobile = window.matchMedia('(max-width: 767px)').matches;
        return isMobile;
    }

    function showLoading() {
        document.getElementById('loadingOverlay')?.classList.add('active');
    }

    function hideLoading() {
        document.getElementById('loadingOverlay')?.classList.remove('active');
    }

    async function loadAppVersion() {
        try {
            const response = await fetch('VERSION', { cache: 'no-store' });
            if (!response.ok) return;
            const version = (await response.text()).trim();
            if (version) {
                document.getElementById('appVersion').textContent = `v${version}`;
            }
        } catch (e) {
            console.warn('Version file could not be loaded', e);
        }
    }

    function updateLanguageUI() {
        document.documentElement.lang = currentLang;
        document.body.classList.toggle('lang-bn', currentLang === 'bn');
        document.body.classList.toggle('lang-de', currentLang === 'de');

        document.querySelectorAll('[data-i18n]').forEach(el => {
            el.textContent = t(el.dataset.i18n);
        });

                const languageToggle = document.getElementById('languageToggle');
        if (languageToggle) {
            if (currentLang === 'en') {
                languageToggle.textContent = 'বাংলা';
                languageToggle.setAttribute('aria-label', 'Switch to Bengali');
            } else if (currentLang === 'bn') {
                languageToggle.textContent = 'Deutsch';
                languageToggle.setAttribute('aria-label', 'Switch to German');
            } else {
                languageToggle.textContent = 'English';
                languageToggle.setAttribute('aria-label', 'Switch to English');
            }
        }

        document.querySelectorAll('.tl-item').forEach((item, index) => {
            const era = eraMeta[index];
            if (!era) return;
            const label = item.querySelector('.tl-section-label');
            const badge = label?.querySelector('.accuracy-badge');
            if (label) {
                label.textContent = localize(era.name) + ' ';
                if (badge) {
                    if (badge.classList.contains('accuracy-high')) badge.textContent = t('accuracyHigh');
                    if (badge.classList.contains('accuracy-medium')) badge.textContent = t('accuracyMedium');
                    if (badge.classList.contains('accuracy-low')) badge.textContent = t('accuracyLow');
                    label.appendChild(badge);
                }
            }
            const period = item.querySelector('.tl-period');
            if (period) period.textContent = localize(era.period);
            const summary = item.querySelector('.tl-summary');
            if (summary) summary.textContent = localize(era.summary);
        });

        updateMapTitle();
    }

    function updateMapTitle() {
        const era = eraMeta[currentEraIndex];
        if (!era) return;
        document.getElementById('mapTitle').textContent = `${localize(era.name)} (${localize(era.period)})`;
    }

    // ============================================================
    //  1. MAP SETUP WITH MULTIPLE BASE LAYERS
    // ============================================================

    const map = L.map('historyMap', {
        center: [25, 45],
        zoom: 4,
        zoomControl: false
    });

    // Define different base map layers
    const baseLayers = {
        historical: L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Physical_Map/MapServer/tile/{z}/{y}/{x}', {
            attribution: 'Tiles &copy; Esri',
            maxZoom: 8,
            opacity: 0.4
        }),
        neutral: L.tileLayer('https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
            maxZoom: 8,
            opacity: 0.3
        }),
        modern: L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; OpenStreetMap contributors &copy; CARTO'
        })
    };

    let currentBaseLayer = baseLayers.historical;
    currentBaseLayer.addTo(map);

    // Base layer switcher
    document.querySelectorAll('.basemap-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.basemap-btn').forEach(b => {
                b.classList.remove('active');
                b.setAttribute('aria-pressed', 'false');
            });
            e.target.classList.add('active');
            e.target.setAttribute('aria-pressed', 'true');
            const mapType = e.target.dataset.map;
            map.removeLayer(currentBaseLayer);
            currentBaseLayer = baseLayers[mapType];
            currentBaseLayer.addTo(map);
            // Bring GeoJSON layer to front
            if (geojsonLayer) {
                geojsonLayer.bringToFront();
            }
        });
    });

    document.getElementById('languageToggle')?.addEventListener('click', () => {
        currentLang = currentLang === 'en' ? 'bn' : (currentLang === 'bn' ? 'de' : 'en');
        updateLanguageUI();
        if (subEventsData && scholarsData && greekData) {
            updateSidebar();
        }
    });

    function isSmallScreen() {
        return window.matchMedia('(max-width: 767px)').matches;
    }

    function keepActiveEraVisible() {
        if (!isSmallScreen()) return;

        document.querySelector('.tl-item.active')?.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
            inline: 'center'
        });
    }

    L.control.zoom({ position: 'topright' }).addTo(map);

    const eraViews = [
        { center: [35, 20], zoom: 4 },
        { center: [24, 45], zoom: 5 },
        { center: [30, 45], zoom: 4 },
        { center: [30, 40], zoom: 3 },
        { center: [32, 40], zoom: 4 },
        { center: [35, 45], zoom: 3 },
        { center: [15, 60], zoom: 2 }
    ];

    let geojsonLayer = null;
    let subEventsData = null;
    let scholarsData = null;
    let greekData = null;
    let currentEraIndex = 0;
    let selectedScholarId = null;
    let selectedGreekId = null;
    let highlightedRegionLayer = null;
    let scholarLayers = L.layerGroup().addTo(map);
    let currentTab = 'events';

    // ============================================================
    //  2. DATA FETCHING
    // ============================================================

    async function fetchData(url) {
        const response = await fetch(url);
        return await response.json();
    }


    // Mobile Menu Toggle
    const menuToggle = document.getElementById('menuToggle');
    const headerControls = document.getElementById('headerControls');

    if (menuToggle && headerControls) {
        menuToggle.addEventListener('click', () => {
            const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
            menuToggle.setAttribute('aria-expanded', !isExpanded);
            headerControls.classList.toggle('active');
        });
    }

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (menuToggle && !menuToggle.contains(e.target) && !headerControls.contains(e.target)) {
            menuToggle.setAttribute('aria-expanded', 'false');
            headerControls.classList.remove('active');
        }
    });

    async function init() {
        showLoading();
        try {
            const [events, scholars, greek] = await Promise.all([
                fetchData('data/sub_events.json'),
                fetchData('data/scholars.json'),
                fetchData('data/greek_philosophers.json')
            ]);
            subEventsData = events;
            scholarsData = scholars.scholars;
            greekData = greek.philosophers;
            updateLanguageUI();
            
            // Initialize mobile sidebar behavior
            if (checkMobile()) {
                initMobileSidebar();
            }
            
            await loadEra(0);
            map.invalidateSize();
            hideLoading();
        } catch (e) {
            console.error("Initialization failed", e);
            hideLoading();
        }
    }

    // ============================================================
    //  MOBILE SIDEBAR BEHAVIOR
    // ============================================================

    function initMobileSidebar() {
        const sidebar = document.getElementById('contextPanel');
        const sidebarHeader = sidebar?.querySelector('.sidebar-handle');
        const backdrop = document.getElementById('sidebarBackdrop');
        
        if (!sidebar || !sidebarHeader) return;

        // Toggle sidebar on header tap
        sidebarHeader.addEventListener('click', toggleSidebar);

        // Keyboard support for sidebar header
        sidebarHeader.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleSidebar();
            }
        });
        
        // Close sidebar when clicking backdrop
        backdrop?.addEventListener('click', () => {
            if (sidebarExpanded) {
                toggleSidebar();
            }
        });
        
        // Swipe to close/open
        let startY = 0;
        let currentY = 0;
        let isDragging = false;

        sidebarHeader.addEventListener('touchstart', (e) => {
            startY = e.touches[0].clientY;
            isDragging = true;
        }, { passive: true });

        sidebarHeader.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            currentY = e.touches[0].clientY;
            const deltaY = currentY - startY;
            
            // Only allow dragging if swiping makes sense
            if (sidebarExpanded && deltaY > 0) {
                e.preventDefault();
            } else if (!sidebarExpanded && deltaY < 0) {
                e.preventDefault();
            }
        }, { passive: false });

        sidebarHeader.addEventListener('touchend', (e) => {
            if (!isDragging) return;
            isDragging = false;
            
            const deltaY = currentY - startY;
            const threshold = 50;
            
            if (sidebarExpanded && deltaY > threshold) {
                toggleSidebar();
            } else if (!sidebarExpanded && deltaY < -threshold) {
                toggleSidebar();
            }
        }, { passive: true });
    }

    function toggleSidebar() {
        const sidebar = document.getElementById('contextPanel');
        const sidebarHeader = document.getElementById('sidebarHeader');
        const backdrop = document.getElementById('sidebarBackdrop');
        if (!sidebar) return;
        
        sidebarExpanded = !sidebarExpanded;
        sidebarHeader?.setAttribute('aria-expanded', sidebarExpanded);
        
        if (sidebarExpanded) {
            sidebar.classList.add('expanded');
            backdrop?.classList.add('active');
            document.body.classList.add('sidebar-open');
            // Prevent body scroll when sidebar is open
            document.body.style.overflow = 'hidden';
        } else {
            sidebar.classList.remove('expanded');
            backdrop?.classList.remove('active');
            document.body.classList.remove('sidebar-open');
            // Restore body scroll
            document.body.style.overflow = '';
        }
    }

    // ============================================================
    //  3. INFO CONTROL
    // ============================================================

    const info = L.control();

    info.onAdd = function (map) {
        this._div = L.DomUtil.create('div', 'info');
        this.update();
        return this._div;
    };

    info.update = function (props) {
        this._div.innerHTML = `<h4>${t('historicalRegion')}</h4>` +  (props ?
            '<b>' + localize(props.name) + '</b><br />' + localize(props.description)
            : t('hoverRegion'));
    };

    info.addTo(map);

    function updateLegend(features) {
        const container = document.getElementById('mapLegend');
        container.innerHTML = `<h4>${t('regions')}</h4>`;
        container.classList.add('is-visible');
        const seen = new Set();
        features.forEach(f => {
            const regionName = localize(f.properties.name);
            if (!seen.has(regionName)) {
                seen.add(regionName);
                const div = document.createElement('div');
                div.className = 'legend-item';
                div.innerHTML = `<span class="color-box" style="background:${f.properties.color}"></span><span>${regionName}</span>`;
                container.appendChild(div);
            }
        });
    }

    function clearMapHighlights() {
        scholarLayers.clearLayers();
        if (highlightedRegionLayer && geojsonLayer) {
            geojsonLayer.resetStyle(highlightedRegionLayer);
        }
        highlightedRegionLayer = null;
    }

    function highlightRegionNear(coords) {
        if (!geojsonLayer || !coords) return;

        if (highlightedRegionLayer) {
            geojsonLayer.resetStyle(highlightedRegionLayer);
            highlightedRegionLayer = null;
        }

        const latLng = L.latLng(coords[0], coords[1]);
        geojsonLayer.eachLayer(layer => {
            if (!highlightedRegionLayer && layer.getBounds().contains(latLng)) {
                highlightedRegionLayer = layer;
                layer.setStyle({
                    weight: 5,
                    color: '#111827',
                    dashArray: '',
                    fillOpacity: 0.88
                });
                layer.bringToFront();
            }
        });
    }

    function makeEventPopup(ev) {
        return `
            <div class="map-popup">
                <strong>${localize(ev.title)}</strong>
                <span>${localize(ev.year)}</span>
                <p>${localize(ev.desc)}</p>
            </div>
        `;
    }

    function makeScholarPopup(s, label, note) {
        return `
            <div class="map-popup">
                <strong>${localize(s.name)}</strong>
                <span>${label}</span>
                <p>${note || localize(s.summary)}</p>
                <small>${s.born}-${s.died} CE · ${localize(s.field)}</small>
            </div>
        `;
    }

    // ============================================================
    //  4. TABS & SIDEBAR
    // ============================================================

    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.tab-btn').forEach(b => {
                b.classList.remove('active');
                b.setAttribute('aria-selected', 'false');
            });
            e.target.classList.add('active');
            e.target.setAttribute('aria-selected', 'true');
            currentTab = e.target.dataset.tab;
            selectedScholarId = null;
            selectedGreekId = null;
            clearMapHighlights();

            // Update tabpanel labelledby
            const content = document.getElementById('sidebarContent');
            if (content) {
                content.setAttribute('aria-labelledby', e.target.id);
            }

            updateSidebar();
        });
    });


    function updateSidebar() {
        const content = document.getElementById('sidebarContent');
        
        // Fade out
        content.style.opacity = '0';
        
        setTimeout(() => {
            if (!content) return;
            content.innerHTML = '';
            
            if (selectedScholarId && currentTab === 'scholars') {
                renderScholarDetail(content);
            } else if (selectedGreekId && currentTab === 'greek') {
                renderGreekDetail(content);
            } else if (currentTab === 'events') {
                renderEvents(content);
            } else if (currentTab === 'scholars') {
                renderScholarsList(content);
            } else if (currentTab === 'greek') {
                renderGreekInfluence(content);
            }
            
            content.scrollTop = 0;

            // Fade in
            setTimeout(() => {
                content.style.opacity = '1';
            }, 50);
        }, 100);
    }



    function renderEvents(content) {
        const events = subEventsData[currentEraIndex] || [];
        if (events.length === 0) {
            content.innerHTML = `<div style="padding:1rem;color:#7a6f62;">${t('noEvents')}</div>`;
            return;
        }
        events.forEach(ev => {
            const div = document.createElement('div');
            div.className = 'sub-event';
            div.style.cursor = ev.coords ? 'pointer' : 'default';
            div.innerHTML = `<span class="se-year">${localize(ev.year)}</span><span class="se-title">${localize(ev.title)}</span><p class="se-desc">${localize(ev.desc)}</p>`;
            if (ev.coords) {
                div.addEventListener('click', () => {
                    clearMapHighlights();
                    document.querySelectorAll('.sub-event.selected').forEach(item => item.classList.remove('selected'));
                    div.classList.add('selected');
                    highlightRegionNear(ev.coords);
                    const marker = L.circleMarker(ev.coords, {
                        radius: 9,
                        fillColor: '#b45309',
                        color: '#ffffff',
                        weight: 2,
                        opacity: 1,
                        fillOpacity: 0.95,
                        className: 'selected-map-node'
                    }).addTo(scholarLayers);
                    marker.bindPopup(makeEventPopup(ev)).openPopup();
                    marker.on('click', () => marker.openPopup());
                    map.flyTo(ev.coords, 5, { duration: 1.5 });
                });
            }
            content.appendChild(div);
        });
    }


    function renderScholarsList(content) {
        clearMapHighlights();
        const eraYears = [
            [-500, 500], [570, 632], [632, 661], [661, 1258], [900, 1600], [1400, 1922], [1900, 2026]
        ];
        const [start, end] = eraYears[currentEraIndex];

        // Custom logic for overlapping or specific era assignments
        const relevantScholars = scholarsData.filter(s => {
            // Era 0: Classical (-500 to 500)
            // Era 1: Prophet (570-632)
            // Era 2: Rashidun (632-661)
            // Era 3: Umayyad/Abbasid (661-1258)
            // ...

            // Special handling for early scholars to avoid showing them in Era 0
            if (currentEraIndex === 0 && s.born > 500) return false;

            // Standard check
            return s.born <= end && s.died >= start;
        });

        if (relevantScholars.length === 0) {
            content.innerHTML = `<div style="padding:1rem;color:#7a6f62;">${t('noScholars')}</div>`;
        } else {
            relevantScholars.forEach(s => {
                const div = document.createElement('div');
                div.className = 'scholar-card';
                div.setAttribute('role', 'button');
                div.setAttribute('tabindex', '0');
                div.setAttribute('aria-label', `${t('viewDetails')} ${localize(s.name)}`);
                div.innerHTML = `
                    <div class="scholar-initials" style="background:${s.colorBg}; color:${s.colorText}">${s.initials}</div>
                    <div class="scholar-info">
                        <span class="scholar-name">${localize(s.name)}</span>
                        <span class="scholar-field">${s.born}–${s.died} CE</span>
                        <div class="scholar-field">${localize(s.field)}</div>
                    </div>`;

                const selectHandler = () => {
                    selectedScholarId = s.id;
                    updateSidebar();
                    showScholarOnMap(s);
                };

                div.addEventListener('click', selectHandler);
                div.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        selectHandler();
                    }
                });
                content.appendChild(div);
            });
        }
    }

    function renderScholarDetail(content) {
        const s = scholarsData.find(sch => sch.id === selectedScholarId);
        if (!s) return;

        const detailDiv = document.createElement('div');
        detailDiv.className = 'scholar-detail-view';
        
        const worksHtml = s.works ? s.works.map(w => `
            <div class="detail-work">
                <strong>${localize(w.title)}</strong>
                <p>${localize(w.desc)}</p>
            </div>
        `).join('') : '';

        const journeysHtml = s.journeys ? s.journeys.map(j => `
            <div class="detail-journey">
                <strong>${localize(j.place)}</strong>
                <p>${localize(j.note)}</p>
            </div>
        `).join('') : '';

        const refsHtml = s.references ? s.references.map(r => `
            <div class="detail-reference">
                <strong>${localize(r.title)}</strong>
                <span>${r.author || ''}</span>
            </div>
        `).join('') : '';

        const vidsHtml = s.videos ? s.videos.map(v => `
            <div class="detail-video">
                <div class="video-container">
                    <iframe 
                        src="${getYoutubeEmbedUrl(v.url)}" 
                        title="${localize(v.title)}" 
                        frameborder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowfullscreen>
                    </iframe>
                </div>
                <div class="video-caption">${localize(v.title)}</div>
            </div>
        `).join('') : '';

        detailDiv.innerHTML = `
            <div style="display: flex; gap: 0.5rem; margin-bottom: 1rem;">
                <button class="back-btn" id="backToScholars">← ${t('backToList')}</button>
                <button class="map-action-btn" id="viewScholarOnMap">🗺️ ${t('viewOnMap')}</button>
            </div>
            <div class="detail-header">
                <div class="detail-avatar" style="background:${s.color}; color:${s.colorText}">${s.initials}</div>
                <div>
                    <h2 class="detail-name">${localize(s.name)}</h2>
                    <div class="detail-arabic">${s.arabic || ''}</div>
                </div>
            </div>

            <div class="detail-meta">
                <span>📅 ${s.born}–${s.died} CE</span>
                <span>⏳ ${s.lifespan_years || (s.died - s.born)} ${t('years')}</span>
                <span>🎓 ${localize(s.title)}</span>
            </div>
            <div class="detail-meta" style="margin-top: -1rem; background: none; border: 1px solid #e9dfd3;">
                <span>📚 ${t('fields')}: ${localize(s.field)}</span>
            </div>
            <div class="detail-meta" style="margin-top: -1rem; background: none; border: 1px solid #e9dfd3;">
                <span>📍 ${t('born')}: ${localize(s.birthplace)}</span>
                <span>🌍 ${t('active')}: ${localize(s.active)}</span>
            </div>
            <p class="detail-summary">${localize(s.summary)}</p>

            <h3>${t('notableWorks')}</h3>
            ${worksHtml || `<p>${t('noWorks')}</p>`}

            <h3>${t('lifeJourneys')}</h3>
            ${journeysHtml || `<p>${t('noJourneys')}</p>`}

            <h3>${t('recommendedReading')}</h3>
            ${refsHtml || `<p>${t('noReferences')}</p>`}

            <h3>${t('watchLearn')}</h3>
            ${vidsHtml || `<p>${t('noVideos')}</p>`}

            <h3>${t('intellectualConnections')}</h3>
            <div class="detail-connections">
                ${s.connections ? s.connections.map(connId => {
                    const conn = scholarsData.find(cs => cs.id === connId);
                    if (conn) {
                        return `<span class="connection-tag interactive" data-id="${conn.id}">${localize(conn.name)}</span>`;
                    }
                    return `<span class="connection-tag">${connId}</span>`;
                }).join('') : t('noneRecorded')}
            </div>
        `;

        content.appendChild(detailDiv);

        detailDiv.querySelectorAll('.connection-tag.interactive').forEach(tag => {
            tag.setAttribute('role', 'button');
            tag.setAttribute('tabindex', '0');

            const selectConnHandler = () => {
                const connId = tag.dataset.id;
                selectedScholarId = connId;
                const conn = scholarsData.find(cs => cs.id === connId);
                updateSidebar();
                if (conn) showScholarOnMap(conn);
            };

            tag.addEventListener('click', selectConnHandler);
            tag.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    selectConnHandler();
                }
            });
        });

        document.getElementById('backToScholars').addEventListener('click', () => {
            selectedScholarId = null;
            clearMapHighlights();
            updateSidebar();
        });
        document.getElementById('viewScholarOnMap').addEventListener('click', () => {
            if (isMobile && sidebarExpanded) {
                toggleSidebar();
            }
            showScholarOnMap(s);
        });
    }

    function renderGreekInfluence(content) {
        const relevantGreeks = greekData.filter(g => g.eras && g.eras.includes(currentEraIndex));
        if (relevantGreeks.length === 0) {
            content.innerHTML = `<div style="padding:1rem;color:#7a6f62;">${t('noGreek')}</div>`;
        } else {
            clearMapHighlights();
            relevantGreeks.forEach(g => {
                const div = document.createElement('div');
                div.className = 'scholar-card';
                div.setAttribute('role', 'button');
                div.setAttribute('tabindex', '0');
                div.setAttribute('aria-label', `${t('viewDetails')} ${localize(g.name)}`);
                div.innerHTML = `
                    <div class="scholar-info" style="margin-left: 0">
                        <span class="scholar-name">${localize(g.name)}</span>
                        <span class="scholar-field">${g.lifespan}</span>
                        <div class="scholar-field">${localize(g.field)}</div>
                        <p class="se-desc" style="margin-top: 0.5rem; font-size: 0.9rem;">${localize(g.summary)}</p>
                    </div>`;
                const selectHandler = () => {
                    selectedGreekId = g.id;
                    updateSidebar();
                    showGreekOnMap(g);
                };
                div.addEventListener('click', selectHandler);
                div.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        selectHandler();
                    }
                });
                content.appendChild(div);
            });
        }
    }

    function renderGreekDetail(content) {
        const g = greekData.find(item => item.id === selectedGreekId);
        if (!g) return;

        const worksHtml = g.works ? g.works.map(w => `
            <div class="detail-work">
                <strong>${localize(w.title)}</strong>
                <p>${localize(w.desc)}</p>
            </div>
        `).join('') : '';

        const refsHtml = g.references ? g.references.map(r => `
            <div class="detail-reference">
                <strong>${localize(r.title)}</strong>
                <span>${r.author || ''}</span>
            </div>
        `).join('') : '';

        const vidsHtml = g.videos ? g.videos.map(v => `
            <div class="detail-video">
                <div class="video-container">
                    <iframe 
                        src="${getYoutubeEmbedUrl(v.url)}" 
                        title="${localize(v.title)}" 
                        frameborder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowfullscreen>
                    </iframe>
                </div>
                <div class="video-caption">${localize(v.title)}</div>
            </div>
        `).join('') : '';

        const detailDiv = document.createElement('div');
        detailDiv.className = 'scholar-detail-view';
        detailDiv.innerHTML = `
            <div style="display: flex; gap: 0.5rem; margin-bottom: 1rem;">
                <button class="back-btn" id="backToGreeks">← ${t('backToList')}</button>
                <button class="map-action-btn" id="viewGreekOnMap">🗺️ ${t('viewOnMap')}</button>
            </div>
            <div class="detail-header">
                <div>
                    <h2 class="detail-name">${localize(g.name)}</h2>
                    <div class="detail-arabic">${g.lifespan}</div>
                </div>
            </div>
            <div class="detail-meta">
                <span>📚 ${localize(g.field)}</span>
                <span>📍 ${t('birthplace')}: ${localize(g.birthplace)}</span>
                <span>🌍 ${t('activePlace')}: ${localize(g.active)}</span>
            </div>
            <p class="detail-summary">${localize(g.summary)}</p>
            <h3>${t('notableWorks')}</h3>
            ${worksHtml || `<p>${t('noWorks')}</p>`}
            <h3>${t('influence')}</h3>
            <p>${localize(g.influence)}</p>

            <h3>${t('recommendedReading')}</h3>
            ${refsHtml || `<p>${t('noReferences')}</p>`}

            <h3>${t('watchLearn')}</h3>
            ${vidsHtml || `<p>${t('noVideos')}</p>`}
        `;

        content.appendChild(detailDiv);
        document.getElementById('backToGreeks').addEventListener('click', () => {
            selectedGreekId = null;
            clearMapHighlights();
            updateSidebar();
        });
        document.getElementById('viewGreekOnMap').addEventListener('click', () => {
            if (isMobile && sidebarExpanded) {
                toggleSidebar();
            }
            showGreekOnMap(g);
        });
    }

    function makeGreekPopup(g, label, note) {
        return `
            <div class="map-popup">
                <strong>${localize(g.name)}</strong>
                <span>${label}</span>
                <p>${note || localize(g.summary)}</p>
                <small>${g.lifespan} · ${localize(g.field)}</small>
            </div>
        `;
    }

    function showGreekOnMap(g) {
        clearMapHighlights();
        const points = [];
        let primaryMarker = null;

        if (g.birthplace?.coords) {
            const marker = L.circleMarker(g.birthplace.coords, {
                radius: 10,
                fillColor: '#3b82f6',
                color: '#ffffff',
                weight: 2,
                opacity: 1,
                fillOpacity: 0.95,
                className: 'selected-map-node'
            }).bindPopup(makeGreekPopup(g, `${t('birthplace')}: ${localize(g.birthplace)}`, localize(g.summary))).addTo(scholarLayers);
            marker.on('click', () => marker.openPopup());
            primaryMarker = marker;
            points.push(g.birthplace.coords);
            highlightRegionNear(g.birthplace.coords);
        }

        if (g.active?.coords) {
            const marker = L.circleMarker(g.active.coords, {
                radius: 7,
                fillColor: '#1d4ed8',
                color: '#ffffff',
                weight: 2,
                opacity: 1,
                fillOpacity: 0.75
            }).bindPopup(makeGreekPopup(g, `${t('activePlace')}: ${localize(g.active)}`, localize(g.influence))).addTo(scholarLayers);
            marker.on('click', () => marker.openPopup());
            if (!primaryMarker) primaryMarker = marker;
            points.push(g.active.coords);
        }

        if (points.length > 1) {
            L.polyline(points, {
                color: '#2563eb',
                weight: 2,
                opacity: 0.4,
                dashArray: '5, 10'
            }).addTo(scholarLayers);
            map.flyToBounds(points, { padding: [50, 50], duration: 1.5 });
        } else if (points.length === 1) {
            map.flyTo(points[0], 5, { duration: 1.5 });
        }

        primaryMarker?.openPopup();
    }

    function showScholarOnMap(s) {
        clearMapHighlights();
        const points = [];
        let primaryMarker = null;

        if (s.birthplace && s.birthplace.coords) {
            const marker = L.circleMarker(s.birthplace.coords, {
                radius: 10,
                fillColor: s.color,
                color: "#fff",
                weight: 2,
                opacity: 1,
                fillOpacity: 0.95,
                className: 'selected-map-node'
            }).bindPopup(makeScholarPopup(s, `${t('birthplace')}: ${localize(s.birthplace)}`, localize(s.summary))).addTo(scholarLayers);
            marker.on('click', () => marker.openPopup());
            primaryMarker = marker;
            points.push(s.birthplace.coords);
            highlightRegionNear(s.birthplace.coords);
        }

        if (s.journeys) {
            s.journeys.forEach(j => {
                if (j.place && j.place.coords) {
                    const marker = L.circleMarker(j.place.coords, {
                        radius: 6,
                        fillColor: s.color,
                        color: "#fff",
                        weight: 1,
                        opacity: 1,
                        fillOpacity: 0.7
                    }).bindPopup(makeScholarPopup(s, `${t('journey')}: ${localize(j.place)}`, localize(j.note))).addTo(scholarLayers);
                    marker.on('click', () => marker.openPopup());
                    if (!primaryMarker) primaryMarker = marker;
                    points.push(j.place.coords);
                }
            });
        }

        if (points.length > 1) {
            L.polyline(points, {
                color: s.color,
                weight: 2,
                opacity: 0.4,
                dashArray: '5, 10'
            }).addTo(scholarLayers);
            map.flyToBounds(points, { padding: [50, 50], duration: 1.5 });
        } else if (points.length === 1) {
            map.flyTo(points[0], 5, { duration: 1.5 });
        }

        primaryMarker?.openPopup();
    }

    // ============================================================
    //  5. LOAD ERA
    // ============================================================

    // Timeline item click/keyboard listeners
    document.querySelectorAll('.tl-item').forEach(item => {
        const loadHandler = () => {
            const eraIndex = Number(item.dataset.era);
            loadEra(eraIndex);
        };

        item.addEventListener('click', loadHandler);
        item.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                loadHandler();
            }
        });
    });

    function getEraSlug(index) {
        const slugs = ['classical', 'prophet', 'rashidun', 'umayyad', 'regional', 'gunpowder', 'modern'];
        return slugs[index];
    }

    window.loadEra = async function(index) {
        selectedScholarId = null;
        selectedGreekId = null;
        clearMapHighlights();
        showLoading();
        currentEraIndex = index;
        const items = document.querySelectorAll('.tl-item');
        items.forEach((i, idx) => {
            i.classList.remove('active');
            i.setAttribute('aria-selected', idx === index ? 'true' : 'false');
        });
        items[index].classList.add('active');
        keepActiveEraVisible();
        
        updateMapTitle();

        if (geojsonLayer) map.removeLayer(geojsonLayer);

        try {
            const data = await fetchData(`data/era_${index}_${getEraSlug(index)}.geojson`);
            geojsonLayer = L.geoJson(data, {
                style: (f) => ({
                    fillColor: f.properties.color || '#5d8c5d',
                    weight: 2,
                    opacity: 1,
                    color: 'white',
                    dashArray: '3',
                    fillOpacity: 0.7
                }),
                onEachFeature: (f, l) => {
                    l.on({
                        mouseover: (e) => {
                            e.target.setStyle({ weight: 4, color: '#333', fillOpacity: 0.9 });
                            info.update(f.properties);
                        },
                        mouseout: (e) => {
                            if (e.target !== highlightedRegionLayer) {
                                geojsonLayer.resetStyle(e.target);
                            }
                            info.update();
                        },
                        click: (e) => {
                            const name = localize(f.properties.name);
                            const description = localize(f.properties.description) || '';
                            l.bindPopup(`<strong>${name}</strong><br>${description}`).openPopup(e.latlng);
                        }
                    });
                }
            }).addTo(map);

            updateLegend(data.features);
            updateSidebar();
            map.flyTo(eraViews[index].center, eraViews[index].zoom, { duration: 1.2 });
            
            // On mobile, collapse sidebar after selecting era
            if (checkMobile() && sidebarExpanded) {
                setTimeout(() => toggleSidebar(), 300);
            }
            
            hideLoading();
        } catch (e) {
            console.error("Era load failed", e);
            hideLoading();
        }
    };

    window.addEventListener('resize', () => {
        map.invalidateSize();
        const wasMobile = isMobile;
        checkMobile();
        
        // Reinitialize mobile features if switching to mobile
        if (!wasMobile && isMobile) {
            initMobileSidebar();
        }
        
        keepActiveEraVisible();
    });

    // ============================================================
    //  INITIALIZE
    // ============================================================

    loadAppVersion();
    init();

})();
