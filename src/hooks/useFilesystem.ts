export type NodeType = "dir" | "file" | "drive" | "root";

export interface Node {
  type: NodeType;
  name: string;
  icon?: string;

  // Dirs and drives don't have content, and some files (like shortcuts)
  // also don't have them.
  content?: string | Blob;
  children?: Node[];

  // You can't modify protected files or dirs unless you
  // enable it via the boolean flag window.flags.allowModifyProtected.
  // Protection also applies to children unless those children explicitly
  // mark themselves as unprotected.
  protected?: boolean;

  // You can't see hidden files unless you enable them via settings or
  // via the boolean flag window.flags.showHiddenFiles.
  hidden?: boolean;
}

export const fs: Node = {
  // The root is the same as "This PC" on Windows and handles all the drives
  type: "root",
  name: "Computer",
  icon: "/icons/computer.png",
  protected: true,
  children: [
    {
      type: "drive",
      name: "C:",
      icon: "/icons/drive.png",
      protected: false,
      children: [
        {
          type: "dir",
          name: "User",
          children: [
            {
              type: "dir",
              name: "Desktop",
              icon: "/icons/desktop.png",
              children: [
                {
                  type: "file",
                  name: "My Computer.lnk",
                  icon: "/icons/computer.png",
                },
                {
                  type: "dir",
                  name: "Recycle Bin",
                  icon: "/icons/recycle-bin.png",
                },
              ],
            },
            {
              type: "dir",
              name: "Programs",
              children: [
                {
                  type: "dir",
                  name: "AppHandler",
                  protected: true,
                  children: [],
                },
                {
                  type: "dir",
                  name: "Horcrux",
                  protected: false,
                  children: [
                    {
                      type: "file",
                      name: "manifest.json",
                      content: JSON.stringify({
                        name: "Horcrux",
                        main: "index.html",
                        permissions: [],
                        uuid: "4d70c8ed-9c0b-411f-a96c-5e400c07b229",
                      }),
                    },
                    {
                      type: "file",
                      name: "index.html",
                      content: `<html><div style="width:100vw;height:100vh;background-color:red;">TEST</div></html>`,
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};

/**
 * Traverses a nested Node tree segment by segment to resolve the target node.
 * Returns the Node if found, or null if any segment along the path does not exist.
 */
export function findNodeByPath(rootNode: Node = fs, path: string) {
  let currentNode = rootNode;

  for (const segment of path.split("/").filter(Boolean)) {
    if (!currentNode.children || !Array.isArray(currentNode.children))
      return null;

    const nextNode = currentNode.children.find(
      (child) => child.name === segment,
    );
    if (!nextNode) return null;

    currentNode = nextNode;
  }

  return currentNode;
}
