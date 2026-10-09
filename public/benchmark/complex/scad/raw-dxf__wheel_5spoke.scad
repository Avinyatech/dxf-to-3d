// DXF drawing to OpenSCAD model

// Circle definitions
circle1 = [0, 0, 120];
circle2 = [0, 0, 20];
circle3 = [27.5066, 19.9847, 6];
circle4 = [-10.5066, 32.3359, 6];
circle5 = [-34, 0, 6];
circle6 = [-10.5066, -32.3359, 6];
circle7 = [27.5066, -19.9847, 6];

// Polyline definitions
polyline1 = [[48.9074, 10.3956], [25, 43.3013], [50, 86.6025], [97.8148, 20.7912], [-66.9131, 74.3145], [-91.3545, 99.4522], [-91.3545, -40.6737], [-66.9131, -74.3145], [50, -86.6025], [97.8148, -20.7912], [25, -43.3013], [48.9074, -10.3956]];
polyline2 = [[-33.4565, 37.1572], [-66.9131, 74.3145], [10.4528, 99.4522], [50, 86.6025], [97.8148, 20.7912], [10.4528, -99.4522], [-66.9131, -74.3145], [-33.4565, -37.1572]];
polyline3 = [[-45.6773, 20.3368], [-45.6773, -20.3368], [-91.3545, -40.6737], [-91.3545, 40.6737]];

// Extrude the shapes
circle_solid = [for (i = [1:7]) circle(circle1[2], $fn=64)];
circle_solids = [for (i = [1:7]) translate([circle1[0], circle1[1], 0]) rotate([0, 0, i*45]) circle_solid];

polyline_solid = [for (i = [0:11]) polygon(points=polyline1[i], $fn=4)];
polyline_solids = [for (i = [0:11]) translate([polyline1[i][0], polyline1[i][1], 0]) rotate([0, 0, i*30]) polyline_solid];

polyline2_solid = [for (i = [0:7]) polygon(points=polyline2[i], $fn=4)];
polyline2_solids = [for (i = [0:7]) translate([polyline2[i][0], polyline2[i][1], 0]) rotate([0, 0, i*45]) polyline2_solid];

// Combine all solids
final_solid = union() {
  for (i = [0:6]) difference() {
    translate([circle1[0], circle1[1], 0]) rotate([0, 0, i*45]) circle(circle1[2], $fn=64);
    translate([circle1[0], circle1[1], 0]) rotate([0, 0, i*45]) circle(circle2[2], $fn=64);
  }
  for (i = [0:11]) translate([polyline1[i][0], polyline1[i][1], 0]) rotate([0, 0, i*30]) polygon(points=polyline1[i], $fn=4);
  for (i = [0:7]) translate([polyline2[i][0], polyline2[i][1], 0]) rotate([0, 0, i*45]) polygon(points=polyline2[i], $fn=4);
};

// Scale and extrude to final depth
scale([1, 1, 8/circle1[2]]) final_solid;