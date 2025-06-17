// hello.ts
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  // Manejo del preflight (OPTIONS)
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    })
  }

  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    {
      global: {
        headers: {
          Authorization: req.headers.get('Authorization')!,
        },
      },
    }
  )

  /*const {
    data: { user },
    error,
  } = await supabaseClient.auth.getUser()*/
  const { data, error } = await supabaseClient.rpc('get_roles');

  if (error ) {
    return new Response(JSON.stringify(error), { status: 403,  headers: {
      'Access-Control-Allow-Origin': 'http://localhost:5173',
    },}
     );
  }

  return new Response(JSON.stringify(data), {
    headers: {
      "Content-Type": "application/json",
      'Access-Control-Allow-Origin': 'http://localhost:5173',
    }

  });
 /* if (error || !user) {
    return new Response('Unauthorized', {
      status: 401,
      headers: {
        'Access-Control-Allow-Origin': 'http://localhost:5173',
      },
    })
  }

  return new Response(`Hola ${user.email}!`, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain',
      'Access-Control-Allow-Origin': 'http://localhost:5173',
    },
  })*/
})
