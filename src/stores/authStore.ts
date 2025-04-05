
// Fake auth store minimal implementation to fix import errors
export interface User {
  id: string;
  email: string;
  company_id: string;
  name?: string;
  role?: string;
}

const mockUser: User = {
  id: "user-1",
  email: "user@example.com",
  company_id: "company-1",
  name: "John Doe",
  role: "admin"
};

export function useAuth() {
  return {
    user: mockUser,
    isAuthenticated: true,
    isLoading: false
  };
}

export function getUser(): User {
  return mockUser;
}
