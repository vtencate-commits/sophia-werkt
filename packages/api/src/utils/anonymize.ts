const PLACEHOLDER_EMAIL = '[EMAIL]';
const PLACEHOLDER_BSN = '[BSN]';
const PLACEHOLDER_PHONE = '[TELEFOON]';

const ANONYMIZATION_MAP = new Map<string, string>();

export function anonymizeText(text: string): string {
  let result = text;

  // Anonymize email addresses
  const emailRegex = /[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+/gi;
  result = result.replace(emailRegex, (email) => {
    if (!ANONYMIZATION_MAP.has(email)) {
      ANONYMIZATION_MAP.set(email, `${PLACEHOLDER_EMAIL}${ANONYMIZATION_MAP.size}`);
    }
    return ANONYMIZATION_MAP.get(email)!;
  });

  // Anonymize BSN numbers (9 digits)
  const bsnRegex = /\b\d{3}\s?\d{2}\s?\d{3}\b/g;
  result = result.replace(bsnRegex, (bsn) => {
    const normalized = bsn.replace(/\s/g, '');
    if (!ANONYMIZATION_MAP.has(normalized)) {
      ANONYMIZATION_MAP.set(normalized, `${PLACEHOLDER_BSN}${ANONYMIZATION_MAP.size}`);
    }
    return ANONYMIZATION_MAP.get(normalized)!;
  });

  // Anonymize phone numbers (various formats)
  const phoneRegex = /(\+31|0031|0)(6|612|4)\s?[\d\s\-()]{7,}/gi;
  result = result.replace(phoneRegex, (phone) => {
    const normalized = phone.replace(/[\s\-()]/g, '');
    if (!ANONYMIZATION_MAP.has(normalized)) {
      ANONYMIZATION_MAP.set(normalized, `${PLACEHOLDER_PHONE}${ANONYMIZATION_MAP.size}`);
    }
    return ANONYMIZATION_MAP.get(normalized)!;
  });

  return result;
}

export function deAnonymizeText(text: string): string {
  let result = text;

  ANONYMIZATION_MAP.forEach((placeholder, original) => {
    result = result.replace(new RegExp(placeholder, 'g'), original);
  });

  return result;
}

export function clearAnonymizationMap(): void {
  ANONYMIZATION_MAP.clear();
}

export function getAnonymizationMap(): Map<string, string> {
  return new Map(ANONYMIZATION_MAP);
}
