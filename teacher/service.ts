
import { insert_teacher, update_teacher } from '../_shared/teachers_model.ts';
import { sanitizeDeep } from '../_shared/sanatizer.ts';
import { supabase_connect, response } from '../_shared/global_services.ts';

export async function insert_teacher(req: Request) {
    const body: insert_teacher = await req.json(); // Extraer JSON del body
    const supabase = supabase_connect(req);
    const validate_student: insert_teacher = sanitizeDeep(body); // sanitizar los datos

    validate_student.p_role_id = 1;


    const { data, error } = await supabase.rpc("insert_teacher", validate_student);
    if (error) {
        return response({ error: error.message }, 354);
    }
    return response(data, 200);
}


export async function get_teachers(req: Request) {

    const supabase = supabase_connect(req);

    const { data, error } = await supabase.rpc("teacherstable");

    if (error) {
        console.error('Error fetching students:', error);  // Para depuración
        return response({ error: error.message }, 350);
    }

    return response(data, 200);
}


export async function get_teacher(id: number, req: Request) {

    const supabase = supabase_connect(req);

    const { data, error } = await supabase.rpc("get_teacher", { _person_id: id });

    if (error) {
        return response({ error: error.message }, 351);
    }

    return response(data, 200);
}

export async function update_teacher(req: Request) {
    const body: update_teacher = await req.json();
    const supabase = supabase_connect(req);
    const validate_teacher: update_teacher = sanitizeDeep(body);
    const { data, error } = await supabase.rpc("update_teacher", validate_teacher);

    if (error) {
        return response({ error: error.message }, 352);
    }
    return response(data, 200);
}
export async function update_teacher_status(req: Request) {
    const body = await req.json(); // Extraer JSON del body
    const supabase = supabase_connect(req);
    const validate_teacher_status = sanitizeDeep(body.teacher); // sanitizar los datos


    const { error } = await supabase.rpc("update_teacher_status", validate_teacher_status);
    if (error) {
        return response({ message: validate_teacher_status }, 385);
    }
    return response({ message: "update success" }, 200);

}
export async function delete_teacher(id, req: Request) {

    const supabase = supabase_connect(req);

    const { data: data_enrolment, error: error_enrolment } = await supabase.rpc("delete_teacher_if_no_enrollements", {  p_person_id: id });
    if (error_enrolment) {
        return response({ error: error_enrolment.message }, 305);
    }
    

    return response("success", 200);
}