import { z } from "zod";

export const validationMessages = {
  array: {
    min: (field: string, min: number) =>
      `${field} must contain at least ${min} item${min > 1 ? "s" : ""}`,
    max: (field: string, max: number) =>
      `${field} must contain at most ${max} item${max > 1 ? "s" : ""}`,
    required: (field: string) => `${field} is required`,
  },
  date: {
    invalid: (field: string) => `${field} must be a valid date`,
  },
  enum: (field: string, values: Record<string, string>) =>
    `${field} must be one of ${Object.values(values).join(", ")}`,
  number: {
    min: (field: string, min: number) => `${field} must be at least ${min}`,
    max: (field: string, max: number) => `${field} must be at most ${max}`,
    positive: (field: string) => `${field} must be a positive number`,
    required: (field: string) => `${field} is required`,
  },
  string: {
    max: (field: string, max: number) => `${field} must be at most ${max} characters long`,
    min: (field: string, min: number) => `${field} must be at least ${min} characters long`,
    required: (field: string) => `${field} is required`,
    uuid: (field: string) => `${field} must be a valid UUID`,
  },
};

export const SupabaseId = z.string().uuid(validationMessages.string.required("ID"));

export const CreatedAt = z.string().refine((val) => !Number.isNaN(Date.parse(val)), {
  message: validationMessages.date.invalid("Created at"),
});
