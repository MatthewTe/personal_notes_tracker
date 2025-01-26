
document.addEventListener("DOMContentLoaded", async (e) => {
    const L = await import('https://cdn.jsdelivr.net/npm/leaflet@1.9.4/+esm')

    var map = L.map('world_map').setView([0.064501, -6.926427], 2)

    L.tileLayer('https://basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png', {
        attribution:'&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attributions">CARTO</a>',
        maxZoom: 20,
        minZoom: 0
    }).addTo(map);

    const countryResp = await fetch("/spatial/countries.geojson");
    const countryJSON = await countryResp.json();

    L.geoJSON(countryJSON, {
        onEachFeature: (feature, layer) => {
            layer.bindPopup(feature.properties.ADMIN, {closeButton: false, offset: L.point(0, -40)})
            layer.on("mouseover", (e) => layer.openPopup());
            layer.on("mouseout", (e) => layer.closePopup());

            layer.on("click", (e) => {
                window.location.href = `/posts/${feature.properties.ADMIN}`
            })

        }
    }).addTo(map)

})