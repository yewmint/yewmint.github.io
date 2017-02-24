(function() {
  var Point, Polygon, Ray, Segment, canvas, cast, clearCanvas, ctx, drawCast, drawFill, drawPoint, drawPolygon, drawSegment, getCursor, getIntersection, getRdians, i, intersections, len, polygon, polygons, raycastPolygons, readyToPaint, sortIntersections;

  getRdians = function(x1, y1, x2, y2) {
    var dx, dy;
    dx = x2 - x1;
    dy = y2 - y1;
    return Math.atan2(dy, dx);
  };

  getIntersection = function(ray, segment) {
    var H, Hrt, Hst, r_dx, r_dy, r_px, r_py, rt, s_dx, s_dy, s_px, s_py, st;
    if (segment.isCollision === false) {
      return null;
    }
    r_px = ray.a.x;
    r_py = ray.a.y;
    r_dx = ray.b.x - ray.a.x;
    r_dy = ray.b.y - ray.a.y;
    s_px = segment.a.x;
    s_py = segment.a.y;
    s_dx = segment.b.x - segment.a.x;
    s_dy = segment.b.y - segment.a.y;
    H = s_dx * r_dy - r_dx * s_dy;
    if (H === 0) {
      return null;
    }
    Hrt = s_dx * (s_py - r_py) - s_dy * (s_px - r_px);
    Hst = r_dx * (s_py - r_py) - r_dy * (s_px - r_px);
    rt = Hrt / H;
    st = Hst / H;
    if (rt < 0) {
      return null;
    }
    if (st < 0 || st > 1) {
      return null;
    }
    return {
      x: Math.round(r_px + r_dx * rt),
      y: Math.round(r_py + r_dy * rt),
      distance: Math.sqrt(Math.pow(r_dx * rt, 2) + Math.pow(r_dy * rt, 2))
    };
  };

  Point = (function() {
    function Point(x3, y3) {
      this.x = x3;
      this.y = y3;
    }

    return Point;

  })();

  Segment = (function() {
    function Segment(x1, y1, x2, y2, isCollision) {
      this.isCollision = isCollision;
      this.a = new Point(x1, y1);
      this.b = new Point(x2, y2);
    }

    return Segment;

  })();

  Ray = (function() {
    function Ray(x1, y1, x2, y2) {
      this.a = new Point(x1, y1);
      this.b = new Point(x2, y2);
    }

    return Ray;

  })();

  Polygon = (function() {
    function Polygon(points) {
      this.points = points.slice(0);
      this.segments = [];
      this.points.forEach((function(_this) {
        return function(elem, index, arr) {
          var curPoint, nextPoint;
          curPoint = arr[index];
          nextPoint = arr[(index + 1) % arr.length];
          return _this.segments.push(new Segment(curPoint.x, curPoint.y, nextPoint.x, nextPoint.y, true));
        };
      })(this));
      this.pointSegmentSets = [];
      this.points.forEach((function(_this) {
        return function(elem, index, arr) {
          return _this.pointSegmentSets.push({
            point: elem,
            segments: [_this.segments[(index - 1 + arr.length) % arr.length], _this.segments[index]]
          });
        };
      })(this));
    }

    return Polygon;

  })();

  polygons = [new Polygon([new Point(0, 0), new Point(700, 0), new Point(700, 480), new Point(0, 480)]), new Polygon([new Point(140, 230), new Point(140, 180), new Point(90, 180), new Point(90, 230)]), new Polygon([new Point(640, 230), new Point(640, 180), new Point(590, 180), new Point(590, 230)]), new Polygon([new Point(50, 50), new Point(100, 50), new Point(50, 100)]), new Polygon([new Point(380, 300), new Point(439, 280), new Point(465, 77), new Point(200, 180), new Point(220, 250)]), new Polygon([new Point(630, 400), new Point(600, 280), new Point(550, 360)]), new Polygon([new Point(80, 400), new Point(200, 380), new Point(150, 430)])];

  canvas = document.getElementById("ray");

  ctx = canvas.getContext("2d");

  getCursor = function(x, y) {
    var bbox;
    bbox = canvas.getBoundingClientRect();
    return {
      x: x - bbox.left * (canvas.width / bbox.width) || 0,
      y: y - bbox.top * (canvas.height / bbox.height) || 0
    };
  };

  clearCanvas = function() {
    return ctx.clearRect(0, 0, 700, 480);
  };

  drawPoint = function(point) {
    ctx.fillStyle = "#FF0000";
    ctx.beginPath();
    ctx.arc(point.x, point.y, 5, 0, 2 * Math.PI);
    return ctx.fill();
  };

  drawSegment = function(segment, color) {
    if (color == null) {
      color = "#888888";
    }
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.moveTo(segment.a.x, segment.a.y);
    ctx.lineTo(segment.b.x, segment.b.y);
    return ctx.stroke();
  };

  drawPolygon = function(polygon) {
    var i, len, ref, results, segment;
    ref = polygon.segments;
    results = [];
    for (i = 0, len = ref.length; i < len; i++) {
      segment = ref[i];
      results.push(drawSegment(segment));
    }
    return results;
  };

  intersections = [];

  sortIntersections = function(ox, oy) {
    return intersections.sort(function(a, b) {
      return a[0].radians - b[0].radians;
    });
  };

  drawFill = function(ox, oy) {
    var i, ints, j, len, len1, point;
    ctx.beginPath();
    ctx.fillStyle = "rgba(255, 155, 155, 0.8)";
    ctx.moveTo(ox, oy);
    for (i = 0, len = intersections.length; i < len; i++) {
      ints = intersections[i];
      for (j = 0, len1 = ints.length; j < len1; j++) {
        point = ints[j];
        ctx.lineTo(point.x, point.y);
      }
    }
    ctx.lineTo(intersections[0][0].x, intersections[0][0].y);
    return ctx.fill();
  };

  drawCast = function(ox, oy) {
    var i, ints, len, point, results;
    results = [];
    for (i = 0, len = intersections.length; i < len; i++) {
      ints = intersections[i];
      results.push((function() {
        var j, len1, results1;
        results1 = [];
        for (j = 0, len1 = ints.length; j < len1; j++) {
          point = ints[j];
          drawSegment(new Segment(ox, oy, point.x, point.y), "#ff5d69");
          results1.push(drawPoint(point));
        }
        return results1;
      })());
    }
    return results;
  };

  raycastPolygons = function(ray) {
    var i, intersection, j, len, len1, newIntersection, polygon, ref, segment;
    intersection = null;
    for (i = 0, len = polygons.length; i < len; i++) {
      polygon = polygons[i];
      ref = polygon.segments;
      for (j = 0, len1 = ref.length; j < len1; j++) {
        segment = ref[j];
        newIntersection = getIntersection(ray, segment);
        if (newIntersection === null) {
          continue;
        }
        if (intersection === null || intersection.distance > newIntersection.distance) {
          intersection = newIntersection;
        }
      }
    }
    return intersection;
  };

  cast = function(cursorX, cursorY) {
    var angle, angles, dx, dy, i, intersection, ints, j, len, len1, polygon, psSet, radians, ray, results;
    intersections = [];
    clearCanvas();
    for (i = 0, len = polygons.length; i < len; i++) {
      polygon = polygons[i];
      drawPolygon(polygon);
    }
    results = [];
    for (j = 0, len1 = polygons.length; j < len1; j++) {
      polygon = polygons[j];
      results.push((function() {
        var k, l, len2, len3, ref, results1;
        ref = polygon.pointSegmentSets;
        results1 = [];
        for (k = 0, len2 = ref.length; k < len2; k++) {
          psSet = ref[k];
          ints = [];
          ray = new Ray(cursorX, cursorY, psSet.point.x, psSet.point.y);
          radians = getRdians(ray.a.x, ray.a.y, ray.b.x, ray.b.y);
          angles = [radians - 0.00001, radians, radians + 0.00001];
          for (l = 0, len3 = angles.length; l < len3; l++) {
            angle = angles[l];
            dx = Math.cos(angle);
            dy = Math.sin(angle);
            ray.b.x = psSet.point.x + dx;
            ray.b.y = psSet.point.y + dy;
            intersection = raycastPolygons(ray);
            if (intersection) {
              intersection.radians = radians;
              ints.push(intersection);
            }
          }
          results1.push(intersections.push(ints));
        }
        return results1;
      })());
    }
    return results;
  };

  readyToPaint = true;

  for (i = 0, len = polygons.length; i < len; i++) {
    polygon = polygons[i];
    drawPolygon(polygon);
  }

  cast(100, 100);

  sortIntersections(100, 100);

  drawFill(100, 100);

  drawCast(100, 100);

  canvas.addEventListener("mousemove", function(e) {
    var cursor;
    if (!readyToPaint) {
      return;
    }
    cursor = getCursor(e.clientX, e.clientY);
    cast(cursor.x, cursor.y);
    sortIntersections(cursor.x, cursor.y);
    drawFill(cursor.x, cursor.y);
    drawCast(cursor.x, cursor.y);
    readyToPaint = false;
    return requestAnimationFrame(function() {
      return readyToPaint = true;
    });
  }, false);

}).call(this);
