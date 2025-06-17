//Hola Hola

export interface TeacherBase {
  p_full_name: string;
  p_email: string;
  p_birth_date: string;
  p_card_id: string;
  p_phone_number: string;
  p_phone_number_optional?: string;
  p_nationality: string;
  p_home_direction: string;
  p_occupation: string;

  p_language_id: number;
}

export interface insert_teacher extends TeacherBase {
  p_role_id: number;
 
}

export interface update_teacher extends TeacherBase {
  p_person_id: number;
}
