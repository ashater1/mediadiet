import { z } from "zod";

const DateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, { message: "Invalid date provided" })
  .transform((val) => new Date(val));

export const NewSubmissionSchema = z.object({
  id: z.string(),
  stars: z.number().int().min(1).max(5).nullish(),
  consumedDate: DateSchema,
  favorited: z.coerce.boolean(),
  review: z.string(),
});

// TODO - Fix this to use stringToBoolean util
export const NewMovieSchema = NewSubmissionSchema.merge(
  z.object({
    onPlane: z.coerce.boolean().default(false),
    inTheater: z.coerce.boolean().default(false),
  })
);

export const NewBookSchema = NewSubmissionSchema.merge(
  z.object({
    audiobook: z.coerce.boolean().default(false),
    firstPublishedYear: z
      .string()
      .regex(/^\d{4}$/)
      .nullish(),
  })
);

export const NewTvSchema = NewSubmissionSchema.merge(
  z.object({
    seasonId: z.string().regex(/^\d+$/),
  })
);
