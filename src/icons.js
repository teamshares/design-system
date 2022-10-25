import { registerIconLibrary } from "@shoelace-style/shoelace/dist/utilities/icon-library.js";

export const registerIcons = () => {
  registerIconLibrary("default", {
    resolver: name => `https://cdn.jsdelivr.net/npm/heroicons@2.0.1/24/outline/${name}.svg`
  });
};
