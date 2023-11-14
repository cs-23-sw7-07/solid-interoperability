import { InvalidDate } from "../../Errors/InvalidDate";

export function getDate(date: string): Date {
  const regex =
    /^"([^"]+)"\^\^http:\/\/www\.w3\.org\/2001\/XMLSchema#dateTime$/;
  const match = date.match(regex);

  if (!match) {
    throw new InvalidDate("Could not match datetime");
  }

  const dateResult: Date = new Date(match[1]);
  if (dateResult.toString() === "Invalid Date") {
    throw new InvalidDate(date + " is of invalid datetime format");
  }

  return dateResult;
}
