import { z } from "zod";
import { format } from "date-fns-tz";

export const stringToBool = z
  .string()
  .toLowerCase()
  .nullish()
  .transform((x) => (x ? x === "true" : false))
  .pipe(z.boolean());

export const nullishStringToBool = z
  .string()
  .toLowerCase()
  .nullish()
  .transform((x) => !!x && x === "true")
  .pipe(z.boolean());

export const isoDate = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, { message: "Invalid date provided" })
  .transform((x) => new Date(x));
