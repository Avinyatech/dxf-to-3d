module solid() {
    // First rectangle
    polygon(points=[[0,0],[80,0],[80,40],[0,40]]);
    
    // Second rectangle with holes
    translate([25, 15]) {
        scale([1, 1, 1]) {
            polygon(points=[[0,0],[55,0],[55,25],[0,25]]);
        }
    }
}

linear_extrude(height=6) {
    solid();
}