
import {
  EXPONENT_CSS_BODY_STYLES,
  EXPONENT_CSS_STYLES,
  Panel,
  Text
} from "@repcomm/exponent-ts"

import { connect } from "./net/client.js";

EXPONENT_CSS_STYLES.mount(document.head);
EXPONENT_CSS_BODY_STYLES.mount(document.head);

async function main() {

  const container = new Panel()
    .setId("container")
    .mount(document.body);

  const title = new Text()
    .setId("title")
    .setTextContent("netgame")
    .mount(container);

  
  connect();
  
}

main();
