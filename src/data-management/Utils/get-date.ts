import { InvalidDate } from "../../Errors/InvalidDate";

export function getDate(date: string): Date {
  const dateResult: Date = new Date(date);
  if (dateResult.toString() === "Invalid Date") {
    throw new InvalidDate(date + " is of invalid datetime format");
  }

  return dateResult;
}
