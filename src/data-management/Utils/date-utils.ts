export function toXsdDateTime(date: Date) {
  return `"${date.toISOString()}"^^xsd:dateTime`;
}
