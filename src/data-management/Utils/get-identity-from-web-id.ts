export function getIdentityFromWebId(web_id: string): string {
  return web_id.split("/").slice(0, 3).join("/");
}
