import { z } from "zod";
import { db } from "~/db.server";
import { isoDate, nullishStringToBool } from "../zod/utils";
import { CoreAddToListSchema } from "./add.server";

export type EntryArgs = z.infer<typeof entrySchema>;

export const entrySchema = CoreAddToListSchema.merge(
  z.object({
    id: z.string(),
  })
);

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
