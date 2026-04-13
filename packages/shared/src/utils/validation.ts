export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function isValidPassword(password: string): boolean {
  return password.length >= 10;
}

export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^(\+31|0)[1-9]\d{8}$/;
  return phoneRegex.test(phone.replace(/[\s\-()]/g, ''));
}

export function isValidKvkNumber(kvk: string): boolean {
  return /^\d{8}$/.test(kvk.trim());
}

export function sanitizeHtml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trimEnd() + '...';
}
