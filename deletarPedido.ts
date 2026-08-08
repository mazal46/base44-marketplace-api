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
      }), { status: 400, headers: { "Content-Type": "application/json" } });
    }

    await base44.entities.Pedido.delete(id);

    return new Response(JSON.stringify({
      success: true,
      message: "Pedido deletado com sucesso"
    }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: error.message || "Erro ao deletar pedido"
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
});
