import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { toast } from "sonner";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Copies the room code to clipboard
 * @param roomCode The room code to copy
 * @returns Promise that resolves when the copy is complete
 */
export const copyRoomCode = async (roomCode: string): Promise<void> => {
  try {
    await navigator.clipboard.writeText(roomCode);
    toast.success("Room code copied to clipboard");
  } catch (err) {
    console.error("Failed to copy room code:", err);
    throw new Error("Failed to copy room code to clipboard");
  }
};

/**
 * Copies the room URL to clipboard
 * @param roomCode The room code to generate the URL from
 * @returns Promise that resolves when the copy is complete
 */
export const copyRoomUrl = async (roomCode: string): Promise<void> => {
  try {
    const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
    const roomUrl = `${baseUrl}/view/${roomCode}`;
    await navigator.clipboard.writeText(roomUrl);
    toast.success("Room link copied to clipboard");
  } catch (err) {
    console.error("Failed to copy room link:", err);
    throw new Error("Failed to copy room link to clipboard");
  }
};

/**
 * Generates the room URL from a room code
 * @param roomCode The room code to generate the URL from
 * @returns The complete room URL
 */
export const getRoomUrl = (roomCode: string): string => {
  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
  return `${baseUrl}/view/${roomCode}`;
};
