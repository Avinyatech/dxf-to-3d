linear_extrude(height = 15)
  union() {
    circle(r = 90, $fn = 64);
    circle(r = 30, $fn = 64);
    translate([62, 0]) circle(r = 7, $fn = 64);
    translate([43.841, 43.841]) circle(r = 7, $fn = 64);
    translate([0, 62]) circle(r = 7, $fn = 64);
    translate([-43.841, 43.841]) circle(r = 7, $fn = 64);
    translate([-62, 0]) circle(r = 7, $fn = 64);
    translate([-43.841, -43.841]) circle(r = 7, $fn = 64);
    translate([0, -62]) circle(r = 7, $fn = 64);
    translate([43.841, -43.841]) circle(r = 7, $fn = 64);
    translate([41.575, 17.221]) circle(r = 3, $fn = 64);
    translate([-17.221, 41.575]) circle(r = 3, $fn = 64);
    translate([-41.575, -17.221]) circle(r = 3, $fn = 64);
    translate([17.221, -41.575]) circle(r = 3, $fn = 64);
  }