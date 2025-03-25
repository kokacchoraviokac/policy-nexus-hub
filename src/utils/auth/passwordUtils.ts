
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const initiatePasswordReset = async (email: string): Promise<boolean> => {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + '/reset-password',
    });
    
    if (error) {
      console.error("Error initiating password reset:", error);
      toast.error("Failed to send password reset email");
      return false;
    }
    
    toast.success("Password reset email sent");
    return true;
  } catch (error) {
    console.error("Error in password reset:", error);
    toast.error("Failed to send password reset email");
    return false;
  }
};

export const updatePassword = async (newPassword: string): Promise<boolean> => {
  try {
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });
    
    if (error) {
      console.error("Error updating password:", error);
      toast.error("Failed to update password");
      return false;
    }
    
    toast.success("Password updated successfully");
    return true;
  } catch (error) {
    console.error("Error in password update:", error);
    toast.error("Failed to update password");
    return false;
  }
};
