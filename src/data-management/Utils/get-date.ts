export function getDate(date: string): Date {
  const regex =
    /^"([^"]+)"\^\^http:\/\/www\.w3\.org\/2001\/XMLSchema#dateTime$/;
  const match = date.match(regex);

  if (!match) {
    throw new Error("Invalid datetime format");
  }

  return new Date(match[1]);
  //return new Date(date.slice(1, -44));
}
