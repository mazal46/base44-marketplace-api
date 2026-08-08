import { createClientFromRequest } from "npm:@base44/sdk@0.8.31";

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json().catch(() => ({}));

    const { id } = body;

    if (!id) {
      return new Response(JSON.stringify({
        success: false,
        error: "ID do pedido é obrigatório"
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    const pedido = await base44.entities.Pedido.get(id);

    return new Response(JSON.stringify({
      success: true,
      data: pedido
    }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: error.message || "Erro ao obter pedido"
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
});
