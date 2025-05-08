document.getElementById('map-selector').addEventListener('change', function() {
    loadMap("../db/maps/" + this.value);
});

function loadMap(mapPath) {
    fetch(mapPath)
        .then(response => response.text())
        .then(data => {
            console.log("Map file content loaded:", data);  // Debugging step to verify data is received

            let canvas = document.getElementById('mapCanvas');
            let ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            let scaleFactor = 0.5; // Adjust as needed
            data.split('\n').forEach(line => {
                let parts = line.split(', ');
                if (parts[0] === 'P') { // Parse EQ Map Points
                    let x = parseFloat(parts[1]) * scaleFactor;
                    let y = parseFloat(parts[2]) * scaleFactor;
                    let size = parseInt(parts[6]) || 5; // Default size if missing
                    let color = `rgb(${parts[3]}, ${parts[4]}, ${parts[5]})`;

                    ctx.fillStyle = color;
                    ctx.beginPath();
                    ctx.arc(x, y, size, 0, Math.PI * 2);
                    ctx.fill();
                }
            });

            console.log("Map rendering complete.");
        })
        .catch(error => console.error('Error loading map:', error));
}
