/**
 * Utility functions for tracking items in @for loops
 * These functions help prevent Angular NG0955 warnings about duplicate keys
 */

/**
 * Tracks an item by combining its index and ID
 * @param index The index of the item in the array
 * @param item The item with an id property
 * @returns A unique string combining index and id
 */
export function trackByIndexAndId<T extends { id: string | number }>(index: number, item: T): string {
  return `${index}-${item.id}`;
}

/**
 * Tracks an item by its index when no ID is available
 * @param index The index of the item in the array
 * @returns The index as a string
 */
export function trackByIndex(index: number): string {
  return `${index}`;
}

/**
 * Tracks a primitive value (like a number or string)
 * @param index The index of the item in the array
 * @param item The primitive value
 * @returns The primitive value as a string
 */
export function trackByValue<T>(index: number, item: T): string {
  return `${item}`;
}
