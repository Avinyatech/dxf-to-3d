linear_extrude(height = 3)
  difference() {
    circle(r = 20, $fn = 64);
    circle(r = 9, $fn = 64);
  }