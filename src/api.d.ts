declare global {
  interface Window {
    electronApi: {
      fetch: (
        mode: "json" | "text" | "blob" | "arraybuffer" | "formdata" = "text",
        ...args: Parameters<typeof net.fetch>
      ) => any;
    };
  }
}

export {};
