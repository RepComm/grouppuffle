import { Exponent } from "@repcomm/exponent-ts";
export class SVGPanel extends Exponent {
  //@ts-ignore
  constructor(element) {
    var _this$element;

    super();

    if (element) {
      //@ts-ignore
      this.useNative(element);
    } else {
      // this.make("svg");
      let _element = document.createElementNS("http://www.w3.org/2000/svg", "svg");

      this.useNative(_element);
    } // console.log(this.element);


    if (((_this$element = this.element) === null || _this$element === void 0 ? void 0 : _this$element.nodeName.toLowerCase()) == "svg") {
      this.addClasses("svgpanel");

      let fixSize = () => {
        let x = 0;
        let y = 0;
        let w = Math.floor(this.rect.width);
        let h = Math.floor(this.rect.height);
        let helperViewBox = this.element.getElementById("helperViewBox"); // console.log(helperViewBox);

        if (helperViewBox) {
          helperViewBox.style.display = "unset";
          let r = helperViewBox.getBBox();
          w = Math.floor(r.width);
          h = Math.floor(r.height);
          x = Math.floor(r.x);
          y = Math.floor(r.y);
          helperViewBox.style.display = "none";
        }

        this.setAttr("width", "100%"); // this.setAttr("height", h);

        this.setAttr("height", "100%");
        this.setAttr("viewBox", `${x} ${y} ${w} ${h}`); // console.log("fix size");
      };

      window.addEventListener("resize", () => {
        fixSize();
      }); //gross, fix later

      setInterval(() => {
        fixSize();
      }, 1000);
    }
  }

  setAttr(name, value) {
    var _this$element2;

    (_this$element2 = this.element) === null || _this$element2 === void 0 ? void 0 : _this$element2.setAttribute(name, value);
    return this;
  }

  setAttrNS(name, value) {
    var _this$element3;

    (_this$element3 = this.element) === null || _this$element3 === void 0 ? void 0 : _this$element3.setAttributeNS(this.element.namespaceURI, name, value);
    return this;
  }

  static load(url, replaceWithGroup = false, debugLog = false) {
    if (debugLog) console.log("SVGPanel.load");
    return new Promise(async function (_resolve, _reject) {
      let result;

      try {
        if (debugLog) console.log("fetching url", url);
        let resp = await fetch(url);
        if (debugLog) console.log("converting to text");
        let text = await resp.text();
        if (debugLog) console.log("text fetched:", text);
        let domParser = new DOMParser();
        if (debugLog) console.log("Document parsing from text");
        let doc = domParser.parseFromString(text, "image/svg+xml");
        if (debugLog) console.log("doc parsed", doc);
        let svgs = [doc.documentElement]; //doc.getElementsByClassName("svg") as any as SVGSVGElement[];

        if (svgs.length < 1) {
          _reject("no svg elements found in doc");

          return;
        }

        if (replaceWithGroup) {
          let children = svgs[0].children;
          let group = document.createElementNS("http://www.w3.org/2000/svg", "g");
          group.append(...children);
          svgs[0] = group;
        }

        result = new SVGPanel(svgs[0]);
      } catch (ex) {
        _reject(ex);

        return;
      }

      if (debugLog) console.log("resolving", result);

      _resolve(result);
    });
  }

  mount(parent) {
    //@ts-ignore
    return super.mount(parent);
  }

  get transform() {
    let baseVal = this.element.transform.baseVal;

    if (baseVal.numberOfItems < 1) {
      let newSVGTransform = document.createElementNS("http://www.w3.org/2000/svg", "svg").createSVGTransform();
      baseVal.appendItem(newSVGTransform);
    }

    return baseVal.getItem(0);
  }

}