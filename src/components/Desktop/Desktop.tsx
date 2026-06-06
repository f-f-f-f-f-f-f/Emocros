import { DesktopItem } from "../../utils";
import styles from "./Desktop.module.css";

export default function Desktop({ items = [] }: { items?: DesktopItem[] }) {
  return (
    <div
      style={{ backgroundImage: `url("/wallpapers/pond.jpg")` }}
      className={styles.container}
    >
      {items.map((item) => (
        <div className={styles.item} key={item.title}>
          <span>{item.title}</span>
          <img src={item.icon} width="64" height="64"></img>
        </div>
      ))}
    </div>
  );
}
