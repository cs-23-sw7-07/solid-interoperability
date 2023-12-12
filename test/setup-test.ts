import { copyContentOfFolder } from "./Utils/folder-management";

export default async function(): Promise<void> {
    await copyContentOfFolder(__dirname + "/" + '../solid-server/Alice-pod', __dirname + "/" + '../solid-server/Alice-pod-copy')
    await copyContentOfFolder(__dirname + "/" + './test-data/Alice-pod', __dirname + "/" + '../solid-server/Alice-pod')    
}