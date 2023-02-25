export class SecondPageComponent extends HTMLElement {
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
        <h1>Page 2</h1>
        <p>This is page 2.</p>
    `;
    shadow.appendChild(div);
  }

  public static get tagName(): string {
    return "second-page";
  }
}
