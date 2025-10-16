/**
 * Validation Helpers
 *
 * Pure functions for input validation.
 * NO database access, NO ctx parameter.
 */

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return pattern.test(email);
}

/**
 * Validate todo title
 */
export function isValidTodoTitle(title: string): boolean {
  return title.trim().length > 0 && title.length <= 200;
}

/**
 * Validate todo description
 */
export function isValidTodoDescription(description: string): boolean {
  return description.length <= 2000;
}

/**
 * Validate priority value
 */
export function isValidPriority(
  priority: string
): priority is "low" | "medium" | "high" {
  return ["low", "medium", "high"].includes(priority);
}

/**
 * Validate theme value
 */
export function isValidTheme(
  theme: string
): theme is "light" | "dark" | "system" {
  return ["light", "dark", "system"].includes(theme);
}

/**
 * Validate due date (must be in the future)
 */
export function isValidDueDate(dueDate: number): boolean {
  return dueDate > Date.now();
}

/**
 * Validate tags array
 */
export function isValidTags(tags: string[]): boolean {
  return (
    Array.isArray(tags) &&
    tags.length <= 10 &&
    tags.every((tag) => tag.length > 0 && tag.length <= 50)
  );
}

/**
 * Sanitize todo title (trim and limit length)
 */
export function sanitizeTodoTitle(title: string): string {
  return title.trim().slice(0, 200);
}

/**
 * Sanitize todo description
 */
export function sanitizeTodoDescription(description: string): string {
  return description.trim().slice(0, 2000);
}

/**
 * Sanitize tags (remove duplicates, trim, limit)
 */
export function sanitizeTags(tags: string[]): string[] {
  const unique = [...new Set(tags.map((tag) => tag.trim()))];
  return unique.filter((tag) => tag.length > 0).slice(0, 10);
}
