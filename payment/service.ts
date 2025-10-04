
import { sanitizeDeep } from '../_shared/sanatizer.ts';
import { supabase_connect, response, getCostaRicaDate } from '../_shared/global_services.ts';


export async function insert_payment(req: Request) {
    const body = await req.json(); // Extraer JSON del body
    const supabase = supabase_connect(req);
    const action: string = body.action;

    if (action !== undefined && action !== null) {
        const validated_payment = sanitizeDeep(body.payment); // sanitizar los datos
        switch (action) {
            case 'automatic':

                const originalDate = new Date(validated_payment.p_next_payment);
                const nextPayment = new Date(originalDate);
                nextPayment.setMonth(nextPayment.getMonth() + 1);
                validated_payment.p_next_payment = nextPayment.toISOString().split('T')[0];
                validated_payment.p_pay_date = getCostaRicaDate();
                validated_payment.p_reason = "Pago de mensualidad";
                const { error } = await supabase.rpc("add_automatic_payment", validated_payment);

                if (error) {
                    return response({ message: error.message }, 385);
                }

                return response({ message:  validated_payment.p_pay_date }, 200);

            case 'manual':
                validated_payment.p_pay_date = getCostaRicaDate();
                const { error: meesageerror } = await supabase.rpc("add_manual_payment", validated_payment);
                if (meesageerror) {
                    return response({ message: meesageerror.message }, 385);
                }
                return response({ message:  validated_payment.p_pay_date  }, 200);

        }


    } else {
        return response({ message: "The action doesn't exist" }, 500);
    }

}
export async function get_statistics(req: Request) {

    const supabase = supabase_connect(req);

    const { data: general_earned_money, error: error_earned_money } = await supabase.rpc("calcular_ganancias");
    if (error_earned_money) {
        return response({ error: error_earned_money.message }, 305);
    }
    const statistics: { [key: string]: any[] } = {};

    statistics["general_earned_money"] = general_earned_money;
    const { data: month_earned_money, error: error_month_earned_money } = await supabase.rpc("ganancias_por_mes");
    if (error_month_earned_money) {
        return response({ error: error_month_earned_money.message }, 305);
    }


    statistics["month_earned_money"] = month_earned_money;
  /*  const today = getCostaRicaDate();
    const previousMonth = today.getMonth() === 0 ? 12 : today.getMonth();*/


    const { data: earned_last_four_week, error: error_last_four_week } = await supabase.rpc("earned_last_four_weeks");
    if (error_month_earned_money) {
        return response({ error: error_last_four_week.message }, 305);
    }
    statistics["earned_last_four_week"] = earned_last_four_week;

    return response(statistics, 200);
}


export async function get_history_payments(req: Request) {

    const supabase = supabase_connect(req);

    const { data, error } = await supabase.rpc("history_payment_table");

    if (error) {
        return response({ error: error.message }, 304);
    }

    return response(data, 200);
}

export async function delete_payment(id, req: Request) {

    const supabase = supabase_connect(req);

    const { data: data_payment, error: error_enrolment } = await supabase.rpc("delete_payment_if_today", { p_payment_id: id });
    if (error_enrolment) {
        return response({ error: data_payment.message }, 305);
    }
    

    return response("success", 200);
}