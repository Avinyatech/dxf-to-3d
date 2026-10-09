linear_extrude(height = 30)
  difference() {
    polygon(points = [
      [12,0], [270,0], [282,12], [282,178], [270,190], [12,190], [0,178], [0,12],
      [91,47.5], [109,47.5], [109,54.5], [91,54.5],
      [91,135.5], [109,135.5], [109,142.5], [91,142.5],
      [173,47.5], [191,47.5], [191,54.5], [173,54.5],
      [173,135.5], [191,135.5], [191,142.5], [173,142.5]
    ]);
    translate([59,95]) circle(r = 37, $fn = 64);
    translate([141,95]) circle(r = 37, $fn = 64);
    translate([223,95]) circle(r = 37, $fn = 64);
    translate([18,33]) circle(r = 5.5, $fn = 64);
    translate([18,157]) circle(r = 5.5, $fn = 64);
    translate([100,33]) circle(r = 5.5, $fn = 64);
    translate([100,157]) circle(r = 5.5, $fn = 64);
    translate([182,33]) circle(r = 5.5, $fn = 64);
    translate([182,157]) circle(r = 5.5, $fn = 64);
    translate([264,33]) circle(r = 5.5, $fn = 64);
    translate([264,157]) circle(r = 5.5, $fn = 64);
    translate([100,125]) circle(r = 6, $fn = 64);
    translate([182,65]) circle(r = 6, $fn = 64);
    translate([30,145]) circle(r = 4, $fn = 64);
    translate([252,45]) circle(r = 4, $fn = 64);
  }