
import { insert_student } from '../_shared/students_model.ts';
import { sanitizeDeep } from '../_shared/sanatizer.ts';
import { supabase_connect, response, getCostaRicaDate } from '../_shared/global_services.ts';
import { insert_enrollement } from '../_shared/course_enrollement_model.ts';

export async function insert_student(req: Request) {
    const body = await req.json(); // Extraer JSON del body
    const supabase = supabase_connect(req);
    const validate_student = sanitizeDeep(body.student); // sanitizar los datos
    validate_student.p_role_id = 2;

    const { data: person_id, error } = await supabase.rpc("insert_student", validate_student);
    if (error) {
        return response({ message: error.message }, 385);
    } else {


        for (const enrollement of body.enrolled_courses) {
            const e = sanitizeDeep(enrollement);
            const e_first_course_payment = enrollement.e_first_course_payment;
            const e_enrollment_payment = enrollement.e_enrollment_paymentSN;
            delete enrollement.e_first_course_payment;
            delete enrollement.e_enrollment_paymentSN;
            const { data: enrollement_id, error } = await supabase.rpc('insert_enrollement', {
                p_person_student_id: person_id,
                p_start_date: e.e_start_date,
                p_schedule: e.e_schedule,
                p_enrollement_date: getCostaRicaDate(),
                p_next_payment: e.e_next_payment,
                p_course_id: e.e_course_id,
                p_enrolment_payment: e.e_enrolment_payment,
                p_course_payment: e.e_course_payment,
                p_person_teacher_id: e.e_person_teacher_id,
                p_notes: e.e_notes,
            });

            if (error) {
                return response({ message: error.message }, 380);
            }
            if (e_first_course_payment == 1) {
                const { error } = await supabase.rpc('add_automatic_payment', {
                    p_enrolment_id: enrollement_id,
                    p_pay_date: getCostaRicaDate(),
                    p_next_payment: e.e_next_payment,
                    p_reason: "Pago de mensualidad"
                });
                if (error) {
                    return response({ message: error.message }, 381);
                }
            }

            if (e_enrollment_payment == 1) {
                const { error } = await supabase.rpc('add_manual_payment', {
                    p_enrolment_id: enrollement_id,
                    p_pay_date: getCostaRicaDate(),
                    p_next_payment: e.e_next_payment,
                    p_reason: "Pago de matrícula",
                    p_course_payment: e.e_enrolment_payment
                });
                if (error) {
                    return response({ message: error.message }, 381);
                }
            }
        }
        return response({ message: person_id }, 200);

    }

}


export async function get_students(req: Request) {

    const supabase = supabase_connect(req);

    const { data, error } = await supabase.rpc("studentstable");

    if (error) {
        return response({ error: error.message }, 304);
    }

    return response(data, 200);
}


export async function get_student(id, req: Request) {

    const supabase = supabase_connect(req);

    const { data, error } = await supabase.rpc("get_student", { p_id: id });

    if (error) {
        return response({ error: error.message }, 305);
    }
    const { data: data_enrolment, error: error_enrolment } = await supabase.rpc("get_enrollment", { p_id: id });
    if (error_enrolment) {
        return response({ error: error_enrolment.message }, 305);
    }
    const data_to_user: { [key: string]: any[] } = {};

    data_to_user["student"] = data;
    data_to_user["enrolment"] = data_enrolment;

    return response(data_to_user, 200);
}

export async function update_student(req: Request) {
    const body = await req.json(); // Extraer JSON del body
    const supabase = supabase_connect(req);
    const validate_student = sanitizeDeep(body.student); // sanitizar los datos
    validate_student.p_role_id = 2;

    const { error } = await supabase.rpc("update_student", validate_student);
    if (error) {
        return response({ message: validate_student }, 385);
    } else {

        if (body.enrolled_courses.length > 0) {
            for (const enrollement of body.enrolled_courses) {
                const e = sanitizeDeep(enrollement);
                const e_first_course_payment = enrollement.e_first_course_payment;
                const e_enrollment_payment = enrollement.e_enrollment_paymentSN;
                const e_enrolment_payment = e.e_enrolment_payment;
                delete enrollement.e_first_course_payment;
                delete enrollement.e_enrollment_paymentSN;
                const { data: enrollement_id, error } = await supabase.rpc('insert_enrollement', {
                    p_person_student_id: validate_student.p_personid,
                    p_start_date: e.e_start_date,
                    p_schedule: e.e_schedule,
                    p_enrollement_date: getCostaRicaDate(),
                    p_next_payment: e.e_next_payment,
                    p_course_id: e.e_course_id,
                    p_enrolment_payment: e.e_enrolment_payment,
                    p_course_payment: e.e_course_payment,
                    p_person_teacher_id: e.e_person_teacher_id,
                    p_notes: e.e_notes,
                });

                if (error) {
                    return response({ message: error.message }, 380);
                }
                if (e_first_course_payment == 1) {
                    const { error } = await supabase.rpc('add_automatic_payment', {
                        p_enrolment_id: enrollement_id,
                        p_pay_date: getCostaRicaDate(),
                        p_next_payment: e.e_next_payment,
                        p_reason: "Pago de mensualidad"
                    });
                    if (error) {
                        return response({ message: error.message }, 381);
                    }
                }

                if (e_enrollment_payment == 1) {
                    const { error } = await supabase.rpc('add_manual_payment', {
                        p_enrolment_id: enrollement_id,
                        p_pay_date: getCostaRicaDate(),
                        p_next_payment: e.e_next_payment,
                        p_reason: "Pago de matrícula",
                        p_course_payment: e_enrolment_payment,
                    });
                    if (error) {
                        return response({ message: error.message }, 381);
                    }
                }
            }
        }
        return response({ message: "upload success" }, 200);

    }
}
