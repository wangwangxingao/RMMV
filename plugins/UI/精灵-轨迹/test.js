/**
 * 
 * @param {*} x 
 * @param {*} y 
 */
function addPoint(x, y) {
    var d_x, d_y;

    d_x = x - positions.back().x;
    d_y = y - positions.back().y;

    if (d_x * d_x + d_y * d_y >= MIN_MOVEMENT) {
        updateStatistic(x, y);
        recognizeGesture();
    }
}

function updateStatistic(x, y) {
    positions.push_back(Point(x, y));
    point_num = positions.size();
    if (point_num > 1) {
        // For Point Recognization
        dist_sum += positions.begin().dist(x, y);
        dist_average = dist_sum / (point_num - 1);

        // For Line Recognization
        // Need a patch for the V0 calculation.
        var v0 = Point(positions[1].x - positions[0].x, positions[0].y);
        var v1 = Point(x - positions[0].x, y - positions[0].y);
        if (normalize(v0) && normalize(v1)) {
            var theta = acos(dot(v0, v1));
            theta_sum += theta;
            theta_sqsum += sq(theta);
            theta_average = theta_sum / (float)(point_num - 1);
            theta_factor = sqrt((point_num - 1) * theta_sqsum - sq(theta_sum)) / (point_num - 1);
        }
    }
    mainDirections = detectDirection(positions);

    //Statistic Update
    pos_x_sum += x;
    pos_y_sum += y;
    pos_xx_sum += sq(x);
    pos_xy_sum += x * y;

    midPoint = Point(pos_x_sum / point_num, pos_y_sum / point_num);
    curGestureRender . render_bbox . addPoint(x, y);
}