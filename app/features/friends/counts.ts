import { db } from "~/db.server";

export async function getCounts(username: string) {
  let data = db.user.findFirst({
    where: { username },
  });

  return data;
}
