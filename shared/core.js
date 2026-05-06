/* /shared/core.js
 * CoPath Validation Engine — shared utilities.
 * Static-only: no backend. State lives in localStorage.
 * Users can export/import their entire session as JSON.
 */

const CoPathCore = {
    SESSION_VERSION: '1.0',
    DRAFT_PREFIX: 'copath_draft_',

    // Auto-detect the data path based on folder depth.
    getDefaultDataPath: function () {
        if (window.location.pathname.includes('/modules/')) {
            return '../../data';
        }
        return './data';
    },

    setBasePath: function (path) {
        localStorage.setItem('copath_base_path', path.trim());
        alert('Data path updated. Reloading.');
        window.location.reload();
    },

    getBasePath: function () {
        return localStorage.getItem('copath_base_path') || this.getDefaultDataPath();
    },

    // ── JSON Fetcher ──────────────────────────────────────────────
    fetchData: async function (moduleName) {
        let basePath = this.getBasePath();
        if (!basePath.endsWith('/')) basePath += '/';
        const url = `${basePath}${moduleName}.json`;
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error(`CoPath data error for ${moduleName}.json:`, error);
            if (window.location.protocol === 'file:') {
                console.warn('Browsers block fetching local JSON via file:///. Run a local server (e.g. `npx serve`) or deploy the site.');
            }
            return null;
        }
    },

    // ── Draft Persistence ─────────────────────────────────────────
    saveDraft: function (moduleId, stateObj) {
        const payload = { timestamp: new Date().toISOString(), data: stateObj };
        localStorage.setItem(this.DRAFT_PREFIX + moduleId, JSON.stringify(payload));
    },
    loadDraft: function (moduleId) {
        const draft = localStorage.getItem(this.DRAFT_PREFIX + moduleId);
        return draft ? JSON.parse(draft) : null;
    },
    clearDraft: function (moduleId) {
        localStorage.removeItem(this.DRAFT_PREFIX + moduleId);
    },

    // ── Session Export / Import ───────────────────────────────────
    // Bundle every draft (across all modules) into one downloadable JSON
    // file. Lets users keep work across browsers/devices without a backend.
    listDrafts: function () {
        const out = {};
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith(this.DRAFT_PREFIX)) {
                const moduleId = key.slice(this.DRAFT_PREFIX.length);
                try { out[moduleId] = JSON.parse(localStorage.getItem(key)); } catch (e) { /* skip corrupt */ }
            }
        }
        return out;
    },

    exportSession: function () {
        const drafts = this.listDrafts();
        const session = {
            _meta: {
                app: 'CoPath Validation Engine',
                version: this.SESSION_VERSION,
                exported: new Date().toISOString(),
                module_count: Object.keys(drafts).length
            },
            drafts: drafts
        };
        const blob = new Blob([JSON.stringify(session, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        const stamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
        a.href = url;
        a.download = `copath-session-${stamp}.json`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
    },

    importSession: function (file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const session = JSON.parse(e.target.result);
                    if (!session || !session.drafts || typeof session.drafts !== 'object') {
                        throw new Error('File is missing a valid drafts object.');
                    }
                    const count = Object.keys(session.drafts).length;
                    const ok = confirm(
                        `Import ${count} module draft(s) from this file?\n\n` +
                        'This will overwrite any current drafts in this browser. Existing drafts not present in the file will be kept.'
                    );
                    if (!ok) return resolve(false);
                    for (const [moduleId, payload] of Object.entries(session.drafts)) {
                        localStorage.setItem(this.DRAFT_PREFIX + moduleId, JSON.stringify(payload));
                    }
                    alert(`Imported ${count} module(s). Reloading…`);
                    window.location.reload();
                    resolve(true);
                } catch (err) {
                    alert('Could not read that session file.\n' + err.message);
                    reject(err);
                }
            };
            reader.onerror = () => {
                alert('Failed to read file.');
                reject(reader.error);
            };
            reader.readAsText(file);
        });
    },

    clearAllDrafts: function () {
        const drafts = this.listDrafts();
        const count = Object.keys(drafts).length;
        if (count === 0) { alert('No drafts to clear.'); return; }
        if (!confirm(`Erase ${count} draft(s) from this browser? This cannot be undone.`)) return;
        Object.keys(drafts).forEach(id => this.clearDraft(id));
        alert(`Cleared ${count} draft(s).`);
        window.location.reload();
    },

    // ── Toast notifications ───────────────────────────────────────
    // Non-blocking replacement for alert(). kind: 'info' | 'success' | 'error'
    toast: function (msg, kind = 'info', ms = 3500) {
        let host = document.getElementById('copath-toast-host');
        if (!host) {
            host = document.createElement('div');
            host.id = 'copath-toast-host';
            document.body.appendChild(host);
        }
        const el = document.createElement('div');
        el.className = `copath-toast ${kind}`;
        el.innerText = msg;
        host.appendChild(el);
        // Animate in
        requestAnimationFrame(() => el.classList.add('in'));
        setTimeout(() => {
            el.classList.remove('in');
            setTimeout(() => el.remove(), 250);
        }, ms);
    },

    // ── Inline field validation ──────────────────────────────────
    markFieldError: function (input, msg) {
        if (!input) return;
        input.classList.add('copath-invalid');
        let err = input.parentElement.querySelector('.copath-field-error');
        if (!err) {
            err = document.createElement('div');
            err.className = 'copath-field-error';
            input.parentElement.appendChild(err);
        }
        err.innerText = msg;
        // Auto-clear when user edits.
        const clear = () => this.clearFieldError(input);
        input.addEventListener('input', clear, { once: true });
        input.addEventListener('change', clear, { once: true });
    },

    clearFieldError: function (input) {
        if (!input) return;
        input.classList.remove('copath-invalid');
        const err = input.parentElement.querySelector('.copath-field-error');
        if (err) err.remove();
    },

    // Wires Enter-to-submit on a set of inputs by triggering a button click.
    // Skips textareas (Enter inserts a newline there).
    enterToSubmit: function (inputIds, primaryButtonOrFn) {
        inputIds.forEach(id => {
            const el = typeof id === 'string' ? document.getElementById(id) : id;
            if (!el || el.tagName === 'TEXTAREA') return;
            el.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    if (typeof primaryButtonOrFn === 'function') primaryButtonOrFn();
                    else if (primaryButtonOrFn && primaryButtonOrFn.click) primaryButtonOrFn.click();
                }
            });
        });
    },

    // ── Persistent Settings UI (bottom-left toggle) ──────────────
    injectSettingsUI: function () {
        const currentPath = this.getBasePath();
        const drafts = this.listDrafts();
        const draftCount = Object.keys(drafts).length;

        const uiHtml = `
            <div id="copath-settings-toggle" class="no-print" title="CoPath session & data settings">⚙️ Session</div>
            <div id="copath-settings-panel" class="no-print" role="dialog" aria-label="CoPath settings">
                <h4>Your Session</h4>
                <p class="panel-help"><strong>${draftCount}</strong> module draft(s) saved in this browser. Export to take your work to another device.</p>
                <div class="btn-row">
                    <button class="panel-btn" onclick="CoPathCore.exportSession()">Download Session JSON</button>
                    <button class="panel-btn secondary" onclick="document.getElementById('copath-import-file').click()">Import…</button>
                    <input type="file" id="copath-import-file" accept="application/json,.json" style="display:none" onchange="if(this.files[0]) CoPathCore.importSession(this.files[0])">
                </div>

                <h4>Data Directory</h4>
                <p class="panel-help">Where module JSON files live. Use a relative path or absolute URL.</p>
                <input type="text" id="copath-path-input" value="${currentPath}">
                <div class="btn-row" style="margin-top: 8px;">
                    <button class="panel-btn" onclick="CoPathCore.setBasePath(document.getElementById('copath-path-input').value)">Save</button>
                    <button class="panel-btn secondary" onclick="CoPathCore.setBasePath(CoPathCore.getDefaultDataPath())">Reset</button>
                </div>

                <h4>Danger Zone</h4>
                <div class="btn-row">
                    <button class="panel-btn danger" onclick="CoPathCore.clearAllDrafts()">Erase All Drafts</button>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', uiHtml);

        const toggle = document.getElementById('copath-settings-toggle');
        const panel = document.getElementById('copath-settings-panel');
        toggle.addEventListener('click', () => {
            panel.style.display = panel.style.display === 'block' ? 'none' : 'block';
        });
        document.addEventListener('click', (e) => {
            if (!panel.contains(e.target) && e.target !== toggle) panel.style.display = 'none';
        });
    }
};

// Auto-inject the settings UI when the DOM loads.
document.addEventListener('DOMContentLoaded', () => {
    CoPathCore.injectSettingsUI();
});
