import { AccessGrant } from "../src/data-management/data-model/access-authorization/access-grant";
import { AccessMode, DataGrant, GrantScope } from "../src/data-management/data-model/access-authorization/data-grant";
import { ApplicationAgent, SocialAgent } from "../src/data-management/data-model/agent";
import { SocialAgentRegistration } from "../src/data-management/data-model/agent-registration/social-agent-registration";
import { DataRegistration } from "../src/data-management/data-model/data-registration/data-registration";


const pmShapetrees = 'http://data.example/shapetrees/pm#';
const alice = 'https://alice.example/';
const bob = 'https://bob.example/';
const projectron = 'https://projectron.example/';
const aliceBob = 'https://alice.example/agents/c4562da9/';
const aliceWorkData = 'https://work.alice.example/data/';
const jarvis = 'https://jarvis.example/';
const bobAgents = 'https://bob.example/agents/'



const dataRegistration8501f084 = new DataRegistration(
    "8501f084",
    aliceWorkData + "8501f084",
    new SocialAgent(alice),
    new ApplicationAgent(jarvis),
    new Date("2023-10-23T10:00:00Z"),
    new Date("2020-04-04T21:11:33.000Z"),
    pmShapetrees + "ProjectTree"
);


const dataGrantb42228af = new DataGrant(
    "b42228af",
    aliceBob + "b42228af",
    aliceBob,
    new SocialAgent(alice),
    new SocialAgent(bob),
    pmShapetrees + "ProjectTree",
    dataRegistration8501f084,
    [AccessMode.Read, AccessMode.Create],
    GrantScope.AllFromRegistry,
    projectron + "#ac54ff1e",
    undefined,
    [AccessMode.Update, AccessMode.Delete]
);


const dataRegistrationdf4ab227 = new DataRegistration(
    "df4ab227/",
    aliceWorkData + "df4ab227",
    new SocialAgent(alice),
    new ApplicationAgent(jarvis),
    new Date("2020-04-04T20:15:47.000Z"),
    new Date("2020-04-04T21:11:33.000Z"),
    pmShapetrees + "TaskTree"
);


// Create an instance of DataGrant.
const dataGrant95ff7580 = new DataGrant(
    "95ff7580",
    aliceBob + "95ff7580",
    aliceBob,
    new SocialAgent(alice),
    new SocialAgent(bob),
    pmShapetrees + "TaskTree",
    dataRegistrationdf4ab227,
    [AccessMode.Read, AccessMode.Create],
    GrantScope.Inherited,
    projectron + "#9462959c",
    undefined,
    [AccessMode.Update, AccessMode.Delete],
    dataGrantb42228af
);

const hasAccessNeedGroup = "projectron:#d8219b1f";

const accessGrantb6e125b8 = new AccessGrant(
    "b6e125b8",
    new SocialAgent(alice),
    new Date("2020-04-04T20:15:47.000Z"),
    new SocialAgent(bob),
    hasAccessNeedGroup,
    [dataGrantb42228af, dataGrant95ff7580]
);

export let socialAgentRegistrationc4562da9 = new SocialAgentRegistration(
    "c4562da9/",
    new SocialAgent(alice),
    new ApplicationAgent(jarvis),
    new Date("2020-04-04T20:15:47.000Z"),
    new Date("2020-04-04T21:11:33.000Z"),
    new SocialAgent(bob),
    accessGrantb6e125b8,
    bobAgents + "255aa181/"
);