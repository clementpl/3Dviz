var d3 = require('d3');
var rendererManager = require('./rendererManager');

module.exports = class Histogram3D {
    constructor(dom, width, height) {
        this.dom = d3.select(`#${dom}`);
        this.width = width || this.dom.node().getBoundingClientRect().width;
        this.height = height || this.dom.node().getBoundingClientRect().height;
        this.dataManager = {};
        this.renderer = new rendererManager(document.getElementById(dom), this.width, this.height);
    }

    load(data, getter) {
        this.dataManager.getter = getter;
        this.dataManager.data = data;
    }

    render() {
        var data = this.dataManager.data;
        var getter = this.dataManager.getter;

        var margin = 15; //margin between 2 bar
        var widthHisto = 1000;
        var depthHisto = 1000;
        var heightHisto = 1000;

        var widthClass = (widthHisto - (margin * data.length)) / data.length;
        var depthClass = (depthHisto - (margin * data.length)) / data.length;

        var yOffset = (heightHisto - heightHisto / data[0][getter.y]) / 2; //yOffset to center the histogramme
        var xOffset = widthHisto / 2; //xOffset to center the histogramme

        console.log("widthClass: " + widthClass);
        console.log("length: " + data.length);
        data.forEach((d, i) => {
            var h = heightHisto - heightHisto / d[getter.y];
            this.renderer.add('cube', {
                color: 0x0000ff,
                width: widthClass,
                height: h,
                depth: depthClass,
                position: {
                    x: (i * widthClass) - xOffset + (i * margin),
                    y: h / 2 - yOffset,
                    z: 0
                }
            });
        });

        this.renderer.add('grid', {
            yOffset: yOffset,
            xLength: data.length,
            zLength: data.length,
            xSize: widthClass + margin,
            zSize: depthClass + margin
        });

        this.renderer.render();

        function addAxis() {
            //Add X axis
            this.renderer.add('axis', {
                color: 0x00ff00,
                lineWidth: 3, //depthClass,
                dashed: true,
                src: {
                    x: -xOffset - widthClass / 2,
                    y: -yOffset - 10,
                    z: depthClass / 2
                },
                dst: {
                    x: xOffset - widthClass / 2 - margin,
                    y: -yOffset - 10,
                    z: depthClass / 2
                }
            });
            //Add Y axis
            //Add Z axis
        }
    }
}
