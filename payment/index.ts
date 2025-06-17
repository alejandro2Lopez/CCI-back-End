
import { insert_payment, get_statistics, get_history_payments } from "./service.ts";
import { isAllowedUser } from "../_shared/auth.ts";
import { response } from '../_shared/global_services.ts';

import { handleCors } from "../_shared/cors.ts";

Deno.serve(async (req) => {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;
  try {
    await isAllowedUser(req);
    const url = new URL(req.url);
    const method = req.method;


    switch (method) {
      case 'GET':
        const url = new URL(req.url);
        const command = url.pathname.split('/').pop();
        const id = command && command.trim() !== "" ? command : "";

        if (id !== "") {
          // Si necesitas manejar GET con un ID, puedes hacerlo aquí.
          return get_history_payments(req);
        } else {
          // Si no hay ID, obtener todos los estudiantes.
          return await get_statistics(req);
        }
      //  return response({ error: 'Method Not Allowed' }, 500);
      case 'POST':
        return await insert_payment(req);
      case 'PUT':
        return response({ error: 'Method Not Allowed' }, 500);
      case 'DELETE':
        return response({ error: 'Method Not Allowed' }, 500);
      default:
        return response({ error: 'Method Not Allowed' }, 388);
    }
  } catch (error) {
    return response(`Internal Server Error: ${error.message}`, 389);

  }
});

