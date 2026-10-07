linear_extrude(height = 6)
  difference() {
    polygon([[0,0],[80,0],[80,40],[0,40]]);
    polygon([[25,15],[55,15],[55,25],[25,25]]);
  }