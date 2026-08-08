import { createClientFromRequest } from "npm:@base44/sdk@0.8.31";

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json().catch(() => ({}));

    const { id } = body;

    if (!id) {
      return new Response(JSON.stringify({
        success: false,
        error: "ID da transação é obrigatório"
      }), { status: 400, headers: { "Content-Type": "application/json" } });
    }

    await base44.entities.Transacao.delete(id);

    return new Response(JSON.stringify({
      success: true,
      message: "Transação deletada com sucesso"
    }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: error.message || "Erro ao deletar transação"
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
});