import { MovieDetailsCrewType } from "./api";

export function getReleaseYear(release_date: string | undefined | null) {
  if (!release_date) return;
  return release_date.slice(0, 4);
}

export function getDirectors(crew: MovieDetailsCrewType[] | null | undefined) {
  if (!crew) return [];
  const assistantDirectors = crew
    .filter((member) => member.job === "Assistant Director")
    .map((assistantDirector) => {
      return { id: assistantDirector.id, name: assistantDirector.name };
    });

  const directors = crew
    .filter((member) => member.job === "Director")
    .map((director) => {
      return { id: director.id, name: director.name };
    });

  const filteredDirectors = directors.filter((director) => {
    return !assistantDirectors.some(
      (assistantDir) => director.id === assistantDir.id
    );
  });

  return filteredDirectors;
}

export function getDirectorNames(crew: MovieDetailsCrewType[] | undefined) {
  return crew;
}
