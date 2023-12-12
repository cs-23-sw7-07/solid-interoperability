import { copyContentOfFolder } from "./Utils/folder-management"

export default async function(): Promise<void> {
    await copyContentOfFolder(__dirname + "/" + '../solid-server/Alice-pod-copy', __dirname + "/" + '../solid-server/Alice-pod')    
}