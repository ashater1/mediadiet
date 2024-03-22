import { Prisma } from "@prisma/client";

type Book = Prisma.MediaItemCreateArgs["data"];
