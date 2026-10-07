linear_extrude(height = 10)
  difference() {
    square([100, 60]);
    translate([20, 30]) circle(r = 8, $fn = 64);
    translate([80, 30]) circle(r = 8, $fn = 64);
  }