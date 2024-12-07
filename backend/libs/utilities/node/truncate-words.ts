/**
 * Truncate sentence words by character length
 * @param text 
 * @param maxLength 
 * @returns 
 */
export function truncateTextWords(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }

  const trimmedDesc = text.slice(0, maxLength);
  const lastSpaceIndex = trimmedDesc.lastIndexOf(' ');

  if (lastSpaceIndex === -1) {
    return trimmedDesc;
  }

  return trimmedDesc.slice(0, lastSpaceIndex).trim();
}