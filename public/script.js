document.addEventListener("DOMContentLoaded", function() {
    var map = L.map("map").setView([0, 0], 2); // Widok mapy

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
        maxZoom: 18,
    }).addTo(map);

    var pointList = document.getElementById("point-list");
    var pointInput = document.getElementById("point-input");
    var addPointButton = document.getElementById("add-point");
    var markers = L.markerClusterGroup(); // Zgrupowane markery

    // Lista z min. 10 punktami
    for (var i = 1; i <= 10; i++) {
        addPointToList("Point " + i);
    }

    addPointButton.addEventListener("click", function() {
        var pointText = pointInput.value;
        if (pointText) {
            addPointToList(pointText);
            pointInput.value = "";
        }
    });

    function addPointToList(pointText) {
        var listItem = document.createElement("li");
        listItem.textContent = pointText;

        var removeButton = document.createElement("button");
        removeButton.textContent = "Remove";
        removeButton.addEventListener("click", function() {
            pointList.removeChild(listItem);
            markers.eachLayer(function(layer) {
                if (layer.options.title === pointText) {
                    markers.removeLayer(layer);
                }
            });
            map.removeLayer(markers);
            map.addLayer(markers);
        });

        listItem.appendChild(removeButton);
        pointList.appendChild(listItem);

        var marker = L.marker(getRandomLatLng(), { title: pointText }); // Add marker with title
        marker.bindPopup(pointText);
        markers.addLayer(marker); // Dodawanie markera do grupy
        map.addLayer(markers); // Dodawanie grupy do mapy

        listItem.addEventListener("click", function() {
            map.on("click", onMapClick); // Crosshair  na mapie
            listItem.style.cursor = "crosshair";
        });

        function onMapClick(e) {
            var newMarker = L.marker(e.latlng, { title: pointText });
            newMarker.bindPopup(pointText);
            markers.addLayer(newMarker);
            map.addLayer(markers);
            map.off("click", onMapClick); // Wylaczenie crosshair
            listItem.style.cursor = "default";
        }
    }

    function getRandomLatLng() {
        var lat = Math.random() * 180 - 90;
        var lng = Math.random() * 360 - 180;
        return [lat, lng];
    }
});
