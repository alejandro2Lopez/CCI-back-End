
import { update_enrollment_status, get_enrollment, update_enrollment, get_enrollment_table } from "./service.ts";
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
          return await  get_enrollment(id, req);
        } else {
          // Si no hay ID, obtener todos los estudiantes.
          return await get_enrollment_table(req);
        }

      case 'POST':
        return update_enrollment_status(req);
      case 'PUT':
        return update_enrollment(req);
      case 'DELETE':
        return response({ error: 'Method Not Allowed' }, 500);
      default:
        return response({ error: 'Method Not Allowed' }, 388);
    }
  } catch (error) {
    return response(`Internal Server Error: ${error.message}`, 389);

  }
});

