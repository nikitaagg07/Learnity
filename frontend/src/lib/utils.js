import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// tailwind class merge helper
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// 👇 Add these utility functions

export function getAvatarColor(name) {
  const colors = ["bg-red-500", "bg-green-500", "bg-blue-500", "bg-yellow-500"];
  let index = name.charCodeAt(0) % colors.length;
  return colors[index];
}

export function getInitials(name) {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

export function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString();
}

export function formatTime(dateStr) {
  return new Date(dateStr).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}
