export const validationMessages = {
  date: {
    invalid: (field: string) => `${field} must be a valid date`,
  },
  enum: (field: string, values: Record<string, string>) =>
    `${field} must be one of ${Object.values(values).join(", ")}`,
  number: {
    min: (field: string, min: number) => `${field} must be at least ${min}`, // skrócone
    max: (field: string, max: number) => `${field} must be at most ${max}`, // skrócone
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
