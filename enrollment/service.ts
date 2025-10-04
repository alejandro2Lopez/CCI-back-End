
import { sanitizeDeep } from '../_shared/sanatizer.ts';
import { supabase_connect, response } from '../_shared/global_services.ts';


export async function update_enrollment_status(req: Request) {
    const body = await req.json(); // Extraer JSON del body
    const supabase = supabase_connect(req);
    const validate_enrollment = sanitizeDeep(body.enrollment); // sanitizar los datos


    const { error } = await supabase.rpc("update_enrollment_status", validate_enrollment);
    if (error) {
        return response({ message: validate_enrollment }, 385);
    }
    return response({ message: "update success" }, 200);

}
export async function get_enrollment(id, req: Request) {

    const supabase = supabase_connect(req);

    const { data: data_enrolment, error: error_enrolment } = await supabase.rpc("get_enrollment_by_enrollment_id", { p_id: id });
    if (error_enrolment) {
        return response({ error: error_enrolment.message }, 305);
    }
    const data_to_user: { [key: string]: any[] } = {};

    data_to_user["enrolment"] = data_enrolment;

    return response(data_to_user, 200);
}

export async function update_enrollment(req: Request) {

    const body = await req.json(); // Extraer JSON del body
    const supabase = supabase_connect(req);
    const validate_enrollment = sanitizeDeep(body.enrollment);
    delete validate_enrollment.e_enrollment_paymentSN;
    delete validate_enrollment.e_first_course_payment;
    delete validate_enrollment.e_enrolment_payment;
    delete validate_enrollment.e_teacher;
    delete validate_enrollment.e_course;
    delete validate_enrollment.e_student_id;



    const { error: error_enrolment } = await supabase.rpc("update_enrollment", validate_enrollment);
    if (error_enrolment) {
        return response({ error:  error_enrolment  }, 305);
    }

    return response({ message: "sucess" }, 200);
}

export async function get_enrollment_table(req: Request) {

    const supabase = supabase_connect(req);

    const { data, error } = await supabase.rpc("enrollment_table");

    if (error) {
        return response({ error: error.message }, 304);
    }

    return response(data, 200);
}
export async function delete_enrollment(id, req: Request) {

    const supabase = supabase_connect(req);

    const { data: data_enrolment, error: error_enrolment } = await supabase.rpc("delete_enrollment", { p_enrollment_id: id });
    if (error_enrolment) {
        return response({ error: error_enrolment.message }, 305);
    }


    return response("success", 200);
}