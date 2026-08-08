import { createClientFromRequest } from "npm:@base44/sdk@0.8.31";

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json().catch(() => ({}));

    const {
      clienteId,
      lojaId,
      itens,
      subtotal,
      frete,
      total,
      totalItens,
      enderecoEntrega,
      metodoPagamento,
      observacoes
    } = body;

    // Validações básicas
    if (!clienteId) {
      return new Response(JSON.stringify({
        success: false,
        error: "clienteId é obrigatório"
      }), { status: 400, headers: { "Content-Type": "application/json" } });
    }

    if (!lojaId) {
      return new Response(JSON.stringify({
        success: false,
        error: "lojaId é obrigatório"
      }), { status: 400, headers: { "Content-Type": "application/json" } });
    }

    if (!itens || !Array.isArray(itens) || itens.length === 0) {
      return new Response(JSON.stringify({
        success: false,
        error: "itens é obrigatório e deve conter ao menos 1 item"
      }), { status: 400, headers: { "Content-Type": "application/json" } });
    }

    // Gera número do pedido: PED-YYYYMMDD-XXXX
    const now = new Date();
    const dateStr = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}`;
    const random = Math.floor(1000 + Math.random() * 9000);
    const numeroPedido = `PED-${dateStr}-${random}`;

    // Calcula total se não fornecido
    const calculatedSubtotal = subtotal ?? itens.reduce((sum, item) => {
      return sum + (item.precoUnitario * item.quantidade);
    }, 0);

    const calculatedTotal = total ?? (calculatedSubtotal + (frete || 0));

    const pedidoData = {
      numeroPedido,
      clienteId,
      lojaId,
      itens,
      subtotal: calculatedSubtotal,
      frete: frete || 0,
      total: calculatedTotal,
      totalItens: totalItens ?? itens.reduce((sum, item) => sum + item.quantidade, 0),
      enderecoEntrega: enderecoEntrega || "",
      metodoPagamento: metodoPagamento || "",
      observacoes: observacoes || "",
      status: "AguardandoPagamento",
      statusWhatsapp: "NaoEnviado"
    };

    const pedido = await base44.entities.Pedido.create(pedidoData);

    return new Response(JSON.stringify({
      success: true,
      data: pedido,
      message: `Pedido ${numeroPedido} criado com sucesso`
    }), {
      status: 201,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: error.message || "Erro ao criar pedido"
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
});
