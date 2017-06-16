/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
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
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

var Intersection, Point, Polygon, Segment, Vector2, Vector3, Vertex,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Point = (function() {
  Point.ZERO = new Point(0, 0);

  function Point(x1, y1) {
    this.x = x1;
    this.y = y1;
  }

  Point.prototype.distance = function(point) {
    var dx, dy;
    dx = point.x - this.x;
    dy = point.y - this.y;
    return Math.sqrt(dx * dx + dy * dy);
  };

  Point.prototype.same = function(point) {
    return point.x === this.x && point.y === this.y;
  };

  Point.prototype.clone = function() {
    return new Point(this.x, this.y);
  };

  Point.prototype.offset = function(point) {
    return new Point(this.x + point.x, this.y + point.y);
  };

  return Point;

})();

Vertex = (function(superClass) {
  extend(Vertex, superClass);

  function Vertex(x, y, segOut, segIn) {
    this.segOut = segOut != null ? segOut : null;
    this.segIn = segIn != null ? segIn : null;
    Vertex.__super__.constructor.call(this, x, y);
  }

  Vertex.prototype.clone = function() {
    return new Vertex(this.x, this.y, this.segOut, this.segIn);
  };

  Vertex.prototype.offset = function(point) {
    return new Vertex(this.x + point.x, this.y + point.y, this.segOut, this.segIn);
  };

  return Vertex;

})(Point);

Intersection = (function(superClass) {
  extend(Intersection, superClass);

  function Intersection(x, y, segA1, segB1, isInner1) {
    this.segA = segA1 != null ? segA1 : null;
    this.segB = segB1 != null ? segB1 : null;
    this.isInner = isInner1;
    Intersection.__super__.constructor.call(this, x, y);
  }

  Intersection.prototype.clone = function() {
    return new Intersection(this.x, this.y, this.segA, this.segB);
  };

  Intersection.prototype.offset = function(point) {
    return new Intersection(this.x + point.x, this.y + point.y, this.segA, this.segB);
  };

  return Intersection;

})(Point);

Segment = (function() {
  function Segment(vtxA, vtxB) {
    this.vtxA = vtxA;
    this.vtxB = vtxB;
  }

  Segment.prototype.vec2 = function() {
    return Vector2.fromPoints(this.vtxA, this.vtxB);
  };

  Segment.prototype.vec3 = function() {
    return Vector2.fromPoints(this.vtxA, this.vtxB).vec3();
  };

  Segment.prototype.left = function(point) {
    var va, vb;
    va = Vector2.fromPoints(point, this.vtxA);
    vb = Vector2.fromPoints(point, this.vtxB);
    return va.cross(vb) > 0;
  };

  Segment.prototype.same = function(seg) {
    return (this.vtxA.same(seg.vtxA) && this.vtxB.same(seg.vtxB)) || (this.vtxA.same(seg.vtxB) && this.vtxB.same(seg.vtxA));
  };

  Segment.prototype.intersect = function(seg) {
    var H, Hrt, Hst, isInner, r_dx, r_dy, r_px, r_py, rt, s_dx, s_dy, s_px, s_py, segA, segB, st, x, y;
    segA = this;
    segB = seg;
    r_px = segA.vtxA.x;
    r_py = segA.vtxA.y;
    r_dx = segA.vtxB.x - segA.vtxA.x;
    r_dy = segA.vtxB.y - segA.vtxA.y;
    s_px = segB.vtxA.x;
    s_py = segB.vtxA.y;
    s_dx = segB.vtxB.x - segB.vtxA.x;
    s_dy = segB.vtxB.y - segB.vtxA.y;
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
    isInner = true;
    if (rt === 0 || st === 0 || rt === 1 || st === 1) {
      isInner = false;
    }
    return new Intersection(x, y, segA, segB, isInner);
  };

  return Segment;

})();

Polygon = (function() {
  function Polygon(points) {
    var i, len, point;
    if (points.length <= 2) {
      return null;
    }
    this.vtxs = [];
    for (i = 0, len = points.length; i < len; i++) {
      point = points[i];
      this.vtxs.push(new Vertex(point.x, point.y));
    }
    this.vtxs.forEach((function(_this) {
      return function(vertex, index, arr) {
        var nextVertex, prevVertex;
        nextVertex = arr[(index + 1) % arr.length];
        prevVertex = arr[(index - 1 + arr.length) % arr.length];
        vertex.segOut = new Segment(vertex, nextVertex);
        return vertex.segIn = new Segment(prevVertex, vertex);
      };
    })(this));
  }

  Polygon.prototype.segOnEdge = function(seg) {
    var i, len, ref, vtx;
    ref = this.vtxs;
    for (i = 0, len = ref.length; i < len; i++) {
      vtx = ref[i];
      if (seg.same(vtx.segOut)) {
        return true;
      }
    }
    return false;
  };

  Polygon.prototype.pointInside = function(point) {
    var i, innerCnt, inter, interCnt, interPoints, len, ray, ref, seg, vtx;
    ray = new Segment(point, point.offset(new Point(-10000, 0)));
    interCnt = 0;
    innerCnt = 0;
    interPoints = [];
    ref = this.vtxs;
    for (i = 0, len = ref.length; i < len; i++) {
      vtx = ref[i];
      seg = vtx.segOut;
      inter = ray.intersect(seg);
      if (inter) {
        interPoints.push(inter);
      }
    }
    interPoints = _.uniq(interPoints, function(point) {
      return {
        x: point.x,
        y: point.y
      };
    });
    return interPoints.length % 2 === 1;
  };

  Polygon.prototype.segInside = function(seg) {
    var center, centerX, centerY, i, inter, len, ref, vtx;
    ref = this.vtxs;
    for (i = 0, len = ref.length; i < len; i++) {
      vtx = ref[i];
      inter = vtx.segOut.intersect(seg);
      if (inter && inter.isInner) {
        return false;
      }
    }
    centerX = (seg.vtxA.x + seg.vtxB.x) / 2;
    centerY = (seg.vtxA.y + seg.vtxB.y) / 2;
    center = new Point(centerX, centerY);
    return this.pointInside(center);
  };

  Polygon.prototype.clone = function() {
    var i, len, points, ref, vertex;
    points = [];
    ref = this.vtxs;
    for (i = 0, len = ref.length; i < len; i++) {
      vertex = ref[i];
      points.push(vertex.clone());
    }
    return new Polygon(points);
  };

  Polygon.prototype.offset = function(point) {
    var i, len, points, ref, vertex;
    points = [];
    ref = this.vtxs;
    for (i = 0, len = ref.length; i < len; i++) {
      vertex = ref[i];
      points.push(vertex.offset(point));
    }
    return new Polygon(points);
  };

  return Polygon;

})();

Vector2 = (function() {
  Vector2.fromPoints = function(pointA, pointB) {
    var dx, dy;
    dx = pointB.x - pointA.x;
    dy = pointB.y - pointA.y;
    return new Vector2(dx, dy);
  };

  function Vector2(x1, y1) {
    this.x = x1;
    this.y = y1;
  }

  Vector2.prototype.perpendicular = function() {
    var newDest;
    newDest = new Point(this.y, -this.x);
    return new Vector2(Point.ZERO, newDest);
  };

  Vector2.prototype.normalize = function() {
    var distance;
    distance = this.distance();
    return new Vector2(this.x / distance, this.y / distance);
  };

  Vector2.prototype.dot = function(vec) {
    return this.x * vec.x + this.y * vec.y;
  };

  Vector2.prototype.cross = function(vec) {
    return this.vec3().cross(vec.vec3()).z;
  };

  Vector2.prototype.radians = function(vec) {
    var cosVal, dot;
    dot = this.dot(vec);
    cosVal = dot / this.distance() / vec.distance();
    return Math.acos(cosVal);
  };

  Vector2.prototype.distance = function() {
    return Point.ZERO.distance(new Point(this.x, this.y));
  };

  Vector2.prototype.vec3 = function() {
    return new Vector3(this.x, this.y, 0);
  };

  return Vector2;

})();

Vector3 = (function() {
  function Vector3(x1, y1, z1) {
    this.x = x1;
    this.y = y1;
    this.z = z1;
  }

  Vector3.prototype.cross = function(vec) {
    var vecA, vecB, x, y, z;
    vecA = this;
    vecB = vec;
    x = vecA.y * vecB.z - vecA.z * vecB.y;
    y = vecA.z * vecB.x - vecA.x * vecB.z;
    z = vecA.x * vecB.y - vecA.y * vecB.x;
    return new Vector3(x, y, z);
  };

  return Vector3;

})();

module.exports = {
  Point: Point,
  Vertex: Vertex,
  Intersection: Intersection,
  Segment: Segment,
  Polygon: Polygon,
  Vector2: Vector2,
  Vector3: Vector3
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
    pointA = this._convCoord(seg.vtxA);
    pointB = this._convCoord(seg.vtxB);
    this.context.moveTo(pointA.x, pointA.y);
    this.context.lineTo(pointB.x, pointB.y);
    return this.context.stroke();
  };

  Painter.prototype.paintPolygon = function(poly) {
    var j, len, ref, results, vtx;
    ref = poly.vtxs;
    results = [];
    for (j = 0, len = ref.length; j < len; j++) {
      vtx = ref[j];
      results.push(this.paintSeg(vtx.segOut));
    }
    return results;
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

module.exports = {
  Painter: Painter
};


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

var Painter, Point, Polygon, Segment, Vector2, curPoly, getAddEdge, getDTA, getDTB, getRadians, init, outbox, painter, ref, target, target2;

ref = __webpack_require__(0), Point = ref.Point, Vector2 = ref.Vector2, Polygon = ref.Polygon, Segment = ref.Segment;

Painter = __webpack_require__(1).Painter;

painter = new Painter("wrapper", 640, 480);

window.pt = painter;

outbox = new Polygon([new Point(0, 0), new Point(640, 0), new Point(640, 480), new Point(0, 480)]);

target = new Polygon([new Point(253, 358), new Point(27, 191), new Point(87, 33), new Point(260, 121), new Point(460, 95), new Point(427, 121), new Point(548, 197)]);

target2 = new Polygon([new Point(194, 384), new Point(292, 352), new Point(179, 200), new Point(348, 75), new Point(348, 254), new Point(459, 254), new Point(384, 369), new Point(424, 384)]);

init = function(poly) {
  var i, len, ref1, results, vtx;
  ref1 = poly.vtxs;
  results = [];
  for (i = 0, len = ref1.length; i < len; i++) {
    vtx = ref1[i];
    results.push(vtx.edgeCnt = 2);
  }
  return results;
};

getRadians = function(vtx, seg) {
  var va, vb;
  va = Vector2.fromPoints(vtx, seg.vtxA);
  vb = Vector2.fromPoints(vtx, seg.vtxB);
  return va.radians(vb);
};

getDTA = function(seg, poly) {
  var destVtx, dt, i, isInsideA, isInsideB, len, pradians, radians, ref1, vecTryA, vecTryB, vtx;
  dt = null;
  pradians = null;
  ref1 = poly.vtxs;
  for (i = 0, len = ref1.length; i < len; i++) {
    vtx = ref1[i];
    if (vtx.edgeCnt > 0 && seg.left(vtx)) {
      if (vtx !== seg.vtxA && vtx !== seg.vtxB) {
        destVtx = seg.vtxB.segOut.vtxB;
        vecTryB = Vector2.fromPoints(seg.vtxB, vtx);
        isInsideB = (function() {
          var vecCur;
          while (destVtx !== vtx) {
            vecCur = Vector2.fromPoints(seg.vtxB, destVtx);
            if (vecCur.cross(vecTryB) < 0) {
              return false;
            }
            destVtx = destVtx.segOut.vtxB;
          }
          return true;
        })();
        destVtx = seg.vtxA.segIn.vtxA;
        vecTryA = Vector2.fromPoints(seg.vtxA, vtx);
        isInsideA = (function() {
          var vecCur;
          while (destVtx !== vtx) {
            vecCur = Vector2.fromPoints(seg.vtxA, destVtx);
            if (vecCur.cross(vecTryA) > 0) {
              return false;
            }
            destVtx = destVtx.segIn.vtxA;
          }
          return true;
        })();
        console.log("test");
        if (isInsideA && isInsideB) {
          console.log("pass");
          if (!dt) {
            dt = vtx;
            pradians = getRadians(vtx, seg);
          } else {
            radians = getRadians(vtx, seg);
            if (radians > pradians) {
              dt = vtx;
              pradians = radians;
            }
          }
        }
      }
    }
  }
  return dt;
};

getDTB = function(seg, poly) {
  var dt, i, len, pradians, radians, ref1, segA, segB, vtx;
  dt = null;
  pradians = null;
  ref1 = poly.vtxs;
  for (i = 0, len = ref1.length; i < len; i++) {
    vtx = ref1[i];
    if (vtx.edgeCnt > 0 && seg.left(vtx)) {
      if (vtx !== seg.vtxA && vtx !== seg.vtxB) {
        segA = new Segment(seg.vtxA, vtx);
        segB = new Segment(seg.vtxB, vtx);
        if ((poly.segOnEdge(segA) || poly.segInside(segA)) && (poly.segOnEdge(segB) || poly.segInside(segB))) {
          if (!dt) {
            dt = vtx;
            pradians = getRadians(vtx, seg);
          } else {
            radians = getRadians(vtx, seg);
            if (radians > pradians) {
              dt = vtx;
              pradians = radians;
            }
          }
        }
      }
    }
  }
  return dt;
};

getAddEdge = function(poly) {
  var ans, dt, i, len, potSegA, potSegB, ref1, s0, s1, stack;
  init(poly);
  stack = [poly.vtxs[0].segOut];
  ans = [];
  while (stack.length > 0) {
    s0 = stack.pop();
    dt = getDTB(s0, poly);
    if (!dt) {

    }
    potSegA = new Segment(s0.vtxA, dt);
    potSegB = new Segment(dt, s0.vtxB);
    ref1 = [potSegA, potSegB];
    for (i = 0, len = ref1.length; i < len; i++) {
      s1 = ref1[i];
      if (!poly.segOnEdge(s1)) {
        if (_.find(stack, s1)) {
          stack = _.without(stack, s1);
        } else {
          ans.push(s1);
          stack.push(s1);
        }
        s1.vtxA.edgeCnt++;
        s1.vtxB.edgeCnt++;
      } else {
        s1.vtxA.edgeCnt--;
        s1.vtxB.edgeCnt--;
      }
    }
    s0.vtxA.edgeCnt--;
    s0.vtxB.edgeCnt--;
  }
  return ans;
};

curPoly = target2;

painter.paintPolygon(outbox);

painter.paintPolygon(curPoly);

window.slice = _.once(function() {
  var i, len, ref1, results, seg;
  painter.setColor("#ff0000");
  ref1 = getAddEdge(curPoly);
  results = [];
  for (i = 0, len = ref1.length; i < len; i++) {
    seg = ref1[i];
    results.push(painter.paintSeg(seg));
  }
  return results;
});


/***/ })
/******/ ]);