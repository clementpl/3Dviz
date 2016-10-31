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
        var nodes = [];
        var axis = {
            x: [],
            y: [],
            z: []
        };
        data.forEach((row) => {
            var xVal = row[getter.x];
            var yVal = row[getter.y];
            var zVal = row[getter.z];
            if (axis.x.indexOf(xVal) == -1)
                axis.x.push(xVal);
            if (axis.y.indexOf(yVal) == -1)
                axis.y.push(yVal);
            if (axis.z.indexOf(zVal) == -1)
                axis.z.push(zVal);

            if (typeof yVal != "number")
                this.dataManager.maxY = axis.y.length;
            else if (!this.dataManager.maxY || this.dataManager.maxY < yVal)
                this.dataManager.maxY = yVal;

            nodes.push({
                x: {value: xVal, idx: typeof xVal == "number" ? xVal : axis.x.indexOf(xVal)},
                y: {value: yVal, idx: typeof yVal == "number" ? yVal : axis.y.indexOf(yVal)},
                z: {value: zVal, idx: typeof zVal == "number" ? zVal : axis.z.indexOf(zVal)},
                __data__: row
            });
        });
        this.dataManager.getter = getter;
        this.dataManager.data = data;
        this.dataManager.nodes = nodes;
        this.dataManager.axis = axis;
    }

    render() {
        var data = this.dataManager.data;
        var nodes = this.dataManager.nodes;
        var getter = this.dataManager.getter;
        var axis = this.dataManager.axis;

        var margin = 15;//margin between 2 bar
        var widthHisto = 1000;
        var depthHisto = 1000;
        var heightHisto = 1000;

        var widthClass = (widthHisto - (margin * axis.x.length)) / axis.x.length;
        var depthClass = (depthHisto - (margin * axis.z.length)) / axis.z.length;
        var heightClass = heightHisto / axis.y.length;

//        var yOffset = (heightHisto - heightHisto / data[0][getter.y]) / 2; //yOffset to center the histogramme
        var yOffset = heightHisto / 2; //yOffset to center the histogramme
        var xOffset = widthHisto / 2; //xOffset to center the histogramme
        var zOffset = depthHisto / 2; //zOffset to center the histogramme

        axis.x.forEach((n, i) => {
            this.renderer.add('text', {
                text: n,
                position: {
                    x: (i * widthClass) - xOffset + (i * margin),
                    y: -yOffset - margin,
                    z: zOffset
                }
            });
        });
        axis.z.forEach((n, i) => {
            this.renderer.add('text', {
                text: n,
                position: {
                    x: xOffset - widthClass/2,
                    y: -yOffset - margin,
                    z: (i * depthClass) - zOffset + (i * margin)
                }
            });
        });

        nodes.forEach((n, i) => {
            var h = heightHisto * n.y.idx / this.dataManager.maxY;
            console.log(h);
            this.renderer.add('cube', {
                color: 0x0000ff,
                width: widthClass,
                height: h,
                depth: depthClass,
                position: {
                    x: (n.x.idx * widthClass) - xOffset + (n.x.idx * margin),
                    y: h / 2 - yOffset,
//                    z: (n.z.idx * depthClass) - depthHisto + (n.z.idx * margin)
                    z: (n.z.idx * depthClass) - zOffset + (n.z.idx * margin)
                }
            });
        });

        this.renderer.add('grid', {
            yOffset: yOffset,
            xLength: axis.x.length,
            zLength: axis.z.length,
            xSize: widthClass + margin,
            zSize: depthClass + margin
//            rotation: {x: 67.5}
        });
        //add Wall grid (y)
        this.renderer.add('grid', {
            yOffset: yOffset,
            drawLine: 'horizontal',
            xLength: axis.y.length,
            zLength: axis.y.length,
            xSize: heightClass,
            zSize: heightClass,
            rotation: {x: 1.5708},
            position: {z: -zOffset - depthClass/2,
                x:-((heightClass*(axis.y.length+1))/2)-margin*4}
        });
        this.renderer.add('grid', {
            yOffset: yOffset,
            drawLine: 'vertical',
            xLength: axis.y.length,
            zLength: axis.y.length,
            xSize: heightClass,
            zSize: heightClass,
            rotation: {z: 1.5708},//, y: 1.5708 * 2}
            position: {x:-((heightClass*(axis.y.length+1))/2)-4*margin}
        });
        this.renderer.setCameraPosition({position: {z: depthHisto * 2}});
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
