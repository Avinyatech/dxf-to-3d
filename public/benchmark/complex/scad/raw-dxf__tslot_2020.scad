// DXF to OpenSCAD conversion

// Define the thickness of the extrusion
thickness = 40;

// Define the points of the LWPOLYLINE
points = [
  [-10, -10], [-3.1, -10], [-4.5, -8.2], [-4.5, -5], [4.5, -5], [3.1, -3.1], [10, -3.1], [10, -10],
  [8.2, -8.2], [5, -8.2], [5, -4.5], [8.2, -4.5], [8.2, -3.1], [10, -3.1], [10, 3.1], [8.2, 3.1],
  [8.2, 4.5], [5, 4.5], [5, 8.2], [8.2, 8.2], [8.2, 10], [3.1, 10], [3.1, 8.2], [4.5, 8.2],
  [4.5, 5], [-4.5, 5], [-3.1, 3.1], [-10, 3.1], [-10, 10], [-8.2, 10], [-8.2, 8.2], [-5, 8.2],
  [-5, 4.5], [-8.2, 4.5], [-8.2, 3.1], [-10, 3.1], [-10, -3.1], [-8.2, -3.1], [-8.2, -4.5], [-5, -4.5],
  [-5, -8.2], [-8.2, -8.2], [-8.2, -10], [-3.1, -10]
];

// Create the polygon from the points
polygon(points);

// Function to create a polygon from a list of points
module polygon(points) {
  linear_extrude(height = thickness) {
    polygon(points);
  }
}