
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.8";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface InvitationEmailRequest {
  invitation_id: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { invitation_id }: InvitationEmailRequest = await req.json();

    if (!invitation_id) {
      throw new Error("Invalid request: missing invitation_id");
    }

    // Create a Supabase client with the Admin key (to bypass RLS policies)
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      {
        auth: {
          persistSession: false,
        },
      }
    );

    // Get the invitation details
    const { data: invitation, error: invitationError } = await supabaseAdmin
      .from("invitations")
      .select("*, companies(*)")
      .eq("id", invitation_id)
      .single();

    if (invitationError || !invitation) {
      throw new Error(`Failed to fetch invitation: ${invitationError?.message || "Not found"}`);
    }

    // Get the sender information
    const { data: sender, error: senderError } = await supabaseAdmin
      .from("profiles")
      .select("name, email")
      .eq("id", invitation.created_by)
      .single();

    if (senderError && invitation.created_by) {
      console.warn(`Failed to fetch sender information: ${senderError.message}`);
    }

    // Create signup URL with token
    const baseUrl = Deno.env.get("PUBLIC_SITE_URL") || "http://localhost:3000";
    const signupUrl = `${baseUrl}/login?token=${invitation.token}`;

    // In a real application, you would send an actual email here
    // For now, we'll just log the email details and update the invitation status
    console.log({
      to: invitation.email,
      subject: `Invitation to join ${invitation.companies?.name || "Policy Hub"}`,
      body: `
        You've been invited to join ${invitation.companies?.name || "Policy Hub"} as a${invitation.role === "admin" ? "n Admin" : " User"}.
        
        Click the following link to accept the invitation and set up your account:
        ${signupUrl}
        
        This invitation will expire in 7 days.
        
        ${sender ? `Sent by: ${sender.name} (${sender.email})` : ""}
      `
    });

    // For now, return success - in a real app, you would integrate with an email service
    return new Response(
      JSON.stringify({ 
        success: true,
        message: "Invitation email processed successfully (would be sent in production)",
        invitation_id,
        recipient: invitation.email,
        signup_url: signupUrl
      }),
      {
        status: 200,
        headers: { 
          "Content-Type": "application/json",
          ...corsHeaders 
        },
      }
    );
  } catch (error: any) {
    console.error("Error in send-invitation-email function:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 500,
        headers: { 
          "Content-Type": "application/json",
          ...corsHeaders 
        },
      }
    );
  }
};

serve(handler);
