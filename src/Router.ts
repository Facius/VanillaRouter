import { IURLMatcher } from "./UrlMatcher";

export type SubscriptionCallback<T> = (route: T | null) => unknown;
export type Subscription = { unsubscribe: () => void };

export interface Subscriber<T> {
  callback: SubscriptionCallback<T>;
}

export class Router<T> {
  private subscriptionCounter: number = 0;
  private subscriptions: Map<number, Subscriber<T>> = new Map();

  constructor(private urlMatcher: IURLMatcher<T>) {
    // Listen to popstate events (back/forward)
    window.addEventListener("popstate", () => this.dispatch(window.location.href));

    // Trigger initial route
    setTimeout(() => this.dispatch(window.location.href), 0);
  }

  public subscribe(callback: SubscriptionCallback<T | null>): Subscription {
    // Increment the subscription counter
    const id = this.subscriptionCounter++;

    // Add the subscriber to the map
    this.subscriptions.set(id, { callback });
    return {
      unsubscribe: () => {
        this.subscriptions.delete(id);
      },
    };
  }

  public navigate(url: string) {
    // Update the browser history
    window.history.pushState({ url: url }, "", url);
    this.dispatch(url);
  }

  private dispatch(url: string) {
    // Find the matching route
    const route = this.urlMatcher.find(url);

    // Dispatch the route to all subscribers
    this.subscriptions.forEach((subscriber) => {
      subscriber.callback(route);
    });
  }
}
