/// <reference lib="webworker" />

import { findNodeByPath, fs } from "@/hooks/useFilesystem";
import { clear, createStore, del, get, set, UseStore } from "idb-keyval";

const win = self as unknown as ServiceWorkerGlobalScope;

const stores: Record<string, UseStore> = {};

win.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);

  if (url.pathname.startsWith("/app-route/")) {
    e.respondWith(handleVirtualReq(e.request, url.pathname));
  }
});

async function handleVirtualReq(req: Request, pathname: string) {
  // Format: /app-route/[appUuid]/[processUuid]/...
  const parts = pathname.split("/").filter(Boolean);
  const aid = parts[1]; // App UUID
  const pathSegments = parts.slice(3);
  const path = pathSegments.join("/");

  if (path.startsWith("api/storage")) {
    // Format: api/storage/[key]
    return handleVirtualStorage(req, aid, parts.at(-1) || "");
  }

  // Route any non-storage path requests directly to your VFS tree assets
  return handleVirtualAssets(aid, path);
}

async function handleVirtualStorage(req: Request, aid: string, key: string) {
  const store = (stores[aid] = createStore(
    `app-persistent-storage-${aid}`,
    `storage`,
  ));
  if (req.method === "GET") {
    try {
      const data = await get(key, store);
      return new Response(data);
    } catch {
      return new Response("500 Server Error", { status: 500 });
    }
  }

  if (req.method === "POST" || req.method === "PUT") {
    try {
      const blob = await req.blob();
      await set(key, blob, store);
      return new Response(JSON.stringify({ success: true }), {
        headers: { "Content-Type": "application/json" },
      });
    } catch {
      return new Response("500 Server Error", { status: 500 });
    }
  }

  if (req.method === "DELETE") {
    try {
      if (!key) await clear(store);
      else {
        await del(key, store);
      }

      return new Response("204 No Content", { status: 204 });
    } catch {
      return new Response("500 Server Error", { status: 500 });
    }
  }

  return new Response("405 Method Not Allowed", {
    status: 405,
    headers: {
      Allow: `GET, PUT, POST, DELETE`,
    },
  });
}

async function handleVirtualAssets(aid: string, path: string) {
  const node = findNodeByPath(
    findNodeByPath(fs, `C:/User/Programs/${aid}`) || fs,
    path,
  );

  if (!node || node.type !== "file" || node.content === undefined) {
    return new Response(`404 Not Found: ${path}`, {
      status: 404,
    });
  }

  const filename = path.split("/").at(-1) || "";
  const mimeType = getMimeType(filename);

  return new Response(node.content, {
    headers: { "Content-Type": mimeType },
  });
}

function getMimeType(filename: string): string {
  const extension = filename.split(".").pop()?.toLowerCase() || "";
  const mimeTypes: Record<string, string> = {
    html: "text/html",
    htm: "text/html",
    js: "application/javascript",
    mjs: "application/javascript",
    css: "text/css",
    json: "application/json",
    png: "image/png",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    svg: "image/svg+xml",
    gif: "image/gif",
    txt: "text/plain",
  };

  return mimeTypes[extension] || "application/octet-stream";
}
