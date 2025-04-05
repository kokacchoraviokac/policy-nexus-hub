
import { supabase } from "@/integrations/supabase/client";
import { User, UserRole } from "@/types/auth";
import { toast } from "sonner";
import { MOCK_USERS } from "@/data/mockUsers";

export const fetchUserProfile = async (userId: string): Promise<User | null> => {
  try {
    // First check if this is a mock user ID
    const mockUser = MOCK_USERS.find(u => u.id === userId);
    if (mockUser) {
      return mockUser;
    }

    // Otherwise fetch from Supabase
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('name, email, role, avatar_url, company_id')
      .eq('id', userId)
      .single();

    if (error) {
      console.error("Error fetching user profile:", error);
      return null;
    }

    if (profile) {
      // Validate role
      const validRoles: UserRole[] = ['superAdmin', 'admin', 'employee', 'agent', 'client'];
      const role = validRoles.includes(profile.role as UserRole) 
        ? profile.role as UserRole 
        : 'employee';
      
      return {
        id: userId,
        name: profile.name,
        email: profile.email,
        role: role,
        avatar: profile.avatar_url,
        companyId: profile.company_id,
      };
    }
    
    return null;
  } catch (err) {
    console.error("Error in profile fetch:", err);
    return null;
  }
};

export const updateUserProfile = async (
  userId: string,
  userData: Partial<User>
): Promise<boolean> => {
  try {
    // Check if updating a mock user
    const mockUserIndex = MOCK_USERS.findIndex(u => u.id === userId);
    if (mockUserIndex >= 0) {
      // Update the mock user in memory
      // Note: This won't persist across page refreshes
      MOCK_USERS[mockUserIndex] = {
        ...MOCK_USERS[mockUserIndex],
        ...userData
      };
      toast.success("Profile updated successfully (mock user)");
      return true;
    }

    // Otherwise, update in Supabase
    const { error } = await supabase
      .from('profiles')
      .update({
        name: userData.name,
        avatar_url: userData.avatar,
        ...(userData.role && { role: userData.role }),
        ...(userData.companyId && { company_id: userData.companyId }),
      })
      .eq('id', userId);
    
    if (error) {
      console.error("Error updating profile:", error);
      toast.error(`Failed to update profile: ${error.message}`);
      return false;
    }
    
    toast.success("Profile updated successfully");
    return true;
  } catch (error) {
    console.error("Error updating user:", error);
    toast.error("Failed to update profile");
    return false;
  }
};

// Ensure profile creation with proper defaults when needed
export const ensureUserProfile = async (userId: string, userData: Partial<User>): Promise<boolean> => {
  try {
    // Check if this is a mock user ID
    const mockUser = MOCK_USERS.find(u => u.id === userId);
    if (mockUser) {
      // Mock users already have profiles
      return true;
    }
    
    // First check if profile exists
    const { data: existingProfile, error: checkError } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', userId)
      .single();
      
    if (checkError && checkError.code !== 'PGRST116') {
      // Some error other than "not found"
      console.error("Error checking for existing profile:", checkError);
      return false;
    }
    
    // If profile exists, no need to create
    if (existingProfile) {
      return true;
    }
    
    // Profile doesn't exist, create it
    const { error: insertError } = await supabase
      .from('profiles')
      .insert({
        id: userId,
        name: userData.name || 'User',
        email: userData.email || '',
        role: userData.role || 'employee',
        avatar_url: userData.avatar,
        company_id: userData.companyId,
      });
      
    if (insertError) {
      console.error("Error creating user profile:", insertError);
      return false;
    }
    
    console.log("Profile created successfully for user:", userId);
    return true;
  } catch (error) {
    console.error("Error in profile creation process:", error);
    return false;
  }
};
