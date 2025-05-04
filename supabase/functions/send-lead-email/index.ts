
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
}

interface EmailSendRequest {
  leadId: string;
  subject: string;
  content: string;
  companyId: string;
  sentBy: string;
  templateId?: string;
  recipientEmail: string;
  recipientName: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const {
      leadId,
      subject,
      content,
      companyId,
      sentBy,
      templateId,
      recipientEmail,
      recipientName
    }: EmailSendRequest = await req.json();

    // Validate required fields
    if (!leadId || !subject || !content || !companyId || !sentBy || !recipientEmail) {
      throw new Error("Missing required fields");
    }

    // Get supabase client with service role for internal operations
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // For now, we'll simulate sending an email and just log the record
    console.log(`Sending email to ${recipientEmail} (${recipientName}): ${subject}`);
    
    // Record the communication in our database
    const { data, error } = await supabase
      .from('lead_communications')
      .insert({
        lead_id: leadId,
        company_id: companyId,
        subject,
        content,
        direction: 'outbound',
        type: 'email',
        status: 'sent', // We'll assume success for now
        sent_by: sentBy,
        sent_at: new Date().toISOString(),
        template_id: templateId || null,
        email_metadata: {
          recipientEmail,
          recipientName,
          sentAt: new Date().toISOString()
        }
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating communication record:", error);
      throw error;
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Email sent successfully",
        data 
      }), 
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders
        }
      }
    );
  } catch (error) {
    console.error("Error in send-lead-email function:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : "Unknown error" 
      }),
      {
        status: 400,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders
        }
      }
    );
  }
};

serve(handler);
