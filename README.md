# Base44 Marketplace API

Sistema de API para dropshipping/marketplace construído com backend functions da Base44.

## Estrutura

### Pedidos (`functions/pedidos/`)
- `listarPedidos.ts` — Lista pedidos com filtros (status, clienteId, lojaId)
- `obterPedido.ts` — Retorna um pedido pelo ID
- `criarPedido.ts` — Cria pedido com número automático e cálculo de totais
- `atualizarPedido.ts` — Atualização parcial (status, whatsapp, datas, etc)
- `deletarPedido.ts` — Deleta um pedido pelo ID

### Transações (`functions/transacoes/`)
- `listarTransacoes.ts` — Lista transações com filtros (status, tipo, pedidoId, etc)
- `obterTransacao.ts` — Retorna uma transação pelo ID
- `criarTransacao.ts` — Cria transação com cálculo automático de valorLiquido
- `atualizarTransacao.ts` — Atualização parcial com recálculo de valorLiquido
- `deletarTransacao.ts` — Deleta uma transação pelo ID

## Entities

| Entity | Descrição |
|--------|-----------|
| Cliente | Clientes do marketplace |
| Fornecedor | Fornecedores com score e avaliação |
| Loja | Lojas/vitrines com regras de negócio |
| Produto | Produtos com preço, margem e estoque |
| Pedido | Pedidos com status e itens |
| Transacao | Transações financeiras com valorLiquido calculado |

## Tecnologias
- Base44 Backend Functions (Deno + TypeScript)
- Base44 SDK (`@base44/sdk@0.8.31`)
- Base44 Entities (banco de dados gerenciado)
