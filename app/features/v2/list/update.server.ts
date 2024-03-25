import { z } from "zod";
import { db } from "~/db.server";
import { isoDate, nullishStringToBool } from "../zod/utils";

export type EntryArgs = z.infer<typeof entrySchema>;

export const entrySchema = z.object({
  audiobook: nullishStringToBool,
  consumedDate: isoDate,
  favorited: nullishStringToBool,
  id: z.string().nullish(),
  inTheater: nullishStringToBool,
  onPlane: nullishStringToBool,
  review: z.string().nullish(),
  stars: z.coerce.number().nullish(),
});

export async function updateEntry({
  audiobook,
  consumedDate,
  favorited,
  id,
  inTheater,
  onPlane,
  review,
  stars,
}: EntryArgs) {
  if (typeof id !== "string") throw new Error("id should be a string");

  const result = await db.review.update({
    where: { id },
    data: {
      audiobook,
      consumedDate,
      favorited,
      inTheater,
      onPlane,
      review,
      stars,
    },
  });

  return result;
}
