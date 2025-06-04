import { z } from "zod";

import { validationMessages } from "./validationMessages";

export const SupabaseId = z.string().uuid(validationMessages.string.required("ID"));

export const CreatedAt = z.string().refine((val) => !Number.isNaN(Date.parse(val)), {
  message: validationMessages.date.invalid("Created at"),
});
