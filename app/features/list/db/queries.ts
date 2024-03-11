import { Prisma } from "@prisma/client";

export function getTvReviewQuery(username: string) {
  return Prisma.validator<Prisma.TvReviewFindManyArgs>()({
    orderBy: [{ createdAt: "desc" }, { consumedDate: "desc" }],
    include: {
      tvSeason: {
        include: {
          tvShow: {
            include: {
              studio: true,
            },
          },
          TvReview: {
            select: {
              consumedDate: true,
            },
          },
          _count: {
            select: {
              TvReview: {
                where: {
                  user: {
                    username,
                  },
                },
              },
            },
          },
        },
      },
    },
  });
}

export function getMovieReviewQuery(username: string) {
  return Prisma.validator<Prisma.MovieReviewFindManyArgs>()({
    orderBy: [{ createdAt: "desc" }, { consumedDate: "desc" }],
    include: {
      movie: {
        include: {
          directors: true,
          MovieReview: {
            take: 1,
            select: {
              consumedDate: true,
            },
          },
          _count: {
            select: {
              MovieReview: {
                where: {
                  user: {
                    username,
                  },
                },
              },
            },
          },
        },
      },
    },
  });
}

export function getBookReviewQuery(username: string) {
  return Prisma.validator<Prisma.BookReviewFindManyArgs>()({
    orderBy: [{ createdAt: "desc" }, { consumedDate: "desc" }],
    include: {
      book: {
        include: {
          authors: true,
          BookReview: {
            take: 1,
            select: {
              consumedDate: true,
            },
          },
          _count: {
            select: {
              BookReview: {
                where: {
                  user: {
                    username,
                  },
                },
              },
            },
          },
        },
      },
    },
  });
}

export type MovieEntry = Prisma.MovieReviewGetPayload<
  ReturnType<typeof getMovieReviewQuery>
>;

export type BookEntry = Prisma.BookReviewGetPayload<
  ReturnType<typeof getBookReviewQuery>
>;

export type TvEntry = Prisma.TvReviewGetPayload<
  ReturnType<typeof getTvReviewQuery>
>;
