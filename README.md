# Sistema de Controle de Peças — AZ Remanufaturados

Sistema interno de gestão para controle de empresas, produtos e vendas.

## Funcionalidades

- **Empresas**: Cadastro completo com CNPJ, contato, localização
- **Produtos**: Motores de partida e alternadores com código e aplicação
- **Vendas**: Registro de serviços com BT, tipo de serviço, pedido
- **Dashboard**: Resumo com últimas vendas
- **Exportação**: CSV de vendas por empresa ou geral

## Tecnologia

Sistema HTML/CSS/JS puro. Os dados ficam no **Supabase** (banco na nuvem),
acessado pela camada `shared/db.js` (`AZ_DB`). Assim o sistema é **um só**:
cada dispositivo é apenas uma janela para o mesmo banco central.

## Sincronização entre dispositivos (importante para novos módulos)

Tudo que é criado em qualquer dispositivo vai para o banco e aparece para
todos, com atualização automática (quase em tempo real). O mecanismo é
central e fica em **`shared/sync.js`** — ele liga sozinho em qualquer
página que inclua os scripts compartilhados.

**Para um módulo participar da sincronização automática, basta:**

1. Guardar os dados no Supabase via `AZ_DB` (nunca em `localStorage` —
   `localStorage` é local do aparelho e NÃO sincroniza; use-o apenas para
   preferências de UI, como ligar/desligar som).
2. Incluir `<script src="/shared/sync.js"></script>` na página (já presente
   em todos os módulos, inclusive nos placeholders "em breve").
3. Definir uma função global `azReload()` que recarrega os dados do banco e
   redesenha a tela:

   ```js
   window.azReload = async function () {
     await loadAll();      // busca do Supabase
     renderTelaAtual();    // redesenha
   };
   ```

O `sync.js` cuida do resto: recarrega ao voltar o foco / abrir a aba e a
cada 15s, e não atualiza enquanto um modal (`.overlay.open`) estiver aberto,
para não atrapalhar quem está preenchendo um cadastro. Módulos sem dados
(que não definem `azReload`) são ignorados com segurança.

> Regra de ouro: **nenhum dado do sistema deve morar em `localStorage`.**
> Se precisar persistir algo que os outros dispositivos devem ver, vai para
> o Supabase.

## Deploy

Publicado automaticamente via Vercel a cada push na branch `main`.
