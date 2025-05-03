
// This edge function will check for upcoming and overdue activities
// and create notifications for users

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7'
import { format, subDays } from 'https://esm.sh/date-fns@3.6.0'

// Define headers for CORS
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Handle CORS preflight requests
Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Create Supabase client with service role key
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const now = new Date()
    
    // Check for activities due in the next day
    const tomorrow = new Date(now)
    tomorrow.setDate(tomorrow.getDate() + 1)
    
    // Format dates for query
    const nowISO = now.toISOString()
    const tomorrowISO = tomorrow.toISOString()
    
    console.log(`Checking for activities due between now (${nowISO}) and tomorrow (${tomorrowISO})`)
    
    // Get activities due in the next day that are still pending
    const { data: upcomingActivities, error: upcomingError } = await supabaseClient
      .from('sales_activities')
      .select('*, created_by(id)')
      .eq('status', 'pending')
      .gte('due_date', nowISO)
      .lte('due_date', tomorrowISO)

    if (upcomingError) {
      throw upcomingError
    }
    
    console.log(`Found ${upcomingActivities.length} upcoming activities`)
    
    // Get activities that are overdue (due_date in the past, still pending)
    const { data: overdueActivities, error: overdueError } = await supabaseClient
      .from('sales_activities')
      .select('*, created_by(id)')
      .eq('status', 'pending')
      .lt('due_date', nowISO)
    
    if (overdueError) {
      throw overdueError
    }
    
    console.log(`Found ${overdueActivities.length} overdue activities`)
    
    // Process upcoming activities
    for (const activity of upcomingActivities) {
      // Check for existing notification to avoid duplicates
      const { data: existingNotifications, error: checkError } = await supabaseClient
        .from('notifications')
        .select('id')
        .eq('related_entity_id', activity.id)
        .eq('type', 'activity_due')
        .eq('status', 'unread')
      
      if (checkError) {
        console.error(`Error checking for existing notifications: ${checkError.message}`)
        continue
      }
      
      // Only create notification if one doesn't already exist
      if (existingNotifications.length === 0) {
        const formattedDate = format(new Date(activity.due_date), 'PPp')
        
        // Check if the user has notification preferences
        const { data: preferences } = await supabaseClient
          .from('user_notification_preferences')
          .select('activity_reminders, in_app_notifications')
          .eq('user_id', activity.created_by.id)
          .maybeSingle()
        
        // Only create notification if user has reminders enabled
        if (!preferences || (preferences.activity_reminders && preferences.in_app_notifications)) {
          const { error: insertError } = await supabaseClient
            .from('notifications')
            .insert({
              title: 'Activity Due Soon',
              message: `You have a ${activity.activity_type} activity due at ${formattedDate}`,
              type: 'activity_due',
              user_id: activity.created_by.id,
              company_id: activity.company_id,
              related_entity_type: 'sales_activity',
              related_entity_id: activity.id,
              due_date: activity.due_date,
              status: 'unread'
            })
          
          if (insertError) {
            console.error(`Error creating notification: ${insertError.message}`)
          } else {
            console.log(`Created due notification for activity ${activity.id}`)
          }
        }
      }
    }
    
    // Process overdue activities
    for (const activity of overdueActivities) {
      // Check for existing notification to avoid duplicates
      const { data: existingNotifications, error: checkError } = await supabaseClient
        .from('notifications')
        .select('id')
        .eq('related_entity_id', activity.id)
        .eq('type', 'activity_overdue')
        .eq('status', 'unread')
      
      if (checkError) {
        console.error(`Error checking for existing notifications: ${checkError.message}`)
        continue
      }
      
      // Only create notification if one doesn't already exist
      if (existingNotifications.length === 0) {
        const formattedDate = format(new Date(activity.due_date), 'PPp')
        
        // Check if the user has notification preferences
        const { data: preferences } = await supabaseClient
          .from('user_notification_preferences')
          .select('activity_reminders, in_app_notifications')
          .eq('user_id', activity.created_by.id)
          .maybeSingle()
        
        // Only create notification if user has reminders enabled
        if (!preferences || (preferences.activity_reminders && preferences.in_app_notifications)) {
          const { error: insertError } = await supabaseClient
            .from('notifications')
            .insert({
              title: 'Activity Overdue',
              message: `Your ${activity.activity_type} activity was due at ${formattedDate} and is now overdue`,
              type: 'activity_overdue',
              user_id: activity.created_by.id,
              company_id: activity.company_id,
              related_entity_type: 'sales_activity',
              related_entity_id: activity.id,
              due_date: activity.due_date,
              status: 'unread'
            })
          
          if (insertError) {
            console.error(`Error creating notification: ${insertError.message}`)
          } else {
            console.log(`Created overdue notification for activity ${activity.id}`)
          }
        }
      }
    }
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        upcoming_processed: upcomingActivities.length,
        overdue_processed: overdueActivities.length
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        } 
      }
    )

  } catch (error) {
    console.error('Error processing activity reminders:', error)
    
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        } 
      }
    )
  }
})
