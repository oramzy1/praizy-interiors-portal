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
    const { recovery_email } = await req.json();

    if (!recovery_email) {
      return new Response(
        JSON.stringify({ error: "Recovery email is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Find the admin user with this recovery email
    const { data: settings, error: settingsError } = await supabaseAdmin
      .from("admin_settings")
      .select("user_id, recovery_email")
      .limit(1)
      .single();

    if (settingsError || !settings) {
      return new Response(
        JSON.stringify({ error: "No admin account found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!settings.recovery_email || settings.recovery_email.toLowerCase() !== recovery_email.toLowerCase()) {
      return new Response(
        JSON.stringify({ error: "Recovery email does not match" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Reset password to default
    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
      settings.user_id,
      { password: DEFAULT_PASSWORD, email: DEFAULT_EMAIL }
    );

    if (updateError) throw updateError;

    // Reset display username
    await supabaseAdmin
      .from("admin_settings")
      .update({ display_username: "admin" })
      .eq("user_id", settings.user_id);

    return new Response(
      JSON.stringify({
        message: "Credentials have been reset to defaults",
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
