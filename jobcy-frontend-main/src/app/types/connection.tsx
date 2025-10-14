// src/types/connection.ts
export interface Connection {
  id: string | number;
  name: string;
  title?: string;
  experience?: string;
  education?: string;
  skills?: string[];
  status?: "seeking" | "open" | "employed";
  connected?: boolean;
}
