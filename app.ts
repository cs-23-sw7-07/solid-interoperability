import { getAuthenticatedSession, getNodeTestingEnvironment, getPodRoot } from '@inrupt/internal-test-env';  



async function a() {
  const env = getNodeTestingEnvironment()
  const session = await getAuthenticatedSession(env);
  const pod = await getPodRoot(session);
  console.log(pod)

  getResource(Registration)
}

a()