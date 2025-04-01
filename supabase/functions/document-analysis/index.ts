
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { documentText, analysisType, documentType, documentCategory } = await req.json()

    if (!documentText) {
      throw new Error("Document text is required")
    }

    // Initialize OpenAI API
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openaiApiKey) {
      throw new Error("OpenAI API key not configured")
    }

    let prompt = ""
    let systemPrompt = ""

    // Configure prompts based on analysis type
    switch (analysisType) {
      case "classify":
        systemPrompt = "You are an expert in insurance document classification. Analyze the document text and determine the most likely document category."
        prompt = `Analyze the following insurance document text and classify it into one of these categories: policy, claim, invoice, lien, notification, correspondence, claim_evidence, medical, legal, financial, or other. Reply with ONLY the category name and nothing else.

Document text:
${documentText.slice(0, 3000)}`
        break
        
      case "extract":
        systemPrompt = "You are an expert in extracting structured data from insurance documents."
        prompt = `Extract key information from the following ${documentType || "insurance"} document. For ${documentCategory || "general"} documents, identify fields like policy numbers, dates, amounts, parties involved, etc. Return the data in JSON format.

Document text:
${documentText.slice(0, 3000)}`
        break
        
      case "summarize":
        systemPrompt = "You are an expert in summarizing complex insurance documents concisely."
        prompt = `Provide a brief professional summary (maximum 3 paragraphs) of the following ${documentType || "insurance"} document.

Document text:
${documentText.slice(0, 3000)}`
        break
        
      default:
        throw new Error("Invalid analysis type")
    }

    // Call OpenAI API
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${openaiApiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: prompt }
        ],
        temperature: 0.3, // Lower temperature for more deterministic results
        max_tokens: 1000
      })
    })

    if (!response.ok) {
      const error = await response.json()
      console.error("OpenAI API error:", error)
      throw new Error("Error calling OpenAI API: " + JSON.stringify(error))
    }

    const result = await response.json()
    const analysis = result.choices[0].message.content

    return new Response(
      JSON.stringify({
        success: true,
        analysis: analysis,
        analysisType
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error("Error in document analysis function:", error)
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
