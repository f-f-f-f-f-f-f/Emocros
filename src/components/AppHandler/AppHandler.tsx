import { Node } from "@/hooks/useFilesystem";
import { useDraggable } from "@neodrag/react";
import { useEffect, useRef, useState } from "react";
import styles from "./AppHandler.module.css";

export interface Manifest {
  name: string;
  main: string;
  include?: string[];
  exclude?: string[];
}

export default function AppHandler({ folderNode }: { folderNode: Node }) {
  const [iframeSrc, setIframeSrc] = useState<string | null>(null);
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

      const appUuid = manifest.name;
      const cleanMain = manifest.main.startsWith("/")
        ? manifest.main.slice(1)
        : manifest.main;

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
    <div ref={draggableRef} className={styles.app}>
      <iframe src={iframeSrc} title={`app-instance-${instanceUuid}`} />
    </div>
  );
}
