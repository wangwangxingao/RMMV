
(function () {
    //
    // Point class
    //
    function Point(x, y, id) // constructor
    {
        this.X = x;
        this.Y = y;
        this.ID = id; // stroke ID to which this point belongs (1,2,...)
    }
    //
    // PointCloud class: a point-cloud template
    //
    function PointCloud(name, points) // constructor
    {
        this.Name = name;
        this.Points = Resample(points, NumPoints);
        this.Points = Scale(this.Points);
        this.Points = TranslateTo(this.Points, Origin);
    }
    //
    // Result class
    //
    function Result(name, score) // constructor
    {
        this.Name = name;
        this.Score = score;
    }
    //
    // PDollarRecognizer class constants
    //
    var NumPoints = 32;
    var Origin = new Point(0, 0, 0);

    //
    // PDollarRecognizer class
    //
    function PDollarRecognizer(_NumPoints, _Origin) // constructor
    {
        //
        // The $P Point-Cloud Recognizer API begins here --
        // 3 methods: Recognize(), AddGesture(), DeleteUserGestures()
        //

        if (typeof _NumPoints !== 'undefined') {
            NumPoints = _NumPoints;
        }

        if (typeof _Origin !== 'undefined') {
            Origin = _Origin;
        }

        this.PointClouds = [];

        this.Recognize = function (points) {
            points = Resample(points, NumPoints);
            points = Scale(points);
            points = TranslateTo(points, Origin);

            var b = +Infinity;
            var u = -1;
            for (var i = 0; i < this.PointClouds.length; i++) // for each point-cloud template
            {
                var d = GreedyCloudMatch(points, this.PointClouds[i]);
                if (d < b) {
                    b = d; // best (least) distance
                    u = i; // point-cloud
                }
            }
            return (u == -1) ? new Result("No match.", 0.0) : new Result(this.PointClouds[u].Name, Math.max((b - 2.0) / -2.0, 0.0));
        };
        this.AddGesture = function (name, points) {
            this.PointClouds[this.PointClouds.length] = new PointCloud(name, points);
            var num = 0;
            for (var i = 0; i < this.PointClouds.length; i++) {
                if (this.PointClouds[i].Name == name)
                    num++;
            }
            return num;
        };
        this.DeleteUserGestures = function () {
            this.PointClouds.length = 0; // clear any beyond the original set
            return 0;
        };
    }

    function initDefaultGestures(recognizer) {
        //
        // one predefined point-cloud for each gesture
        //
        recognizer.AddGesture("T", new Array(
            new Point(30, 7, 1), new Point(103, 7, 1),
            new Point(66, 7, 2), new Point(66, 87, 2)
        ));
        recognizer.AddGesture("N", new Array(
            new Point(177, 92, 1), new Point(177, 2, 1),
            new Point(182, 1, 2), new Point(246, 95, 2),
            new Point(247, 87, 3), new Point(247, 1, 3)
        ));
        recognizer.AddGesture("D", new Array(
            new Point(345, 9, 1), new Point(345, 87, 1),
            new Point(351, 8, 2), new Point(363, 8, 2), new Point(372, 9, 2), new Point(380, 11, 2), new Point(386, 14, 2), new Point(391, 17, 2), new Point(394, 22, 2), new Point(397, 28, 2), new Point(399, 34, 2), new Point(400, 42, 2), new Point(400, 50, 2), new Point(400, 56, 2), new Point(399, 61, 2), new Point(397, 66, 2), new Point(394, 70, 2), new Point(391, 74, 2), new Point(386, 78, 2), new Point(382, 81, 2), new Point(377, 83, 2), new Point(372, 85, 2), new Point(367, 87, 2), new Point(360, 87, 2), new Point(355, 88, 2), new Point(349, 87, 2)
        ));
        recognizer.AddGesture("P", new Array(
            new Point(507, 8, 1), new Point(507, 87, 1),
            new Point(513, 7, 2), new Point(528, 7, 2), new Point(537, 8, 2), new Point(544, 10, 2), new Point(550, 12, 2), new Point(555, 15, 2), new Point(558, 18, 2), new Point(560, 22, 2), new Point(561, 27, 2), new Point(562, 33, 2), new Point(561, 37, 2), new Point(559, 42, 2), new Point(556, 45, 2), new Point(550, 48, 2), new Point(544, 51, 2), new Point(538, 53, 2), new Point(532, 54, 2), new Point(525, 55, 2), new Point(519, 55, 2), new Point(513, 55, 2), new Point(510, 55, 2)
        ));
        recognizer.AddGesture("X", new Array(
            new Point(30, 146, 1), new Point(106, 222, 1),
            new Point(30, 225, 2), new Point(106, 146, 2)
        ));
        recognizer.AddGesture("H", new Array(
            new Point(188, 137, 1), new Point(188, 225, 1),
            new Point(188, 180, 2), new Point(241, 180, 2),
            new Point(241, 137, 3), new Point(241, 225, 3)
        ));
        recognizer.AddGesture("I", new Array(
            new Point(371, 149, 1), new Point(371, 221, 1),
            new Point(341, 149, 2), new Point(401, 149, 2),
            new Point(341, 221, 3), new Point(401, 221, 3)
        ));
        recognizer.AddGesture("exclamation", new Array(
            new Point(526, 142, 1), new Point(526, 204, 1),
            new Point(526, 221, 2)
        ));
        recognizer.AddGesture("line", new Array(
            new Point(12, 347, 1), new Point(119, 347, 1)
        ));
        recognizer.AddGesture("five-point star", new Array(
            new Point(177, 396, 1), new Point(223, 299, 1), new Point(262, 396, 1), new Point(168, 332, 1), new Point(278, 332, 1), new Point(184, 397, 1)
        ));
        recognizer.AddGesture("null", new Array(
            new Point(382, 310, 1), new Point(377, 308, 1), new Point(373, 307, 1), new Point(366, 307, 1), new Point(360, 310, 1), new Point(356, 313, 1), new Point(353, 316, 1), new Point(349, 321, 1), new Point(347, 326, 1), new Point(344, 331, 1), new Point(342, 337, 1), new Point(341, 343, 1), new Point(341, 350, 1), new Point(341, 358, 1), new Point(342, 362, 1), new Point(344, 366, 1), new Point(347, 370, 1), new Point(351, 374, 1), new Point(356, 379, 1), new Point(361, 382, 1), new Point(368, 385, 1), new Point(374, 387, 1), new Point(381, 387, 1), new Point(390, 387, 1), new Point(397, 385, 1), new Point(404, 382, 1), new Point(408, 378, 1), new Point(412, 373, 1), new Point(416, 367, 1), new Point(418, 361, 1), new Point(419, 353, 1), new Point(418, 346, 1), new Point(417, 341, 1), new Point(416, 336, 1), new Point(413, 331, 1), new Point(410, 326, 1), new Point(404, 320, 1), new Point(400, 317, 1), new Point(393, 313, 1), new Point(392, 312, 1),
            new Point(418, 309, 2), new Point(337, 390, 2)
        ));
        recognizer.AddGesture("arrowhead", new Array(
            new Point(506, 349, 1), new Point(574, 349, 1),
            new Point(525, 306, 2), new Point(584, 349, 2), new Point(525, 388, 2)
        ));
        recognizer.AddGesture("pitchfork", new Array(
            new Point(38, 470, 1), new Point(36, 476, 1), new Point(36, 482, 1), new Point(37, 489, 1), new Point(39, 496, 1), new Point(42, 500, 1), new Point(46, 503, 1), new Point(50, 507, 1), new Point(56, 509, 1), new Point(63, 509, 1), new Point(70, 508, 1), new Point(75, 506, 1), new Point(79, 503, 1), new Point(82, 499, 1), new Point(85, 493, 1), new Point(87, 487, 1), new Point(88, 480, 1), new Point(88, 474, 1), new Point(87, 468, 1),
            new Point(62, 464, 2), new Point(62, 571, 2)
        ));
        recognizer.AddGesture("six-point star", new Array(
            new Point(177, 554, 1), new Point(223, 476, 1), new Point(268, 554, 1), new Point(183, 554, 1),
            new Point(177, 490, 2), new Point(223, 568, 2), new Point(268, 490, 2), new Point(183, 490, 2)
        ));
        recognizer.AddGesture("asterisk", new Array(
            new Point(325, 499, 1), new Point(417, 557, 1),
            new Point(417, 499, 2), new Point(325, 557, 2),
            new Point(371, 486, 3), new Point(371, 571, 3)
        ));
        recognizer.AddGesture("half-note", new Array(
            new Point(546, 465, 1), new Point(546, 531, 1),
            new Point(540, 530, 2), new Point(536, 529, 2), new Point(533, 528, 2), new Point(529, 529, 2), new Point(524, 530, 2), new Point(520, 532, 2), new Point(515, 535, 2), new Point(511, 539, 2), new Point(508, 545, 2), new Point(506, 548, 2), new Point(506, 554, 2), new Point(509, 558, 2), new Point(512, 561, 2), new Point(517, 564, 2), new Point(521, 564, 2), new Point(527, 563, 2), new Point(531, 560, 2), new Point(535, 557, 2), new Point(538, 553, 2), new Point(542, 548, 2), new Point(544, 544, 2), new Point(546, 540, 2), new Point(546, 536, 2)
        ));

        // This is to indicate that the operation was destructive.
        return null;
    }

    //
    // Private helper functions from this point down
    //
    function GreedyCloudMatch(points, P) {
        var e = 0.50;
        var step = Math.floor(Math.pow(points.length, 1 - e));
        var min = +Infinity;
        for (var i = 0; i < points.length; i += step) {
            var d1 = CloudDistance(points, P.Points, i);
            var d2 = CloudDistance(P.Points, points, i);
            min = Math.min(min, Math.min(d1, d2)); // min3
        }
        return min;
    }
    function CloudDistance(pts1, pts2, start) {
        var matched = new Array(pts1.length); // pts1.length == pts2.length
        for (var k = 0; k < pts1.length; k++)
            matched[k] = false;
        var sum = 0;
        var i = start;
        do {
            var index = -1;
            var min = +Infinity;
            for (var j = 0; j < matched.length; j++) {
                if (!matched[j]) {
                    var d = Distance(pts1[i], pts2[j]);
                    if (d < min) {
                        min = d;
                        index = j;
                    }
                }
            }
            matched[index] = true;
            var weight = 1 - ((i - start + pts1.length) % pts1.length) / pts1.length;
            sum += weight * min;
            i = (i + 1) % pts1.length;
        } while (i != start);
        return sum;
    }
    function Resample(points, n) {
        var I = PathLength(points) / (n - 1); // interval length
        var D = 0.0;
        var newpoints = new Array(points[0]);
        for (var i = 1; i < points.length; i++) {
            if (points[i].ID == points[i - 1].ID) {
                var d = Distance(points[i - 1], points[i]);
                if ((D + d) >= I) {
                    var qx = points[i - 1].X + ((I - D) / d) * (points[i].X - points[i - 1].X);
                    var qy = points[i - 1].Y + ((I - D) / d) * (points[i].Y - points[i - 1].Y);
                    var q = new Point(qx, qy, points[i].ID);
                    newpoints[newpoints.length] = q; // append new point 'q'
                    points.splice(i, 0, q); // insert 'q' at position i in points s.t. 'q' will be the next i
                    D = 0.0;
                }
                else D += d;
            }
        }
        if (newpoints.length == n - 1) // sometimes we fall a rounding-error short of adding the last point, so add it if so
            newpoints[newpoints.length] = new Point(points[points.length - 1].X, points[points.length - 1].Y, points[points.length - 1].ID);
        return newpoints;
    }
    function Scale(points) {
        var minX = +Infinity, maxX = -Infinity, minY = +Infinity, maxY = -Infinity, i;
        for (i = 0; i < points.length; i++) {
            minX = Math.min(minX, points[i].X);
            minY = Math.min(minY, points[i].Y);
            maxX = Math.max(maxX, points[i].X);
            maxY = Math.max(maxY, points[i].Y);
        }
        var size = Math.max(maxX - minX, maxY - minY);
        var newpoints = [];
        for (i = 0; i < points.length; i++) {
            var qx = (points[i].X - minX) / size;
            var qy = (points[i].Y - minY) / size;
            newpoints[newpoints.length] = new Point(qx, qy, points[i].ID);
        }
        return newpoints;
    }
    function TranslateTo(points, pt) // translates points' centroid
    {
        var c = Centroid(points);
        var newpoints = [];
        for (var i = 0; i < points.length; i++) {
            var qx = points[i].X + pt.X - c.X;
            var qy = points[i].Y + pt.Y - c.Y;
            newpoints[newpoints.length] = new Point(qx, qy, points[i].ID);
        }
        return newpoints;
    }
    function Centroid(points) {
        var x = 0.0, y = 0.0;
        for (var i = 0; i < points.length; i++) {
            x += points[i].X;
            y += points[i].Y;
        }
        x /= points.length;
        y /= points.length;
        return new Point(x, y, 0);
    }
    function PathDistance(pts1, pts2) // average distance between corresponding points in two paths
    {
        var d = 0.0;
        for (var i = 0; i < pts1.length; i++) // assumes pts1.length == pts2.length
            d += Distance(pts1[i], pts2[i]);
        return d / pts1.length;
    }
    function PathLength(points) // length traversed by a point path
    {
        var d = 0.0;
        for (var i = 1; i < points.length; i++) {
            if (points[i].ID == points[i - 1].ID)
                d += Distance(points[i - 1], points[i]);
        }
        return d;
    }
    function Distance(p1, p2) // Euclidean distance between two points
    {
        var dx = p2.X - p1.X;
        var dy = p2.Y - p1.Y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    var PDollar = {
        Point: Point,
        PDollarRecognizer: PDollarRecognizer,
        initDefaultGestures: initDefaultGestures
    };

    if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
        module.exports = PDollar;
    } else {
        window.PDollar = PDollar;
    }
})();