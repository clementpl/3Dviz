var d3 = require('d3');
var rendererManager = require('./rendererManager');

module.exports = class Histogram3D {
  constructor(dom, width, height) {
    this.dom = d3.select(`#${dom}`);
    this.width = width || this.dom.node().getBoundingClientRect().width;
    //TODO WHY height=0 ??? look at init of dom element
    this.height = height || this.dom.node().getBoundingClientRect().height || 500;
    this.renderer = new rendererManager(document.getElementById(dom), this.width, this.height);
  }

  load(data) {

  }

  render() {
    this.renderer.add('cube', {color: 0x0000ff});
    this.renderer.render();
    this.renderer.animate();
  }
}
