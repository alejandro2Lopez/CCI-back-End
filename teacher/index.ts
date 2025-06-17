
import { insert_teacher, update_teacher, get_teacher, get_teachers, update_teacher_status } from "./service.ts";
import { isAllowedUser } from "../_shared/auth.ts";
import { response } from '../_shared/global_services.ts';

import { handleCors } from "../_shared/cors.ts";

Deno.serve(async (req) => {

  try {
    const corsResponse = handleCors(req);
    if (corsResponse) return corsResponse;
    await isAllowedUser(req);
    const url = new URL(req.url);
    const method = req.method;
    const command = url.pathname.split('/').pop();
    const id = command && command.trim() !== "" ? command : "";
    switch (method) {
      case 'GET':
        if (id !== "") {
          // Si necesitas manejar GET con un ID, puedes hacerlo aquí.
          return await get_teacher(Number(id), req);
        } else {
          // Si no hay ID, obtener todos los estudiantes.
          return await get_teachers(req);
        }

      case 'POST':
        return await insert_teacher(req);

      case 'PUT':
        // Si hay un ID, puedes hacer un PUT para actualizar.
        return update_teacher(req);


      case 'DELETE':

        return await update_teacher_status(req);

      default:
        return response({ error: 'Method Not Allowed' }, 308);

    }
  } catch (error) {
    return response(`Internal Server Error: ${error.message}`, 309);

  }
});
