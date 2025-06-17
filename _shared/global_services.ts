import { createClient } from 'https://esm.sh/@supabase/supabase-js';

import { corsHeaders } from './cors.ts';

export function supabase_connect(req: Request) {

  return createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_ANON_KEY")!,
    {
      global: {
        headers: { Authorization: req.headers.get("Authorization")! },
      },
    }
  );

}

export function response(data: any, code: number) {
  return new Response(JSON.stringify({ data }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    status: code,
  });

}
export function getCostaRicaDate() {
  const now = new Date();
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Costa_Rica",
    hour12: false,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const parts = formatter.formatToParts(now);
  const values = Object.fromEntries(parts.map(p => [p.type, p.value]));

  return new Date(`${values.year}-${values.month}-${values.day}T${values.hour}:${values.minute}:${values.second}`);
}
