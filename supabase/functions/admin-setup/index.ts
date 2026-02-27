import { createClient } from "https://esm.sh/@supabase/supabase-js@2.97.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const DEFAULT_EMAIL = "admin@praizyinterior.ng";
const DEFAULT_PASSWORD = "PraizyAdmin2025!";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Check if admin already exists
    const { data: existingRoles } = await supabaseAdmin
      .from("user_roles")
      .select("id")
      .eq("role", "admin")
      .limit(1);

    if (existingRoles && existingRoles.length > 0) {
      return new Response(
        JSON.stringify({ message: "Admin already exists", exists: true }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create the admin user
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: DEFAULT_EMAIL,
      password: DEFAULT_PASSWORD,
      email_confirm: true,
    });

    if (authError) throw authError;

    const userId = authData.user.id;

    // Assign admin role
    const { error: roleError } = await supabaseAdmin
      .from("user_roles")
      .insert({ user_id: userId, role: "admin" });

    if (roleError) throw roleError;

    // Create admin settings
    const { error: settingsError } = await supabaseAdmin
      .from("admin_settings")
      .insert({
        user_id: userId,
        display_username: "admin",
        recovery_email: null,
      });

    if (settingsError) throw settingsError;

    return new Response(
      JSON.stringify({
        message: "Admin created successfully",
        credentials: { email: DEFAULT_EMAIL, password: DEFAULT_PASSWORD },
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
