import {fetch} from "solid-auth-fetcher";
import N3 from "n3";
import {URL} from "url";
import {ISocialAgent} from "./SocialAgent";
import {NotImplementedYet} from "../Errors/NotImplementedYet";
import {Authorization, AuthService} from "./Authorization";


export class Rdf {
    constructor(private quads: N3.Quad[]) {}

    get Quads(){
        return this.quads
    }
}

export class ProfileDocument extends Rdf implements ISocialAgent{
   
   static async fetch(webId: URL) {
       const response = await fetch(webId.toString(), {
           headers: { "Content-Type": "text/turtle" },
       });
       const profile = await response.text();

       const parser = new N3.Parser();

       return new ProfileDocument(parser.parse(profile));

   }

   get Authorization(){
      const agentUrl =  this.Quads.find(
          (x) =>
              x.predicate.value ==
              "http://www.w3.org/ns/solid/interop#hasAuthorizationAgent",
      )?.object.value;
      if (agentUrl == undefined){
          throw Error("The identity described by this profile document does not have any authorization agent.")
      }
      const agent = new Authorization(this, new AuthService(new URL(agentUrl)))
      return agent;
   }

   get WebId(){
       const id =  this.Quads.find(
           (x) =>
               x.object.value ==
               "http://xmlns.com/foaf/0.1/Person",
       )?.subject.value;
       if (id == undefined){
           throw new Error("Did not find WebId in profile document.")
       }
       return new URL(id);
   }
   static new(webId: URL, pod: URL){
       const webIdQuad = new N3.Quad(
           new N3.NamedNode(webId.toString()),
           new N3.NamedNode("http://www.w3.org/1999/02/22-rdf-syntax-ns#type"),
           new N3.NamedNode("http://xmlns.com/foaf/0.1/Person")
       )

       return new ProfileDocument([webIdQuad])
   }

    get Pod(): URL {
        throw new NotImplementedYet()
    }
}

