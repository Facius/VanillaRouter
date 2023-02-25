export class MainComponent extends HTMLElement {
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
      <h1>Home</h1>
      <p>This is the home page.</p>
    `;
    shadow.appendChild(div);
  }

  public static get tagName(): string {
    return "main-page";
  }
}