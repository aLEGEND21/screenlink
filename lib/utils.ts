import { type ClassValue, clsx } from "clsx";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Generates a random room ID of specified length
 * @param length Length of the room ID (default: 6)
 * @returns A random room ID string
 */
export function generateRoomId(length: number = 6): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Gets the full URL for a room
 * @param roomId The room ID
 * @returns The complete room URL
 */
export function getRoomUrl(roomId: string): string {
  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
  return `${baseUrl}/view?roomId=${roomId}`;
}

/**
 * Copies text to clipboard
 * @param text The text to copy
 */
export async function copyToClipboard(text: string): Promise<void> {
  try {
    await navigator.clipboard.writeText(text);
  } catch (err) {
    console.error("Failed to copy text:", err);
    throw new Error("Failed to copy to clipboard");
  }
}

/**
 * Copies a room code to clipboard
 * @param roomCode The room code to copy
 */
export async function copyRoomCode(roomCode: string): Promise<void> {
  await copyToClipboard(roomCode);
  toast.success("Room code copied to clipboard");
}

/**
 * Copies a room URL to clipboard
 * @param roomId The room ID
 */
export async function copyRoomUrl(roomId: string): Promise<void> {
  const url = getRoomUrl(roomId);
  await copyToClipboard(url);
  toast.success("Room link copied to clipboard");
}
