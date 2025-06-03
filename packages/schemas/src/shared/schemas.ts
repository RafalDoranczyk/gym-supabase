import { z } from "zod";

import { MACRO_NUMBER_MAX, MACRO_NUMBER_MIN } from "./const";
import { validationMessages } from "./validationMessages";

export const SupabaseId = z.string().uuid(validationMessages.string.required("ID"));

export const MacroNumber = z.coerce.number().min(MACRO_NUMBER_MIN).max(MACRO_NUMBER_MAX);

export const CreatedAt = z.string().refine((val) => !Number.isNaN(Date.parse(val)), {
  message: validationMessages.date.invalid("Created at"),
});

export const SearchString = z
  .string()
  .transform((val) => val.trim())
  .optional()
  .or(z.literal(""));
