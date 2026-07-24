// ============================================================
//  AZ Remanufaturados — Sincronização automática entre dispositivos
//  Mecanismo genérico e reutilizável por TODOS os módulos.
//
//  ┌─ COMO USAR EM QUALQUER MÓDULO (atual ou futuro) ──────────┐
//  │                                                            │
//  │  Basta definir uma função global chamada azReload() que    │
//  │  recarrega os dados do banco e redesenha a tela:           │
//  │                                                            │
//  │    window.azReload = async function () {                   │
//  │      await loadAll();          // busca do Supabase        │
//  │      renderTelaAtual();        // redesenha a tela         │
//  │    };                                                      │
//  │                                                            │
//  │  Só isso. Não precisa configurar timer, foco, nem nada.    │
//  │  Este arquivo cuida de tudo automaticamente:               │
//  │    • recarrega ao voltar o foco / abrir a aba              │
//  │    • recarrega a cada X segundos enquanto a aba está aberta│
//  │    • NÃO atualiza enquanto um modal (.overlay.open) estiver │
//  │      aberto, para não atrapalhar quem está preenchendo     │
//  │                                                            │
//  │  Se um módulo NÃO definir azReload, este arquivo apenas    │
//  │  não faz nada (seguro para telas sem dados).               │
//  └────────────────────────────────────────────────────────────┘
// ============================================================

const AZ_SYNC = {
  // Intervalo entre recargas automáticas (ms). 15s é imperceptível
  // para o usuário e mantém tudo praticamente em tempo real.
  intervaloMs: 15000,
  _timer: null,

  // Há algum cadastro/modal aberto? (não atualiza para não atrapalhar a edição)
  _modalAberto() {
    return !!document.querySelector('.overlay.open');
  },

  async _tick() {
    // Só roda se o módulo tiver definido como recarregar a si mesmo
    if (typeof window.azReload !== 'function') return;
    // Não gasta rede com a aba em segundo plano
    if (document.visibilityState !== 'visible') return;
    // Não interrompe uma edição em andamento
    if (this._modalAberto()) return;
    try {
      await window.azReload();
    } catch (e) {
      // Silencioso: tenta de novo no próximo ciclo
      console.debug('AZ_SYNC: falha ao recarregar, tentará de novo.', e);
    }
  },

  iniciar() {
    if (this._timer) return;
    // Recarrega periodicamente
    this._timer = setInterval(() => this._tick(), this.intervaloMs);
    // Recarrega na hora ao voltar para a aba
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') this._tick();
    });
    // Recarrega na hora ao focar a janela
    window.addEventListener('focus', () => this._tick());
  }
};

// Liga automaticamente assim que a página estiver pronta.
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => AZ_SYNC.iniciar());
} else {
  AZ_SYNC.iniciar();
}
