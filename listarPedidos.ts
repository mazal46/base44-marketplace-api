import { createClientFromRequest } from "npm:@base44/sdk@0.8.31";

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json().catch(() => ({}));

    const { status, clienteId, lojaId, limit, skip, sort } = body;

    const filter = {};
    if (status) filter.status = status;
    if (clienteId) filter.clienteId = clienteId;
    if (lojaId) filter.lojaId = lojaId;

    const options = {};
    if (limit) options.limit = limit;
    if (skip) options.skip = skip;
    if (sort) options.sort = sort;

    const result = await base44.entities.Pedido.list({ filter, ...options });

    return new Response(JSON.stringify({
      success: true,
      data: result,
      count: Array.isArray(result) ? result.length : 0
    }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: error.message || "Erro ao listar pedidos"
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
});
