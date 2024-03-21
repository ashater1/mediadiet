import invariant from "tiny-invariant";
import { z } from "zod";

const apiKey = process.env.THE_MOVIE_DB_API_KEY;
const apiUrl = "https://api.themoviedb.org/3";

const TvSearchResultsSchema = z
  .array(
    z.object({
      id: z.number(),
      first_air_date: z.string().optional(),
      last_air_date: z.string().optional(),
      name: z.string(),
      poster_path: z.string().nullish(),
    })
  )
  .default([]);

const TvSearchSchema = z.object({
  results: TvSearchResultsSchema,
});

const MovieSearchResultsSchema = z
  .array(
    z.object({
      id: z.number(),
      poster_path: z.string().nullish(),
      release_date: z.string().nullish(),
      title: z.string().nullish(),
    })
  )
  .default([]);

const MovieSearchSchema = z.object({
  results: MovieSearchResultsSchema,
});

const MovieDetailsCrewSchema = z.object({
  id: z.number(),
  name: z.string().nullish(),
  job: z.string().nullish(),
});

export type MovieDetailsCrewType = z.infer<typeof MovieDetailsCrewSchema>;

const MovieDetailsSchema = z.object({
  id: z.number(),
  backdrop_path: z.string().nullish(),
  credits: z.object({ crew: MovieDetailsCrewSchema.array() }).nullish(),
  original_title: z.string().nullish(),
  overview: z.string().nullish(),
  poster_path: z.string().nullish(),
  release_date: z.string().nullish(),
  runtime: z.number().nullish(),
  tagline: z.string().nullish(),
  title: z.string().nullish(),
});

const TvSeasonSchema = z.object({
  id: z.coerce.string(),
  air_date: z
    .string()
    .regex(/(d{4}-d{2}-d{2})?/)
    .nullish()
    .transform((val) => val && new Date(val)),
  episode_count: z.number().nullish(),
  name: z.string().nullish(),
  poster_path: z.string().nullish(),
  season_number: z.number().nullish(),
});

const TvNetworkSchema = z.object({
  id: z.number().nullish(),
  name: z.string().nullish(),
  logo_path: z.string().nullish(),
});

const TvDetailsSchema = z.object({
  id: z.number(),
  backdrop_path: z.string().nullish(),
  first_air_date: z.string().nullish(),
  last_air_date: z.string().nullish(),
  name: z.string().nullish(),
  networks: z.array(TvNetworkSchema.nullish()).default([]),
  original_name: z.string().nullish(),
  overview: z.string().nullish(),
  poster_path: z.string().nullish(),
  seasons: z.array(TvSeasonSchema.nullish()).default([]),
  tagline: z.string().nullish(),
});

export type MovieDetailsType = z.infer<typeof MovieDetailsSchema>;
export type TvDetailsType = z.infer<typeof TvDetailsSchema>;

export type MoviesType = z.infer<typeof MovieSearchResultsSchema>;
export type TvShowsType = z.infer<typeof TvSearchResultsSchema>;

export type MovieType = MoviesType[0];
export type TvShowType = TvShowsType[0];

export type TvSeasonType = z.infer<typeof TvDetailsSchema>["seasons"];

// TODO - move these to use safeParse to support 404 responses
class MovieDb {
  constructor() {}

  async searchMovies(searchTerm: string) {
    const _searchTerm = searchTerm.trim();
    invariant(_searchTerm, "An empty string was provided as a searchTerm");

    let url = `${apiUrl}/search/movie?query=${_searchTerm}&api_key=${apiKey}&include_adult=false`;
    let response = await fetch(url);
    let body = await response.json();
    let { results } = MovieSearchSchema.parse(body);
    return results;
  }

  async searchTv(searchTerm: string) {
    if (!searchTerm || searchTerm.trim() === "")
      throw new Error("A blank or empty string was provided");

    let url = `${apiUrl}/search/tv?query=${searchTerm}&api_key=${apiKey}&include_adult=false`;
    let response = await fetch(url);
    let body = await response.json();
    let { results } = TvSearchSchema.parse(body);
    return results;
  }

  async getMovie(id: string) {
    if (!id) throw new Error("Moviedb Id is required");
    let url = `${apiUrl}/movie/${id}?api_key=${apiKey}&append_to_response=credits`;
    let response = await fetch(url);
    let body = await response.json();
    let movie = MovieDetailsSchema.parse(body);
    return movie;
  }

  async getShow(id: string) {
    if (!id) throw new Error("Moviedb Id is required");
    let url = `${apiUrl}/tv/${id}?api_key=${apiKey}&append_to_response=credits`;
    let response = await fetch(url);
    let body = await response.json();
    let result = TvDetailsSchema.parse(body);
    return result;
  }

  async getPopularMovies() {
    let url = `${apiUrl}/movie/popular?api_key=${apiKey}`;
    let response = await fetch(url);
    let body = await response.json();
    let result = MovieSearchSchema.parse(body);
    return result;
  }

  async getPopularShows() {
    let url = `${apiUrl}/tv/popular?api_key=${apiKey}`;
    let response = await fetch(url);
    let body = await response.json();
    let result = TvSearchSchema.parse(body);
    return result;
  }

  async getTopRatesMovies() {
    let url = `${apiUrl}/movie/top_rated?api_key=${apiKey}`;
    let response = await fetch(url);
    let body = await response.json();
    let result = MovieSearchSchema.safeParse(body);
    return result;
  }

  async getTopRatedShows() {
    let url = `${apiUrl}/tv/top_rated?api_key=${apiKey}`;
    let response = await fetch(url);
    let body = await response.json();
    let result = TvSearchSchema.safeParse(body);
    return result;
  }
}

export const movieDb = new MovieDb();
