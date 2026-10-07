linear_extrude(height = 12)
  difference() {
    polygon([[0,0],[120,0],[120,80],[0,80]]);
    translate([15,15]) circle(r = 5, $fn = 64);
    translate([105,15]) circle(r = 5, $fn = 64);
    translate([15,65]) circle(r = 5, $fn = 64);
    translate([105,65]) circle(r = 5, $fn = 64);
    polygon([[40,25],[80,25],[80,55],[40,55]]);
  }