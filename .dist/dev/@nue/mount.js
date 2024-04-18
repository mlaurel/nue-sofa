var __require = ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined")
    return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});

// browser/mount.js
async function importAll(reload_path) {
  const comps = document.querySelector('[name="nue:components"]')?.getAttribute("content");
  if (!comps)
    return [];
  const arr = [];
  for (let path of comps.split(" ")) {
    if (path == reload_path)
      path += `?${++remounts}`;
    const { lib } = await import(path);
    if (lib)
      arr.push(...lib);
  }
  return arr;
}
async function mountAll(reload_path) {
  const els = document.querySelectorAll("[island]");
  const lib = els[0] ? await importAll(reload_path) : [];
  if (!lib[0])
    return;
  const { createApp } = await import("./nue.js");
  for (const node of [...els]) {
    const name = node.getAttribute("island");
    const next = node.nextElementSibling;
    const data = next?.type == "application/json" ? JSON.parse(next.textContent) : {};
    const comp = lib.find((a) => a.name == name);
    if (comp) {
      const app = createApp(comp, data, lib).mount(node);
      apps.push(app);
    } else {
      console.error("Component not defined:", name);
    }
  }
}
async function unmountAll() {
  apps.forEach((app) => app.unmount());
  apps = [];
}
var apps = [];
var remounts = 0;
addEventListener("route", mountAll);
addEventListener("DOMContentLoaded", mountAll);
export {
  unmountAll,
  mountAll
};
