/**
 * Form Validation Utilities
 */

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Validate email format
 */
export function validateEmail(email: string): ValidationResult {
  if (!email) {
    return { isValid: false, error: "Email is required" };
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, error: "Invalid email format" };
  }
  
  return { isValid: true };
}

/**
 * Validate password strength
 */
export function validatePassword(password: string): ValidationResult {
  if (!password) {
    return { isValid: false, error: "Password is required" };
  }
  
  if (password.length < 8) {
    return { isValid: false, error: "Password must be at least 8 characters" };
  }
  
  if (!/[A-Z]/.test(password)) {
    return { isValid: false, error: "Password must contain an uppercase letter" };
  }
  
  if (!/[a-z]/.test(password)) {
    return { isValid: false, error: "Password must contain a lowercase letter" };
  }
  
  if (!/[0-9]/.test(password)) {
    return { isValid: false, error: "Password must contain a number" };
  }
  
  return { isValid: true };
}

/**
 * Validate confirm password matches
 */
export function validateConfirmPassword(
  password: string,
  confirmPassword: string
): ValidationResult {
  if (!confirmPassword) {
    return { isValid: false, error: "Please confirm your password" };
  }
  
  if (password !== confirmPassword) {
    return { isValid: false, error: "Passwords do not match" };
  }
  
  return { isValid: true };
}

/**
 * Validate full name
 */
export function validateName(name: string): ValidationResult {
  if (!name) {
    return { isValid: false, error: "Name is required" };
  }
  
  if (name.trim().length < 2) {
    return { isValid: false, error: "Name must be at least 2 characters" };
  }
  
  return { isValid: true };
}
