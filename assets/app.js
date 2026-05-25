(function() {
    'use strict';

    // ============================================================
    //  MOBILE UX ENHANCEMENTS
    // ============================================================

    let isMobile = false;
    let sidebarExpanded = false;
    let touchStartY = 0;
    let touchStartX = 0;
    
    function checkMobile() {
        isMobile = window.matchMedia('(max-width: 720px)').matches;
        return isMobile;
    }

    function showLoading() {
        document.getElementById('loadingOverlay')?.classList.add('active');
    }

    function hideLoading() {
        document.getElementById('loadingOverlay')?.classList.remove('active');
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
            document.querySelectorAll('.basemap-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
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

    const mobileEraSelect = document.getElementById('mobileEraSelect');
    mobileEraSelect?.addEventListener('change', (e) => {
        loadEra(Number(e.target.value));
    });

    function isSmallScreen() {
        return window.matchMedia('(max-width: 720px)').matches;
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
    let currentTab = 'events';

    // ============================================================
    //  2. DATA FETCHING
    // ============================================================

    async function fetchData(url) {
        const response = await fetch(url);
        return await response.json();
    }

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
            
            // Initialize mobile sidebar behavior
            if (checkMobile()) {
                initMobileSidebar();
            }
            
            await loadEra(0);
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
        const sidebarHeader = sidebar?.querySelector('.sidebar-header');
        const backdrop = document.getElementById('sidebarBackdrop');
        
        if (!sidebar || !sidebarHeader) return;

        // Toggle sidebar on header tap
        sidebarHeader.addEventListener('click', toggleSidebar);
        
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
        const backdrop = document.getElementById('sidebarBackdrop');
        if (!sidebar) return;
        
        sidebarExpanded = !sidebarExpanded;
        
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
        this._div.innerHTML = '<h4>Historical Region</h4>' +  (props ?
            '<b>' + props.name + '</b><br />' + props.description
            : 'Hover over a region');
    };

    info.addTo(map);

    function updateLegend(features) {
        const container = document.getElementById('mapLegend');
        container.innerHTML = '<h4>Regions</h4>';
        container.classList.add('is-visible');
        const seen = new Set();
        features.forEach(f => {
            if (!seen.has(f.properties.name)) {
                seen.add(f.properties.name);
                const div = document.createElement('div');
                div.className = 'legend-item';
                div.innerHTML = `<span class="color-box" style="background:${f.properties.color}"></span><span>${f.properties.name}</span>`;
                container.appendChild(div);
            }
        });
    }

    // ============================================================
    //  4. TABS & SIDEBAR
    // ============================================================

    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            currentTab = e.target.dataset.tab;
            updateSidebar();
        });
    });

    function updateSidebar() {
        const content = document.getElementById('sidebarContent');
        
        // Fade out
        content.style.opacity = '0';
        
        setTimeout(() => {
            content.innerHTML = '';
            
            if (currentTab === 'events') {
            const events = subEventsData[currentEraIndex] || [];
            events.forEach(ev => {
                const div = document.createElement('div');
                div.className = 'sub-event';
                div.innerHTML = `<span class="se-year">${ev.year}</span><span class="se-title">${ev.title}</span><p class="se-desc">${ev.desc}</p>`;
                content.appendChild(div);
            });
        } else if (currentTab === 'scholars') {
            const eraYears = [
                [-500, 500], [570, 632], [632, 661], [661, 1258], [900, 1600], [1400, 1922], [1900, 2026]
            ];
            const [start, end] = eraYears[currentEraIndex];
            const relevantScholars = scholarsData.filter(s => s.born <= end && s.died >= start);
            
            if (relevantScholars.length === 0) {
                content.innerHTML = '<div style="padding:1rem;color:#7a6f62;">No major scholars recorded for this era.</div>';
            } else {
                relevantScholars.forEach(s => {
                    const div = document.createElement('div');
                    div.className = 'scholar-card';
                    div.innerHTML = `<span class="scholar-name">${s.name.en}</span>
                                     <span class="scholar-field">${s.born}–${s.died} CE</span>
                                     <div class="scholar-field">${s.field.en}</div>`;
                    content.appendChild(div);
                });
            }
        } else if (currentTab === 'greek') {
            const relevantGreeks = greekData.filter(g => g.era === currentEraIndex);
            if (relevantGreeks.length === 0) {
                content.innerHTML = '<div style="padding:1rem;color:#7a6f62;">No notable Greek influences identified for this era.</div>';
            } else {
                relevantGreeks.forEach(g => {
                    const div = document.createElement('div');
                    div.className = 'scholar-card';
                    div.innerHTML = `<span class="scholar-name">${g.name.en}</span><span class="scholar-field">${g.lifespan}</span><p class="se-desc">${g.summary.en}</p>`;
                    content.appendChild(div);
                });
            }
        }
        content.scrollTop = 0;
        
        // Fade in
        setTimeout(() => {
            content.style.opacity = '1';
        }, 50);
        
        }, 100);
    }

    // ============================================================
    //  5. LOAD ERA
    // ============================================================

    function getEraSlug(index) {
        const slugs = ['classical', 'prophet', 'rashidun', 'umayyad', 'regional', 'gunpowder', 'modern'];
        return slugs[index];
    }

    window.loadEra = async function(index) {
        showLoading();
        currentEraIndex = index;
        const items = document.querySelectorAll('.tl-item');
        items.forEach(i => i.classList.remove('active'));
        items[index].classList.add('active');
        if (mobileEraSelect) {
            mobileEraSelect.value = String(index);
        }
        keepActiveEraVisible();
        
        const title = items[index].querySelector('.tl-section-label').textContent;
        const period = items[index].querySelector('.tl-period').textContent;
        document.getElementById('mapTitle').textContent = `${title.replace(/High Accuracy|Medium Accuracy|Low Accuracy/g, '').trim()} (${period})`;

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
                            geojsonLayer.resetStyle(e.target);
                            info.update();
                        },
                        click: (e) => {
                            const description = f.properties.description || '';
                            l.bindPopup(`<strong>${f.properties.name}</strong><br>${description}`).openPopup(e.latlng);
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

    init();

})();
