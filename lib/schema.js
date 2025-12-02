import { z } from "zod";

export const accountSchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.enum(["CURRENT", "SAVINGS"]),
  // accept string or number and coerce to number
  balance: z
    .union([z.string(), z.number()])
    .transform((v) => (typeof v === "string" ? parseFloat(v) : v))
    .refine((n) => Number.isFinite(n) && n >= 0, {
      message: "Initial balance must be a non-negative number",
    }),
  isDefault: z.boolean().default(false),
});

export const transactionSchema = z
  .object({
    type: z.enum(["INCOME", "EXPENSE"]),
    // accept string or number and coerce to number
    amount: z
      .union([z.string(), z.number()])
      .transform((v) => (typeof v === "string" ? parseFloat(v) : v))
      .refine((n) => Number.isFinite(n) && n > 0, {
        message: "Amount must be a positive number",
      }),
    description: z.string().optional().nullable(),
    // accept Date or string and coerce to Date
    date: z
      .union([z.date(), z.string()])
      .transform((d) => (typeof d === "string" ? new Date(d) : d))
      .refine((d) => d instanceof Date && !Number.isNaN(d.getTime()), {
        message: "Invalid date",
      }),
    accountId: z.string().min(1, "Account is required"),
    category: z.string().min(1, "Category is required"),
    isRecurring: z.boolean().default(false),
    recurringInterval: z
      .enum(["DAILY", "WEEKLY", "MONTHLY", "YEARLY"])
      .optional()
      .nullable(),
  })
  .superRefine((data, ctx) => {
    if (data.isRecurring && !data.recurringInterval) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Recurring interval is required for recurring transactions",
        path: ["recurringInterval"],
      });
    }
  });

export default { accountSchema, transactionSchema };
