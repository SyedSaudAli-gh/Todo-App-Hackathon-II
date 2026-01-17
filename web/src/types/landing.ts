export interface DemoTodo {
  id: number;
  title: string;
  priority: "high" | "medium" | "low";
  completed: boolean;
}

export interface Feature {
  icon: string; // Lucide icon name
  title: string;
  description: string;
}

export interface FooterLink {
  text: string;
  href: string;
}

export interface AuthFormProps {
  mode: "signin" | "signup";
  onSubmit: (data: AuthFormData) => Promise<void>;
  loading: boolean;
  error: string | null;
}

export interface AuthFormData {
  name?: string; // Required for signup
  email: string;
  password: string;
  confirmPassword?: string; // Only for signup
}

export interface ValidationErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}
