import { Node } from "@/hooks/useFilesystem";
import { useDraggable } from "@neodrag/react";
import { useEffect, useRef, useState } from "react";

export interface Manifest {
  name: string;
  main: string;
  include?: string[];
  exclude?: string[];
  permissions: Array<"dangerousFilesystem" | "fullSystemAccess" | "pageModals">;
}

export default function AppHandler({ folderNode }: { folderNode: Node }) {
  const [iframeSrc, setIframeSrc] = useState<string | null>(null);
  const [sandboxFlags, setSandboxFlags] = useState<string>("");
  const [currZIndex, setCurrZIndex] = useState(3);
  const [instanceUuid] = useState(() => crypto.randomUUID());

  const pushError = (e: string) => alert(`Error while launching app: ${e}`);

  const draggableRef = useRef(null as any);
  useDraggable(draggableRef);

  useEffect(() => {
    let manifest: Manifest;

    try {
      const text = folderNode.children?.find(
        (n) => n.name === "manifest.json",
      )?.content;

      if (!text) return pushError(`manifest.json not found`);
      if (typeof text !== "string") return pushError(`Invalid manifest.json`);

      manifest = JSON.parse(text);

      if (typeof manifest !== "object" || !manifest)
        return pushError(`Invalid manifest.json`);
      if (!manifest.name)
        return pushError(`Missing property 'name' from manifest.json`);
      if (!manifest.main)
        return pushError(`Missing property 'main' from manifest.json`);

      const sandbox = ["allow-scripts", "allow-forms", "allow-popups"];

      if (manifest.permissions?.includes("dangerousFilesystem")) {
        const allowed = confirm(
          "This app has full privileges to your filesystem and can potentially cause extreme harm. Do you want to allow it?",
        );
        if (!allowed) return;
      }

      if (manifest.permissions?.includes("fullSystemAccess")) {
        if (!window.flags?.enableFullSysAccess) {
          return pushError(
            "Launch blocked: fullSystemAccess requires enabling window.flags.enableFullSysAccess.",
          );
        }
        const allowed = confirm(
          "This app has extremely high permissions and effectively becomes part of Emocros. Do you want to allow it?",
        );
        if (!allowed) return;
        sandbox.push("allow-same-origin");
      }

      if (manifest.permissions?.includes("pageModals")) {
        const allowed = confirm(
          "This app can cause intrusive and blocking dialogs. Do you want to allow it?",
        );
        if (!allowed) return;
        sandbox.push("allow-modals");
      }

      const appUuid = manifest.name;
      const cleanMain = manifest.main.startsWith("/")
        ? manifest.main.slice(1)
        : manifest.main;

      setSandboxFlags(sandbox.join(" "));
      setIframeSrc(`/app-route/${appUuid}/${instanceUuid}/${cleanMain}`);
    } catch (e) {
      return pushError(`Invalid manifest.json: ${e}`);
    }

    setCurrZIndex((z) => z + 1);
  }, [folderNode, instanceUuid]);

  if (!iframeSrc) {
    return (
      <div style={{ zIndex: `${currZIndex}` }}>
        Launching application container... {JSON.stringify(folderNode)}
      </div>
    );
  }

  return (
    <div ref={draggableRef} className="w-full h-full bg-white">
      <iframe
        src={iframeSrc}
        sandbox={sandboxFlags}
        className="w-full h-full border-none m-0 p-0 block"
        title={`app-instance-${instanceUuid}`}
      />
    </div>
  );
}
