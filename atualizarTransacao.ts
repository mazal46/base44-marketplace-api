import { createClientFromRequest } from "npm:@base44/sdk@0.8.31";

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json().catch(() => ({}));

    const { id, status, tipo, valor, desconto, comissao, taxaGateway, formaPagamento, data } = body;

    if (!id) {
      return new Response(JSON.stringify({
        success: false,
        error: "ID da transação é obrigatório"
      }), { status: 400, headers: { "Content-Type": "application/json" } });
    }

    // Se valor ou taxas foram alteradas, recalcula valorLiquido
    const updateData = {};
    if (status) updateData.status = status;
    if (tipo) updateData.tipo = tipo;
    if (valor !== undefined) updateData.valor = valor;
    if (desconto !== undefined) updateData.desconto = desconto;
    if (comissao !== undefined) updateData.comissao = comissao;
    if (taxaGateway !== undefined) updateData.taxaGateway = taxaGateway;
    if (formaPagamento) updateData.formaPagamento = formaPagamento;
    if (data) updateData.data = data;

    // Recalcula valor líquido se algum campo financeiro mudou
    if (valor !== undefined || desconto !== undefined || comissao !== undefined || taxaGateway !== undefined) {
      // Busca a transação atual pra mesclar com os novos valores
      const atual = await base44.entities.Transacao.get(id);
      const v = valor !== undefined ? valor : atual.valor;
      const d = desconto !== undefined ? desconto : atual.desconto;
      const c = comissao !== undefined ? comissao : atual.comissao;
      const t = taxaGateway !== undefined ? taxaGateway : atual.taxaGateway;
      updateData.valorLiquido = v - (d || 0) - (c || 0) - (t || 0);
    }

    if (Object.keys(updateData).length === 0) {
      return new Response(JSON.stringify({
        success: false,
        error: "Nenhum campo válido para atualização"
      }), { status: 400, headers: { "Content-Type": "application/json" } });
    }

    const transacao = await base44.entities.Transacao.update(id, updateData);

    return new Response(JSON.stringify({
      success: true,
      data: transacao,
      message: "Transação atualizada com sucesso"
    }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: error.message || "Erro ao atualizar transação"
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
});