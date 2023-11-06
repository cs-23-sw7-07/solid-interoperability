import { ApplicationAgent, SocialAgent } from "../src/data-management/data-model/agent";
import { ApplicationRegistration } from "../src/data-management/data-model/agent-registration/application-registration";
import { SocialAgentRegistration } from "../src/data-management/data-model/agent-registration/social-agent-registration";
import { AccessAuthorization } from "../src/data-management/data-model/authorization/access-auhorization";
import { AccessGrant } from "../src/data-management/data-model/authorization/access-grant";
import { AccessMode } from "../src/data-management/data-model/authorization/access-mode";
import { DataAuthorization } from "../src/data-management/data-model/authorization/data-authorization";
import { DataGrant } from "../src/data-management/data-model/authorization/data-grant";
import { GrantScope } from "../src/data-management/data-model/authorization/grant-scope";
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
const aliceauthorization = 'https://alice.example/authorization'




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

export const dataGrant2aa21a8c = new DataGrant(
    "2aa21a8c",
    aliceBob + "/2aa21a8c",
    aliceBob,
    new SocialAgent(alice),
    new SocialAgent(bob),
    pmShapetrees + "ProjectTree",
    dataRegistration8501f084,
    [AccessMode.Read, AccessMode.Create],
    GrantScope.SelectedFromRegistry,
    projectron + "/#ac54ff1e",
    ["https://work.alice.example/data/8501f084/16e1eae9", "https://work.alice.example/data/8501f084/886785d2"],
    [AccessMode.Update, AccessMode.Delete]
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
    aliceBob,
    new SocialAgent(alice),
    new Date("2020-04-04T20:15:47.000Z"),
    new SocialAgent(bob),
    projectron + "/#d8219b1f",
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








export const dataGrant23hj244 = new DataGrant(
    "23hj244",
    aliceProjectron + "/23hj244",
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

export const dataAuthorization54a1b6a0 = new DataAuthorization(
    "54a1b6a0",
    aliceauthorization,
    new SocialAgent(alice),
    new ApplicationAgent(projectron),
    pmShapetrees + "ProjectTree",
    dataRegistration8501f084,
    [AccessMode.Read, AccessMode.Create],
    GrantScope.All,
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

export const dataAuthorization0e4cb692 = new DataAuthorization(
    "0e4cb692",
    aliceauthorization,
    new SocialAgent(alice),
    new ApplicationAgent(projectron),
    pmShapetrees + "TaskTree",
    dataRegistrationdf4ab227,
    [AccessMode.Read, AccessMode.Create],
    GrantScope.Inherited,
    projectron + "/#9462959c",
    undefined,
    [AccessMode.Update, AccessMode.Delete],
    dataAuthorization54a1b6a0
)

export const accessGrant27eae14b = new AccessGrant(
    "27eae14b",
    aliceProjectron,
    new SocialAgent(alice),
    new Date("2020-04-04T20:15:47.000Z"),
    new ApplicationAgent(projectron),
    projectron + "/#d8219b1f",
    [
        dataGrant40d038ea,
        dataGrant0945218b,
    ]
);

export const accessAuthorizatione2765d6c = new AccessAuthorization(
    "e2765d6c",
    new SocialAgent(alice),
    new ApplicationAgent(jarvis),
    new Date("2020-04-04T20:15:47.000Z"),
    new ApplicationAgent(projectron),
    projectron + "/#d8219b1f",
    [
        dataAuthorization54a1b6a0,
        dataAuthorization0e4cb692,
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


export const accessAuthorizatione47e07897 = new AccessAuthorization(
    "47e07897",
    new SocialAgent(alice),
    new ApplicationAgent(jarvis),
    new Date("2020-09-05T06:15:01.000Z"),
    new ApplicationAgent(jarvis),
    jarvis + "/#4fd1482d",
    [
        dataAuthorization0e4cb692
    ]
);


export const accessAuthorizationd577d117 = new AccessAuthorization(
    "d577d117",
    new SocialAgent(alice),
    new ApplicationAgent(jarvis),
    new Date("2020-09-05T06:15:01.000Z"),
    new ApplicationAgent(jarvis),
    jarvis + "/#4fd1482d",
    [
        dataAuthorization0e4cb692
    ]
);