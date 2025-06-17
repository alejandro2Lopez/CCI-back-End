
import { get_teachers, get_courses, get_languages } from "./service.ts";
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
    const searchParams = url.searchParams;

    const action = searchParams.get("action");
    switch (method) {
      case 'GET':

        if (action === "getTeachers") {

          return await get_teachers(req);
        } else if (action === "getCourses") {
          return await get_courses(req);
        }else if (action === "getLanguages") {
          return await get_languages(req);
        } else {
          return response({ error: 'Method Not Allowed' }, 500);
        }

      case 'POST':
        return response({ error: 'Method Not Allowed' }, 500);
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

