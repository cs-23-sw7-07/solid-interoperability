export function fetchResource(tempResource: string): string {
  // This should take in a URL string
  // This should use the fetch API to fetch the actual RDF online from the server
  if (tempResource == "https://projectron.example/#id") {
    return "test/rdfs-examples/parse-tests-rdfs/profile-doc-projection.ttl";
  } else if (tempResource == "https://bob.example/#id") {
    return "test/rdfs-examples/parse-tests-rdfs/profile-doc-bob.ttl";
  } else if (tempResource == "https://jarvis.example/#id") {
    return "test/rdfs-examples/parse-tests-rdfs/profile-doc-defualt.ttl";
  }
  return "";
}
