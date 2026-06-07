import { DesktopItem } from "@/utils";
import AppHandler from "@/components/AppHandler/AppHandler";
import styles from "./Desktop.module.css";
import { useState } from "react";
import { findNodeByPath, fs } from "@/hooks/useFilesystem";

export default function Desktop({ items = [] }: { items?: DesktopItem[] }) {
  const [openApps, setOpenApps] = useState<string[]>([]);

  return (
    <div
      style={{ backgroundImage: `url("/wallpapers/pond.jpg")` }}
      className={styles.container}
    >
      {items.map((item) => (
        <div
          className={styles.item}
          key={item.title}
          onClick={() => {
            if (item.app) {
              if (openApps.includes(item.app)) {
                setOpenApps((apps) => [
                  ...apps.filter((app) => app !== item.app),
                  item.app!,
                ]);
              } else {
                setOpenApps((apps) => [...apps, item.app!]);
              }
            }
          }}
        >
          <span>{item.title}</span>
          <img src={item.icon} width="64" height="64"></img>
        </div>
      ))}

      <div>
        {openApps.map((app) => (
          <AppHandler
            key={app}
            folderNode={findNodeByPath(fs, `C:/User/Programs/${app}`)!}
          ></AppHandler>
        ))}
      </div>
    </div>
  );
}
