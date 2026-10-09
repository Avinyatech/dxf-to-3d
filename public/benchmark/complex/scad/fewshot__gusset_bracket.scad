linear_extrude(height = 8)
  difference() {
    polygon([[0,0],[120,0],[120,25],[45,25],[25,45],[25,100],[0,100]]);
    translate([20,12.5]) circle(r = 5, $fn = 64);
    translate([60,12.5]) circle(r = 5, $fn = 64);
    translate([100,12.5]) circle(r = 5, $fn = 64);
    translate([12.5,55]) circle(r = 4, $fn = 64);
    translate([12.5,90]) circle(r = 4, $fn = 64);
    polygon([[9.5,67],[15.5,67],[15.5,77],[9.5,77]]);
  }