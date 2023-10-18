import { z } from "zod";

const apiKey = process.env.THE_MOVIE_DB_API_KEY;
const apiUrl = "https://api.themoviedb.org/3";

const ImageSchema = z.object({
  file_path: z.string().nullish(),
  vote_average: z.number().nullish(),
});

const ImagesSchema = z.object({
  images: z
    .object({
      backdrops: z.array(ImageSchema).nullish(),
      posters: z.array(ImageSchema).nullish(),
    })
    .nullish(),
});

const VideoSchema = z.object({
  name: z.string().nullish(),
  key: z.string().nullish(),
  site: z.string().nullish(),
});

const CastSchema = z.object({
  id: z.number().nullish(),
  name: z.string().nullish(),
  profile_path: z.string().nullish(),
  character: z.string().nullish(),
  order: z.number().nullish(),
});

const CrewSchema = z.object({
  id: z.number().nullish(),
  name: z.string().nullish(),
  profile_path: z.string().nullish(),
  job: z.string().nullish(),
});

type CrewType = z.infer<typeof CrewSchema>;

const CreditsSchema = z.object({
  credits: z
    .object({
      cast: z.array(CastSchema).nullish(),
      crew: z.array(CrewSchema).nullish(),
    })
    .nullish(),
});

const DetailsSchema = z.object({
  backdrop_path: z.string().nullish(),
  overview: z.string().nullish(),
  genres: z.array(z.object({ id: z.number() })),
  id: z.number(),
  imdb_id: z.string().nullish(),
  title: z.string().nullish(),
  poster_path: z.string().nullish(),
  release_date: z.string().nullish(),
  runtime: z.number().nullish(),
  status: z
    .union([
      z.literal("Rumored"),
      z.literal("Planned"),
      z.literal("In Production"),
      z.literal("Post Production"),
      z.literal("Released"),
      z.literal("Cancelled"),
    ])
    .nullish(),
  tagline: z.string().nullish(),
});

const MovieSchema = DetailsSchema.merge(CreditsSchema).merge(ImagesSchema);

type AppendToResponse = "images" | "videos" | "credits";

class MovieDb {
  static getDirector = (credits: CrewType[] | undefined | null) => {
    if (!Array.isArray(credits)) return null;

    let assistantDirectors = credits
      .filter((credit: any) => credit.job === "Assistant Director")
      .map((credit: any) => credit.id);

    let directors = credits.filter(
      (credit: any) =>
        credit.job === "Director" && !assistantDirectors.includes(credit.id)
    );

    return directors;
  };

  constructor() {}

  async getMovie({
    movieId,
    appendToResponse = [],
  }: {
    movieId: string;
    appendToResponse?: AppendToResponse[];
  }) {
    if (!movieId) throw new Error("No movie id was provided");

    let url = `${apiUrl}/movie/${movieId}?api_key=${apiKey}`;

    if (appendToResponse.length) {
      const appendParams = appendToResponse.join(",").replace(/\s/g, "");
      url = `${url}&append_to_response=${appendParams}`;
    }

    let response = await fetch(url);
    let body = await response.json();
    let results = MovieSchema.safeParse(body);

    let director;

    if (results.success) {
      if (
        results.data.credits?.crew &&
        Array.isArray(results.data.credits?.crew)
      ) {
        director = MovieDb.getDirector(results.data.credits.crew);
      }
    }

    return { ...results, director };
  }
}

export const movieDbClient = new MovieDb();
