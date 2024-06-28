import pkg from "../package.json";
import { ManifestType } from "@src/manifest-type";

const manifest: ManifestType = {
  manifest_version: 3,
  name: pkg.displayName,
  version: pkg.version,
  description: pkg.description,

  action: {
    default_popup: "src/pages/popup/index.html",
    default_icon: "icon-34.png",
  },

  icons: {
    "128": "icon-128.png",
  },
  content_scripts: [
    {
      matches: ["http://*/*", "https://*/*", "<all_urls>"],
      css: ["contentStyle.css"],
    },
  ],
  permissions: ["tabs", "storage"],
  web_accessible_resources: [
    {
      resources: ["contentStyle.css", "icon-128.png", "icon-34.png"],
      matches: [],
    },
  ],
};

export default manifest;
