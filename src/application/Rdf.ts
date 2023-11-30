import {fetch} from "solid-auth-fetcher";
import N3 from "n3";
import {URL} from "url";
import {Authorization, AuthService} from "./Authorization";


export class Rdf {
    constructor(private quads: N3.Quad[]) {}

    get Quads(){
        return this.quads
    }
}

export class ProfileDocument extends Rdf{
   static async fetch(webId: URL) {
       const response = await fetch(webId.toString(), {
           headers: { "Content-Type": "text/turtle" },
       });
       const profile = await response.text();

       const parser = new N3.Parser();

       return new ProfileDocument(parser.parse(profile));

   }
   get AuthorizationAgent(){
      const agentUrl =  this.Quads.find(
          (x) =>
              x.predicate.value ==
              "http://www.w3.org/ns/solid/interop#hasAuthorizationAgent",
      )?.object.value;
      if (agentUrl == undefined){
          throw Error("The identity described by this profile document does not have any authorization agent.")
      }
      const agent = new Authorization(this, new URL(agentUrl))
      return agent;
   }
   get WebId(){
       return this.Quads.find(
           (x) =>
               x.object.value ==
               "http://xmlns.com/foaf/0.1/Person",
       )?.subject.value;
   }
}

