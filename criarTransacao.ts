import { createClientFromRequest } from "npm:@base44/sdk@0.8.31";

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json().catch(() => ({}));

    const {
      pedidoId,
      lojaId,
      fornecedorId,
      tipo,
      valor,
      desconto,
      comissao,
      taxaGateway,
      formaPagamento
    } = body;

    // Validações básicas
    if (!tipo) {
      return new Response(JSON.stringify({
        success: false,
        error: "tipo é obrigatório (Venda, Reembolso, Comissao, Saque)"
      }), { status: 400, headers: { "Content-Type": "application/json" } });
    }

    if (valor === undefined || valor === null) {
      return new Response(JSON.stringify({
        success: false,
        error: "valor é obrigatório"
      }), { status: 400, headers: { "Content-Type": "application/json" } });
    }

    // Calcula valor líquido: valor - desconto - taxaGateway - comissao
    const descontoCalculado = desconto || 0;
    const comissaoCalculada = comissao || 0;
    const taxaCalculada = taxaGateway || 0;
    const valorLiquido = valor - descontoCalculado - comissaoCalculada - taxaCalculada;

    const transacaoData = {
      pedidoId: pedidoId || "",
      lojaId: lojaId || "",
      fornecedorId: fornecedorId || "",
      tipo,
      valor,
      desconto: descontoCalculado,
      comissao: comissaoCalculada,
      taxaGateway: taxaCalculada,
      valorLiquido,
      formaPagamento: formaPagamento || "",
      status: "Pendente",
      data: new Date().toISOString()
    };

    const transacao = await base44.entities.Transacao.create(transacaoData);

    return new Response(JSON.stringify({
      success: true,
      data: transacao,
      message: "Transação criada com sucesso"
    }), {
      status: 201,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: error.message || "Erro ao criar transação"
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
});