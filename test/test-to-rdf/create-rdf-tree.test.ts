import { AccessGrant } from "../../src/data-management/data-model/access-authorization/access-grant"
import { SocialAgent } from "../../src/data-management/data-model/agent"
import { SocialAgentRegistration } from "../../src/data-management/data-model/agent-registration/social-agent-registration"

test(
    "Test",
    () => expect(testToRdfSocialAgentRegistration()).toBe("hello")
)

function testToRdfSocialAgentRegistration() {
    return new SocialAgentRegistration(new SocialAgent("a"), "https://jarvis.example/#id", new Date(), new Date(), "https://bob.example", new AccessGrant(), "bob-agents:255aa181\/")
}