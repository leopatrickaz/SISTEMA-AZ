# Instruções do Projeto — SISTEMA-AZ (AZ Remanufaturados)

Sistema interno de gestão (HTML/CSS/JS puro, sem framework). Cada módulo é
uma página em `modulos/*.html`. Código compartilhado fica em `shared/`.

## ⚠️ REGRA DE OURO: o sistema é UM SÓ, na nuvem

O sistema deve funcionar como um sistema único e centralizado: **cada
dispositivo (celular, PC, tablet — qualquer quantidade) é apenas uma janela
para o mesmo banco.** Tudo que é feito em um dispositivo tem que aparecer
para todos os outros, automaticamente.

Por isso:

- **NUNCA guarde dados em `localStorage`.** Ele é local do aparelho e NÃO
  sincroniza. Só é aceitável para preferências puras de UI (ex.: ligar/
  desligar som de alerta). Qualquer dado que outro dispositivo precise ver
  vai para o **Supabase**.
- **Todo dado persiste no Supabase**, acessado por `shared/db.js` (`AZ_DB`).
  Ex.: `AZ_DB.get`, `AZ_DB.insert`, `AZ_DB.update`, `AZ_DB.remove`.
- As tabelas têm prefixo por empresa: use sempre `AZ_DB.tbl('nome')`, que
  resolve para `az_nome` (AZ Remanufaturados) ou `azp_nome` (AZ Pesados),
  conforme a empresa ativa na sessão.

## Sincronização automática entre dispositivos

O mecanismo é central: **`shared/sync.js`** (incluído em todos os módulos,
inclusive nos placeholders). Ele liga sozinho e recarrega ao voltar o foco /
abrir a aba e a cada 15s, sem atualizar enquanto um modal (`.overlay.open`)
estiver aberto.

**Todo módulo com dados DEVE seguir esta convenção:**

1. Incluir `<script src="/shared/sync.js"></script>` (após `components.js`).
2. Definir uma função global `azReload()` que recarrega do banco e redesenha:
   ```js
   window.azReload = async function () {
     await loadAll();      // busca do Supabase via AZ_DB
     renderTelaAtual();    // redesenha a tela
   };
   ```

Ao criar QUALQUER módulo novo, já nasça seguindo isso (dados no Supabase +
`azReload`). Não reimplemente timers de atualização em cada módulo.

Exceção conhecida: `solicitacoes-orcamento.html` tem lógica própria de
auto-refresh (alerta sonoro + monitoramento em segundo plano) e não usa
`azReload`. Está correto assim.

## Estado dos módulos

- **Ativos com dados (Supabase + sync):** `vendas`, `orcamentos`,
  `solicitacoes-orcamento`.
- **Placeholders "em breve" (sem dados ainda):** `clientes`, `estoque`,
  `financeiro`, `garantias`, `relatorios`. Já incluem `sync.js`; ao serem
  implementados de verdade, seguir a convenção acima.

## Supabase

- Config (URL + chave anônima) em `shared/config.js`.
- As tabelas usam a política RLS `public_all` (acesso total via chave
  anônima). Ao criar tabela nova para um módulo, replicar esse padrão e
  criar as duas variantes (`az_` e `azp_`).

## Deploy

Publicado automaticamente via **Vercel** a cada push na branch `main`.
Os módulos e `shared/` são servidos com `Cache-Control: no-cache` (ver
`vercel.json`), mas peça ao usuário um refresh forçado (Ctrl+Shift+R) após
mudanças, por garantia.

## Idioma

O usuário fala **português (BR)**. Responda e escreva comentários/commits em
português.
