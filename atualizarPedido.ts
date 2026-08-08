import { createClientFromRequest } from "npm:@base44/sdk@0.8.31";

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json().catch(() => ({}));

    const { id, status, statusWhatsapp, dataEntregaEstimada, dataPagamento, observacoes, enderecoEntrega } = body;

    if (!id) {
      return new Response(JSON.stringify({
        success: false,
        error: "ID do pedido é obrigatório"
      }), { status: 400, headers: { "Content-Type": "application/json" } });
    }

    // Monta apenas os campos a serem atualizados
    const updateData = {};
    if (status) updateData.status = status;
    if (statusWhatsapp) updateData.statusWhatsapp = statusWhatsapp;
    if (dataEntregaEstimada) updateData.dataEntregaEstimada = dataEntregaEstimada;
    if (dataPagamento) updateData.dataPagamento = dataPagamento;
    if (observacoes !== undefined) updateData.observacoes = observacoes;
    if (enderecoEntrega !== undefined) updateData.enderecoEntrega = enderecoEntrega;

    if (Object.keys(updateData).length === 0) {
      return new Response(JSON.stringify({
        success: false,
        error: "Nenhum campo válido para atualização"
      }), { status: 400, headers: { "Content-Type": "application/json" } });
    }

    const pedido = await base44.entities.Pedido.update(id, updateData);

    return new Response(JSON.stringify({
      success: true,
      data: pedido,
      message: "Pedido atualizado com sucesso"
    }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: error.message || "Erro ao atualizar pedido"
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
});
