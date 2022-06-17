
import { Component, Exponent } from "@repcomm/exponent-ts";

export class SVGPanel extends Exponent {
  
  //@ts-ignore
  element: SVGSVGElement|SVGGElement;

  constructor (element?: SVGSVGElement|SVGElement) {
    super();

    
    if (element) {
      //@ts-ignore
      this.useNative(element);
    } else {
      // this.make("svg");
      let element = document.createElementNS("http://www.w3.org/2000/svg","svg");
      this.useNative(element as any);
    }
    
    // console.log(this.element);
    if (this.element?.nodeName.toLowerCase() == "svg") {
      this.addClasses("svgpanel");
      
      let fixSize = ()=>{
        let x = 0;
        let y = 0;
        let w = Math.floor(this.rect.width);
        let h = Math.floor(this.rect.height);
        
        let helperViewBox = (this.element as any as SVGSVGElement).getElementById("helperViewBox") as SVGRectElement;
        // console.log(helperViewBox);
        if (helperViewBox) {
          helperViewBox.style.display = "unset";
          let r = helperViewBox.getBBox();
          w = Math.floor(r.width);
          h = Math.floor(r.height);
          x = Math.floor(r.x);
          y = Math.floor(r.y);
          helperViewBox.style.display = "none";
        }

        this.setAttr("width", "100%");
        // this.setAttr("height", h);
        this.setAttr("height", "100%");
        
        this.setAttr("viewBox", `${x} ${y} ${w} ${h}`);
        
        // console.log("fix size");
      };
      
      window.addEventListener("resize", ()=>{fixSize()});

      //gross, fix later
      setInterval(()=>{
        fixSize();
      }, 1000);
      
    }
    
  }
  setAttr(name: string, value: any): this {
    this.element?.setAttribute(name, value);
    return this;
  }
  setAttrNS (name: string, value: any): this {
    this.element?.setAttributeNS(this.element.namespaceURI, name, value);
    return this;
  }
  static load (url: string, replaceWithGroup: boolean = false, debugLog: boolean = false): Promise<SVGPanel> {
    if (debugLog) console.log("SVGPanel.load");

    return new Promise(async (_resolve, _reject)=>{
      let result: SVGPanel;

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

        let svgs: Array<SVGElement> = [doc.documentElement as any]; //doc.getElementsByClassName("svg") as any as SVGSVGElement[];
        if (svgs.length < 1) {
          _reject("no svg elements found in doc");
          return;
        }

        if (replaceWithGroup) {
          let children = svgs[0].children;
          let group = document.createElementNS("http://www.w3.org/2000/svg","g");
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
  mount(parent: Component | HTMLElement | SVGGElement | SVGSVGElement | SVGPanel): this {
    //@ts-ignore
    return super.mount(parent);
  }
  get transform (): SVGTransform {
    let baseVal = this.element.transform.baseVal;
    if (baseVal.numberOfItems < 1) {
      let newSVGTransform = document.createElementNS("http://www.w3.org/2000/svg", "svg").createSVGTransform();
      baseVal.appendItem( newSVGTransform );
    }
    return baseVal.getItem(0);
  }
}
