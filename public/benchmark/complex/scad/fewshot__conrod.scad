linear_extrude(height = 20)
  difference() {
    polygon([[-3,-29.85],[148.5,-14.925],[148.5,14.925],[-3,29.85]]);
    translate([0,0]) circle(r = 22, $fn = 64);
    translate([150,0]) circle(r = 9, $fn = 64);
    polygon([[55,-4],[95,-4],[95,4],[55,4]]);
  }