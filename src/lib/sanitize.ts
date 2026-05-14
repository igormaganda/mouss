/**
 * Sanitization Utilities
 * Protect sensitive data and prevent injection attacks
 */

/**
 * Sanitize CV content by removing/masking sensitive information
 */
export function sanitizeCVContent(text: string): {
  sanitized: string;
  warnings: string[];
  redactedItems: RedactedItem[];
} {
  const warnings: string[] = [];
  const redactedItems: RedactedItem[] = [];
  let sanitized = text;

  // 1. Remove script tags and event handlers
  sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  sanitized = sanitized.replace(/on\w+="[^"]*"/gi, '');
  sanitized = sanitized.replace(/on\w+='[^']*'/gi, '');

  // 2. Mask French Social Security Numbers (13-15 digits)
  const ssnPattern = /(\d{1}\s?\d{2}\s?\d{2}\s?\d{2}\s?\d{3}\s?\d{3}\s?\d{2})/g;
  sanitized = sanitized.replace(ssnPattern, (match) => {
    redactedItems.push({ type: 'ssn', original: '[NUMÉRO SÉCU]' });
    warnings.push('Un numéro de sécurité sociale a été détecté et masqué');
    return '[NUMÉRO SÉCU MASQUÉ]';
  });

  // 3. Mask phone numbers (French format)
  const phonePattern = /(\+33|0)[1-9](\s?\d{2}){4}/g;
  sanitized = sanitized.replace(phonePattern, (match) => {
    redactedItems.push({ type: 'phone', original: '[TÉLÉPHONE]' });
    return '[TÉLÉPHONE MASQUÉ]';
  });

  // 4. Mask credit card numbers
  const ccPattern = /\b(\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4})\b/g;
  sanitized = sanitized.replace(ccPattern, (match) => {
    redactedItems.push({ type: 'credit_card', original: '[CARTE BANCAIRE]' });
    warnings.push('Un numéro de carte bancaire a été détecté et masqué');
    return '[CARTE MASQUÉE]';
  });

  // 5. Mask IBAN
  const ibanPattern = /[A-Z]{2}\d{2}[A-Z0-9]{4,30}/g;
  sanitized = sanitized.replace(ibanPattern, (match) => {
    if (match.length >= 15 && match.length <= 34) {
      redactedItems.push({ type: 'iban', original: '[IBAN]' });
      return '[IBAN MASQUÉ]';
    }
    return match;
  });

  // 6. Remove potential SQL injection patterns
  const sqlPatterns = [
    /('|")\s*(OR|AND)\s*\1/gi,
    /;\s*(DROP|DELETE|UPDATE|INSERT|ALTER)/gi,
    /UNION\s+SELECT/gi,
    /--\s*$/gm,
  ];
  
  for (const pattern of sqlPatterns) {
    if (pattern.test(sanitized)) {
      warnings.push('Du contenu potentiellement dangereux a été détecté et supprimé');
      sanitized = sanitized.replace(pattern, '');
    }
  }

  // 7. Remove HTML tags except allowed ones
  const allowedTags = ['p', 'br', 'b', 'i', 'u', 'strong', 'em', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4'];
  const tagPattern = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi;
  sanitized = sanitized.replace(tagPattern, (match, tag) => {
    if (allowedTags.includes(tag.toLowerCase())) {
      return match;
    }
    return '';
  });

  return { sanitized, warnings, redactedItems };
}

interface RedactedItem {
  type: 'ssn' | 'phone' | 'email' | 'credit_card' | 'iban' | 'other';
  original: string;
}

/**
 * Validate and sanitize email address
 */
export function sanitizeEmail(email: string): string | null {
  // Basic email validation
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  
  if (!emailPattern.test(email)) {
    return null;
  }

  // Convert to lowercase and trim
  return email.toLowerCase().trim();
}

/**
 * Sanitize user input text (general purpose)
 */
export function sanitizeText(text: string, options?: {
  maxLength?: number;
  allowHtml?: boolean;
  allowNewlines?: boolean;
}): string {
  const { maxLength = 10000, allowHtml = false, allowNewlines = true } = options || {};
  
  let sanitized = text;

  // Truncate if too long
  if (sanitized.length > maxLength) {
    sanitized = sanitized.slice(0, maxLength);
  }

  // Remove null bytes
  sanitized = sanitized.replace(/\0/g, '');

  // Handle HTML
  if (!allowHtml) {
    // Convert HTML entities
    sanitized = sanitized
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;');
  }

  // Handle newlines
  if (!allowNewlines) {
    sanitized = sanitized.replace(/[\r\n]/g, ' ');
  }

  return sanitized.trim();
}

/**
 * Sanitize URL
 */
export function sanitizeUrl(url: string): string | null {
  try {
    const parsed = new URL(url);
    
    // Only allow safe protocols
    const allowedProtocols = ['http:', 'https:', 'mailto:'];
    if (!allowedProtocols.includes(parsed.protocol)) {
      return null;
    }

    return parsed.toString();
  } catch {
    return null;
  }
}

/**
 * Sanitize filename
 */
export function sanitizeFilename(filename: string): string {
  // Remove path separators and null bytes
  let sanitized = filename.replace(/[\/\\:\*\?"<>\|]/g, '_');
  sanitized = sanitized.replace(/\0/g, '');
  
  // Remove leading dots (hidden files)
  sanitized = sanitized.replace(/^\.+/, '');
  
  // Limit length
  if (sanitized.length > 255) {
    const ext = sanitized.split('.').pop();
    const name = sanitized.slice(0, -(ext?.length || 0) - 1);
    sanitized = name.slice(0, 250) + '.' + ext;
  }

  return sanitized || 'unnamed';
}

/**
 * Sanitize phone number (French format)
 */
export function sanitizePhoneNumber(phone: string): string | null {
  // Remove all non-digit characters except +
  const cleaned = phone.replace(/[^\d+]/g, '');
  
  // Validate French phone number
  const patterns = [
    /^(\+33|0)[1-9]\d{8}$/, // French mobile/landline
    /^\+[\d]{10,15}$/, // International
  ];

  for (const pattern of patterns) {
    if (pattern.test(cleaned)) {
      return cleaned;
    }
  }

  return null;
}

/**
 * Check for potential phishing/malicious URLs in text
 */
export function detectMaliciousUrls(text: string): {
  hasMaliciousUrls: boolean;
  urls: string[];
  warnings: string[];
} {
  const urlPattern = /https?:\/\/[^\s<>"{}|\\^`\[\]]+/gi;
  const urls = text.match(urlPattern) || [];
  const warnings: string[] = [];
  const suspiciousPatterns = [
    /bit\.ly/i,
    /tinyurl/i,
    /goo\.gl/i,
    /t\.co/i,
    /phish/i,
    /malware/i,
    /virus/i,
  ];

  let hasMaliciousUrls = false;

  for (const url of urls) {
    try {
      const parsed = new URL(url);
      
      // Check for suspicious patterns
      for (const pattern of suspiciousPatterns) {
        if (pattern.test(url)) {
          warnings.push(`URL potentiellement suspecte détectée: ${url}`);
          hasMaliciousUrls = true;
        }
      }

      // Check for IP address instead of domain
      if (/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(parsed.hostname)) {
        warnings.push(`URL avec adresse IP détectée: ${url}`);
        hasMaliciousUrls = true;
      }
    } catch {
      warnings.push(`URL invalide détectée: ${url}`);
    }
  }

  return { hasMaliciousUrls, urls, warnings };
}

/**
 * Escape special characters for JSON output
 */
export function escapeJson(text: string): string {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r')
    .replace(/\t/g, '\\t');
}

/**
 * Log security event
 */
export function logSecurityEvent(event: {
  type: 'xss_attempt' | 'sql_injection' | 'rate_limit' | 'sensitive_data' | 'other';
  severity: 'low' | 'medium' | 'high' | 'critical';
  details: string;
  ip?: string;
  userId?: string;
}): void {
  const logEntry = {
    timestamp: new Date().toISOString(),
    ...event,
  };

  // In production, send to logging service
  console.warn('[SECURITY]', JSON.stringify(logEntry));
}
