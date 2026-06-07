import Desktop from "./components/Desktop/Desktop";
import Taskbar from "./components/Taskbar/Taskbar";
import "./index.css";
import sw from "./sw?url";
import "./zIdxs.css";

function App() {
  window.flags = {};

  navigator.serviceWorker.register(sw, { type: "module", scope: "/" });

  const items = [
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
    {
      icon: "/icons/file.png",
      title: "Horcrux",
      app: "Horcrux",
    },
  ];

  return (
    <>
      <Desktop items={items}></Desktop>
      <Taskbar></Taskbar>
    </>
  );
}

export default App;
