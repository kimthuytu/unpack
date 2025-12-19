export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePassword(password: string): boolean {
  // At least 8 characters
  return password.length >= 8;
}

export function validateRequired(value: any): boolean {
  return value !== null && value !== undefined && value !== '';
}



