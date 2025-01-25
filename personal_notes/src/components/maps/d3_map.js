document.addEventListener("DOMContentLoaded", async (e) => {

    const d3 =  await import("https://cdn.jsdelivr.net/npm/d3@7/+esm");

    // We want a scrollable map of the word colour ramped by the number of posts
    // from that country. When you click on a country - it brings you to a route 
    // of posts from that country
    const countriesResp = await fetch("/spatial/countries.geojson")
    const countriesJSON = await(countriesResp.json())
  
    const width = 1000;
    const height =  490;

    const zoomed = (event) => {
        const { transform } = event;
        g.attr("transform", transform)
        g.attr("stroke-width", 1 / transform.k);
    }

    const zoom = d3.zoom()
        .scaleExtent([1, 15])
        .on("zoom", zoomed)

    const svg = d3.create('svg')
        .attr("viewBox", [0, 0, width, height])
        .attr("width", width)
        .attr("height", height)
        .attr("style", "max-width: 100%; height: auto;")
        .on("click", reset);

    const path = d3.geoPath(d3.geoEquirectangular());
    
    const g = svg.append("g")
        .attr("style", "max-width: 100%; height: auto;");

    const countries = g.append("g")
            .attr("fill", "#444")
            .attr("cursor", "pointer")
        .selectAll("path")
        .data(countriesJSON.features)
        .join("path")
            .on("click", clicked)
            .attr("d", path);

    countries.append("title")
        .text(d => d.properties.ADMIN)

    g.append("path")
        .attr("fill", "none")
        .attr("stroke", "white")
        .attr("stroke-linejoin", "round")
        .attr("d", path(countriesJSON.features));

    svg.call(zoom)

    function reset() {
        countries.transition().style("fill", null);
        svg.transition().duration(750).call(
        zoom.transform,
        d3.zoomIdentity,
        d3.zoomTransform(svg.node()).invert([width / 2, height / 2])
        );
    }

    function clicked(event, d) {
        const [[x0, y0], [x1, y1]] = path.bounds(d);
        event.stopPropagation();
        countries.transition().style("fill", null);
        d3.select(this).transition().style("fill", "red");
        svg.transition().duration(750).call(
        zoom.transform,
        d3.zoomIdentity
            .translate(width / 2, height / 2)
            .scale(Math.min(8, 0.9 / Math.max((x1 - x0) / width, (y1 - y0) / height)))
            .translate(-(x0 + x1) / 2, -(y0 + y1) / 2),
        d3.pointer(event, svg.node())
        );
    }
    
    world_map.append(svg.node());


})