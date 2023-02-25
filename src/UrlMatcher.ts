export interface IURLMatcher<T> {
  find(url: string): T | null;
}

export type UrlMatcherCallback<T> = (result: URLPatternResult) => T;

export type UrlCallback<T> = (result: URLPatternResult) => T;

interface UrlItem<T> {
  pattern: URLPattern;
  onMatch: UrlCallback<T>;
}

export class URLMatcher<T> implements IURLMatcher<T> {
  private urls: UrlItem<T>[] = [];

  constructor(private baseUrl: string = window.location.origin) {}

  add(init: URLPatternInit, onMatch: UrlMatcherCallback<T>) {
    // Add the base URL to the pattern if it's not already there
    init = Object.assign({ baseURL: this.baseUrl }, init);
    /**
     *  Create the URL pattern and add it to the list
     *  https://developer.mozilla.org/en-US/docs/Web/API/URLPattern
     *  */
    const pattern = new URLPattern(init);
    this.urls.push({ pattern, onMatch });
  }

  find(url: string): T | null {
    // Add the base URL to the URL if it's not part of the url
    const absoluteUrl = url.includes(this.baseUrl) ? url : this.baseUrl + url;
    let callbackResult: T | null = null;
    // Loop through the URL patterns and find the first match
    this.urls.every((item) => {
      const isMatch = item.pattern.exec(absoluteUrl);
      if (isMatch) {
        // Call the callback and return false to stop the loop
        callbackResult = item.onMatch(isMatch);
        return false;
      }
      return true;
    });
    // Return the result of the callback if any.
    return callbackResult;
  }
}
