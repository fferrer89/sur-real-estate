// Immediately Invoked Function Expression (IIFE)

(async function () {
    const validations = {
        minLteMax(minVal, maxVal) {
            if (minVal > maxVal) {
                throw new RangeError(`Minimum must be smaller than or equal to maximum`);
            }
        }
    }
    const form = document.getElementById('get-listing-form');
    const listingCoordinates = document.getElementsByClassName("listing-coordinates");

    if (form) {
        const minPrice = document.getElementById('minPrice');
        const maxPrice = document.getElementById('maxPrice');
        const minSqft = document.getElementById('minSqft');
        const maxSqft = document.getElementById('maxSqft');
        form.addEventListener('submit', (event) => {
            event.preventDefault(); // prevents the default behavior of the form submission (aka posting (POST) the form data)
            // There was an error from the client side while validating the form
            if (minPrice && maxPrice && minSqft && maxSqft) {
                minPrice.setCustomValidity("");
                try {
                    validations.minLteMax(parseInt(minPrice.value), parseInt(maxPrice.value));
                    // form.submit();
                } catch (e) {
                    minPrice.setCustomValidity(e.message);
                    minPrice.reportValidity();
                }
                minSqft.setCustomValidity("");
                try {
                    validations.minLteMax(parseInt(minSqft.value), parseInt(maxSqft.value));
                } catch (e) {
                    minSqft.setCustomValidity(e.message);
                    minSqft.reportValidity();
                }
                if (minPrice.checkValidity() && minSqft.checkValidity()) {
                    // .checkValidity() -> Returns true if an input element contains valid data.
                    form.submit(); // Both minPrice and minSqft have valid inputs, hence submit form
                }
            }
        })

        /**
         * Event Listeners for the Price Range input elements (minPrice and maxPrice) that set the validationMessage of
         * minPrice to an empty string
         */
        minPrice.addEventListener("input", () => {
            // .setCustomValidity() -> Sets the validationMessage property of an input element.
            minPrice.setCustomValidity("");
        })
        maxPrice.addEventListener("input", () => {
            minPrice.setCustomValidity("");
        })

        /**
         * Event Listeners for the Square Feet Range input elements (maxSqft and minSqft) that set the validationMessage
         * of minSqft to an empty string
         */
        maxSqft.addEventListener("input", () => {
            minSqft.setCustomValidity("");
        })
        minSqft.addEventListener("input", () => {
            minSqft.setCustomValidity("");
        })
    }

    // Listing history
    let listingHistorySection = document.querySelector('#listingHistorySection');
    let listingHistory =  localStorage.getItem('listingHistory');
    // listingHistory ->  [{id: '657786efe400c2dd593621ae', name: 'Broadwarey Av', visits: 4}, {id: '657786efe400c2dd593621ae', name: 'Broadwarey Av', visits: 4}];
    if (listingHistory) {
        const historyText = document.createElement('p');
        historyText.textContent = 'Listings History';
        listingHistorySection.append(historyText);
        // there is a history of listing visits
        // Create an ordered list of anchor for listings
        const ul = document.createElement('ol');
        listingHistorySection.append(ul);

        let li, a;
        listingHistory = JSON.parse(listingHistory);
        listingHistory.forEach((listing) => {
            li = document.createElement('li');
            a = document.createElement('a');
            a.href = `/listings/${listing.id}`
            a.textContent = listing.name;
            li.append(a);
            ul.append(li);
        })
    }

    /**
     * Load the Maps JavaScript API by adding the inline bootstrap loader to your application code
     */
    (g => {
        let h, a, k, p = "The Google Maps JavaScript API", c = "google", l = "importLibrary", q = "__ib__",
            m = document, b = window;
        b = b[c] || (b[c] = {});
        let d = b.maps || (b.maps = {}), r = new Set, e = new URLSearchParams,
            u = () => h || (h = new Promise(async (f, n) => {
                await (a = m.createElement("script"));
                e.set("libraries", [...r] + "");
                for (k in g) e.set(k.replace(/[A-Z]/g, t => "_" + t[0].toLowerCase()), g[k]);
                e.set("callback", c + ".maps." + q);
                a.src = `https://maps.${c}apis.com/maps/api/js?` + e;
                d[q] = f;
                a.onerror = () => h = n(Error(p + " could not load."));
                a.nonce = m.querySelector("script[nonce]")?.nonce || "";
                m.head.append(a)
            }));
        d[l] ? console.warn(p + " only loads once. Ignoring:", g) : d[l] = (f, ...n) => r.add(f) && u().then(() => d[l](f, ...n))
    })({
        key: "AIzaSyC9_iw7GAf2QkVw5tijEynNDKZXWQaoM_s",
        v: "weekly",
        // Use the 'v' parameter to indicate the version to use (weekly, beta, alpha, etc.).
        // Add other bootstrap parameters as needed, using camel case.
    });


    async function initMap() {

        // Request needed libraries.
        const { Map, InfoWindow } = await google.maps.importLibrary("maps");
        const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary(
            "marker",
        );
        const map = new Map(document.getElementById("map"), {
            zoom: 3,
            center: { lat: 41.1413571, lng: -90.5319137},
            mapId: "DEMO_MAP_ID",
        });
        const infoWindow = new InfoWindow({
            content: "",
            disableAutoPan: true,
        });
        // Create an array of alphabetical characters used to label the markers.
        const labels = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        // Add some markers to the map.
        const markers = locations.map((position, i) => {
            const label = labels[i % labels.length];
            const pinGlyph = new PinElement({
                glyph: label,
                glyphColor: "white",
            });
            const marker = new AdvancedMarkerElement({
                position,
                content: pinGlyph.element,
            });

            // markers can only be keyboard focusable when they have click listeners
            // open info window when marker is clicked
            marker.addListener("click", () => {
                infoWindow.setContent(position.anchor);
                infoWindow.open(map, marker);
            });
            return marker;
        });

        // Add a marker clusterer to manage the markers.
        new markerClusterer.MarkerClusterer({ markers, map });
    }

    let locations = [];
    if (listingCoordinates) {
        for (let element of listingCoordinates) {
            let lat = element.getAttributeNode('data-lat');
            let lng = element.getAttributeNode('data-lng');
            if (lat && lng) {
                // locations.push({lat: parseFloat(lat.value), lng: parseFloat(lng.value)});
                locations.push({
                    lat: parseFloat(lat.value),
                    lng: parseFloat(lng.value),
                    anchor: element
                });
            }
        }
    }
    await initMap();

})();
