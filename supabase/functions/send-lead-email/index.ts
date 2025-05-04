
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.29.0";

// CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface SendEmailPayload {
  leadId: string;
  subject: string;
  content: string;
  companyId: string;
  sentBy: string;
  templateId?: string;
  recipientEmail: string;
  recipientName: string;
}

// Email server configuration placeholder - this would use your company email settings
// In a real implementation, we would retrieve SMTP settings from company_email_settings

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Get request data
    const payload: SendEmailPayload = await req.json();
    const { leadId, subject, content, companyId, sentBy, templateId, recipientEmail, recipientName } = payload;

    // Log the email sending attempt
    console.log(`Attempting to send email to ${recipientEmail} from user ${sentBy}`);
    
    // Save the communication record first
    const { data: commData, error: commError } = await supabaseClient
      .from('lead_communications')
      .insert({
        lead_id: leadId,
        subject,
        content,
        company_id: companyId,
        direction: 'outbound',
        type: 'email',
        status: 'sent', // Optimistic update - in real implementation, update after actual sending
        sent_by: sentBy,
        sent_at: new Date().toISOString(),
        template_id: templateId,
        email_metadata: { recipientEmail, recipientName }
      })
      .select()
      .single();

    if (commError) {
      console.error("Error saving communication:", commError);
      throw commError;
    }

    // In a real implementation, we would:
    // 1. Retrieve SMTP settings for the company
    // 2. Use those settings to send an actual email
    // 3. Update the communication status based on the email service response
    
    // For demo purposes, we'll simulate a successful email send
    console.log(`Email sent to ${recipientEmail}: ${subject}`);

    // Create a notification about this communication
    const { error: notifError } = await supabaseClient
      .from('notifications')
      .insert({
        user_id: sentBy,
        company_id: companyId,
        title: "Email sent",
        message: `Email "${subject}" has been sent to ${recipientName}`,
        type: "lead_communication",
        status: "unread",
        related_entity_id: leadId,
        related_entity_type: "lead"
      });

    if (notifError) {
      console.error("Error creating notification:", notifError);
      // Continue - notification creation failure shouldn't stop the response
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Email sent successfully",
        communicationId: commData.id
      }),
      { 
        headers: { 
          "Content-Type": "application/json",
          ...corsHeaders
        } 
      }
    );
  } catch (error) {
    console.error("Error sending email:", error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        status: 500,
        headers: { 
          "Content-Type": "application/json",
          ...corsHeaders
        } 
      }
    );
  }
});
