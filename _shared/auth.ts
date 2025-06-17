// utils/auth.ts
import { supabase_connect } from "./global_services.ts";

export async function isAllowedUser(req: Request) {
    const supabase = supabase_connect(req);

    const {
        data: { user },
        error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user || !user.email) {
        throw new Error("Unauthorized: no se pudo obtener el usuario");
    }

    const { data, error } = await supabase
        .rpc("is_allowed_user");

    if (error) {
        throw new Error("Unauthorized: acceso denegado");
    }

    if (!data?.[0]?.allowed) {

        throw new Error("Unauthorized: usuario no habilitado");
    }

    return true;
}
