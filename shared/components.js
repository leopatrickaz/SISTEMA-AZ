// ============================================================
//  AZ Remanufaturados — Componentes e Utilitários
//  Funções reutilizáveis por todos os módulos
// ============================================================

// ── Utilitários gerais ───────────────────────────────────────

const uid       = () => Math.random().toString(36).slice(2) + Date.now().toString(36);
const today     = () => new Date().toISOString().slice(0, 10);
const brl       = v  => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(v || 0));
const fmtDate   = d  => { if (!d) return '—'; try { const p = d.split('-'); return `${p[2]}/${p[1]}/${p[0]}`; } catch { return d; } };
const fmtDateTime = d => { if (!d) return '—'; try { const dt = new Date(d); return dt.toLocaleDateString('pt-BR') + ' ' + dt.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }); } catch { return d; } };
const esc       = s  => { if (!s) return ''; return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); };
const tipoLabel = t  => t === 'motor_partida' ? 'Motor de partida' : 'Alternador';
const pedidoLabel = p => ({ verbal: 'Verbal', email: 'E-mail', whatsapp: 'WhatsApp' }[p] || '');


// ── Toast (notificações) ─────────────────────────────────────

function showToast(msg, type = 'success') {
  let t = document.getElementById('az-toast');
  if (!t) {
    t = document.createElement('div');
    t.id = 'az-toast';
    t.className = 'toast';
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.className = 'toast ' + type;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3000);
}


// ── Loading overlay ──────────────────────────────────────────

function showLoading(show) {
  let el = document.getElementById('az-loading');
  if (!el) {
    el = document.createElement('div');
    el.id = 'az-loading';
    el.className = 'loading-overlay';
    el.innerHTML = '<div class="spinner"></div> Carregando...';
    document.body.appendChild(el);
  }
  el.classList.toggle('show', show);
}


// ── Confirm dialog ───────────────────────────────────────────

let _confirmCallback = null;

function openConfirm(title, desc, onConfirm) {
  document.getElementById('confirmTitle').textContent = title;
  document.getElementById('confirmDesc').textContent = desc;
  _confirmCallback = onConfirm;
  document.getElementById('confirmOverlay').classList.add('open');
}

function closeConfirm() {
  document.getElementById('confirmOverlay').classList.remove('open');
  _confirmCallback = null;
}

function executeConfirm() {
  if (_confirmCallback) _confirmCallback();
  closeConfirm();
}


// ── Sidebar mobile ───────────────────────────────────────────

function openModulesSidebar() {
  const el = document.getElementById('modulesSidebar');
  if (el) el.style.display = 'block';
}

function closeModulesSidebar() {
  const el = document.getElementById('modulesSidebar');
  if (el) el.style.display = 'none';
}

function toggleMobileMenu() {
  const el = document.getElementById('mobileNav');
  if (el) el.classList.toggle('open');
}

function closeMobileMenu() {
  const el = document.getElementById('mobileNav');
  if (el) el.classList.remove('open');
}


// ── Navegação entre módulos ──────────────────────────────────

function goHome() {
  window.location.href = '/';
}

function abrirModulo(arquivo) {
  window.location.href = arquivo;
}

// Sai da empresa ativa e volta para a tela de seleção de empresa
function trocarEmpresa() {
  if (typeof AZ_EMPRESA !== 'undefined') AZ_EMPRESA.limpar();
  window.location.href = '/';
}


// ── Identidade visual da empresa ativa ───────────────────────
// Aplica cores, ícone e nome da empresa selecionada em todos os
// elementos marcados com data-brand-*, e ajusta o <title> da página.
// Chamar após AZ_AUTH.requireAcesso() em cada módulo.

function applyEmpresaBranding(tituloPagina) {
  if (typeof AZ_EMPRESA === 'undefined') return;
  const empresa = AZ_EMPRESA.atual();
  if (!empresa) return;

  const root = document.documentElement.style;
  root.setProperty('--primary', empresa.tema.primary);
  root.setProperty('--primary-light', empresa.tema.primaryLight);
  root.setProperty('--sidebar-active', empresa.tema.sidebarActive);

  document.querySelectorAll('[data-brand-icon]').forEach(el => el.textContent = empresa.icone);
  document.querySelectorAll('[data-brand-nome]').forEach(el => el.textContent = empresa.nome);
  document.querySelectorAll('[data-brand-curto]').forEach(el => el.textContent = empresa.nomeCurto);
  document.querySelectorAll('[data-brand-sub]').forEach(el => el.textContent = empresa.nomeSub);
  document.querySelectorAll('[data-brand-logo-img]').forEach(el => {
    if (empresa.logo) { el.src = empresa.logo; el.alt = empresa.nome; el.style.display = ''; }
    else { el.style.display = 'none'; }
  });

  if (tituloPagina) document.title = `${tituloPagina} — ${empresa.nome}`;
}


// ── Ícones de contorno (sem preenchimento) usados nos módulos ─
// Compartilhado entre a grade da home (index.html) e a sidebar de módulos.

const MODULO_ICON_SVG = {
  vendas: '<path d="M6 2h12v19l-3-2-3 2-3-2-3 2V2z"/><line x1="9" y1="7" x2="15" y2="7"/><line x1="9" y1="11" x2="15" y2="11"/>',
  orcamentos: '<rect x="6" y="4" width="12" height="17" rx="2"/><path d="M9 4V3a1 1 0 011-1h4a1 1 0 011 1v1"/><line x1="9" y1="10" x2="15" y2="10"/><line x1="9" y1="14" x2="15" y2="14"/><line x1="9" y1="18" x2="13" y2="18"/>',
  'tabela-precos': '<path d="M12 2h7a2 2 0 012 2v7a2 2 0 01-.59 1.41l-8 8a2 2 0 01-2.82 0l-7-7a2 2 0 010-2.82l8-8A2 2 0 0112 2z"/><circle cx="16.5" cy="7.5" r="1.5"/>',
  estoque: '<path d="M12 2 3 7v10l9 5 9-5V7l-9-5z"/><path d="M3 7l9 5 9-5"/><path d="M12 12v9"/>',
  financeiro: '<rect x="3" y="6" width="18" height="13" rx="2"/><path d="M3 10h18"/><circle cx="16" cy="14.5" r="1.4"/>',
  clientes: '<circle cx="9" cy="8" r="3.2"/><path d="M2.5 20c0-3.4 3-6 6.5-6s6.5 2.6 6.5 6"/><circle cx="17" cy="9" r="2.4"/><path d="M17 13.2c2.6 0 4.8 1.9 4.8 5.3"/>',
  relatorios: '<path d="M4 4v16h16"/><rect x="7.5" y="12" width="2.6" height="6"/><rect x="12.5" y="8" width="2.6" height="10"/><rect x="17.5" y="14" width="2.6" height="4"/>',
  garantias: '<path d="M12 3l7 3v5.5c0 5-3.2 8.2-7 9.5-3.8-1.3-7-4.5-7-9.5V6l7-3z"/><path d="M9 12l2 2 4-4.5"/>',
  solicitacoes: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3.3 6.5L12 13l8.7-6.5"/><path d="M12 9v6M9.5 12.5L12 15l2.5-2.5"/>'
};

function moduloIconSvg(m, opts) {
  const stroke = (opts && opts.stroke) || 'rgba(255,255,255,0.85)';
  const paths = MODULO_ICON_SVG[m.id] || '';
  if (opts && opts.fluid) {
    return `<svg viewBox="0 0 24 24" fill="none" stroke="${stroke}" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${paths}</svg>`;
  }
  const size = (opts && opts.size) || 20;
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${stroke}" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${paths}</svg>`;
}


// ── Renderiza sidebar de módulos (lateral deslizante) ────────
// Quando os módulos não couberem no espaço disponível, o tamanho de
// cada item é reduzido automaticamente (em vez de aparecer barra de
// rolagem) para que todos fiquem visíveis de uma vez.

function renderSidebarModulos(moduloAtualId) {
  const containers = [
    document.getElementById('sidebarModulosList'),
    document.getElementById('sidebarModulosListDesktop')
  ].filter(Boolean);
  if (!containers.length) return;

  const empresa = (typeof AZ_EMPRESA !== 'undefined') ? AZ_EMPRESA.atual() : null;
  const modulos = empresa ? empresa.modulos : AZ_CONFIG.modulosComuns;

  const html = modulos.map(m => {
    const isAtual = m.id === moduloAtualId;
    const badge = !m.ativo
      ? '<span style="font-size:10px;background:rgba(255,255,255,0.15);color:rgba(255,255,255,0.6);padding:1px 7px;border-radius:999px;margin-left:6px">Em breve</span>'
      : '';
    return `
      <div
        class="sb-mod-item"
        onclick="${m.ativo ? `window.location.href='${m.arquivo}'` : ''}"
        style="
          cursor:${m.ativo ? 'pointer' : 'default'};
          background:${isAtual ? 'color-mix(in srgb, var(--sidebar-active) 35%, transparent)' : 'transparent'};
          opacity:${m.ativo ? '1' : '0.6'};
        "
      >
        <span class="sb-mod-icon">${moduloIconSvg(m, { fluid: true })}</span>
        <div style="flex:1;min-width:0">
          <div class="sb-mod-name">
            ${esc(m.nome)}${badge}
          </div>
          <div class="sb-mod-desc">${esc(m.descricao)}</div>
        </div>
      </div>`;
  }).join('');

  containers.forEach(c => {
    c.innerHTML = html;
    ajustarDensidadeSidebar(c);
  });
}

// Reduz o tamanho dos itens da sidebar em etapas até todos caberem
// sem precisar rolar (normal → sb-compact → sb-ultra).
function ajustarDensidadeSidebar(container) {
  container.classList.remove('sb-compact', 'sb-ultra');
  if (container.scrollHeight <= container.clientHeight + 1) return;
  container.classList.add('sb-compact');
  if (container.scrollHeight <= container.clientHeight + 1) return;
  container.classList.add('sb-ultra');
}

// Reavalia a densidade da sidebar ao redimensionar a janela
// (ex.: girar tablet, redimensionar navegador).
let _sbResizeTimer = null;
window.addEventListener('resize', function () {
  clearTimeout(_sbResizeTimer);
  _sbResizeTimer = setTimeout(function () {
    ['sidebarModulosList', 'sidebarModulosListDesktop'].forEach(id => {
      const el = document.getElementById(id);
      if (el) ajustarDensidadeSidebar(el);
    });
  }, 150);
});
