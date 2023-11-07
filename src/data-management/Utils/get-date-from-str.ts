export function getDateFromStr(date: string): Date {
    return new Date(date.slice(1, -44))
}