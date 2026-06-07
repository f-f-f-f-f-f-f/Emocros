const corsFetch = window.electronApi.fetch;

interface DesktopItem {
  title: string;
  icon: string;
  path?: string;
  app?: string;
}

export { corsFetch };
export type { DesktopItem };

