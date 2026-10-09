// DXF drawing to OpenSCAD

// Define the circles
circle1 = [0, 0, 7];
circle2 = [0, 0, 7];
circle3 = [62, 0, 7];
circle4 = [43.8406, 43.8406, 7];
circle5 = [43.8406, -43.8406, 7];
circle6 = [-62, 0, 7];
circle7 = [-43.8406, -43.8406, 7];
circle8 = [-43.8406, 43.8406, 7];
circle9 = [17.2208, 41.5746, 3];
circle10 = [-17.2208, 41.5746, 3];
circle11 = [-41.5746, -17.2208, 3];
circle12 = [41.5746, -17.2208, 3];

// Create the circles as cylinders
cylinder1 = circle(d = 14, $fn = 60, center = true);
cylinder2 = circle(d = 14, $fn = 60, center = true);
cylinder3 = circle(d = 14, $fn = 60, center = true);
cylinder4 = circle(d = 14, $fn = 60, center = true);
cylinder5 = circle(d = 14, $fn = 60, center = true);
cylinder6 = circle(d = 14, $fn = 60, center = true);
cylinder7 = circle(d = 14, $fn = 60, center = true);
cylinder8 = circle(d = 14, $fn = 60, center = true);
cylinder9 = circle(d = 6, $fn = 60, center = true);
cylinder10 = circle(d = 6, $fn = 60, center = true);
cylinder11 = circle(d = 6, $fn = 60, center = true);
cylinder12 = circle(d = 6, $fn = 60, center = true);

// Translate the circles to their respective positions
translate([circle1[0], circle1[1], 0]) cylinder1;
translate([circle2[0], circle2[1], 0]) cylinder2;
translate([circle3[0], circle3[1], 0]) cylinder3;
translate([circle4[0], circle4[1], 0]) cylinder4;
translate([circle5[0], circle5[1], 0]) cylinder5;
translate([circle6[0], circle6[1], 0]) cylinder6;
translate([circle7[0], circle7[1], 0]) cylinder7;
translate([circle8[0], circle8[1], 0]) cylinder8;
translate([circle9[0], circle9[1], 0]) cylinder9;
translate([circle10[0], circle10[1], 0]) cylinder10;
translate([circle11[0], circle11[1], 0]) cylinder11;
translate([circle12[0], circle12[1], 0]) cylinder12;

// Extrude the circles to create a 3D solid
linear_extrude(height = 15) {
  union() {
    translate([circle1[0], circle1[1], 0]) circle(d = 14, $fn = 60);
    translate([circle2[0], circle2[1], 0]) circle(d = 14, $fn = 60);
    translate([circle3[0], circle3[1], 0]) circle(d = 14, $fn = 60);
    translate([circle4[0], circle4[1], 0]) circle(d = 14, $fn = 60);
    translate([circle5[0], circle5[1], 0]) circle(d = 14, $fn = 60);
    translate([circle6[0], circle6[1], 0]) circle(d = 14, $fn = 60);
    translate([circle7[0], circle7[1], 0]) circle(d = 14, $fn = 60);
    translate([circle8[0], circle8[1], 0]) circle(d = 14, $fn = 60);
    translate([circle9[0], circle9[1], 0]) circle(d = 6, $fn = 60);
    translate([circle10[0], circle10[1], 0]) circle(d = 6, $fn = 60);
    translate([circle11[0], circle11[1], 0]) circle(d = 6, $fn = 60);
    translate([circle12[0], circle12[1], 0]) circle(d = 6, $fn = 60);
  }
}