/**
 * App.js - Central logic for data management and UI rendering
 */

const AppData = {
    init() {
        if (!localStorage.getItem('tramites')) {
            this.seedInitialData();
        }
        this.renderAll();
    },

    seedInitialData() {
        const initialTramites = [
            { id: 1, docente: 'Marta Rodríguez', escuela: 'Escuela N° 12', tramite: 'Licencia Médica', fecha: 'Hoy, 09:12', estado: 'Pendiente' },
            { id: 2, docente: 'Juan Pérez', escuela: 'Escuela N° 5', tramite: 'Baja por Jubilación', fecha: 'Ayer', estado: 'Urgente' }
        ];
        localStorage.setItem('tramites', JSON.stringify(initialTramites));
    },

    getTramites() {
        return JSON.parse(localStorage.getItem('tramites') || '[]');
    },

    addTramite(tramite) {
        const tramites = this.getTramites();
        tramite.id = Date.now();
        tramites.unshift(tramite);
        localStorage.setItem('tramites', JSON.stringify(tramites));
        this.renderAll();
        return tramite;
    },

    deleteTramite(id) {
        let tramites = this.getTramites();
        tramites = tramites.filter(t => t.id !== id);
        localStorage.setItem('tramites', JSON.stringify(tramites));
        this.renderAll();
    },

    renderAll() {
        this.renderTramitesTable();
        // Add more renderers as needed
    },

    renderTramitesTable() {
        const tableBody = document.querySelector('#tramites-table-body');
        if (!tableBody) return;

        const tramites = this.getTramites();
        tableBody.innerHTML = tramites.map(t => `
            <tr>
                <td>${t.docente}</td>
                <td>${t.escuela}</td>
                <td>${t.tramite}</td>
                <td>${t.fecha}</td>
                <td><span class="badge badge-${t.estado.toLowerCase()}">${t.estado}</span></td>
                <td>
                    <button class="btn btn-ghost" onclick="AppData.deleteTramite(${t.id})">
                        <i data-lucide="trash-2" style="height: 14px; color: var(--danger)"></i>
                    </button>
                    <button class="btn btn-ghost">
                        <i data-lucide="chevron-right" style="height: 14px;"></i>
                    </button>
                </td>
            </tr>
        `).join('');
        lucide.createIcons();
    }
};

// Auto-init on load
window.addEventListener('DOMContentLoaded', () => AppData.init());
