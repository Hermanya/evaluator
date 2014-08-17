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

  math.subtract = new Op({
    domain: 'Number, Number',
    range: 'Number',
    body: function(x, y) {
      return x - y;
    }
  });

  math['-'] = math.subtract;

  module.exports = math;

}).call(this);


},{"./operator.coffee":3}],5:[function(require,module,exports){
(function() {
  var Operator, isOperator, math, normalize, swap;

  math = require('./math.coffee');

  Operator = require('./operator.coffee');

  swap = function(list, i1, i2) {
    var tmp;
    tmp = list[i1];
    list[i1] = list[i2];
    return list[i2] = temp;
  };

  isOperator = function(x) {
    return typeof x === 'string' && math[x];
  };

  normalize = function(list) {
    debugger;
    var fst, item, rest, snd, _i, _len;
    if (!(list instanceof Array)) {
      return list;
    }
    if (list.length === 1) {
      return list[0];
    }
    for (_i = 0, _len = list.length; _i < _len; _i++) {
      item = list[_i];
      if (item instanceof Array) {
        normalize(item);
      }
    }
    fst = list[0];
    if (isOperator(fst)) {
      list[0] = math[fst];
    } else {
      while (true) {
        snd = list[1];
        if (isOperator(snd)) {
          fst = [math[snd], fst, list[2]];
          rest = list.splice(3);
          list = [fst].concat(rest);
        } else {
          if (typeof snd === 'number' && snd < 0) {
            fst = [math.sum, fst, snd];
          } else {
            fst = [math.times, fst, snd];
          }
          rest = list.splice(2);
          list = [fst].concat(rest);
        }
        if (list.length === 1) {
          list = list[0];
          break;
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
        assert.deepEqual(f('2+2+ 3'), [math.sum, [math.sum, 2, 2], 3]);
        return assert.deepEqual(f('+ 2 2'), [math.sum, 2, 2]);
      });
    });
  });

}).call(this);


},{"./listify.coffee":1,"./math.coffee":4,"./normalize.coffee":5}]},{},[1,2,4,5,3,6])
//@ sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2hlcm1hbi9leHBlcmltZW50cy9zaW1wbGlmeS9zcmMvbGlzdGlmeS5jb2ZmZWUiLCIvaG9tZS9oZXJtYW4vZXhwZXJpbWVudHMvc2ltcGxpZnkvc3JjL21haW4uY29mZmVlIiwiL2hvbWUvaGVybWFuL2V4cGVyaW1lbnRzL3NpbXBsaWZ5L3NyYy9vcGVyYXRvci5jb2ZmZWUiLCIvaG9tZS9oZXJtYW4vZXhwZXJpbWVudHMvc2ltcGxpZnkvc3JjL21hdGguY29mZmVlIiwiL2hvbWUvaGVybWFuL2V4cGVyaW1lbnRzL3NpbXBsaWZ5L3NyYy9ub3JtYWxpemUuY29mZmVlIiwiL2hvbWUvaGVybWFuL2V4cGVyaW1lbnRzL3NpbXBsaWZ5L3NyYy90ZXN0LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Q0FBQSxLQUFBLGtKQUFBOztDQUFBLENBQUEsQ0FBSyxHQUFMOztDQUFBLENBQ0EsQ0FBTyxDQUFQLEVBREE7O0NBQUEsQ0FFQSxDQUFPLENBQVAsRUFGQTs7Q0FBQSxDQUlBLENBQU8sQ0FBUCxLQUFRO0NBQ04sQ0FBTyxDQUFBLENBQVAsRUFBTztDQUFQLENBQ0EsRUFBQTtDQUNBLEdBQUEsT0FBTztDQVBULEVBSU87O0NBSlAsQ0FTQSxDQUFpQixNQUFBLEtBQWpCO0NBQ0UsT0FBQTtDQUFBO0dBQUEsQ0FBTSxDQUFRLE9BQVI7Q0FDSixHQUFBO0NBREYsSUFBQTtxQkFEZTtDQVRqQixFQVNpQjs7Q0FUakIsQ0FhQSxDQUFjLE1BQUEsRUFBZDtDQUNFLE9BQUE7Q0FBQSxDQUFBLENBQVcsQ0FBWCxJQUFBO0NBQ0EsRUFBTSxDQUFBLE9BQUE7Q0FDSixHQUFZLEVBQVosRUFBQTtDQUFBLEdBQ0EsRUFBQTtDQUhGLElBQ0E7Q0FHQSxPQUFBLEdBQU87Q0FsQlQsRUFhYzs7Q0FiZCxDQW9CQSxDQUF1QixNQUFBLFdBQXZCO0NBQ0UsS0FBQSxFQUFBO0NBQUEsQ0FBQSxDQUFTLENBQVQsRUFBQTtDQUNBLEVBQUEsQ0FBQSxDQUFXO0NBQ1QsR0FBQSxFQUFBO0NBQUEsRUFDVSxDQUFBLEVBQVYsS0FBZ0I7TUFIbEI7Q0FJQSxLQUFBLEtBQU87Q0F6QlQsRUFvQnVCOztDQXBCdkIsQ0EyQkEsQ0FBZ0IsTUFBQSxJQUFoQjtDQUNFLEtBQUEsRUFBQTtDQUFBLENBQUEsQ0FBUyxDQUFULEVBQUE7Q0FDQSxFQUFHLENBQUgsQ0FBVztDQUNULEdBQUEsRUFBQTtDQUFBLEVBQUEsQ0FDVSxFQUFWO0NBQ0EsRUFBQSxDQUFHLENBQVEsQ0FBWDtDQUNFLEVBQUEsQ0FBVSxFQUFWLEVBQUE7Q0FBQSxHQUNBLElBQUE7UUFKRjtDQUFBLEdBS1UsRUFBVixLQUFVO01BUFo7Q0FRQSxLQUFBLEtBQU87Q0FwQ1QsRUEyQmdCOztDQTNCaEIsQ0FzQ0EsQ0FBYyxNQUFBLEVBQWQ7Q0FDRSxPQUFBLG9CQUFBO0NBQUEsQ0FBQSxDQUFTLENBQVQsRUFBQTtDQUFBLENBQUEsQ0FBYSxDQUFBO0NBQWIsQ0FBQSxDQUF1QixDQUFBO0NBQ3ZCLEVBQUEsQ0FBQSxDQUFXO0NBQ1QsRUFBUyxHQUFUO0NBQUEsR0FDQSxFQUFBO01BSEY7Q0FBQSxHQUlBLEVBQUEsS0FBVTtDQUpWLEdBS0EsRUFBQSxjQUFVO0NBTFYsR0FNQSxFQUFBLE9BQVU7Q0FOVixFQU9TLENBQVQsRUFBQTtDQUNBLENBQUEsRUFBQSxDQUFJLENBQUE7Q0FFRixDQUFBLENBQUssR0FBTDtDQUFBLENBQVUsQ0FBSyxHQUFMO0NBQ1YsS0FBQSxPQUFPO01BSFQ7Q0FLRSxLQUFBLE9BQU87TUFkRztDQXRDZCxFQXNDYzs7Q0F0Q2QsQ0FzREEsQ0FBYyxNQUFBLEVBQWQ7Q0FDRSxJQUFBLEdBQUE7Q0FBQSxFQUFRLENBQVIsQ0FBQTtDQUFBLEdBQ0E7Q0FDQSxJQUFBLE1BQU87Q0F6RFQsRUFzRGM7O0NBdERkLENBMkRBLENBQW1CLE1BQUEsT0FBbkI7Q0FDRSxHQUFBLElBQUE7Q0FBQSxDQUFBLENBQU8sQ0FBUDtDQUNBLEVBQUEsQ0FBQSxDQUFXO0NBQ1QsR0FBQSxFQUFBO0NBQ0EsRUFBQSxDQUFNLENBQVUsUUFBVjtDQUNKLEdBQUEsSUFBQTtDQUFBLEdBQ0EsSUFBQTtDQUhGLE1BQ0E7Q0FEQSxHQUlBLEVBQUE7TUFORjtDQU9BLEdBQUEsT0FBTztDQW5FVCxFQTJEbUI7O0NBM0RuQixDQXFFQSxDQUFZLE1BQVo7Q0FDRSxFQUFBLENBQUEsQ0FBVztDQUNULFlBQU8sR0FBQTtNQURUO0NBR0UsVUFBTyxFQUFBO01BSkM7Q0FyRVosRUFxRVk7O0NBckVaLENBMkVBLENBQVksTUFBWjtDQUNFLE9BQUEsSUFBQTtDQUFBLENBQUEsQ0FBTyxDQUFQO0NBQ0EsRUFBQSxDQUFNLENBQW1CLE1BQW5CO0NBQ0osS0FBQSxRQUFBO0NBQUEsRUFDUyxHQUFULEtBQVM7Q0FDVCxHQUFHLENBQVksQ0FBZjtDQUNFLEdBQUksRUFBSixFQUFBO01BREYsRUFBQTtDQUdFLEVBQUEsQ0FBRyxDQUFRLEdBQVg7Q0FDRSxHQUFBLE1BQUE7Q0FBQSxHQUNJLEtBQU0sQ0FBVjtNQUZGLElBQUE7Q0FJRSxHQUFJLEtBQU0sQ0FBVjtVQVBKO1FBSEY7Q0FEQSxJQUNBO0NBREEsR0FZQTtDQUNBLEdBQUEsT0FBTztDQXpGVCxFQTJFWTs7Q0EzRVosQ0EyRkEsQ0FBaUIsR0FBWCxDQUFOLEVBQWtCO0NBQ2hCLEVBQU8sQ0FBUCxFQUFBO0NBQUEsQ0FDQSxDQUFLLENBQUw7Q0FEQSxHQUVBO0NBQ0EsUUFBTyxFQUFBO0NBL0ZULEVBMkZpQjtDQTNGakI7Ozs7O0FDRUE7Q0FBQSxDQUFBLENBQUEsSUFBTyxhQUFQO0NBQUE7Ozs7O0FDRkE7Q0FBQSxLQUFBLFVBQUE7O0NBQUEsQ0FBQSxDQUFTLEdBQVQsR0FBVTtDQUFZLENBQUQsRUFBRixFQUFTLEtBQVQ7Q0FBbkIsRUFBUzs7Q0FBVCxDQUVBLENBQXVCLEdBQWpCLENBQU47Q0FDZSxFQUFBLENBQUEsRUFBQSxZQUFDO0NBQ1osRUFBVSxDQUFULEVBQUQ7Q0FBQSxFQUNTLENBQVIsQ0FBRCxDQUFBO0NBREEsRUFFUSxDQUFQLEVBQUQsR0FBUTtDQUFVLEdBQUEsRUFBUCxHQUFPLE1BQVA7Q0FGWCxNQUVRO0NBSFYsSUFBYTs7Q0FBYjs7Q0FIRjtDQUFBOzs7OztBQ0FBOzs7Ozs7OztDQUFBO0NBQUE7Q0FBQTtDQUFBLEtBQUEsRUFBQTs7Q0FBQSxDQVFBLENBQUssSUFBQSxZQUFBOztDQVJMLENBU0EsQ0FBTyxDQUFQOztDQVRBLENBVUEsQ0FBQSxDQUFJO0NBQ0YsQ0FBUSxFQUFSLEVBQUEsVUFBQTtDQUFBLENBQ08sRUFBUCxDQUFBLEdBREE7Q0FBQSxDQUVNLENBQUEsQ0FBTixLQUFPO0NBQVEsRUFBSSxVQUFKO0NBRmYsSUFFTTtDQWJSLEdBVWU7O0NBVmYsQ0FlQSxDQUFLLENBQUE7O0NBZkwsQ0FnQkEsQ0FBaUIsQ0FBYixDQUFKO0NBQ0UsQ0FBUSxFQUFSLEVBQUEsVUFBQTtDQUFBLENBQ08sRUFBUCxDQUFBLEdBREE7Q0FBQSxDQUVNLENBQUEsQ0FBTixLQUFPO0NBQVEsRUFBSSxVQUFKO0NBRmYsSUFFTTtDQW5CUixHQWdCaUI7O0NBaEJqQixDQXFCQSxDQUFLLENBQUEsQ0FyQkw7O0NBQUEsQ0FzQkEsQ0FBb0IsQ0FBaEIsSUFBSjtDQUNFLENBQVEsRUFBUixFQUFBLFVBQUE7Q0FBQSxDQUNPLEVBQVAsQ0FBQSxHQURBO0NBQUEsQ0FFTSxDQUFBLENBQU4sS0FBTztDQUFRLEVBQUksVUFBSjtDQUZmLElBRU07Q0F6QlIsR0FzQm9COztDQXRCcEIsQ0EyQkEsQ0FBSyxDQUFBLElBM0JMOztDQUFBLENBNEJBLENBQWlCLENBNUJqQixFQTRCTSxDQUFOO0NBNUJBOzs7OztBQ0FBO0NBQUEsS0FBQSxxQ0FBQTs7Q0FBQSxDQUFBLENBQU8sQ0FBUCxHQUFPLFFBQUE7O0NBQVAsQ0FDQSxDQUFXLElBQUEsQ0FBWCxXQUFXOztDQURYLENBR0EsQ0FBTyxDQUFQLEtBQVE7Q0FDTixFQUFBLEtBQUE7Q0FBQSxDQUFXLENBQVgsQ0FBQTtDQUFBLENBQ0ssQ0FBTSxDQUFYO0NBQ0ssQ0FBQSxDQUFNLENBQU4sT0FBTDtDQU5GLEVBR087O0NBSFAsQ0FRQSxDQUFhLE1BQUMsQ0FBZDtBQUNTLENBQVAsR0FBZ0MsQ0FBYixDQUFaLEVBQUEsR0FBQTtDQVRULEVBUWE7O0NBUmIsQ0FXQSxDQUFZLENBQUEsS0FBWjtDQUNFLFlBQUE7Q0FBQSxPQUFBLHNCQUFBO0FBQ08sQ0FBUCxHQUFBLENBQU8sT0FBaUI7Q0FDdEIsR0FBQSxTQUFPO01BRlQ7Q0FJQSxHQUFBLENBQWtCLENBQWY7Q0FDRCxHQUFZLFNBQUw7TUFMVDtBQU9BLENBQUEsUUFBQSxrQ0FBQTt1QkFBQTtDQUNFLEdBQUcsQ0FBSCxDQUFBLE1BQW1CO0NBQ2pCLEdBQUEsSUFBQSxDQUFBO1FBRko7Q0FBQSxJQVBBO0NBQUEsRUFXQSxDQUFBO0NBQ0EsRUFBRyxDQUFILE1BQUc7Q0FFRCxFQUFVLENBQUwsRUFBTDtNQUZGO0NBS0UsRUFBQSxDQUFBLFNBQU07Q0FDSixFQUFBLENBQVcsSUFBWDtDQUVBLEVBQUcsQ0FBQSxJQUFILEVBQUc7Q0FFRCxDQUFrQixDQUFsQixDQUFZLE1BQVo7Q0FBQSxFQUNPLENBQVAsRUFBTyxJQUFQO0NBREEsRUFFTyxDQUFQLEVBQU8sSUFBUDtNQUpGLElBQUE7QUFPSyxDQUFILEVBQUcsQ0FBQSxDQUFjLENBQWQsRUFBQSxFQUFIO0NBQ0UsQ0FBaUIsQ0FBakIsQ0FBVyxRQUFYO01BREYsTUFBQTtDQUdFLENBQW1CLENBQW5CLENBQVcsQ0FBTCxPQUFOO1lBSEY7Q0FBQSxFQUlPLENBQVAsRUFBTyxJQUFQO0NBSkEsRUFLTyxDQUFQLEVBQU8sSUFBUDtVQWRGO0NBZ0JBLEdBQUcsQ0FBZSxDQUFmLEVBQUg7Q0FDRSxFQUFPLENBQVAsTUFBQTtDQUNBLGVBRkY7VUFqQkY7Q0FMRixNQUtFO01BakJGO0NBcUNBLEdBQUEsT0FBTztDQWpEVCxFQVdZOztDQXlDWjs7Ozs7Ozs7Ozs7Ozs7O0NBcERBOztDQUFBLENBc0VBLENBQWlCLEdBQVgsQ0FBTixFQXRFQTtDQUFBOzs7OztBQ0FBO0NBQUEsQ0FBQSxDQUFrQixJQUFsQixDQUFBLENBQWtCO0NBQ2hCLENBQW9CLENBQUEsQ0FBcEIsSUFBQSxDQUFBO0NBQ0ssQ0FBSCxDQUEyQixNQUFBLElBQTNCLFNBQUE7Q0FDRSxJQUFBLE9BQUE7Q0FBQSxFQUFRLEVBQVIsRUFBUSxDQUFSLFVBQVE7Q0FBUixDQUMwQixFQUFiLENBQWIsQ0FBTSxFQUFOO0FBQzhCLENBRjlCLENBRTZCLEVBQTdCLENBQUEsQ0FBTSxDQUFPLENBQWI7QUFDZ0MsQ0FIaEMsQ0FHK0IsRUFBL0IsQ0FBQSxDQUFNLEVBQU4sQ0FBYTtBQUNvQixDQUExQixDQUF5QixHQUFoQyxDQUFNLElBQU8sS0FBYjtDQUxGLE1BQTJCO0NBRDdCLElBQW9CO0NBQXBCLENBT29CLENBQUEsQ0FBcEIsSUFBQSxDQUFBO0NBQ0ssQ0FBSCxDQUE4QixNQUFBLElBQTlCLFlBQUE7Q0FDRSxNQUFBLEtBQUE7Q0FBQSxFQUFVLElBQVYsQ0FBQSxVQUFVO0NBQVYsQ0FDbUMsQ0FBQSxHQUE3QixDQUFXLENBQWpCLENBQUE7QUFDaUQsQ0FGakQsQ0FFc0MsQ0FBQyxHQUFqQyxDQUFXLENBQWpCLENBQUEsQ0FBaUI7QUFDZ0QsQ0FIakUsQ0FHK0MsSUFBekMsQ0FBVyxDQUFqQixDQUFBLENBQWdELFNBQS9CO0NBQ1YsQ0FBMEIsQ0FBQSxFQUFoQixDQUFYLENBQVcsRUFBakIsTUFBQTtDQUxGLE1BQThCO0NBRGhDLElBQW9CO0NBT1gsQ0FBYSxDQUFBLEtBQXRCLENBQXNCLEVBQXRCO0NBQ0ssQ0FBSCxDQUFvRCxNQUFBLElBQXBELGtDQUFBO0NBQ0UsV0FBQSxlQUFBO0NBQUEsRUFBVSxJQUFWLENBQUEsVUFBVTtDQUFWLEVBQ08sQ0FBUCxHQUFPLENBQVAsT0FBTztDQURQLEVBRVksSUFBQSxDQUFaLENBQUEsV0FBWTtDQUZaLEVBR0ksS0FBSixDQUFLO0NBQWdCLE1BQUEsRUFBVixRQUFBO0NBSFgsUUFHSTtDQUhKLENBSThCLENBQUEsQ0FBSyxFQUE3QixFQUFOLENBQUE7Q0FDTyxDQUFzQixDQUFBLENBQUssRUFBNUIsQ0FBVyxFQUFqQixNQUFBO0NBTkYsTUFBb0Q7Q0FEdEQsSUFBc0I7Q0FmeEIsRUFBa0I7Q0FBbEIiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbImF0ID0gdW5kZWZpbmVkXG5jaGFyID0gdW5kZWZpbmVkXG50ZXh0ID0gdW5kZWZpbmVkXG5cbm5leHQgPSAoYykgLT5cbiAgY2hhciA9IHRleHQuY2hhckF0IGF0XG4gIGF0ICs9IDFcbiAgcmV0dXJuIGNoYXJcblxuc2tpcFdoaXRlU3BhY2UgPSAtPlxuICB3aGlsZSBjaGFyIGlzICcgJ1xuICAgIG5leHQoKVxuXG5wYXJzZURpZ2l0cyA9IC0+XG4gIHNlcXVlbmNlID0gJydcbiAgd2hpbGUgY2hhciA+PSAnMCcgYW5kIGNoYXIgPD0gJzknXG4gICAgc2VxdWVuY2UgKz0gY2hhclxuICAgIG5leHQoKVxuICByZXR1cm4gc2VxdWVuY2VcblxucGFyc2VEZWNpbWFsRnJhY3Rpb24gPSAtPlxuICBzdHJpbmcgPSAnJ1xuICBpZiBjaGFyIGlzICcuJ1xuICAgIG5leHQoKVxuICAgIHN0cmluZyArPSAnLicgKyBwYXJzZURpZ2l0cygpXG4gIHJldHVybiBzdHJpbmdcblxucGFyc2VFeHBvbmVudCA9IC0+XG4gIHN0cmluZyA9ICcnXG4gIGlmIGNoYXIgaXMgJ2UnIG9yIGNoYXIgaXMgJ0UnXG4gICAgbmV4dCgpXG4gICAgc3RyaW5nICs9ICdlJ1xuICAgIGlmIGNoYXIgaXMgJy0nXG4gICAgICBzdHJpbmcgKz0gJy0nXG4gICAgICBuZXh0KClcbiAgICBzdHJpbmcgKz0gcGFyc2VEaWdpdHMoKVxuICByZXR1cm4gc3RyaW5nXG5cbnBhcnNlTnVtYmVyID0gLT5cbiAgc3RyaW5nID0gJyc7IF9jaCA9IGNoOyBfYXQgPSBhdFxuICBpZiBjaGFyIGlzICctJ1xuICAgIHN0cmluZyA9ICctJ1xuICAgIG5leHQoKVxuICBzdHJpbmcgKz0gcGFyc2VEaWdpdHMoKVxuICBzdHJpbmcgKz0gcGFyc2VEZWNpbWFsRnJhY3Rpb24oKVxuICBzdHJpbmcgKz0gcGFyc2VFeHBvbmVudCgpXG4gIG51bWJlciA9IE51bWJlciBzdHJpbmdcbiAgaWYgKGlzTmFOIG51bWJlcikgb3Igc3RyaW5nIGlzICcnXG4gICMgdGhpcyBpcyBmb3IgdGhlIHNha2Ugb2YgbWludXMgb3BlcmF0b3JcbiAgICBjaCA9IF9jaDsgYXQgPSBfYXRcbiAgICByZXR1cm4gdW5kZWZpbmVkXG4gIGVsc2VcbiAgICByZXR1cm4gbnVtYmVyXG5cbnBhcnNlU3ltYm9sID0gLT5cbiAgdmFsdWUgPSBjaGFyXG4gIG5leHQoKVxuICByZXR1cm4gdmFsdWVcblxucGFyc2VDb21wbGV4TmFtZSA9IC0+XG4gIG5hbWUgPSAnJ1xuICBpZiBjaGFyIGlzICdgJ1xuICAgIG5leHQoKVxuICAgIHdoaWxlIGNoYXIgaXNudCAnYCdcbiAgICAgIG5hbWUgKz0gY2hhclxuICAgICAgbmV4dCgpXG4gICAgbmV4dCgpXG4gIHJldHVybiBuYW1lXG5cbnBhcnNlTmFtZSA9IC0+XG4gIGlmIGNoYXIgaXMgJ2AnXG4gICAgcmV0dXJuIHBhcnNlQ29tcGxleE5hbWUoKVxuICBlbHNlXG4gICAgcmV0dXJuIHBhcnNlU3ltYm9sKClcblxucGFyc2VMaXN0ID0gLT5cbiAgbGlzdCA9IFtdXG4gIHdoaWxlIGNoYXIgYW5kIGNoYXIgaXNudCAnKSdcbiAgICBza2lwV2hpdGVTcGFjZSgpXG4gICAgbnVtYmVyID0gcGFyc2VOdW1iZXIoKVxuICAgIGlmIG51bWJlciBpc250IHVuZGVmaW5lZFxuICAgICAgbGlzdC5wdXNoIG51bWJlclxuICAgIGVsc2VcbiAgICAgIGlmIGNoYXIgaXMgJygnXG4gICAgICAgIG5leHQoKVxuICAgICAgICBsaXN0LnB1c2ggcGFyc2VMaXN0KClcbiAgICAgIGVsc2VcbiAgICAgICAgbGlzdC5wdXNoIHBhcnNlTmFtZSgpXG4gIG5leHQoKVxuICByZXR1cm4gbGlzdFxuXG5tb2R1bGUuZXhwb3J0cyA9IChzdHJpbmcpIC0+XG4gIHRleHQgPSBzdHJpbmdcbiAgYXQgPSAwXG4gIG5leHQoKVxuICByZXR1cm4gcGFyc2VMaXN0KClcbiIsIiMgZGVwZW5kZW5jeSA9IHJlcXVpcmUgJ3BhdGgvdG8vc2NyaXB0J1xuIyBtb2R1bGUuZXhwb3J0cyA9ICdzb21ldGhpbmcnICMgcmV0dXJuIHdoZW4gcmVxaXJlZFxuY29uc29sZS5sb2cgJ1NjcmlwdCBpcyBydW5uaW5nLidcbiIsInJlZHVjZSA9IChmLCBhKSAtPiBbXS5zcGxpY2UuY2FsbChhLCAwKS5yZWR1Y2UoZilcblxubW9kdWxlLmV4cG9ydHMgPSBjbGFzcyBPcGVyYXRvclxuICBjb25zdHJ1Y3RvcjogKHBhcmFtcykgLT5cbiAgICBAZG9tYWluID0gcGFyYW1zLmRvbWFpblxuICAgIEByYW5nZSA9IHBhcmFtcy5kb21haW5cbiAgICBAYm9keSA9IC0+IHJlZHVjZSBwYXJhbXMuYm9keSBhcmd1bWVudHNcbiIsIiMjI1xuXFxtYXRoYmJ7Tn0gIE5hdHVyYWxcdDAsIDEsIDIsIDMsIDQsIC4uLiBvciAxLCAyLCAzLCA0LCAuLi5cblxcbWF0aGJie1p9XHRJbnRlZ2Vyc1x0Li4uLCDiiJI1LCDiiJI0LCDiiJIzLCDiiJIyLCDiiJIxLCAwLCAxLCAyLCAzLCA0LCA1LCAuLi5cblxcbWF0aGJie1F9XHRSYXRpb25hbFx0YS9iIHdoZXJlIGEgYW5kIGIgYXJlIGludGVnZXJzIGFuZCBiIGlzIG5vdCAwXG5cXG1hdGhiYntSfVx0UmVhbFx0VGhlIGxpbWl0IG9mIGEgY29udmVyZ2VudCBzZXF1ZW5jZSBvZiByYXRpb25hbCBudW1iZXJzXG5cXG1hdGhiYntDfVx0Q29tcGxleFx0YSArIGJpIG9yIGEgKyBpYlxuICAgICAgICAgICAgd2hlcmUgYSBhbmQgYiBhcmUgcmVhbCBudW1iZXJzIGFuZCBpIGlzIHRoZSBzcXVhcmUgcm9vdCBvZiDiiJIxXG4jIyNcbk9wID0gcmVxdWlyZSAnLi9vcGVyYXRvci5jb2ZmZWUnXG5tYXRoID0ge31cbm1hdGguc3VtID0gbmV3IE9wKFxuICBkb21haW46ICdOdW1iZXIsIE51bWJlcidcbiAgcmFuZ2U6ICdOdW1iZXInXG4gIGJvZHk6ICh4LHkpIC0+IHggKyB5XG4pXG5tYXRoWycrJ10gPSBtYXRoLnN1bVxubWF0aC50aW1lcyA9IG5ldyBPcChcbiAgZG9tYWluOiAnTnVtYmVyLCBOdW1iZXInXG4gIHJhbmdlOiAnTnVtYmVyJ1xuICBib2R5OiAoeCx5KSAtPiB4ICogeVxuKVxubWF0aFsnKiddID0gbWF0aC50aW1lc1xubWF0aC5zdWJ0cmFjdCA9IG5ldyBPcChcbiAgZG9tYWluOiAnTnVtYmVyLCBOdW1iZXInXG4gIHJhbmdlOiAnTnVtYmVyJ1xuICBib2R5OiAoeCx5KSAtPiB4IC0geVxuKVxubWF0aFsnLSddID0gbWF0aC5zdWJ0cmFjdFxubW9kdWxlLmV4cG9ydHMgPSBtYXRoXG4iLCJtYXRoID0gcmVxdWlyZSAnLi9tYXRoLmNvZmZlZSdcbk9wZXJhdG9yID0gcmVxdWlyZSAnLi9vcGVyYXRvci5jb2ZmZWUnXG5cbnN3YXAgPSAobGlzdCwgaTEsIGkyKSAtPlxuICB0bXAgPSBsaXN0W2kxXVxuICBsaXN0W2kxXSA9IGxpc3RbaTJdXG4gIGxpc3RbaTJdID0gdGVtcFxuXG5pc09wZXJhdG9yID0gKHgpIC0+XG4gIHJldHVybiB0eXBlb2YgeCBpcyAnc3RyaW5nJyBhbmQgbWF0aFt4XVxuXG5ub3JtYWxpemUgPSAobGlzdCkgLT5cbiAgZGVidWdnZXJcbiAgaWYgbm90IChsaXN0IGluc3RhbmNlb2YgQXJyYXkpXG4gICAgcmV0dXJuIGxpc3RcblxuICBpZiBsaXN0Lmxlbmd0aCBpcyAxXG4gICAgcmV0dXJuIGxpc3RbMF1cblxuICBmb3IgaXRlbSBpbiBsaXN0XG4gICAgaWYgaXRlbSBpbnN0YW5jZW9mIEFycmF5XG4gICAgICBub3JtYWxpemUgaXRlbVxuXG4gIGZzdCA9IGxpc3RbMF1cbiAgaWYgaXNPcGVyYXRvciBmc3RcbiAgIyBwcmVmaXggbm90YXRpb25cbiAgICBsaXN0WzBdID0gbWF0aFtmc3RdXG4gIGVsc2VcbiAgIyBpbmZpeCBub3RhdGlvblxuICAgIHdoaWxlIHRydWUgIyBkbyB3aGlsZSBsb29wXG4gICAgICBzbmQgPSBsaXN0WzFdXG5cbiAgICAgIGlmIGlzT3BlcmF0b3Igc25kXG4gICAgICAjIGV4cGxpY2l0IG9wZXJhdG9yXG4gICAgICAgIGZzdCA9IFttYXRoW3NuZF0sIGZzdCwgbGlzdFsyXV1cbiAgICAgICAgcmVzdCA9IGxpc3Quc3BsaWNlKDMpXG4gICAgICAgIGxpc3QgPSBbZnN0XS5jb25jYXQgcmVzdFxuICAgICAgZWxzZVxuICAgICAgIyBpbXBsaWNpdCBvcGVyYXRvclxuICAgICAgICBpZiB0eXBlb2Ygc25kIGlzICdudW1iZXInIGFuZCBzbmQgPCAwXG4gICAgICAgICAgZnN0ID0gW21hdGguc3VtLCBmc3QsIHNuZF1cbiAgICAgICAgZWxzZVxuICAgICAgICAgIGZzdCA9IFttYXRoLnRpbWVzLCBmc3QsIHNuZF1cbiAgICAgICAgcmVzdCA9IGxpc3Quc3BsaWNlKDIpXG4gICAgICAgIGxpc3QgPSBbZnN0XS5jb25jYXQgcmVzdFxuXG4gICAgICBpZiBsaXN0Lmxlbmd0aCBpcyAxXG4gICAgICAgIGxpc3QgPSBsaXN0WzBdXG4gICAgICAgIGJyZWFrXG4gIHJldHVybiBsaXN0XG5cblxuIyMjXG5pZiBvcGVyYXRvclxuIyB0aGVuIG9wZXJhbmRzXG5lbHNlXG4gIGlmIG9wZXJhbmRcbiAgIyBtdWx0aXBseVxuICBlbHNlXG4gICMgbGlzdCBvZiAzXG5cbmlmIG9wZXJhdG9yIGlzIHVuZGVmaW5lZFxuICBpZiBkZWNsYXJhdGlvblxuICAjIGRlY2xhcmVcbiAgZWxzZVxuICAjIG9wZXJhdG9yIGlzIHVuZGVmaW5lZFxuXG5cblxuIyMjXG5tb2R1bGUuZXhwb3J0cyA9IG5vcm1hbGl6ZVxuIiwiZGVzY3JpYmUgJ1BhcnNlJywgLT5cbiAgZGVzY3JpYmUgJ251bWJlcnMnLCAtPlxuICAgIGl0ICdzaG91bGQgcGFyc2UgbnVtYmVycycsIC0+XG4gICAgICBwYXJzZSA9IHJlcXVpcmUgJy4vbGlzdGlmeS5jb2ZmZWUnXG4gICAgICBhc3NlcnQuZXF1YWwgcGFyc2UoJzEyJyksIDEyXG4gICAgICBhc3NlcnQuZXF1YWwgcGFyc2UoJy0xMi45JyksIC0xMi45XG4gICAgICBhc3NlcnQuZXF1YWwgcGFyc2UoJy0xMi45ZTInKSwgLTEyOTBcbiAgICAgIGFzc2VydC5lcXVhbCBwYXJzZSgnLTEyLjllLTInKSwgLTAuMTI5XG4gIGRlc2NyaWJlICdsaXN0aWZ5JywgLT5cbiAgICBpdCAnc2hvdWxkIGxpc3RpZnkgYSBzdHJpbmcnLCAtPlxuICAgICAgbGlzdGlmeSA9IHJlcXVpcmUgJy4vbGlzdGlmeS5jb2ZmZWUnXG4gICAgICBhc3NlcnQuZGVlcEVxdWFsIGxpc3RpZnkoJysgMiAyJyksIFsnKycsIDIsIDJdXG4gICAgICBhc3NlcnQuZGVlcEVxdWFsIGxpc3RpZnkoJyhmIDIgLTEpJyksIFtbJ2YnLCAyLCAtMV1dXG4gICAgICBhc3NlcnQuZGVlcEVxdWFsIGxpc3RpZnkoJyhgb3BlcmF0b3JgIDIgLTEpJyksIFtbJ29wZXJhdG9yJywgMiwgLTFdXVxuICAgICAgYXNzZXJ0LmRlZXBFcXVhbCBsaXN0aWZ5KCcyKzInKSwgWzIsICcrJywgMl1cbiAgZGVzY3JpYmUgJ25vcm1hbGl6ZScsIC0+XG4gICAgaXQgJ3Nob3VsZCBub3JtYWxpemUgb3BlcmF0b3JzIHRvIHByZWZpeCBub3RhdGlvbicsIC0+XG4gICAgICBsaXN0aWZ5ID0gcmVxdWlyZSAnLi9saXN0aWZ5LmNvZmZlZSdcbiAgICAgIG1hdGggPSByZXF1aXJlICcuL21hdGguY29mZmVlJ1xuICAgICAgbm9ybWFsaXplID0gcmVxdWlyZSAnLi9ub3JtYWxpemUuY29mZmVlJ1xuICAgICAgZiA9IChzKSAtPiBub3JtYWxpemUobGlzdGlmeSBzKVxuICAgICAgYXNzZXJ0LmRlZXBFcXVhbCBmKCcyKzIrIDMnKSwgW21hdGguc3VtLFttYXRoLnN1bSwgMiwgMl0sIDNdXG4gICAgICBhc3NlcnQuZGVlcEVxdWFsIGYoJysgMiAyJyksIFttYXRoLnN1bSwgMiwgMl1cbiJdfQ==
;