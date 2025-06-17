//HOLA ALEJANDRO
export interface insert_student {
    p_full_name: string;
    p_email: string;
    p_birth_date: string; // formato YYYY-MM-DD
    p_card_id: string;
    p_phone_number: string;
    p_phone_number_optional?: string;
    p_nationality: string;
    p_home_direction: string;
    p_occupation: string;
    p_role_id: number;
    ce_full_name: string;
    ce_kindred: string;
    ce_phone_number: string;
    e_start_date: string;
    e_schedule: string; // formato ISO 8601
    e_enrollement_date: string;
    e_next_payment: string;
    e_course_id: number;
    e_person_teacher_id: number;
}

export interface update_student {
    p_person_id: number;
    p_full_name: string;
    p_email: string;
    p_birth_date: string;
    p_card_id: string;
    p_phone_number: string;
    p_phone_number_optional?: string;
    p_nationality: string;
    p_home_direction: string;
    p_occupation: string;
    p_role_id: number;
    ce_full_name: string;
    ce_kindred: string;
    ce_phone_number: string;
    en_active: boolean;
    en_course_id: number;
}
