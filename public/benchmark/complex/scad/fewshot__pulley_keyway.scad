linear_extrude(height = 20)
  union() {
    circle(r = 45, $fn = 64);
    polygon([[2, 9.798, 0], [2, 11.5, 0], [-2, 11.5, 0], [-2, 9.798, 9.899]]);
    translate([28, 0]) circle(r = 8, $fn = 64);
    translate([14, 24.249]) circle(r = 8, $fn = 64);
    translate([-14, 24.249]) circle(r = 8, $fn = 64);
    translate([-28, 0]) circle(r = 8, $fn = 64);
    translate([-14, -24.249]) circle(r = 8, $fn = 64);
    translate([14, -24.249]) circle(r = 8, $fn = 64);
  }