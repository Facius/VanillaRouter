/**
 * Polyfill for URLPattern need in Safari and Firefox
 * https://www.npmjs.com/package/urlpattern-polyfill
 * https://developer.mozilla.org/en-US/docs/Web/API/URLPattern
 */
// @ts-ignore: Property 'UrlPattern' does not exist
if (!globalThis.URLPattern) {
  await import("urlpattern-polyfill");
}

import { Router } from "./Router";
import { Route, RouterOutlet } from "./RouterOutlet";
import { URLMatcher } from "./UrlMatcher";

class App {
  constructor() {
    this.domReady().then(async () => {
      const t0 = performance.now();

      const urlMatcher = new URLMatcher<Route>();
      const router = new Router(urlMatcher);

      // Register routes

      urlMatcher.add({ hash: "/" }, async () => {
        // lazy load the module
        const module = await import("./pages/main.component");
        // register the custom element if it hasn't been registered yet
        if (customElements.get(module.MainComponent.tagName) === undefined) {
          customElements.define(module.MainComponent.tagName, module.MainComponent);
        }
        // return an instance of the custom element
        return { element: document.createElement(module.MainComponent.tagName) };
      });

      urlMatcher.add({ hash: "/second" }, async () => {
        const module = await import("./pages/page2.component");
        if (customElements.get(module.SecondPageComponent.tagName) === undefined) {
          customElements.define(module.SecondPageComponent.tagName, module.SecondPageComponent);
        }
        return { element: document.createElement(module.SecondPageComponent.tagName) };
      });

      urlMatcher.add({ hash: "**" }, async (result: URLPatternResult) => {
        const module = await import("./pages/notfound.component");

        if (result.hash.input === "") {
          router.navigate("#/");
          return { element: document.createElement("div") };
        }

        if (customElements.get(module.NotFountComponent.tagName) === undefined) {
          customElements.define(module.NotFountComponent.tagName, module.NotFountComponent);
        }
        return { element: document.createElement(module.NotFountComponent.tagName) };
      });

      // Register router outlet
      if (customElements.get(RouterOutlet.tagName) === undefined) {
        customElements.define(RouterOutlet.tagName, RouterOutlet);
      }

      // Create router outlet
      const routerOutlet = document.createElement(RouterOutlet.tagName) as RouterOutlet;
      routerOutlet.router = router;

      // Set router outlet animations => on Enter
      routerOutlet.onEnter = (element) => {
        console.log("onEnter", element);
        return new Promise((resolve) => {
          element.animate([{ transform: "translateX(100%)" }], { fill: "forwards", duration: 0 });
          element.animate([{ transform: "translateX(0%)" }], { fill: "forwards", duration: 250 }).onfinish = () => {
            console.log("onEnter finished");
            resolve();
          };
        });
      };

      // Set router outlet animations => on Leave
      routerOutlet.onLeave = (element) => {
        console.log("onLeave", element);
        return new Promise((resolve) => {
          element.animate([{ transform: "translateX(0%)" }], { fill: "forwards", duration: 0 });
          element.animate([{ transform: "translateX(-100%)" }], { fill: "forwards", duration: 250 }).onfinish = () => {
            console.log("onLeave finished");
            resolve();
          };
        });
      };

      routerOutlet.onLoading = async (finished) => {
        console.log("onLoading", finished);
        // add a loading indicator
        await finished;
        console.log("onLoading finished");
      };

      // add the Router to body
      document.body.appendChild(routerOutlet);

      router.subscribe((route) => {
        if (route) {
          route.then((result) => {
            console.log("result", result);
          });
        } else {
          console.log("route is null");
        }
      });

      document.getElementById("main")?.addEventListener("click", () => {
        router.navigate("#/");
      });

      document.getElementById("second")?.addEventListener("click", () => {
        router.navigate("#/second");
      });

      document.getElementById("route3")?.addEventListener("click", () => {
        router.navigate("#/route3");
      });

      const t1 = performance.now();
      console.log("Call to doSomething took " + (t1 - t0) + " milliseconds.");
    });
  }

  private domReady(): Promise<void> {
    return new Promise((resolve) => {
      if (document.readyState === "interactive" || document.readyState === "complete") {
        resolve();
        return;
      }
      document.addEventListener("DOMContentLoaded", () => resolve());
    });
  }
}

export const app = new App();
