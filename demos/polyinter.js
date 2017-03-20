/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.l = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };

/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};

/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};

/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

var Point, Polygon, Segment, Vector, Vertex, createVectorFrom2Points, crossProduct, distanceOf, getIntersection, getRdians, isPointInsidePoly;

Point = (function() {
  function Point(x1, y1) {
    this.x = x1;
    this.y = y1;
  }

  Point.prototype.clone = function() {
    return new Point(this.x, this.y);
  };

  Point.prototype.offset = function(point) {
    return new Point(this.x + point.x, this.y + point.y);
  };

  return Point;

})();

Vertex = (function() {
  function Vertex(point, segOut, segIn) {
    this.segOut = segOut != null ? segOut : null;
    this.segIn = segIn != null ? segIn : null;
    this.point = point.clone();
  }

  Vertex.prototype.destroy = function() {
    this.point = null;
    this.segOut = null;
    return this.segIn = null;
  };

  return Vertex;

})();

Segment = (function() {
  function Segment(vertexA, vertexB) {
    this.vertexA = vertexA;
    this.vertexB = vertexB;
  }

  Segment.prototype.destroy = function() {
    this.vertexA = null;
    return this.vertexB = null;
  };

  return Segment;

})();

Polygon = (function() {
  function Polygon(points) {
    var i, len, point;
    if (points.length <= 2) {
      return null;
    }
    this.vertexes = [];
    for (i = 0, len = points.length; i < len; i++) {
      point = points[i];
      this.vertexes.push(new Vertex(point));
    }
    this.vertexes.forEach((function(_this) {
      return function(vertex, index, arr) {
        var nextVertex, prevVertex;
        nextVertex = arr[(index + 1) % arr.length];
        prevVertex = arr[(index - 1 + arr.length) % arr.length];
        vertex.segOut = new Segment(vertex, nextVertex);
        return vertex.segIn = new Segment(prevVertex, vertex);
      };
    })(this));
  }

  Polygon.prototype.clone = function() {
    var i, len, points, ref, vertex;
    points = [];
    ref = this.vertexes;
    for (i = 0, len = ref.length; i < len; i++) {
      vertex = ref[i];
      points.push(vertex.point.clone());
    }
    return new Polygon(points);
  };

  Polygon.prototype.offset = function(point) {
    var i, len, points, ref, vertex;
    points = [];
    ref = this.vertexes;
    for (i = 0, len = ref.length; i < len; i++) {
      vertex = ref[i];
      points.push(vertex.point.offset(point));
    }
    return new Polygon(points);
  };

  return Polygon;

})();

Vector = (function() {
  function Vector(x1, y1, z1) {
    this.x = x1;
    this.y = y1;
    this.z = z1;
  }

  Vector.prototype.clone = function() {
    return new Vector(this.x, this.y, this.y);
  };

  return Vector;

})();

createVectorFrom2Points = function(pointA, pointB) {
  var x, y, z;
  x = pointB.x - pointA.x;
  y = pointB.y - pointA.y;
  z = 0;
  return new Vector(x, y, z);
};

crossProduct = function(vecA, vecB) {
  var x, y, z;
  x = vecA.y * vecB.z - vecA.z * vecB.y;
  y = vecA.z * vecB.x - vecA.x * vecB.z;
  z = vecA.x * vecB.y - vecA.y * vecB.x;
  return new Vector(x, y, z);
};

getIntersection = function(segA, segB) {
  var H, Hrt, Hst, r_dx, r_dy, r_px, r_py, rt, s_dx, s_dy, s_px, s_py, st, x, y;
  r_px = segA.vertexA.point.x;
  r_py = segA.vertexA.point.y;
  r_dx = segA.vertexB.point.x - segA.vertexA.point.x;
  r_dy = segA.vertexB.point.y - segA.vertexA.point.y;
  s_px = segB.vertexA.point.x;
  s_py = segB.vertexA.point.y;
  s_dx = segB.vertexB.point.x - segB.vertexA.point.x;
  s_dy = segB.vertexB.point.y - segB.vertexA.point.y;
  H = s_dx * r_dy - r_dx * s_dy;
  if (H === 0) {
    return null;
  }
  Hrt = s_dx * (s_py - r_py) - s_dy * (s_px - r_px);
  Hst = r_dx * (s_py - r_py) - r_dy * (s_px - r_px);
  rt = Hrt / H;
  st = Hst / H;
  if (rt < 0 || rt > 1) {
    return null;
  }
  if (st < 0 || st > 1) {
    return null;
  }
  x = r_px + r_dx * rt;
  y = r_py + r_dy * rt;
  return new Point(x, y);
};

distanceOf = function(pointA, pointB) {
  var distance, dx, dy;
  dx = pointB.x - pointA.x;
  dy = pointB.y - pointA.y;
  distance = Math.sqrt(dx * dx + dy * dy);
  return distance;
};

isPointInsidePoly = function(point, poly) {
  var i, len, pointToHead, pointToTail, product, ref, seg, vtx;
  ref = poly.vertexes;
  for (i = 0, len = ref.length; i < len; i++) {
    vtx = ref[i];
    seg = vtx.segOut;
    pointToHead = createVectorFrom2Points(point, seg.vertexA.point);
    pointToTail = createVectorFrom2Points(point, seg.vertexB.point);
    product = crossProduct(pointToHead, pointToTail);
    if (product.z < 0) {
      return false;
    }
  }
  return true;
};

getRdians = function(pointA, pointB) {
  var dx, dy;
  dx = pointB.x - pointA.x;
  dy = pointB.y - pointA.y;
  return Math.atan2(dy, dx);
};

module.exports = {
  Point: Point,
  Vertex: Vertex,
  Segment: Segment,
  Polygon: Polygon,
  Vector: Vector,
  crossProduct: crossProduct,
  createVectorFrom2Points: createVectorFrom2Points,
  getIntersection: getIntersection,
  distanceOf: distanceOf,
  isPointInsidePoly: isPointInsidePoly,
  getRdians: getRdians
};


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

var Painter, geometry;

geometry = __webpack_require__(0);

if (!String.prototype.format) {
  String.prototype.format = function() {
    var args;
    args = arguments;
    return this.replace(/\{(\d+)\}/g, function(s, i) {
      return args[i];
    });
  };
}

Painter = (function() {
  Painter.prototype.color = "#888888";

  Painter.prototype.x = 0;

  Painter.prototype.y = 0;

  function Painter(parentId, width, height) {
    this.width = width;
    this.height = height;
    this.parent = document.getElementById(parentId);
    this.parent.innerHTML = '<canvas width="{0}" height="{1}"></canvas>'.format(this.width, this.height);
    this.canvas = this.parent.firstChild;
    this.context = this.canvas.getContext('2d');
    this._enableCursor();
  }

  Painter.prototype.setColor = function(color) {
    this.color = color;
  };

  Painter.prototype.paintPoint = function(point) {
    var p;
    p = this._convCoord(point);
    this.context.fillStyle = this.color;
    this.context.beginPath();
    this.context.arc(p.x, p.y, 5, 0, 2 * Math.PI);
    return this.context.fill();
  };

  Painter.prototype.paintSeg = function(seg) {
    var pointA, pointB;
    this.context.beginPath();
    this.context.strokeStyle = this.color;
    pointA = this._convCoord(seg.vertexA.point);
    pointB = this._convCoord(seg.vertexB.point);
    this.context.moveTo(pointA.x, pointA.y);
    this.context.lineTo(pointB.x, pointB.y);
    return this.context.stroke();
  };

  Painter.prototype.paintPolygon = function(poly) {
    var j, len, ref, results, vtx;
    ref = poly.vertexes;
    results = [];
    for (j = 0, len = ref.length; j < len; j++) {
      vtx = ref[j];
      results.push(this.paintSeg(vtx.segOut));
    }
    return results;
  };

  Painter.prototype.fillPolygon = function(poly) {
    var j, len, point, ref, vertex;
    this.context.beginPath();
    this.context.fillStyle = this.color;
    this.context.moveTo(poly.vertexes[0].point.x, poly.vertexes[0].point.y);
    ref = poly.vertexes;
    for (j = 0, len = ref.length; j < len; j++) {
      vertex = ref[j];
      point = this._convCoord(vertex.point);
      this.context.lineTo(point.x, point.y);
    }
    return this.context.fill();
  };

  Painter.prototype.clear = function() {
    return this.context.clearRect(0, 0, this.width, this.height);
  };

  Painter.prototype.getCursor = function() {
    return new geometry.Point(this.x, this.y);
  };

  Painter.prototype._convCoord = function(point) {
    return new geometry.Point(point.x, this.height - point.y);
  };

  Painter.prototype._parseCursor = function(x, y) {
    var bbox;
    bbox = canvas.getBoundingClientRect();
    return {
      x: x - bbox.left * (canvas.width / bbox.width) || 0,
      y: y - bbox.top * (canvas.height / bbox.height) || 0
    };
  };

  Painter.prototype._enableCursor = function() {
    return this.canvas.addEventListener("mousemove", (function(_this) {
      return function(e) {
        var bbox, x, y;
        x = e.clientX;
        y = e.clientY;
        bbox = _this.canvas.getBoundingClientRect();
        _this.x = x - bbox.left * (_this.canvas.width / bbox.width) || 0;
        y = y - bbox.top * (_this.canvas.height / bbox.height) || 0;
        return _this.y = _this.height - y;
      };
    })(this), false);
  };

  return Painter;

})();

module.exports = Painter;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

var Intersection, Painter, Point, Polygon, Segment, Vertex, cutCastPoly, distanceOf, geometry, getRdians, isPointInsidePoly, outline, painter, repaint, segCastSeg, square, triangle, visitA, visitB;

geometry = __webpack_require__(0);

Painter = __webpack_require__(1);

geometry = __webpack_require__(0);

Point = geometry.Point;

Vertex = geometry.Vertex;

Segment = geometry.Segment;

Polygon = geometry.Polygon;

distanceOf = geometry.distanceOf;

isPointInsidePoly = geometry.isPointInsidePoly;

getRdians = geometry.getRdians;

Intersection = (function() {
  function Intersection(point, segA, segB, isOutward) {
    this.point = point.clone();
    this.segA = segA;
    this.segB = segB;
    this.isOutward = isOutward;
  }

  return Intersection;

})();

segCastSeg = function(segA, segB) {
  var interPoint, isOutward, vecA, vecInter;
  interPoint = geometry.getIntersection(segA, segB);
  if (!interPoint) {
    return null;
  }
  vecA = geometry.createVectorFrom2Points(segA.vertexA.point, segB.vertexA.point);
  vecInter = geometry.createVectorFrom2Points(segA.vertexA.point, segA.vertexB.point);
  isOutward = geometry.crossProduct(vecA, vecInter).z > 0;
  return new Intersection(interPoint, segA, segB, isOutward);
};

outline = new Polygon([new Point(0, 0), new Point(640, 0), new Point(640, 480), new Point(0, 480)]);

triangle = new Polygon([new Point(120, 140), new Point(240, 100), new Point(520, 140), new Point(320, 400)]);

square = new Polygon([new Point(180, 100), new Point(460, 100), new Point(460, 340), new Point(300, 400), new Point(180, 340)]);

cutCastPoly = function(cut, poly) {
  var cutVtx, inter, inters, j, k, l, len, len1, len2, polyVtx, ref, ref1, segInter, segInters;
  inters = [];
  ref = cut.vertexes;
  for (j = 0, len = ref.length; j < len; j++) {
    cutVtx = ref[j];
    segInters = [];
    ref1 = poly.vertexes;
    for (k = 0, len1 = ref1.length; k < len1; k++) {
      polyVtx = ref1[k];
      inter = segCastSeg(cutVtx.segOut, polyVtx.segOut);
      if (inter) {
        segInters.push(inter);
      }
    }
    segInters.sort(function(a, b) {
      var offset, offsetA, offsetB;
      offset = a.segA.vertexB.point.x - a.segA.vertexA.point.x;
      offsetA = (a.point.x - a.segA.vertexA.point.x) * offset;
      offsetB = (b.point.x - a.segA.vertexA.point.x) * offset;
      return offsetA - offsetB;
    });
    for (l = 0, len2 = segInters.length; l < len2; l++) {
      segInter = segInters[l];
      inters.push(segInter);
    }
  }
  return inters;
};

visitA = function(cut, poly, inters) {
  var cnt, corner, i, ints, nextInter, seg, vtx;
  ints = [];
  vtx = inters[0];
  cnt = 1000;
  i = 0;
  while (i < inters.length) {
    cnt--;
    if (cnt === 0) {
      break;
    }
    ints.push(vtx);
    seg = null;
    if (vtx instanceof Intersection) {
      if (vtx.isOutward) {
        seg = vtx.segB;
      } else {
        seg = vtx.segA;
      }
    } else {
      seg = vtx.segOut;
    }
    corner = seg.vertexB;
    nextInter = inters[(i + 1) % inters.length];
    if (nextInter && (nextInter.segA === seg || nextInter.segB === seg)) {
      if (distanceOf(seg.vertexA.point, corner.point) > distanceOf(seg.vertexA.point, nextInter.point)) {
        vtx = nextInter;
        i++;
      } else {
        vtx = corner;
      }
    } else {
      vtx = corner;
    }
  }
  return ints;
};

visitB = function(cut, poly, inters) {
  var center, inter, ints, j, k, l, len, len1, len2, len3, len4, m, n, ref, ref1, totalX, totalY, vtx;
  ints = [];
  ref = poly.vertexes;
  for (j = 0, len = ref.length; j < len; j++) {
    vtx = ref[j];
    if (isPointInsidePoly(vtx.point, cut)) {
      ints.push(vtx);
    }
  }
  ref1 = cut.vertexes;
  for (k = 0, len1 = ref1.length; k < len1; k++) {
    vtx = ref1[k];
    if (isPointInsidePoly(vtx.point, poly)) {
      ints.push(vtx);
    }
  }
  for (l = 0, len2 = inters.length; l < len2; l++) {
    inter = inters[l];
    ints.push(inter);
  }
  totalX = 0;
  totalY = 0;
  for (m = 0, len3 = ints.length; m < len3; m++) {
    inter = ints[m];
    totalX += inter.point.x;
    totalY += inter.point.y;
  }
  center = new Point(totalX / inters.length, totalY / inters.length);
  for (n = 0, len4 = ints.length; n < len4; n++) {
    inter = ints[n];
    inter.radians = getRdians(center, inter.point);
  }
  ints.sort(function(a, b) {
    return b.radians - a.radians;
  });
  return ints;
};

painter = new Painter("wrapper", 640, 480);

window.useVisitA = true;

repaint = function() {
  var inter, inters, ints, j, k, len, len1, tri;
  painter.clear();
  painter.setColor("#888888");
  tri = triangle.offset(painter.getCursor().offset(new Point(-320, -240)));
  painter.paintPolygon(outline);
  painter.paintPolygon(tri);
  painter.paintPolygon(square);
  inters = cutCastPoly(tri, square);
  if (window.useVisitA) {
    ints = visitA(tri, square, inters);
  } else {
    ints = visitB(tri, square, inters);
  }
  for (j = 0, len = inters.length; j < len; j++) {
    inter = inters[j];
    if (inter.isOutward) {
      painter.setColor("#00ff00");
    } else {
      painter.setColor("#ff0000");
    }
    painter.paintPoint(inter.point);
  }
  for (k = 0, len1 = ints.length; k < len1; k++) {
    inter = ints[k];
    painter.setColor("#0000ff");
    painter.paintPoint(inter.point);
  }
  return requestAnimationFrame(repaint);
};

repaint();


/***/ })
/******/ ]);