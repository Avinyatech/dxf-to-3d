module poly_extrude(h, l_scale = 1, orient = [0, 0, 0], scale = [1, 1, 1]) {
    scale([l_scale, l_scale, l_scale]) rotate(orient) scale(scale) linear_extrude(height = h) children();
}

module circle_extrude(h, r, l_scale = 1, orient = [0, 0, 0], scale = [1, 1, 1]) {
    scale([l_scale, l_scale, l_scale]) rotate(orient) scale(scale) linear_extrude(height = h) circle(r);
}

module polyline_extrude(h, points, closed = true, l_scale = 1, orient = [0, 0, 0], scale = [1, 1, 1]) {
    scale([l_scale, l_scale, l_scale]) rotate(orient) scale(scale) linear_extrude(height = h) polygon(points = points, closed = closed);
}

polyline_extrude(20, [[-3, -29.8496], [148.5, -14.9248], [148.5, 14.9248], [-3, 29.8496]], closed = true)
    circle_extrude(20, 22, closed = true)
        circle(9);