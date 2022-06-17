import { EXPONENT_CSS_BODY_STYLES, EXPONENT_CSS_STYLES, Panel } from "@repcomm/exponent-ts";
import { SVGPanel } from "./components/svg.js";
import { connect } from "./net/client.js";
EXPONENT_CSS_STYLES.mount(document.head);
EXPONENT_CSS_BODY_STYLES.mount(document.head);

async function main() {
  const container = new Panel().setId("container").mount(document.body);
  const renderer = new SVGPanel().mount(container);
  SVGPanel.load("./textures/ship.svg", true, false).then(svgPanel => {
    svgPanel.mount(renderer);
  });
  SVGPanel.load("./textures/map-icon.svg", true).then(mapIcon => {
    setTimeout(() => {
      mapIcon.mount(renderer);
      mapIcon.on("mouseenter", evt => {
        mapIcon.setStyleItem("border-style", "solid white");
        mapIcon.setStyleItem("border-width", "2pt");
      });
      mapIcon.on("mouseleave", evt => {
        mapIcon.setStyleItem("border-style", "unset");
        mapIcon.setStyleItem("border-width", "1pt");
      });
      mapIcon.transform.setTranslate(5, 20);
    }, 1000);
  });
  connect();
}

main();