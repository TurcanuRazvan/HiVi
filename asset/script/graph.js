var hivi = hivi || {};
hivi.graph = (function (window, document) {
    var history = [];
    var visits = {};
    var state = { svg: null, graphModel: null };

    // function declarations
    function init(originalHistory) {

        history = mapHistory(originalHistory);
        state.graphModel = mapHistoryToGraph();
        test(state.graphModel);
    };

    function mapHistory(historyList) {
        var allItems = [];
        historyList.forEach(function (historyItem) {
            var url = historyItem.url;
            var domainsSplits = url.split("/");

            if (domainsSplits[0] === "chrome-extension:" || domainsSplits[0] === "file:") {
                return;
            }

            var domain = domainsSplits[2];

            allItems.push({
                "domain": domain,
                "item": historyItem
            })

        });
        // console.log(allItems);
        return allItems;
    };

    function mapHistoryToGraph() {
        var graph = {
            "nodes": [],
            "links": []
        };

        var currentDomains = [];
        history.forEach(function (historyItem, index, historyArray) {
            if (currentDomains.indexOf(historyItem.domain) === -1) {
                currentDomains.push(historyItem.domain);
                graph.nodes.push({
                    "id": historyItem.domain,
                    "group": currentDomains.length
                });
            }

            if (index > 0 && historyArray[index - 1].domain !== historyItem.domain) {
                graph.links.push({
                    "source": historyArray[index - 1].domain,
                    "target": historyItem.domain,
                    "value": 1
                });
            }
        });
        console.log(graph);
        // debugger;
        return graph;

    };

    function test(graph) {
        var body = document.getElementsByTagName("body")[0];
        var historyGraph = document.getElementById("history-graph");
        var width = body.offsetWidth - 160;//+svg.attr("width"),
        var height = 500;//+svg.attr("height");
        historyGraph.setAttribute("width", width);
        historyGraph.setAttribute("height", height);
        // historyGraph.setAttribute("viewBox", "0 0" + width + " " + height);
        state.svg = d3.select("#history-graph");
        var svg = state.svg;
        var color = d3.scaleOrdinal(d3.schemeCategory20);

        var nd;
        for (var i = 0; i < graph.nodes.length; i++) {
            nd = graph.nodes[i];
            nd.rx = nd.id.length * 4.5;
            nd.ry = 12;
        }

        var simulation = d3.forceSimulation()
            .force("link", d3.forceLink().id(function (d) { return d.id; }))
            .force("collide", d3.ellipseForce(6, 0.5, 5))
            .force("center", d3.forceCenter(width / 2, height / 2));

        var link = svg.append("g")
            .attr("class", "link")
            .selectAll("line")
            .data(graph.links)
            .enter().append("line")
            .attr("stroke-width", function (d) {
                //  return Math.sqrt(d.value);
                return 4;
            });

        var node = svg.append("g")
            .attr("class", "node")
            .selectAll("ellipse")
            .data(graph.nodes)
            .enter().append("ellipse")
            .attr("rx", function (d) { return d.rx; })
            .attr("ry", function (d) { return d.ry; })
            .attr("fill", function (d) { return color(d.group); })
            .call(d3.drag()
                .on("start", dragStarted)
                .on("drag", dragged)
                .on("end", dragended));

        var text = svg.append("g")
            .attr("class", "labels")
            .selectAll("text")
            .data(graph.nodes)
            .enter().append("text")
            .attr("dy", 2)
            .attr("text-anchor", "middle")
            .text(function (d) { return d.id })
            .attr("fill", "white");


        simulation
            .nodes(graph.nodes)
            .on("tick", ticked);

        simulation.force("link")
            .links(graph.links);


        function ticked() {
            link.attr("x1", function (d) { return d.source.x; })
                .attr("y1", function (d) { return d.source.y; })
                .attr("x2", function (d) { return d.target.x; })
                .attr("y2", function (d) { return d.target.y; });

            node.attr("cx", function (d) { return d.x = Math.max(d.rx, Math.min(width - d.rx, d.x)); })
                .attr("cy", function (d) { return d.y = Math.max(d.ry, Math.min(height - d.ry, d.y)); });

            text
                .attr("x", function (d) { return d.x; })
                .attr("y", function (d) { return d.y; });
        }



        function dragStarted(d) {
            if (!d3.event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
        }

        function dragged(d) {
            d.fx = d3.event.x;
            d.fy = d3.event.y;
        }

        function dragended(d) {
            if (!d3.event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
        }
        updateCanvasLinksStyle(svg.node());

    };


    // see: https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Drawing_DOM_objects_into_a_canvas
    function convertSVGtoCanvas(svg) {
        var DomURL = window.URL || window.webkitURL || window;
        var svgElement = svg.node().cloneNode(true);
        var svgString = getSVGString(svgElement);
        var image = new Image();
        var svgBlob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
        var url = DomURL.createObjectURL(svgBlob);

        var canvas = getSVGCanvas();
        var context = canvas.getContext("2d");
        image.onload = function () {
            context.drawImage(image, 0, 0);

            var dataURL = canvas.toDataURL("image/png");
            saveDataURL(dataURL, 'graph.png');
            DomURL.revokeObjectURL(url);
        }
        image.src = url;
    }

    function getSVGString(node) {
        var backgroundRectangle = getSVGBackground();
        node.insertBefore(backgroundRectangle, node.firstChild);

        var svgString = domNodeToString(node);
        return svgString;
    }

    function saveDataURL(dataURL, name) {
        var link = document.createElement('a');
        link.setAttribute('download', name);
        link.setAttribute('href', dataURL);
        link.click();
    }

    function getSVGBackground() {
        var backgroundRectangle = document.createElement('rect');
        backgroundRectangle.setAttribute("width", '100%');
        backgroundRectangle.setAttribute("height", '100%');
        backgroundRectangle.setAttribute('fill', 'white');

        return backgroundRectangle;
    }

    function getSVGCanvas() {
        var svg = document.getElementById("history-graph");
        var canvas = document.createElement("canvas");
        debugger;
        var width = svg.clientWidth;
        canvas.setAttribute('width', width);
        var height = svg.clientHeight;
        canvas.setAttribute("height", height);

        return canvas;
    }

    // Get the string representation of a DOM node (removes the node)
    function domNodeToString(domNode) {
        var element = document.createElement("div");
        element.appendChild(domNode.cloneNode(true));
        return element.innerHTML;
    }

    function updateCanvasLinksStyle(svg) {
        var linksParent = svg.getElementsByClassName("link")[0];
        var svgLines = linksParent.getElementsByTagName("line");

        for (let index = 0; index < svgLines.length; index++) {
            const element = svgLines[index];
            element.style.stroke = "#999";
        }

    }

    (function () {

        window.addEventListener("resize", resizeThrottler, false);

        var resizeTimeout;
        function resizeThrottler() {
            // ignore resize events as long as an actualResizeHandler execution is in the queue
            if (!resizeTimeout) {
                resizeTimeout = setTimeout(function () {
                    resizeTimeout = null;
                    actualResizeHandler();

                    // The actualResizeHandler will execute at a rate of 15fps
                }, 66);
            }
        }

        function actualResizeHandler() {
            // handle the resize event
            if (state.graphModel && state.svg) {
                var svg = state.svg.node();
                svg.innerHTML = "";
                test(state.graphModel);
            }
        }

    }());

    function convertSVGToXML(svg) {
        var DomURL = window.URL || window.webkitURL || window;
        var svgElement = svg.node().cloneNode(true);
        var svgString = getSVGString(svgElement);
        var svgBlob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
        var url = DomURL.createObjectURL(svgBlob);
        var a = document.createElement("a");
        a.href = url;
        a.download = "graph.svg";
        a.click();
        DomURL.revokeObjectURL(url);
    }


    // EVENTS
    document.getElementById('export-png').addEventListener('click', function () {
        convertSVGtoCanvas(state.svg);
    });

    document.getElementById('export-svg').addEventListener('click', function () {
        convertSVGToXML(state.svg);
    });


    return {
        init: init
    };
})(window, document);
