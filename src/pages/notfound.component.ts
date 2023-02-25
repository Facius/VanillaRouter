export class NotFountComponent extends HTMLElement {
  constructor() {
    super();

    const shadow = this.attachShadow({ mode: "open" });
    const div = document.createElement("div");
    div.innerHTML = `
      <style>
        :host {
          position: absolute;
          top: 0;
          width: 100%;
          display: block;
        }
      </style>
      <h1>Not found</h1>
      <p>Sorry, we couldn't find the page you were looking for.</p>
    `;
    shadow.appendChild(div);
  }

  public static get tagName(): string {
    return "not-found-page";
  }
}
