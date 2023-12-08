/**
 * Represents a function that performs an HTTP fetch request.
 *
 * @param input - The URL or Request object to fetch.
 * @param init - The optional RequestInit object that allows you to control various aspects of the request.
 * @returns A Promise that resolves to the Response object representing the response to the request.
 */
export type Fetch = (
  input: RequestInfo,
  init?: RequestInit,
) => Promise<Response>;
