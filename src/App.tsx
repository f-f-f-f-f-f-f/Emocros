import AppHandler from "@/components/AppHandler/AppHandler";
import { findNodeByPath, fs } from "@/hooks/useFilesystem";
import Desktop from "./components/Desktop/Desktop";
import Taskbar from "./components/Taskbar/Taskbar";
import "./index.css";
import sw from "./sw?url";
import "./zIdxs.css";

function App() {
  window.flags = {};

  navigator.serviceWorker.register(sw, { type: "module" });

  return (
    <div>
      <AppHandler
        folderNode={findNodeByPath(fs, "C:/User/Programs/Horcrux/")!}
      ></AppHandler>
      <Desktop
        items={[
          {
            icon: "/icons/recycle-bin.png",
            title: "Recycle Bin",
            path: "",
          },
          {
            icon: "/icons/computer.png",
            title: "My PC",
            path: "",
          },
        ]}
      ></Desktop>
      <Taskbar></Taskbar>
    </div>
  );
}

export default App;
