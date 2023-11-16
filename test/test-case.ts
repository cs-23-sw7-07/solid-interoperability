import {ApplicationAgent, SocialAgent} from "../src/data-management/data-model/agent";
import {ApplicationRegistration} from "../src/data-management/data-model/agent-registration/application-registration";
import {SocialAgentRegistration} from "../src/data-management/data-model/agent-registration/social-agent-registration";
import {AccessAuthorization} from "../src/data-management/data-model/authorization/access-auhorization";
import {AccessGrant} from "../src/data-management/data-model/authorization/access-grant";
import {AccessMode} from "../src/data-management/data-model/authorization/access-mode";
import {DataAuthorization} from "../src/data-management/data-model/authorization/data-authorization";
import {DataGrant} from "../src/data-management/data-model/authorization/data-grant";
import {GrantScope} from "../src/data-management/data-model/authorization/grant-scope";
import {DataRegistration} from "../src/data-management/data-model/data-registration/data-registration";

const pmShapetrees = 'http://data.example/shapetrees/pm#';
const alice = 'https://alice.example';
const bob = 'https://bob.example';
const projectron = 'https://projectron.example';
const jarvis = 'https://jarvis.example';
const bobAgents = 'https://bob.example/agents'

const aliceID = new SocialAgent(alice + '/#id')
const bobID = new SocialAgent(bob + '/#id')
const jarvisID = new ApplicationAgent(jarvis + '/#id')
const projectronID = new ApplicationAgent(projectron + '/#id')

export const dataRegistration8501f084 = new DataRegistration(
    "https://work.alice.example/data/8501f084/",
    aliceID,
    jarvisID,
    new Date("2020-04-04T20:15:47.000Z"),
    new Date("2020-04-04T21:11:33.000Z"),
    pmShapetrees + "ProjectTree"
);

export const dataRegistrationdf4ab227 = new DataRegistration(
    "https://work.alice.example/data/df4ab227/",
    aliceID,
    jarvisID,
    new Date("2020-04-04T20:15:47.000Z"),
    new Date("2020-04-04T21:11:33.000Z"),
    pmShapetrees + "TaskTree"
);

export const dataGrant2aa21a8c = new DataGrant(
    "https://alice.example/agents/c4562da9/2aa21a8c",
    aliceID,
    bobID,
    pmShapetrees + "ProjectTree",
    dataRegistration8501f084,
    [AccessMode.Read, AccessMode.Create],
    GrantScope.SelectedFromRegistry,
    projectron + "/#ac54ff1e",
    ["https://work.alice.example/data/8501f084/16e1eae9", "https://work.alice.example/data/8501f084/886785d2"],
    [AccessMode.Update, AccessMode.Delete]
);

export const dataAuthorization23a123bd = new DataAuthorization(
    "https://alice.example/authorization/23a123bd",
    aliceID,
    bobID,
    pmShapetrees + "ProjectTree",
    dataRegistration8501f084,
    [AccessMode.Read, AccessMode.Create],
    GrantScope.SelectedFromRegistry,
    projectron + "/#ac54ff1e",
    ["https://work.alice.example/data/8501f084/16e1eae9", "https://work.alice.example/data/8501f084/886785d2"],
    [AccessMode.Update, AccessMode.Delete],
);

export const dataGrantb42228af = new DataGrant(
    "https://alice.example/agents/c4562da9/b42228af",
    aliceID,
    bobID,
    pmShapetrees + "ProjectTree",
    dataRegistration8501f084,
    [AccessMode.Read, AccessMode.Create],
    GrantScope.AllFromRegistry,
    projectron + "/#ac54ff1e",
    undefined,
    [AccessMode.Update, AccessMode.Delete]
);

export const dataGrant95ff7580 = new DataGrant(
    "https://alice.example/agents/c4562da9/95ff7580",
    aliceID,
    bobID,
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
    "https://alice.example/agents/c4562da9/b6e125b8",
    aliceID,
    new Date("2020-04-04T20:15:47.000Z"),
    bobID,
    projectron + "/#d8219b1f",
    [dataGrantb42228af, dataGrant95ff7580]
);

export const socialAgentRegistrationc4562da9 = new SocialAgentRegistration(
    "https://alice.example/agents/c4562da9/",
    aliceID,
    jarvisID,
    new Date("2020-04-04T20:15:47.000Z"),
    new Date("2020-04-04T21:11:33.000Z"),
    bobID,
    accessGrantb6e125b8,
    bobAgents + "/255aa181/"
);


export const dataGrant23hj244 = new DataGrant(
    "23hj244",
    aliceID,
    projectronID,
    pmShapetrees + "ProjectTree",
    dataRegistration8501f084,
    [AccessMode.Read, AccessMode.Create],
    GrantScope.AllFromRegistry,
    projectron + "/#ac54ff1e",
    undefined,
    [AccessMode.Update, AccessMode.Delete],
);

export const dataGrant40d038ea = new DataGrant(
    "https://alice.example/agents/2f2f3628/40d038ea",
    aliceID,
    projectronID,
    pmShapetrees + "ProjectTree",
    dataRegistration8501f084,
    [AccessMode.Read, AccessMode.Create],
    GrantScope.AllFromRegistry,
    projectron + "/#ac54ff1e",
    undefined,
    [AccessMode.Update, AccessMode.Delete],
);

export const dataAuthorization54a1b6a0 = new DataAuthorization(
    "https://alice.example/authorization/54a1b6a0",
    aliceID,
    projectronID,
    pmShapetrees + "ProjectTree",
    dataRegistration8501f084,
    [AccessMode.Read, AccessMode.Create],
    GrantScope.All,
    projectron + "/#ac54ff1e",
    undefined,
    [AccessMode.Update, AccessMode.Delete],
);

export const dataGrant0945218b = new DataGrant(
    "https://alice.example/agents/2f2f3628/0945218b",
    aliceID,
    projectronID,
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
    "https://alice.example/authorization/0e4cb692",
    aliceID,
    projectronID,
    pmShapetrees + "TaskTree",
    dataRegistrationdf4ab227,
    [AccessMode.Read, AccessMode.Create],
    GrantScope.Inherited,
    projectron + "/#9462959c",
    undefined,
    [AccessMode.Update, AccessMode.Delete],
    dataAuthorization54a1b6a0
)

export const dataAuthorization0e4cb692Parse = new DataAuthorization(
    "https://alice.example/authorization/0e4cb692",
    aliceID,
    projectronID,
    pmShapetrees + "TaskTree",
    dataRegistrationdf4ab227,
    [AccessMode.Read, AccessMode.Create, AccessMode.Write, AccessMode.Append],
    GrantScope.Inherited,
    projectron + "/#9462959c",
    undefined,
    [AccessMode.Update, AccessMode.Delete],
    dataAuthorization54a1b6a0
)

export const dataAuthorization0e4cb692ParseSocialAgentGrantee = new DataAuthorization(
    "https://alice.example/authorization/0e4cb692",
    aliceID,
    bobID,
    pmShapetrees + "TaskTree",
    dataRegistrationdf4ab227,
    [AccessMode.Read, AccessMode.Create, AccessMode.Write, AccessMode.Append],
    GrantScope.Inherited,
    projectron + "/#9462959c",
    undefined,
    [AccessMode.Update, AccessMode.Delete],
    dataAuthorization54a1b6a0
)

export const dataAuthorization0e4cb692ScopeOfAuthAllFromAgent = new DataAuthorization(
    "https://alice.example/authorization/0e4cb692",
    aliceID,
    projectronID,
    pmShapetrees + "TaskTree",
    dataRegistrationdf4ab227,
    [AccessMode.Read, AccessMode.Create],
    GrantScope.AllFromAgent,
    projectron + "/#9462959c",
    undefined,
    [AccessMode.Update, AccessMode.Delete],
    dataAuthorization54a1b6a0
)

export const dataAuthorization0e4cb692ScopeOfAuthAllFromRegistry = new DataAuthorization(
    "https://alice.example/authorization/0e4cb692",
    aliceID,
    projectronID,
    pmShapetrees + "TaskTree",
    dataRegistrationdf4ab227,
    [AccessMode.Read, AccessMode.Create],
    GrantScope.AllFromRegistry,
    projectron + "/#9462959c",
    undefined,
    [AccessMode.Update, AccessMode.Delete],
    dataAuthorization54a1b6a0
)

export const dataAuthorization0e4cb692ScopeOfAuthSelectedFromRegistry = new DataAuthorization(
    "https://alice.example/authorization/0e4cb692",
    aliceID,
    projectronID,
    pmShapetrees + "TaskTree",
    dataRegistrationdf4ab227,
    [AccessMode.Read, AccessMode.Create],
    GrantScope.SelectedFromRegistry,
    projectron + "/#9462959c",
    undefined,
    [AccessMode.Update, AccessMode.Delete],
    dataAuthorization54a1b6a0
)

export const accessGrant27eae14b = new AccessGrant(
    "https://alice.example/agents/2f2f3628/27eae14b",
    aliceID,
    new Date("2020-04-04T20:15:47.000Z"),
    projectronID,
    projectron + "/#d8219b1f",
    [
        dataGrant40d038ea,
        dataGrant0945218b,
    ]
);

export const accessAuthorizatione2765d6d = new AccessAuthorization(
    "https://alice.example/authorization/e2765d6d",
    aliceID,
    jarvisID,
    new Date("2020-03-04T20:15:47.000Z"),
    projectronID,
    projectron + "/#d8219b1f",
    [
        dataAuthorization54a1b6a0
    ]
);

export const accessAuthorizatione2765d6c = new AccessAuthorization(
    "https://alice.example/authorization/e2765d6c",
    aliceID,
    jarvisID,
    new Date("2020-04-04T20:15:47.000Z"),
    projectronID,
    projectron + "/#d8219b1f",
    [
        dataAuthorization54a1b6a0,
        dataAuthorization0e4cb692,
    ],
    accessAuthorizatione2765d6d
);

export const applicationRegistration2f2f3628 = new ApplicationRegistration(
    "https://alice.example/agents/2f2f3628/",
    aliceID,
    jarvisID,
    new Date("2020-04-04T20:15:47.000Z"),
    new Date("2020-04-04T21:11:33.000Z"),
    projectronID,
    accessGrant27eae14b
);


export const accessAuthorizatione47e07897 = new AccessAuthorization(
    "https://alice.example/authorization/47e07897",
    aliceID,
    jarvisID,
    new Date("2020-09-05T06:15:01.000Z"),
    jarvisID,
    jarvis + "/#4fd1482d",
    [
        dataAuthorization0e4cb692
    ]
);

export const accessAuthorizatione47e07897Parse = new AccessAuthorization(
    "https://alice.example/authorization/47e07897",
    aliceID,
    jarvisID,
    new Date("2020-09-05T06:15:01.000Z"),
    jarvisID,
    jarvis + "/#4fd1482d",
    [
        dataAuthorization0e4cb692Parse
    ]
);

