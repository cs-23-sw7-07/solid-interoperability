import { ProfileDocument } from "./Rdf";

test("getPodTest", async () => {
  const pd = await ProfileDocument.fetch(
    new URL("http://localhost:3000/weed/profile/card#me"),
  );
  expect(pd.Pod.href).toBe("http://localhost:3000/weed/");
});
