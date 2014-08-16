;(function(e,t,n){function i(n,s){if(!t[n]){if(!e[n]){var o=typeof require=="function"&&require;if(!s&&o)return o(n,!0);if(r)return r(n,!0);throw new Error("Cannot find module '"+n+"'")}var u=t[n]={exports:{}};e[n][0](function(t){var r=e[n][1][t];return i(r?r:t)},u,u.exports)}return t[n].exports}var r=typeof require=="function"&&require;for(var s=0;s<n.length;s++)i(n[s]);return i})({1:[function(require,module,exports){
(function() {
  var at, char, next, parseComplexName, parseDecimalFraction, parseDigits, parseExponent, parseList, parseName, parseNumber, parseSymbol, skipWhiteSpace, text;

  at = void 0;

  char = void 0;

  text = void 0;

  next = function(c) {
    char = text.charAt(at);
    at += 1;
    return char;
  };

  skipWhiteSpace = function() {
    var _results;
    _results = [];
    while (char === ' ') {
      _results.push(next());
    }
    return _results;
  };

  parseDigits = function() {
    var sequence;
    sequence = '';
    while (char >= '0' && char <= '9') {
      sequence += char;
      next();
    }
    return sequence;
  };

  parseDecimalFraction = function() {
    var string;
    string = '';
    if (char === '.') {
      next();
      string += '.' + parseDigits();
    }
    return string;
  };

  parseExponent = function() {
    var string;
    string = '';
    if (char === 'e' || char === 'E') {
      next();
      string += 'e';
      if (char === '-') {
        string += '-';
        next();
      }
      string += parseDigits();
    }
    return string;
  };

  parseNumber = function() {
    var ch, number, string, _at, _ch;
    string = '';
    _ch = ch;
    _at = at;
    if (char === '-') {
      string = '-';
      next();
    }
    string += parseDigits();
    string += parseDecimalFraction();
    string += parseExponent();
    number = Number(string);
    if ((isNaN(number)) || string === '') {
      ch = _ch;
      at = _at;
      return void 0;
    } else {
      return number;
    }
  };

  parseSymbol = function() {
    var value;
    value = char;
    next();
    return value;
  };

  parseComplexName = function() {
    var name;
    name = '';
    if (char === '`') {
      next();
      while (char !== '`') {
        name += char;
        next();
      }
      next();
    }
    return name;
  };

  parseName = function() {
    if (char === '`') {
      return parseComplexName();
    } else {
      return parseSymbol();
    }
  };

  parseList = function() {
    var list, number;
    list = [];
    while (char && char !== ')') {
      skipWhiteSpace();
      number = parseNumber();
      if (number !== void 0) {
        list.push(number);
      } else {
        if (char === '(') {
          next();
          list.push(parseList());
        } else {
          list.push(parseName());
        }
      }
    }
    next();
    return list;
  };

  module.exports = function(string) {
    text = string;
    at = 0;
    next();
    return parseList();
  };

}).call(this);


},{}],2:[function(require,module,exports){
(function() {
  console.log('Script is running.');

}).call(this);


},{}],3:[function(require,module,exports){
(function() {
  var Operator, reduce;

  reduce = function(f, a) {
    return [].splice.call(a, 0).reduce(f);
  };

  module.exports = Operator = (function() {
    function Operator(params) {
      this.domain = params.domain;
      this.range = params.domain;
      this.body = function() {
        return reduce(params.body(arguments));
      };
    }

    return Operator;

  })();

}).call(this);


},{}],4:[function(require,module,exports){
/*
\mathbb{N}  Natural	0, 1, 2, 3, 4, ... or 1, 2, 3, 4, ...
\mathbb{Z}	Integers	..., −5, −4, −3, −2, −1, 0, 1, 2, 3, 4, 5, ...
\mathbb{Q}	Rational	a/b where a and b are integers and b is not 0
\mathbb{R}	Real	The limit of a convergent sequence of rational numbers
\mathbb{C}	Complex	a + bi or a + ib
            where a and b are real numbers and i is the square root of −1
*/


(function() {
  var Op, math;

  Op = require('./operator.coffee');

  math = {};

  math.sum = new Op({
    domain: 'Number, Number',
    range: 'Number',
    body: function(x, y) {
      return x + y;
    }
  });

  math['+'] = math.sum;

  math.times = new Op({
    domain: 'Number, Number',
    range: 'Number',
    body: function(x, y) {
      return x * y;
    }
  });

  math['*'] = math.times;

  module.exports = math;

}).call(this);


},{"./operator.coffee":3}],5:[function(require,module,exports){
(function() {
  var Operator, math, normalize, swap;

  math = require('./math.coffee');

  Operator = require('./operator.coffee');

  swap = function(list, i1, i2) {
    var tmp;
    tmp = list[i1];
    list[i1] = list[i2];
    return list[i2] = temp;
  };

  normalize = function(list) {
    var fst, newList, snd;
    if (list instanceof Array) {
      if (list.length === 1) {
        return list[0];
      }
      fst = list[0];
      if (typeof fst === 'string') {
        if (math[fst]) {
          list[0] = math[fst];
        }
      } else {
        snd = list[1];
        if (typeof snd === 'string') {
          if (math[snd]) {
            snd = math[snd];
          }
        }
        newList = void 0;
        if (snd instanceof Operator) {
          newList = [snd, list[0], list[2]];
        } else {
          newList = [math.times, list[0], list[1]];
        }
      }
    }
    return list;
  };

  /*
  if operator
  # then operands
  else
    if operand
    # multiply
    else
    # list of 3
  
  if operator is undefined
    if declaration
    # declare
    else
    # operator is undefined
  */


  module.exports = normalize;

}).call(this);


},{"./math.coffee":4,"./operator.coffee":3}],6:[function(require,module,exports){
(function() {
  describe('Parse', function() {
    describe('numbers', function() {
      return it('should parse numbers', function() {
        var parse;
        parse = require('./listify.coffee');
        assert.equal(parse('12'), 12);
        assert.equal(parse('-12.9'), -12.9);
        assert.equal(parse('-12.9e2'), -1290);
        return assert.equal(parse('-12.9e-2'), -0.129);
      });
    });
    describe('listify', function() {
      return it('should listify a string', function() {
        var listify;
        listify = require('./listify.coffee');
        assert.deepEqual(listify('+ 2 2'), ['+', 2, 2]);
        assert.deepEqual(listify('(f 2 -1)'), [['f', 2, -1]]);
        assert.deepEqual(listify('(`operator` 2 -1)'), [['operator', 2, -1]]);
        return assert.deepEqual(listify('2+2'), [2, '+', 2]);
      });
    });
    return describe('normalize', function() {
      return it('should normalize operators to prefix notation', function() {
        var f, listify, math, normalize;
        listify = require('./listify.coffee');
        math = require('./math.coffee');
        normalize = require('./normalize.coffee');
        f = function(s) {
          return normalize(listify(s));
        };
        return assert.deepEqual(f('+ 2 2'), [math.sum, 2, 2]);
      });
    });
  });

}).call(this);


},{"./listify.coffee":1,"./math.coffee":4,"./normalize.coffee":5}]},{},[1,2,4,5,3,6])
//@ sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2hlcm1hbi9leHBlcmltZW50cy9zaW1wbGlmeS9zcmMvbGlzdGlmeS5jb2ZmZWUiLCIvaG9tZS9oZXJtYW4vZXhwZXJpbWVudHMvc2ltcGxpZnkvc3JjL21haW4uY29mZmVlIiwiL2hvbWUvaGVybWFuL2V4cGVyaW1lbnRzL3NpbXBsaWZ5L3NyYy9vcGVyYXRvci5jb2ZmZWUiLCIvaG9tZS9oZXJtYW4vZXhwZXJpbWVudHMvc2ltcGxpZnkvc3JjL21hdGguY29mZmVlIiwiL2hvbWUvaGVybWFuL2V4cGVyaW1lbnRzL3NpbXBsaWZ5L3NyYy9ub3JtYWxpemUuY29mZmVlIiwiL2hvbWUvaGVybWFuL2V4cGVyaW1lbnRzL3NpbXBsaWZ5L3NyYy90ZXN0LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Q0FBQSxLQUFBLGtKQUFBOztDQUFBLENBQUEsQ0FBSyxHQUFMOztDQUFBLENBQ0EsQ0FBTyxDQUFQLEVBREE7O0NBQUEsQ0FFQSxDQUFPLENBQVAsRUFGQTs7Q0FBQSxDQUlBLENBQU8sQ0FBUCxLQUFRO0NBQ04sQ0FBTyxDQUFBLENBQVAsRUFBTztDQUFQLENBQ0EsRUFBQTtDQUNBLEdBQUEsT0FBTztDQVBULEVBSU87O0NBSlAsQ0FTQSxDQUFpQixNQUFBLEtBQWpCO0NBQ0UsT0FBQTtDQUFBO0dBQUEsQ0FBTSxDQUFRLE9BQVI7Q0FDSixHQUFBO0NBREYsSUFBQTtxQkFEZTtDQVRqQixFQVNpQjs7Q0FUakIsQ0FhQSxDQUFjLE1BQUEsRUFBZDtDQUNFLE9BQUE7Q0FBQSxDQUFBLENBQVcsQ0FBWCxJQUFBO0NBQ0EsRUFBTSxDQUFBLE9BQUE7Q0FDSixHQUFZLEVBQVosRUFBQTtDQUFBLEdBQ0EsRUFBQTtDQUhGLElBQ0E7Q0FHQSxPQUFBLEdBQU87Q0FsQlQsRUFhYzs7Q0FiZCxDQW9CQSxDQUF1QixNQUFBLFdBQXZCO0NBQ0UsS0FBQSxFQUFBO0NBQUEsQ0FBQSxDQUFTLENBQVQsRUFBQTtDQUNBLEVBQUEsQ0FBQSxDQUFX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QUhqRSxDQUcrQyxJQUF6QyxDQUFXLENBQWpCLENBQUEsQ0FBZ0QsU0FBL0I7Q0FDVixDQUEwQixDQUFBLEVBQWhCLENBQVgsQ0FBVyxFQUFqQixNQUFBO0NBTEYsTUFBOEI7Q0FEaEMsSUFBb0I7Q0FPWCxDQUFhLENBQUEsS0FBdEIsQ0FBc0IsRUFBdEI7Q0FDSyxDQUFILENBQW9ELE1BQUEsSUFBcEQsa0NBQUE7Q0FDRSxXQUFBLGVBQUE7Q0FBQSxFQUFVLElBQVYsQ0FBQSxVQUFVO0NBQVYsRUFDTyxDQUFQLEdBQU8sQ0FBUCxPQUFPO0NBRFAsRUFFWSxJQUFBLENBQVosQ0FBQSxXQUFZO0NBRlosRUFHSSxLQUFKLENBQUs7Q0FBZ0IsTUFBQSxFQUFWLFFBQUE7Q0FIWCxRQUdJO0NBQ0csQ0FBc0IsQ0FBQSxDQUFLLEVBQTVCLENBQVcsRUFBakIsTUFBQTtDQUxGLE1BQW9EO0NBRHRELElBQXNCO0NBZnhCLEVBQWtCO0NBQWxCIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyJhdCA9IHVuZGVmaW5lZFxuY2hhciA9IHVuZGVmaW5lZFxudGV4dCA9IHVuZGVmaW5lZFxuXG5uZXh0ID0gKGMpIC0+XG4gIGNoYXIgPSB0ZXh0LmNoYXJBdCBhdFxuICBhdCArPSAxXG4gIHJldHVybiBjaGFyXG5cbnNraXBXaGl0ZVNwYWNlID0gLT5cbiAgd2hpbGUgY2hhciBpcyAnICdcbiAgICBuZXh0KClcblxucGFyc2VEaWdpdHMgPSAtPlxuICBzZXF1ZW5jZSA9ICcnXG4gIHdoaWxlIGNoYXIgPj0gJzAnIGFuZCBjaGFyIDw9ICc5J1xuICAgIHNlcXVlbmNlICs9IGNoYXJcbiAgICBuZXh0KClcbiAgcmV0dXJuIHNlcXVlbmNlXG5cbnBhcnNlRGVjaW1hbEZyYWN0aW9uID0gLT5cbiAgc3RyaW5nID0gJydcbiAgaWYgY2hhciBpcyAnLidcbiAgICBuZXh0KClcbiAgICBzdHJpbmcgKz0gJy4nICsgcGFyc2VEaWdpdHMoKVxuICByZXR1cm4gc3RyaW5nXG5cbnBhcnNlRXhwb25lbnQgPSAtPlxuICBzdHJpbmcgPSAnJ1xuICBpZiBjaGFyIGlzICdlJyBvciBjaGFyIGlzICdFJ1xuICAgIG5leHQoKVxuICAgIHN0cmluZyArPSAnZSdcbiAgICBpZiBjaGFyIGlzICctJ1xuICAgICAgc3RyaW5nICs9ICctJ1xuICAgICAgbmV4dCgpXG4gICAgc3RyaW5nICs9IHBhcnNlRGlnaXRzKClcbiAgcmV0dXJuIHN0cmluZ1xuXG5wYXJzZU51bWJlciA9IC0+XG4gIHN0cmluZyA9ICcnOyBfY2ggPSBjaDsgX2F0ID0gYXRcbiAgaWYgY2hhciBpcyAnLSdcbiAgICBzdHJpbmcgPSAnLSdcbiAgICBuZXh0KClcbiAgc3RyaW5nICs9IHBhcnNlRGlnaXRzKClcbiAgc3RyaW5nICs9IHBhcnNlRGVjaW1hbEZyYWN0aW9uKClcbiAgc3RyaW5nICs9IHBhcnNlRXhwb25lbnQoKVxuICBudW1iZXIgPSBOdW1iZXIgc3RyaW5nXG4gIGlmIChpc05hTiBudW1iZXIpIG9yIHN0cmluZyBpcyAnJ1xuICAjIHRoaXMgaXMgZm9yIHRoZSBzYWtlIG9mIG1pbnVzIG9wZXJhdG9yXG4gICAgY2ggPSBfY2g7IGF0ID0gX2F0XG4gICAgcmV0dXJuIHVuZGVmaW5lZFxuICBlbHNlXG4gICAgcmV0dXJuIG51bWJlclxuXG5wYXJzZVN5bWJvbCA9IC0+XG4gIHZhbHVlID0gY2hhclxuICBuZXh0KClcbiAgcmV0dXJuIHZhbHVlXG5cbnBhcnNlQ29tcGxleE5hbWUgPSAtPlxuICBuYW1lID0gJydcbiAgaWYgY2hhciBpcyAnYCdcbiAgICBuZXh0KClcbiAgICB3aGlsZSBjaGFyIGlzbnQgJ2AnXG4gICAgICBuYW1lICs9IGNoYXJcbiAgICAgIG5leHQoKVxuICAgIG5leHQoKVxuICByZXR1cm4gbmFtZVxuXG5wYXJzZU5hbWUgPSAtPlxuICBpZiBjaGFyIGlzICdgJ1xuICAgIHJldHVybiBwYXJzZUNvbXBsZXhOYW1lKClcbiAgZWxzZVxuICAgIHJldHVybiBwYXJzZVN5bWJvbCgpXG5cbnBhcnNlTGlzdCA9IC0+XG4gIGxpc3QgPSBbXVxuICB3aGlsZSBjaGFyIGFuZCBjaGFyIGlzbnQgJyknXG4gICAgc2tpcFdoaXRlU3BhY2UoKVxuICAgIG51bWJlciA9IHBhcnNlTnVtYmVyKClcbiAgICBpZiBudW1iZXIgaXNudCB1bmRlZmluZWRcbiAgICAgIGxpc3QucHVzaCBudW1iZXJcbiAgICBlbHNlXG4gICAgICBpZiBjaGFyIGlzICcoJ1xuICAgICAgICBuZXh0KClcbiAgICAgICAgbGlzdC5wdXNoIHBhcnNlTGlzdCgpXG4gICAgICBlbHNlXG4gICAgICAgIGxpc3QucHVzaCBwYXJzZU5hbWUoKVxuICBuZXh0KClcbiAgcmV0dXJuIGxpc3RcblxubW9kdWxlLmV4cG9ydHMgPSAoc3RyaW5nKSAtPlxuICB0ZXh0ID0gc3RyaW5nXG4gIGF0ID0gMFxuICBuZXh0KClcbiAgcmV0dXJuIHBhcnNlTGlzdCgpXG4iLCIjIGRlcGVuZGVuY3kgPSByZXF1aXJlICdwYXRoL3RvL3NjcmlwdCdcbiMgbW9kdWxlLmV4cG9ydHMgPSAnc29tZXRoaW5nJyAjIHJldHVybiB3aGVuIHJlcWlyZWRcbmNvbnNvbGUubG9nICdTY3JpcHQgaXMgcnVubmluZy4nXG4iLCJyZWR1Y2UgPSAoZiwgYSkgLT4gW10uc3BsaWNlLmNhbGwoYSwgMCkucmVkdWNlKGYpXG5cbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgT3BlcmF0b3JcbiAgY29uc3RydWN0b3I6IChwYXJhbXMpIC0+XG4gICAgQGRvbWFpbiA9IHBhcmFtcy5kb21haW5cbiAgICBAcmFuZ2UgPSBwYXJhbXMuZG9tYWluXG4gICAgQGJvZHkgPSAtPiByZWR1Y2UgcGFyYW1zLmJvZHkgYXJndW1lbnRzXG4iLCIjIyNcblxcbWF0aGJie059ICBOYXR1cmFsXHQwLCAxLCAyLCAzLCA0LCAuLi4gb3IgMSwgMiwgMywgNCwgLi4uXG5cXG1hdGhiYntafVx0SW50ZWdlcnNcdC4uLiwg4oiSNSwg4oiSNCwg4oiSMywg4oiSMiwg4oiSMSwgMCwgMSwgMiwgMywgNCwgNSwgLi4uXG5cXG1hdGhiYntRfVx0UmF0aW9uYWxcdGEvYiB3aGVyZSBhIGFuZCBiIGFyZSBpbnRlZ2VycyBhbmQgYiBpcyBub3QgMFxuXFxtYXRoYmJ7Un1cdFJlYWxcdFRoZSBsaW1pdCBvZiBhIGNvbnZlcmdlbnQgc2VxdWVuY2Ugb2YgcmF0aW9uYWwgbnVtYmVyc1xuXFxtYXRoYmJ7Q31cdENvbXBsZXhcdGEgKyBiaSBvciBhICsgaWJcbiAgICAgICAgICAgIHdoZXJlIGEgYW5kIGIgYXJlIHJlYWwgbnVtYmVycyBhbmQgaSBpcyB0aGUgc3F1YXJlIHJvb3Qgb2Yg4oiSMVxuIyMjXG5PcCA9IHJlcXVpcmUgJy4vb3BlcmF0b3IuY29mZmVlJ1xubWF0aCA9IHt9XG5tYXRoLnN1bSA9IG5ldyBPcChcbiAgZG9tYWluOiAnTnVtYmVyLCBOdW1iZXInXG4gIHJhbmdlOiAnTnVtYmVyJ1xuICBib2R5OiAoeCx5KSAtPiB4ICsgeVxuKVxubWF0aFsnKyddID0gbWF0aC5zdW1cbm1hdGgudGltZXMgPSBuZXcgT3AoXG4gIGRvbWFpbjogJ051bWJlciwgTnVtYmVyJ1xuICByYW5nZTogJ051bWJlcidcbiAgYm9keTogKHgseSkgLT4geCAqIHlcbilcbm1hdGhbJyonXSA9IG1hdGgudGltZXNcbm1vZHVsZS5leHBvcnRzID0gbWF0aFxuIiwibWF0aCA9IHJlcXVpcmUgJy4vbWF0aC5jb2ZmZWUnXG5PcGVyYXRvciA9IHJlcXVpcmUgJy4vb3BlcmF0b3IuY29mZmVlJ1xuXG5zd2FwID0gKGxpc3QsIGkxLCBpMikgLT5cbiAgdG1wID0gbGlzdFtpMV1cbiAgbGlzdFtpMV0gPSBsaXN0W2kyXVxuICBsaXN0W2kyXSA9IHRlbXBcblxubm9ybWFsaXplID0gKGxpc3QpIC0+XG4gIGlmIGxpc3QgaW5zdGFuY2VvZiBBcnJheVxuICAgIGlmIGxpc3QubGVuZ3RoIGlzIDFcbiAgICAgIHJldHVybiBsaXN0WzBdXG5cbiAgICBmc3QgPSBsaXN0WzBdXG4gICAgaWYgdHlwZW9mIGZzdCBpcyAnc3RyaW5nJ1xuICAgICAgaWYgbWF0aFtmc3RdXG4gICAgICAgIGxpc3RbMF0gPSBtYXRoW2ZzdF1cbiAgICAjIGVsc2VcbiAgICAjICAgaXQncyB2YXJpYWJsZSwgbGVhdmUgYXMgYSBzdHJpbmdcbiAgICBlbHNlXG4gICAgIyBmc3QgaXMgYSBudW1iZXIsIGl0J3MgaW5maXggbm90YXRpb25cbiAgICAgIHNuZCA9IGxpc3RbMV1cblxuICAgICAgaWYgdHlwZW9mIHNuZCBpcyAnc3RyaW5nJ1xuICAgICAgICBpZiBtYXRoW3NuZF1cbiAgICAgICAgIyBleHBsaWNpdCBvcGVyYXRvclxuICAgICAgICAgIHNuZCA9IG1hdGhbc25kXVxuXG4gICAgICBuZXdMaXN0ID0gdW5kZWZpbmVkXG5cbiAgICAgIGlmIHNuZCBpbnN0YW5jZW9mIE9wZXJhdG9yXG4gICAgICAgIG5ld0xpc3QgPSBbc25kLCBsaXN0WzBdLCBsaXN0WzJdXVxuICAgICAgZWxzZVxuICAgICAgICBuZXdMaXN0ID0gW21hdGgudGltZXMsIGxpc3RbMF0sIGxpc3RbMV1dXG4gICAgICAgIFxuICByZXR1cm4gbGlzdFxuXG4jIyNcbmlmIG9wZXJhdG9yXG4jIHRoZW4gb3BlcmFuZHNcbmVsc2VcbiAgaWYgb3BlcmFuZFxuICAjIG11bHRpcGx5XG4gIGVsc2VcbiAgIyBsaXN0IG9mIDNcblxuaWYgb3BlcmF0b3IgaXMgdW5kZWZpbmVkXG4gIGlmIGRlY2xhcmF0aW9uXG4gICMgZGVjbGFyZVxuICBlbHNlXG4gICMgb3BlcmF0b3IgaXMgdW5kZWZpbmVkXG5cblxuXG4jIyNcbm1vZHVsZS5leHBvcnRzID0gbm9ybWFsaXplXG4iLCJkZXNjcmliZSAnUGFyc2UnLCAtPlxuICBkZXNjcmliZSAnbnVtYmVycycsIC0+XG4gICAgaXQgJ3Nob3VsZCBwYXJzZSBudW1iZXJzJywgLT5cbiAgICAgIHBhcnNlID0gcmVxdWlyZSAnLi9saXN0aWZ5LmNvZmZlZSdcbiAgICAgIGFzc2VydC5lcXVhbCBwYXJzZSgnMTInKSwgMTJcbiAgICAgIGFzc2VydC5lcXVhbCBwYXJzZSgnLTEyLjknKSwgLTEyLjlcbiAgICAgIGFzc2VydC5lcXVhbCBwYXJzZSgnLTEyLjllMicpLCAtMTI5MFxuICAgICAgYXNzZXJ0LmVxdWFsIHBhcnNlKCctMTIuOWUtMicpLCAtMC4xMjlcbiAgZGVzY3JpYmUgJ2xpc3RpZnknLCAtPlxuICAgIGl0ICdzaG91bGQgbGlzdGlmeSBhIHN0cmluZycsIC0+XG4gICAgICBsaXN0aWZ5ID0gcmVxdWlyZSAnLi9saXN0aWZ5LmNvZmZlZSdcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwgbGlzdGlmeSgnKyAyIDInKSwgWycrJywgMiwgMl1cbiAgICAgIGFzc2VydC5kZWVwRXF1YWwgbGlzdGlmeSgnKGYgMiAtMSknKSwgW1snZicsIDIsIC0xXV1cbiAgICAgIGFzc2VydC5kZWVwRXF1YWwgbGlzdGlmeSgnKGBvcGVyYXRvcmAgMiAtMSknKSwgW1snb3BlcmF0b3InLCAyLCAtMV1dXG4gICAgICBhc3NlcnQuZGVlcEVxdWFsIGxpc3RpZnkoJzIrMicpLCBbMiwgJysnLCAyXVxuICBkZXNjcmliZSAnbm9ybWFsaXplJywgLT5cbiAgICBpdCAnc2hvdWxkIG5vcm1hbGl6ZSBvcGVyYXRvcnMgdG8gcHJlZml4IG5vdGF0aW9uJywgLT5cbiAgICAgIGxpc3RpZnkgPSByZXF1aXJlICcuL2xpc3RpZnkuY29mZmVlJ1xuICAgICAgbWF0aCA9IHJlcXVpcmUgJy4vbWF0aC5jb2ZmZWUnXG4gICAgICBub3JtYWxpemUgPSByZXF1aXJlICcuL25vcm1hbGl6ZS5jb2ZmZWUnXG4gICAgICBmID0gKHMpIC0+IG5vcm1hbGl6ZShsaXN0aWZ5IHMpXG4gICAgICBhc3NlcnQuZGVlcEVxdWFsIGYoJysgMiAyJyksIFttYXRoLnN1bSwgMiwgMl1cbiAgICAgICNhc3NlcnQuZGVlcEVxdWFsIGYoJzIrIDIrMicpLCBbbWF0aC5zdW0sIFttYXRoLnN1bSwgMiwgMl0sIDJdXG4iXX0=
;