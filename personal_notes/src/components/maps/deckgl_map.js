document.addEventListener("DOMContentLoaded", async (e) => {

    const d3 =  await import("https://cdn.jsdelivr.net/npm/d3@7/+esm");
    const parquetWASM = await import("https://cdn.jsdelivr.net/npm/parquet-wasm@0.6.0/esm/+esm")
    const arrow = await import("https://cdn.jsdelivr.net/npm/apache-arrow@19.0.0/+esm");
    const arrowJSFFI = await import("https://cdn.jsdelivr.net/npm/arrow-js-ffi@0.4.2/+esm")

    await parquetWASM.default();
    const WASM_MEMORY = parquetWASM.wasmMemory();

    const allPostsResponse = await fetch("/posts.json")
    const allPosts = await allPostsResponse.json()

    const countriesParquetResp = await fetch("/spatial/countries.parquet")
    const parquetUint8Array = new Uint8Array(await countriesParquetResp.arrayBuffer())
    const wasmArrowTable =  parquetWASM.readParquet(parquetUint8Array).intoFFI();

    /** @type {arrow.Table} */
    const table = arrowJSFFI.parseTable(
        WASM_MEMORY.buffer,
        wasmArrowTable.arrayAddrs(),
        wasmArrowTable.schemaAddr()
    )

    console.log(table.getChild('geometry'))

    wasmArrowTable.drop();

    // We want a scrollable map of the word colour ramped by the number of posts
    // from that country. When you click on a country - it brings you to a route 
    // of posts from that country



    // Declare the chart dimensions and margins.
    const width = 640;
    const height = 400;
    const marginTop = 20;
    const marginRight = 20;
    const marginBottom = 30;
    const marginLeft = 40;

    // Declare the x (horizontal position) scale.
    const x = d3.scaleUtc()
        .domain([new Date("2023-01-01"), new Date("2024-01-01")])
        .range([marginLeft, width - marginRight]);

    // Declare the y (vertical position) scale.
    const y = d3.scaleLinear()
        .domain([0, 100])
        .range([height - marginBottom, marginTop]);

    // Create the SVG container.
    const svg = d3.create("svg")
        .attr("width", width)
        .attr("height", height);

    // Add the x-axis.
    svg.append("g")
        .attr("transform", `translate(0,${height - marginBottom})`)
        .call(d3.axisBottom(x));

    // Add the y-axis.
    svg.append("g")
        .attr("transform", `translate(${marginLeft},0)`)
        .call(d3.axisLeft(y));

    // Append the SVG element.
    world_map.append(svg.node());


})