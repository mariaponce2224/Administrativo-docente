/**
 * App.js - Motor central de datos y lógica de la aplicación
 */

const AppData = {
    init() {
        this.loadOrCreate('tramites', this.defaults.tramites);
        this.loadOrCreate('metricas', this.defaults.metricas);
        this.loadOrCreate('inventario', this.defaults.inventario);
        this.loadOrCreate('consultas', this.defaults.consultas);
        this.loadOrCreate('usuarios', this.defaults.usuarios);
        this.renderAll();
        this.setupGlobalEdits();
        this.checkPWA();
    },

    defaults: {
        usuarios: [
            { dni: 'admin', password: 'admin', nombre: 'Administrador' }
        ],
        tramites: [
            { id: 1, docente: 'Marta Rodríguez', escuela: 'Escuela N° 12', tramite: 'Licencia Médica', fecha: 'Hoy, 09:12', estado: 'Pendiente' },
            { id: 2, docente: 'Juan Pérez', escuela: 'Escuela N° 5', tramite: 'Baja por Jubilación', fecha: 'Ayer', estado: 'Urgent' }
        ],
        metricas: {
            pendientes: 12,
            bajas: 4,
            docentes: 142,
            stockCrítico: 5
        },
        inventario: [
            { id: 1, item: 'Acuarelas Prof. (Set x12)', cat: 'Consumibles', stock: 45, min: 20, estado: 'Óptimo' },
            { id: 2, item: 'Pinceles Sintéticos (Set)', cat: 'Herramientas', stock: 8, min: 15, estado: 'Stock Bajo' },
            { id: 3, item: 'Papel Acuarela 300g', cat: 'Soportes', stock: 200, min: 50, estado: 'Óptimo' }
        ],
        consultas: [
            { id: 1, titulo: 'Duda sobre licencia', autor: 'Laura M.', estado: 'Pendiente', tipo: 'Legal' }
        ]
    },

    loadOrCreate(key, defaultVal) {
        if (!localStorage.getItem(key)) {
            localStorage.setItem(key, JSON.stringify(defaultVal));
        }
    },

    getData(key) {
        return JSON.parse(localStorage.getItem(key));
    },

    saveData(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
        if (typeof this.renderAll === 'function') this.renderAll();
    },

    // Auth
    register(dni, password, nombre) {
        const usuarios = this.getData('usuarios');
        if (usuarios.find(u => u.dni === dni)) return { success: false, msg: 'El usuario ya existe' };
        usuarios.push({ dni, password, nombre });
        this.saveData('usuarios', usuarios);
        return { success: true };
    },

    login(dni, password) {
        const usuarios = this.getData('usuarios');
        const user = usuarios.find(u => u.dni === dni && u.password === password);
        if (user) {
            localStorage.setItem('currentUser', JSON.stringify(user));
            return { success: true };
        }
        return { success: false, msg: 'Credenciales inválidas' };
    },

    // Métodos para Trámites
    addTramite(t) {
        const data = this.getData('tramites');
        t.id = Date.now();
        data.unshift(t);
        this.saveData('tramites', data);
    },

    deleteRow(key, id) {
        const data = this.getData(key).filter(item => item.id !== id);
        this.saveData(key, data);
    },

    // Métodos para Métricas
    updateMetrica(key, val) {
        const data = this.getData('metricas');
        data[key] = val;
        this.saveData('metricas', data);
    },

    renderAll() {
        this.renderTramitesTable();
        this.renderMetricas();
        this.renderInventarioTable();
        if (window.lucide) lucide.createIcons();
    },

    renderMetricas() {
        const m = this.getData('metricas');
        const map = {
            'val-pendientes': m.pendientes,
            'val-bajas': m.bajas,
            'val-docentes': m.docentes,
            'val-stock': m.stockCrítico
        };

        Object.keys(map).forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                el.innerText = map[id];
                el.style.cursor = 'pointer';
                el.onclick = () => {
                    const key = id.split('-')[1];
                    const newVal = prompt(`Editar ${key}:`, map[id]);
                    if (newVal !== null) this.updateMetrica(key === 'stock' ? 'stockCrítico' : key, newVal);
                };
            }
        });
    },

    renderTramitesTable() {
        const tableBody = document.querySelector('#tramites-table-body');
        if (!tableBody) return;

        const tramites = this.getData('tramites');
        tableBody.innerHTML = tramites.map(t => `
            <tr>
                <td>${t.docente}</td>
                <td>${t.escuela}</td>
                <td>${t.tramite}</td>
                <td>${t.fecha}</td>
                <td><span class="badge badge-${t.estado.toLowerCase()}">${t.estado}</span></td>
                <td>
                    <button class="btn btn-ghost" onclick="AppData.deleteRow('tramites', ${t.id})">
                        <i data-lucide="trash-2" style="height: 14px; color: var(--danger)"></i>
                    </button>
                    <button class="btn btn-ghost">
                        <i data-lucide="chevron-right" style="height: 14px;"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    },

    renderInventarioTable() {
        const tableBody = document.querySelector('#inventario-table-body');
        if (!tableBody) return;

        const inv = this.getData('inventario');
        tableBody.innerHTML = inv.map(i => `
            <tr>
                <td contenteditable="true" onblur="AppData.updateInvItem(${i.id}, 'item', this.innerText)">${i.item}</td>
                <td contenteditable="true" onblur="AppData.updateInvItem(${i.id}, 'cat', this.innerText)">${i.cat}</td>
                <td contenteditable="true" onblur="AppData.updateInvItem(${i.id}, 'stock', this.innerText)">${i.stock}</td>
                <td contenteditable="true" onblur="AppData.updateInvItem(${i.id}, 'min', this.innerText)">${i.min}</td>
                <td><span class="badge badge-${i.stock <= i.min ? 'urgent' : 'done'}">${i.stock <= i.min ? 'Stock Bajo' : 'Óptimo'}</span></td>
                <td>
                    <button class="btn btn-ghost" onclick="AppData.deleteRow('inventario', ${i.id})">
                        <i data-lucide="trash-2" style="height: 14px; color: var(--danger)"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    },

    updateInvItem(id, field, val) {
        const data = this.getData('inventario');
        const item = data.find(i => i.id === id);
        if (item) {
            item[field] = val;
            this.saveData('inventario', data);
        }
    },

    setupGlobalEdits() {
        document.addEventListener('dblclick', (e) => {
            if (e.target.tagName === 'H1' || e.target.tagName === 'P' || e.target.tagName === 'H2') {
                const originalText = e.target.innerText;
                const newText = prompt('Editar texto:', originalText);
                if (newText !== null && newText !== originalText) {
                    e.target.innerText = newText;
                }
            }
        });
    },

    checkPWA() {
        const installBtns = document.querySelectorAll('#install-app-btn');
        const downloadBanner = document.getElementById('download-banner');
        const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;

        if (isStandalone) {
            if (downloadBanner) downloadBanner.style.display = 'none';
            installBtns.forEach(btn => btn.style.display = 'none');
        }
    }
};

// PWA: Manejo del logo de descarga (Install Prompt)
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    const installBtns = document.querySelectorAll('#install-app-btn');
    installBtns.forEach(btn => {
        btn.style.display = 'flex';
        btn.onclick = () => installApp();
    });
});

async function installApp() {
    if (!deferredPrompt) {
        alert('Si no ves el botón de instalar, usa el menú de tu navegador y selecciona "Añadir a pantalla de inicio" o "Instalar Aplicación".');
        return;
    }
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
        const installBtns = document.querySelectorAll('#install-app-btn');
        const downloadBanner = document.getElementById('download-banner');
        if (downloadBanner) downloadBanner.style.display = 'none';
        installBtns.forEach(btn => btn.style.display = 'none');
    }
    deferredPrompt = null;
}

window.addEventListener('DOMContentLoaded', () => AppData.init());
