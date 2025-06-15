export interface SupabaseConfig {
  url: string;
  key: string;
}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export type SupabaseErrorMapper<T> = (error: any) => T;
