import { ipcRenderer, contextBridge } from "electron";

contextBridge.exposeInMainWorld("electronApi", {
  fetch: (
    mode: "json" | "text" | "blob" | "arraybuffer" | "formdata" = "text",
    ...args: Parameters<typeof fetch>
  ) => ipcRenderer.invoke("fetch-ipc", mode, ...args),
});
