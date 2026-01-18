import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
type FormatType = 'date' | 'time' | 'full' | 'relative';

export function formatDateTime(
  input: string | Date | undefined, 
  type: FormatType = 'full'
): string {
  if (!input) return "N/A";

  // Handles the space between date and time in your string format
  const date = typeof input === 'string' ? new Date(input.replace(' ', 'T')) : input;
  
  if (isNaN(date.getTime())) return "Invalid Date";

  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  };

  const dateOptions: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  };

  switch (type) {
    case 'date':
      return date.toLocaleDateString('en-US', dateOptions);
    
    case 'time':
      return date.toLocaleTimeString('en-US', timeOptions);
    
    case 'full':
      return `${date.toLocaleDateString('en-US', dateOptions)} at ${date.toLocaleTimeString('en-US', timeOptions)}`;
    
    case 'relative':
      const now = new Date();
      const diffInMs = now.getTime() - date.getTime();
      const diffInMins = Math.floor(diffInMs / (1000 * 60));
      const diffInHours = Math.floor(diffInMins / 60);
      const diffInDays = Math.floor(diffInHours / 24);

      if (diffInMins < 1) return "Just now";
      if (diffInMins < 60) return `${diffInMins}m ago`;
      if (diffInHours < 24) return `${diffInHours}h ago`;
      if (diffInDays === 1) return "Yesterday";
      if (diffInDays < 7) return `${diffInDays}d ago`;
      return date.toLocaleDateString('en-US', dateOptions);

    default:
      return date.toLocaleString();
  }
}
  export  const parseUserAgent = (ua: string | undefined) => {
    if (!ua) return "Unknown Device";
    
    const osRegex = /\(([^;]+); ([^)]+)\)/;
    const browserRegex = /(Chrome|Safari|Firefox|Edge|MSIE|Trident)\/([\d.]+)/g;
    
    const osMatch = ua.match(osRegex);
    const browserMatches = Array.from(ua.matchAll(browserRegex));
    
    const browser = browserMatches.length > 1 ? browserMatches[browserMatches.length - 2] : browserMatches[0];
    
    const osName = osMatch ? osMatch[2].replace(/_/g, '.') : "Unknown OS";
    const browserName = browser ? browser[1] : "Unknown Browser";

    return `${browserName} on ${osName}`;
};