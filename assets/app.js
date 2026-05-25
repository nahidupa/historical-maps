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
    let selectedScholarId = null;
    let scholarLayers = L.layerGroup();
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
            document.querySelectorAll('.tab-btn').forEach(b => {
                b.classList.remove('active');
                b.setAttribute('aria-selected', 'false');
            });
            e.target.classList.add('active');
            e.target.setAttribute('aria-selected', 'true');
            currentTab = e.target.dataset.tab;
            selectedScholarId = null;
            scholarLayers.clearLayers();

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
            content.innerHTML = '<div style="padding:1rem;color:#7a6f62;">No major events recorded for this era.</div>';
            return;
        }
        events.forEach(ev => {
            const div = document.createElement('div');
            div.className = 'sub-event';
            div.style.cursor = ev.coords ? 'pointer' : 'default';
            div.innerHTML = `<span class="se-year">${ev.year}</span><span class="se-title">${ev.title}</span><p class="se-desc">${ev.desc}</p>`;
            if (ev.coords) {
                div.addEventListener('click', () => {
                    scholarLayers.clearLayers();
                    const marker = L.marker(ev.coords).addTo(scholarLayers);
                    marker.bindPopup(`<strong>${ev.title}</strong><br>${ev.year}<br>${ev.desc}`).openPopup();
                    map.flyTo(ev.coords, 5, { duration: 1.5 });
                });
            }
            content.appendChild(div);
        });
    }


    function renderScholarsList(content) {
        scholarLayers.clearLayers();
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
            content.innerHTML = '<div style="padding:1rem;color:#7a6f62;">No major scholars recorded for this era.</div>';
        } else {
            relevantScholars.forEach(s => {
                const div = document.createElement('div');
                div.className = 'scholar-card';
                div.setAttribute('role', 'button');
                div.setAttribute('tabindex', '0');
                div.setAttribute('aria-label', `View details for ${s.name.en}`);
                div.innerHTML = `
                    <div class="scholar-initials" style="background:${s.colorBg}; color:${s.colorText}">${s.initials}</div>
                    <div class="scholar-info">
                        <span class="scholar-name">${s.name.en}</span>
                        <span class="scholar-field">${s.born}–${s.died} CE</span>
                        <div class="scholar-field">${s.field.en}</div>
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
        
        let worksHtml = s.works ? s.works.map(w => `
            <div class="detail-work">
                <strong>${w.title.en}</strong>
                <p>${w.desc.en}</p>
            </div>
        `).join('') : '';

        let journeysHtml = s.journeys ? s.journeys.map(j => `
            <div class="detail-journey">
                <strong>${j.place.en}</strong>
                <p>${j.note.en}</p>
            </div>
        `).join('') : '';

        
        detailDiv.innerHTML = `
            <button class="back-btn" id="backToScholars">← Back to List</button>
            <div class="detail-header">
                <div class="detail-avatar" style="background:${s.colorBg}; color:${s.colorText}">${s.initials}</div>
                <div>
                    <h2 class="detail-name">${s.name.en}</h2>
                    <div class="detail-arabic">${s.arabic || ''}</div>
                </div>
            </div>

            <div class="detail-meta">
                <span>📅 ${s.born}–${s.died} CE</span>
                <span>⏳ ${s.lifespan_years || (s.died - s.born)} years</span>
                <span>🎓 ${s.title?.en || ''}</span>
            </div>
            <div class="detail-meta" style="margin-top: -1rem; background: none; border: 1px solid #e9dfd3;">
                <span>📚 Fields: ${s.field?.en || ''}</span>
            </div>
            <div class="detail-meta" style="margin-top: -1rem; background: none; border: 1px solid #e9dfd3;">

                <span>📍 Born: ${s.birthplace?.en || ''}</span>
                <span>🌍 Active: ${s.active?.en || ''}</span>
            </div>
            <p class="detail-summary">${s.summary.en}</p>

            <h3>Notable Works</h3>
            ${worksHtml || '<p>No works recorded.</p>'}

            <h3>Life Journeys</h3>
            ${journeysHtml || '<p>No major journeys recorded.</p>'}


            <h3>Intellectual Connections</h3>
            <div class="detail-connections">
                ${s.connections ? s.connections.map(connId => {
                    const conn = scholarsData.find(cs => cs.id === connId);
                    if (conn) {
                        return `<span class="connection-tag interactive" data-id="${conn.id}">${conn.name.en}</span>`;
                    }
                    return `<span class="connection-tag">${connId}</span>`;
                }).join('') : 'None recorded'}
            </div>
        `;

        content.appendChild(detailDiv);

        // Add event listeners for connections

        // Add event listeners for connections
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
            scholarLayers.clearLayers();
            updateSidebar();
        });
    }

    function renderGreekInfluence(content) {
        const relevantGreeks = greekData.filter(g => g.eras && g.eras.includes(currentEraIndex));
        if (relevantGreeks.length === 0) {
            content.innerHTML = '<div style="padding:1rem;color:#7a6f62;">No notable Greek influences identified for this era.</div>';
        } else {
            relevantGreeks.forEach(g => {
                const div = document.createElement('div');
                div.className = 'scholar-card';
                div.innerHTML = `
                    <div class="scholar-info" style="margin-left: 0">
                        <span class="scholar-name">${g.name.en}</span>
                        <span class="scholar-field">${g.lifespan}</span>
                        <p class="se-desc" style="margin-top: 0.5rem; font-size: 0.9rem;">${g.summary.en}</p>
                    </div>`;
                content.appendChild(div);
            });
        }
    }

    function showScholarOnMap(s) {
        scholarLayers.clearLayers();
        const points = [];

        if (s.birthplace && s.birthplace.coords) {
            const marker = L.circleMarker(s.birthplace.coords, {
                radius: 8,
                fillColor: s.color,
                color: "#fff",
                weight: 2,
                opacity: 1,
                fillOpacity: 0.8
            }).bindPopup(`<strong>Birthplace: ${s.birthplace.en}</strong>`).addTo(scholarLayers);
            points.push(s.birthplace.coords);
        }

        if (s.journeys) {
            s.journeys.forEach(j => {
                if (j.place && j.place.coords) {
                    L.circleMarker(j.place.coords, {
                        radius: 6,
                        fillColor: s.color,
                        color: "#fff",
                        weight: 1,
                        opacity: 1,
                        fillOpacity: 0.6
                    }).bindPopup(`<strong>Journey: ${j.place.en}</strong><br>${j.note.en}`).addTo(scholarLayers);
                    points.push(j.place.coords);
                }
            });
        }

        if (points.length > 1) {
            L.polyline(points, {
                color: s.color,
                weight: 3,
                opacity: 0.6,
                dashArray: '5, 10'
            }).addTo(scholarLayers);
            map.flyToBounds(points, { padding: [50, 50], duration: 1.5 });
        } else if (points.length === 1) {
            map.flyTo(points[0], 5, { duration: 1.5 });
        }
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
        scholarLayers.clearLayers();
        showLoading();
        currentEraIndex = index;
        const items = document.querySelectorAll('.tl-item');
        items.forEach((i, idx) => {
            i.classList.remove('active');
            i.setAttribute('aria-selected', idx === index ? 'true' : 'false');
        });
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
