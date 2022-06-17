import { EXPONENT_CSS_BODY_STYLES, EXPONENT_CSS_STYLES, Panel } from "@repcomm/exponent-ts";
import { SVGPanel } from "./components/svg.js";
import { connect } from "./net/client.js";
EXPONENT_CSS_STYLES.mount(document.head);
EXPONENT_CSS_BODY_STYLES.mount(document.head);

async function main() {
  const container = new Panel().setId("container").mount(document.body);
  const renderer = new SVGPanel() // .setAttr("viewBox", "0 0 338.667 190.50019")
  .mount(container);
  SVGPanel.load("./textures/ship.svg", true, false).then(svgPanel => {
    svgPanel.mount(renderer); // container.mountChild(svgPanel as any);
  });
  connect();
}

main();