import { AccessGrant } from "../src/data-management/data-model/access-authorization/access-grant";
import { AccessMode, DataGrant, GrantScope } from "../src/data-management/data-model/access-authorization/data-grant";
import { ApplicationAgent, SocialAgent } from "../src/data-management/data-model/agent";
import { ApplicationRegistration } from "../src/data-management/data-model/agent-registration/application-registration";
import { SocialAgentRegistration } from "../src/data-management/data-model/agent-registration/social-agent-registration";
import { DataRegistration } from "../src/data-management/data-model/data-registration/data-registration";

const pmShapetrees = 'http://data.example/shapetrees/pm#';
const alice = 'https://alice.example';
const bob = 'https://bob.example';
const projectron = 'https://projectron.example';
const aliceBob = 'https://alice.example/agents/c4562da9';
const aliceWorkData = 'https://work.alice.example/data';
const jarvis = 'https://jarvis.example';
const bobAgents = 'https://bob.example/agents'
const aliceProjectron = 'https://alice.example/agents/2f2f3628'





export const dataRegistration8501f084 = new DataRegistration(
    "8501f084",
    aliceWorkData,
    new SocialAgent(alice),
    new ApplicationAgent(jarvis),
    new Date("2020-04-04T20:15:47.000Z"),
    new Date("2020-04-04T21:11:33.000Z"),
    pmShapetrees + "ProjectTree"
);

export const dataRegistrationdf4ab227 = new DataRegistration(
    "df4ab227",
    aliceWorkData,
    new SocialAgent(alice),
    new ApplicationAgent(jarvis),
    new Date("2020-04-04T20:15:47.000Z"),
    new Date("2020-04-04T21:11:33.000Z"),
    pmShapetrees + "TaskTree"
);










export const dataGrantb42228af = new DataGrant(
    "b42228af",
    aliceBob + "/b42228af",
    aliceBob,
    new SocialAgent(alice),
    new SocialAgent(bob),
    pmShapetrees + "ProjectTree",
    dataRegistration8501f084,
    [AccessMode.Read, AccessMode.Create],
    GrantScope.AllFromRegistry,
    projectron + "/#ac54ff1e",
    undefined,
    [AccessMode.Update, AccessMode.Delete]
);

export const dataGrant95ff7580 = new DataGrant(
    "95ff7580",
    aliceBob + "95ff7580",
    aliceBob,
    new SocialAgent(alice),
    new SocialAgent(bob),
    pmShapetrees + "TaskTree",
    dataRegistrationdf4ab227,
    [AccessMode.Read, AccessMode.Create],
    GrantScope.Inherited,
    projectron + "/#9462959c",
    undefined,
    [AccessMode.Update, AccessMode.Delete],
    dataGrantb42228af
);

export const accessGrantb6e125b8 = new AccessGrant(
    "b6e125b8",
    new SocialAgent(alice),
    new Date("2020-04-04T20:15:47.000Z"),
    new SocialAgent(bob),
    "projectron:#d8219b1f",
    [dataGrantb42228af, dataGrant95ff7580]
);

export const socialAgentRegistrationc4562da9 = new SocialAgentRegistration(
    "c4562da9",
    new SocialAgent(alice),
    new ApplicationAgent(jarvis),
    new Date("2020-04-04T20:15:47.000Z"),
    new Date("2020-04-04T21:11:33.000Z"),
    new SocialAgent(bob),
    accessGrantb6e125b8,
    bobAgents + "/255aa181/"
);










export const dataGrant40d038ea = new DataGrant(
    "40d038ea",
    aliceProjectron + "/40d038ea",
    aliceProjectron,
    new SocialAgent(alice),
    new ApplicationAgent(projectron),
    pmShapetrees + "ProjectTree",
    dataRegistration8501f084,
    [AccessMode.Read, AccessMode.Create],
    GrantScope.AllFromRegistry,
    projectron + "/#ac54ff1e",
    undefined,
    [AccessMode.Update, AccessMode.Delete],
);

export const dataGrant0945218b = new DataGrant(
    "0945218b",
    aliceProjectron + "/0945218b",
    aliceProjectron,
    new SocialAgent(alice),
    new ApplicationAgent(projectron),
    pmShapetrees + "TaskTree",
    dataRegistrationdf4ab227,
    [AccessMode.Read, AccessMode.Create],
    GrantScope.Inherited,
    projectron + "/#9462959c",
    undefined,
    [AccessMode.Update, AccessMode.Delete],
    dataGrant40d038ea
);

export const accessGrant27eae14b = new AccessGrant(
    "27eae14b",
    new SocialAgent("https://alice.example/"),
    new Date("2020-04-04T20:15:47.000Z"),
    new ApplicationAgent("https://projectron.example/"),
    "projectron:#d8219b1f",
    [
        dataGrant40d038ea,
        dataGrant0945218b,
    ]
);

export const applicationRegistration2f2f3628 = new ApplicationRegistration(
    "2f2f3628",
    new SocialAgent(alice),
    new ApplicationAgent(jarvis),
    new Date("2020-04-04T20:15:47.000Z"),
    new Date("2020-04-04T21:11:33.000Z"),
    new ApplicationAgent(projectron),
    accessGrant27eae14b
);