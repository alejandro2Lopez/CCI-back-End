
import { insert_student, get_students, get_student, update_student, delete_student } from "./service.ts";
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


    const command = url.pathname.split('/').pop();
    const id = command && command.trim() !== "" ? command : "";
    switch (method) {
      case 'GET':
        if (id !== "") {
          // Si necesitas manejar GET con un ID, puedes hacerlo aquí.
          return await get_student(id,req);
        } else {
          // Si no hay ID, obtener todos los estudiantes.
          return await get_students(req);
        }

      case 'POST':
        return await insert_student(req);

      case 'PUT':
        // Si hay un ID, puedes hacer un PUT para actualizar.
        return update_student(req);
       

      case 'DELETE':
   
        return delete_student(id, req);
        

      default:
        return response({ error: 'Method Not Allowed' }, 388);

    }
  } catch (error) {
    return response(`Internal Server Error: ${error.message}`, 389);

  }
});

