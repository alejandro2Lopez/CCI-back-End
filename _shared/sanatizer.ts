// sanitizer.ts
import validator from 'https://esm.sh/validator@13.9.0';
import xss from 'https://esm.sh/xss@1.0.14';

export function sanitizeString(value: string): string {
  const trimmed = validator.trim(value);
  const noXSS = xss(trimmed);
  return validator.escape(noXSS);
}

export function sanitizeDeep<T = any>(input: T): T {
  if (typeof input === 'string') {
    return sanitizeString(input) as T;
  }

  if (
    typeof input === 'number' ||
    typeof input === 'boolean' ||
    input === null ||
    input === undefined
  ) {
    return input;
  }

  if (Array.isArray(input)) {
    return input.map(sanitizeDeep) as T;
  }

  if (typeof input === 'object') {
    const sanitized: Record<string, any> = {};
    for (const key in input) {
      if (Object.prototype.hasOwnProperty.call(input, key)) {
        sanitized[key] = sanitizeDeep(input[key]);
      }
    }
    return sanitized as T;
  }

  return undefined as unknown as T;
}
