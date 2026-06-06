declare global {
  interface Window {
    electronApi: {
      fetch: (
        mode: "json" | "text" | "blob" | "arraybuffer" | "formdata" = "text",
        ...args: Parameters<typeof net.fetch>
      ) => any;
    };

    // Extend global window interface for security flags
    flags: {
      allowModifyProtected?: boolean;
      showHiddenFiles?: boolean;
      enableFullSysAccess?: boolean;
    };
  }
}

export { };

