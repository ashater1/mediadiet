import { MediaType } from "@prisma/client";

export function getCoverArtUrl({
  coverArtId,
  mediaType,
}: {
  coverArtId: string;
  mediaType: MediaType;
}) {
  return mediaType === "BOOK"
    ? `https://covers.openlibrary.org/b/id/${coverArtId}-L.jpg`
    : `https://image.tmdb.org/t/p/w342${coverArtId}`;
}
