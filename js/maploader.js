document.getElementById('map-selector').addEventListener('change', function() {
    loadMap("../db/maps/" + this.value);
});

function loadMap(mapPath) {
    fetch(mapPath)
        .then(response => response.text())
        .then(data => {
            console.log("Map data loaded:", data);  // Debugging step

            let canvas = document.getElementById('mapCanvas');
            let ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            data.split('\n').forEach(line => {
                let parts = line.split(', ');
                if (parts[0] === 'P') { // Parse EQ Map Points
                    let x = parseFloat(parts[1]);
                    let y = parseFloat(parts[2]);
                    let size = parseInt(parts[6]);
                    let color = `rgb(${parts[3]}, ${parts[4]}, ${parts[5]})`;

                    ctx.fillStyle = color;
                    ctx.beginPath();
                    ctx.arc(x, y, size, 0, Math.PI * 2);
                    ctx.fill();
                }
            });
        })
        .catch(error => console.error('Error loading map:", error));
}
