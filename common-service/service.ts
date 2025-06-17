

import { supabase_connect, response } from '../_shared/global_services.ts';


export async function get_teachers(req: Request) {

    const supabase = supabase_connect(req);

    const { data, error } = await supabase.rpc("get_teachers");

    if (error) {
        return response({ error: error.message }, 304);
    }

    return response(data, 200);
}
export async function get_courses(req: Request) {

    const supabase = supabase_connect(req);

    const { data, error } = await supabase.rpc("get_courses");

    if (error) {
        return response({ error: error.message }, 304);
    }

    return response(data, 200);
}

export async function get_languages(req: Request) {

    const supabase = supabase_connect(req);

    const { data, error } = await supabase.rpc("get_languages");

    if (error) {
        return response({ error: error.message }, 304);
    }

    return response(data, 200);
}