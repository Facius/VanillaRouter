import { html } from "./util";
import { Subscription, Router } from "./Router";

export type Route = Promise<{ element: HTMLElement }>;

export class RouterOutlet extends HTMLElement {
  public readonly shadowRoot = this.attachShadow({ mode: "open" });

  private template: () => string = () => `
    <style>
      :host {
        position: relative;
        display: block;
      }
    </style>
    <slot></slot>
  `;

  public static get tagName(): string {
    return "router-outlet";
  }

  private routeElement: HTMLElement | null = null;
  private routerSubscription: Subscription | null = null;

  private onEnterCallback?: (element: HTMLElement) => Promise<void>;
  private onLeaveCallback?: (element: HTMLElement) => Promise<void>;
  private onLoadingCallback?: (finished: Promise<void>) => unknown;

  constructor() {
    super();
    this.shadowRoot.innerHTML = this.template();
  }

  public set onLoading(callback: (finished: Promise<void>) => void) {
    this.onLoadingCallback = callback;
  }

  public set onEnter(callback: (element: HTMLElement) => Promise<void>) {
    this.onEnterCallback = callback;
  }

  public set onLeave(callback: (element: HTMLElement) => Promise<void>) {
    this.onLeaveCallback = callback;
  }

  public set router(routerInstance: Router<Route>) {
    this.routerSubscription = routerInstance.subscribe((route) => {
      this.render(route);
    });
  }

  public disconnectedCallback() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
      this.routerSubscription = null;
    }
  }

  private async render(route: Route | null) {
    if (route == null) {
      console.error("Route is null!");
      return;
    }

    const promise = new Promise<void>(async (resolve) => {
      const { element } = await route;
      resolve();

      if (this.routeElement) {
        const oldElement = this.routeElement;
        if (this.onLeaveCallback) {
          this.onLeaveCallback(oldElement).then(() => oldElement.remove());
        } else {
          oldElement.remove();
        }
      }

      this.routeElement = element;
      this.shadowRoot?.appendChild(element);
      if (this.onEnterCallback) {
        this.onEnterCallback(element);
      }
    });

    if (this.onLoadingCallback) {
      this.onLoadingCallback(promise);
    }
  }
}
