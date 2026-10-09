module polyline(vertices, height) {
    points = [for (i = [0:len(vertices)-1]) [vertices[i][0], vertices[i][1], height]];
    polygon(points);
}

module circle(center, radius, height) {
    translate([center[0], center[1], height]) circle(r = radius);
}

module bulge_to_arc(x, y, bulge, height) {
    if (bulge == 0) {
        polygon([[x, y, height], [x + 120, y, height], [x + 120, y + 25, height], [x + 45, y + 25, height], [x + 25, y + 45, height], [x + 25, y + 100, height], [x, y + 100, height]]);
    } else {
        // Convert bulge to arc
        // This is a simplified conversion, more accurate methods may require trigonometry
        // For simplicity, we assume the bulge is small and use linear approximation
        // Bulge = tan(angle/4) implies angle = 4 * atan(bulge)
        // We approximate the arc by a series of small line segments
        segments = 10;
        angle_per_segment = 4 * atan(bulge) / segments;
        for (i = [0:segments-1]) {
            angle = i * angle_per_segment;
            dx = radius * cos(angle);
            dy = radius * sin(angle);
            next_x = x + dx;
            next_y = y + dy;
            polygon([[x, y, height], [next_x, next_y, height], [next_x, y + 25, height], [x + 45, y + 25, height], [x + 25, y + 45, height], [x + 25, y + 100, height], [x, y + 100, height]]);
        }
    }
}

height = 8;

polyline([[0,0,0],[120,0,0],[120,25,0],[45,25,0],[25,45,0],[25,100,0],[0,100,0]], height)
circle([20,12.5], 5, height)
circle([60,12.5], 5, height)
circle([100,12.5], 5, height)
circle([12.5,55], 4, height)
circle([12.5,90], 4, height)
polyline([[9.5,67,0],[15.5,67,1],[15.5,77,0],[9.5,77,1]], height)