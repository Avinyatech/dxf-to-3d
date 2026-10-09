// Define the radii and centers of the circles
circle_radius = 120;
hole_radius = 20;
holes = [
  [27.507, 19.985],
  [-10.507, 32.336],
  [-34, 0],
  [-10.507, -32.336],
  [27.507, -19.985]
];

// Define the vertices of the polygons
polygon1 = [
  [48.907, 10.396, 0],
  [25, 43.301, 0.213],
  [50, 86.603, 0],
  [97.815, 20.791, -0.213]
];

polygon2 = [
  [5.226, 49.726, 0],
  [-33.456, 37.157, 0.213],
  [-66.913, 74.314, 0],
  [10.453, 99.452, -0.213]
];

polygon3 = [
  [-45.677, 20.337, 0],
  [-45.677, -20.337, 0.213],
  [-91.355, -40.674, 0],
  [-91.355, 40.674, -0.213]
];

polygon4 = [
  [-33.456, -37.157, 0],
  [5.226, -49.726, 0.213],
  [10.453, -99.452, 0],
  [-66.913, -74.314, -0.213]
];

polygon5 = [
  [25, -43.301, 0],
  [48.907, -10.396, 0.213],
  [97.815, -20.791, 0],
  [50, -86.603, -0.213]
];

// Create the circles
circles = [
  for (i = [0:5]) circle(hole_radius, $fn=60) translate([holes[i][0], holes[i][1], 0])
];

// Create the polygons
polygons = [
  polygon(polygon1),
  polygon(polygon2),
  polygon(polygon3),
  polygon(polygon4),
  polygon(polygon5)
];

// Extrude the shapes
module polygon(vertices) {
  path = [for (v = vertices) [v[0], v[1]]];
  polyhedron(points = path, faces = [[0:len(path)-1]]);
}

difference() {
  cylinder(r=circle_radius, h=8, $fn=60);
  for (circle = circles) {
    circle();
  }
  for (polygon = polygons) {
    polygon();
  }
}