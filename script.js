"use strict"

let censusSelect = document.getElementById("census_benchmark");
let oneLineAddress = document.getElementById("oneline_address");
let submit_button = document.getElementById("submit");
let resultsContainer = document.getElementById("results");
let baseURL = "https://geocoding.geo.census.gov/geocoder/locations/onelineaddress";

//fetch benchmarks from geocoder api
fetch(new Request("https://geocoding.geo.census.gov/geocoder/benchmarks")).then(
    (stream) => stream.json()).then(
        (jsObj) => {
            censusSelect.options.length = 0;
            jsObj.benchmarks.forEach((bm) => {
                let newOption = document.createElement('option');
                newOption.textContent = bm.benchmarkName;
                newOption.value = bm.id;
                censusSelect.appendChild(newOption);
            })
        }
);

submit_button.addEventListener("click", () => {
    let params = new URLSearchParams({
        address: oneLineAddress.value,
        benchmark: censusSelect.value,
        format: "json"
    });

    fetch(new Request(`${baseURL}?${params.toString()}`)).then(
    (stream) => stream.json()).then(
        (jsObj) => {
            const match = jsObj.result?.addressMatches?.[0];
            if(match){
                let addr = document.createElement("p");
                addr.textContent = `Matched Address: ${match.matchedAddress}`;

                let lat = match.coordinates.x;
                let lng = match.coordinates.y;
                let coords = document.createElement("p");
                coords.textContent = `X: ${lat}, Y: ${lng}`;

                let mapEmbed = document.createElement("iframe");
                mapEmbed.width = "400";
                mapEmbed.height = "400";

                let apiKey = "AIzaSyCUrXltBNrIPML-9uX-OeHpo6ZPVHs8Zf4";

                let encodedAddr = encodeURIComponent(match.matchedAddress);
                mapEmbed.src = `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${encodedAddr}&center=${lng},${lat}&zoom=15`;

                resultsContainer.append(addr, coords, mapEmbed);

            }
            else{
                let err = document.createElement("p");
                err.textContent = "No matches found...";
                resultsContainer.append(err);
            }
            
        }
    );
});
