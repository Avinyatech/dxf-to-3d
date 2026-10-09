// Define the vertices of the polyline
vertices = [[12,0,0],[270,0,0.414],[282,12,0],[282,178,0.414],[270,190,0],[12,190,0.414],[0,178,0],[0,12,0.414]];

// Create the base polygon from the vertices
polygon = polygon2d(vertices);

// Define the circles
circle1 = circle(r=37, $fn=60);
circle2 = circle(r=37, $fn=60);
circle3 = circle(r=37, $fn=60);
circle4 = circle(r=5.5, $fn=60);
circle5 = circle(r=5.5, $fn=60);
circle6 = circle(r=5.5, $fn=60);
circle7 = circle(r=5.5, $fn=60);
circle8 = circle(r=5.5, $fn=60);
circle9 = circle(r=5.5, $fn=60);
circle10 = circle(r=5.5, $fn=60);

// Define the circles' positions
translate([59, 95, 0]) circle1_instance = translate([0, 0, 0]) circle1;
translate([141, 95, 0]) circle2_instance = translate([0, 0, 0]) circle2;
translate([223, 95, 0]) circle3_instance = translate([0, 0, 0]) circle3;
translate([18, 33, 0]) circle4_instance = translate([0, 0, 0]) circle4;
translate([18, 157, 0]) circle5_instance = translate([0, 0, 0]) circle5;
translate([100, 33, 0]) circle6_instance = translate([0, 0, 0]) circle6;
translate([100, 157, 0]) circle7_instance = translate([0, 0, 0]) circle7;
translate([182, 33, 0]) circle8_instance = translate([0, 0, 0]) circle8;
translate([182, 157, 0]) circle9_instance = translate([0, 0, 0]) circle9;
translate([264, 33, 0]) circle10_instance = translate([0, 0, 0]) circle10;
translate([264, 157, 0]) circle10_instance = translate([0, 0, 0]) circle10;

// Define the circles' positions
translate([91, 47.5, 0]) circle_instance1 = translate([0, 0, 0]) circle(r=47.5, $fn=60);
translate([109, 47.5, 0]) circle_instance2 = translate([0, 0, 0]) circle(r=47.5, $fn=60);
translate([109, 54.5, 0]) circle_instance3 = translate([0, 0, 0]) circle(r=54.5, $fn=60);
translate([91, 54.5, 0]) circle_instance4 = translate([0, 0, 0]) circle(r=54.5, $fn=60);

translate([91, 135.5, 0]) circle_instance5 = translate([0, 0, 0]) circle(r=135.5, $fn=60);
translate([109, 135.5, 0]) circle_instance6 = translate([0, 0, 0]) circle(r=135.5, $fn=60);
translate([109, 142.5, 0]) circle_instance7 = translate([0, 0, 0]) circle(r=142.5, $fn=60);
translate([91, 142.5, 0]) circle_instance8 = translate([0, 0, 0]) circle(r=142.5, $fn=60);

// Define the circles' positions
translate([100, 125, 0]) circle_instance9 = translate([0, 0, 0]) circle(r=125, $fn=60);
translate([182, 65, 0]) circle_instance10 = translate([0, 0, 0]) circle(r=65, $fn=60);
translate([30, 145, 0]) circle_instance11 = translate([0, 0, 0]) circle(r=145, $fn=60);
translate([252, 45, 0]) circle_instance12 = translate([0, 0, 0]) circle(r=45, $fn=60);

// Extrude the polygon
extruded_polygon = linear_extrude(height=30, center=false) polygon(vertices);

// Subtract the circles from the extruded polygon
final_solid = extruded_polygon - circle1_instance - circle2_instance - circle3_instance - circle4_instance - circle5_instance - circle6_instance - circle7_instance - circle8_instance - circle9_instance - circle10_instance - circle_instance1 - circle_instance2 - circle_instance3 - circle_instance4 - circle_instance5 - circle_instance6 - circle_instance7 - circle_instance8 - circle_instance9 - circle_instance10 - circle_instance11 - circle_instance12;

// Display the final solid
final_solid;