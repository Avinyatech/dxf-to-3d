linear_extrude(height = 10)
  difference() {
    polygon([[15,0],[7.5,12.99],[-7.5,12.99],[-15,0],[-7.5,-12.99],[7.5,-12.99]]);
    translate([0,0]) circle(r = 7, $fn = 64);
  }