fetch("db/maps/blackburrow.txt") 
  .then(response => response.text())
  .then(data => {
    const lines = data.split("\n");
    lines.forEach(line => {
      if (line.startsWith("L")) {
        const parts = line.split(",");
        const [x1, y1, z1, x2, y2, z2, r, g, b] = parts.slice(1).map(parseFloat);
        drawLine(x1, y1, x2, y2, `rgb(${r}, ${g}, ${b})`);
      }
    });
  })
  .catch(error => console.error("Error loading map:", error));