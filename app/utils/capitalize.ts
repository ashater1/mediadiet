const capitalize = (word: string) => {
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
};

const lowerCaseWords = [
  "a",
  "an",
  "and",
  "at",
  "but",
  "by",
  "for",
  "in",
  "nor",
  "of",
  "on",
  "or",
  "so",
  "the",
  "to",
  "up",
  "yet",
];

export function titleize(title: string) {
  // This converts a string into an AP/APA standard title
  let splitTitle = title.split(" ");
  let noExtraSpaces = splitTitle.filter((word) => word !== "");
  if (!noExtraSpaces.length) return null;
  if (noExtraSpaces.length === 1) return capitalize(noExtraSpaces[0]);

  return noExtraSpaces
    .map((word, i) => {
      // Capitalize the first and last word, and any word that isn't in the lowerCaseWords array
      if (
        i === 0 ||
        i === noExtraSpaces.length - 1 ||
        !lowerCaseWords.includes(word.toLowerCase())
      ) {
        return capitalize(word);
      }
      return word.toLowerCase();
    })
    .join(" ");
}
