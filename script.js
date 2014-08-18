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
  var Operator;

  module.exports = Operator = (function() {
    function Operator(params) {
      this.domain = params.domain;
      this.range = params.domain;
      this.precedence = params.precedence;
      this.body = function() {
        return Array.prototype.reduce.call(arguments, params.body);
      };
    }

    return Operator;

  })();

}).call(this);


},{}],4:[function(require,module,exports){
(function() {
  var Operator, evaluate;

  Operator = require('./operator.coffee');

  evaluate = function(list) {
    var dontEvaluate, index, item, _i, _len;
    dontEvaluate = false;
    for (index = _i = 0, _len = list.length; _i < _len; index = ++_i) {
      item = list[index];
      if (index !== 0) {
        if (item instanceof Array) {
          list[index] = evaluate(item);
        }
        if (typeof list[index] !== 'number') {
          dontEvaluate = true;
        }
      }
    }
    if (dontEvaluate) {
      return list;
    }
    return list[0].body.apply(null, list.splice(1));
  };

  module.exports = evaluate;

}).call(this);


},{"./operator.coffee":3}],5:[function(require,module,exports){
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
    precedence: 0,
    body: function(x, y) {
      return x + y;
    }
  });

  math['+'] = math.sum;

  math.times = new Op({
    domain: 'Number, Number',
    range: 'Number',
    precedence: 1,
    body: function(x, y) {
      return x * y;
    }
  });

  math['*'] = math.times;

  math.subtract = new Op({
    domain: 'Number, Number',
    range: 'Number',
    precedence: 0,
    body: function(x, y) {
      return x - y;
    }
  });

  math['-'] = math.subtract;

  module.exports = math;

}).call(this);


},{"./operator.coffee":3}],6:[function(require,module,exports){
(function() {
  var Operator, getIndexOfOperatorWithHighestPrecedence, insertImplicitOperators, isOperator, math, nestByPrecedence, prefixify, swap;

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

  insertImplicitOperators = function(list) {
    var index, item, lastIsNotOperator, result, _i, _len;
    result = [];
    lastIsNotOperator = function() {
      return !(result[result.length - 1] instanceof Operator);
    };
    for (index = _i = 0, _len = list.length; _i < _len; index = ++_i) {
      item = list[index];
      if (index === 0) {
        result.push(item);
        continue;
      }
      if (isOperator(item)) {
        result.push(math[item]);
      } else {
        if (lastIsNotOperator()) {
          if (typeof item === 'number' && item < 0) {
            result.push(math.sum);
          } else {
            result.push(math.times);
          }
        }
        result.push(item);
      }
    }
    return result;
  };

  getIndexOfOperatorWithHighestPrecedence = function(list) {
    var current, index, item, max, _i, _len;
    max = list[1];
    index = 1;
    for (current = _i = 0, _len = list.length; _i < _len; current = ++_i) {
      item = list[current];
      if (item instanceof Operator && item.precedence > max.precedence) {
        max = item;
        index = current;
      }
    }
    return index;
  };

  nestByPrecedence = function(list) {
    var i, newList;
    while (true) {
      i = getIndexOfOperatorWithHighestPrecedence(list);
      newList = [list[i], list[i - 1], list[i + 1]];
      list = list.splice(0, i - 1).concat([newList].concat(list.splice(i + 2)));
      if (list.length === 1) {
        return list[0];
      }
    }
  };

  prefixify = function(list) {
    var item, _i, _len;
    if (!(list instanceof Array)) {
      return list;
    }
    if (list.length === 1) {
      return list[0];
    }
    for (_i = 0, _len = list.length; _i < _len; _i++) {
      item = list[_i];
      if (item instanceof Array) {
        prefixify(item);
      }
    }
    if (isOperator(list[0])) {
      list[0] = math[list[0]];
    } else {
      list = nestByPrecedence(insertImplicitOperators(list));
    }
    return list;
  };

  /*
  */


  module.exports = prefixify;

}).call(this);


},{"./math.coffee":5,"./operator.coffee":3}],7:[function(require,module,exports){
(function() {
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

  describe('prefixify', function() {
    return it('should convert operators to prefix notation', function() {
      var f, listify, math, prefixify;
      listify = require('./listify.coffee');
      math = require('./math.coffee');
      prefixify = require('./prefixify.coffee');
      f = function(s) {
        return prefixify(listify(s));
      };
      assert.deepEqual(f('2+2+ 3'), [math.sum, [math.sum, 2, 2], 3]);
      assert.deepEqual(f('+ 2 2'), [math.sum, 2, 2]);
      assert.deepEqual(f('2 2'), [math.times, 2, 2]);
      return assert.deepEqual(f('2-2x'), [math.sum, 2, [math.times, -2, 'x']]);
    });
  });

  describe('evaluate', function() {
    return it('should evaluate expression', function() {
      var evaluate, f, listify, math, prefixify;
      listify = require('./listify.coffee');
      math = require('./math.coffee');
      prefixify = require('./prefixify.coffee');
      evaluate = require('./evaluate.coffee');
      f = function(s) {
        return evaluate(prefixify(listify(s)));
      };
      assert.equal(f('2+2+3'), 7);
      assert.equal(f('2*2+3'), 7);
      assert.equal(f('2 + 2 * 3'), 8);
      return assert.deepEqual(f('x+2*3'), [math.sum, 'x', 6]);
    });
  });

}).call(this);


},{"./listify.coffee":1,"./math.coffee":5,"./prefixify.coffee":6,"./evaluate.coffee":4}]},{},[4,1,2,5,3,6,7])
//@ sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2hlcm1hbi9leHBlcmltZW50cy9zaW1wbGlmeS9zcmMvbGlzdGlmeS5jb2ZmZWUiLCIvaG9tZS9oZXJtYW4vZXhwZXJpbWVudHMvc2ltcGxpZnkvc3JjL21haW4uY29mZmVlIiwiL2hvbWUvaGVybWFuL2V4cGVyaW1lbnRzL3NpbXBsaWZ5L3NyYy9vcGVyYXRvci5jb2ZmZWUiLCIvaG9tZS9oZXJtYW4vZXhwZXJpbWVudHMvc2ltcGxpZnkvc3JjL2V2YWx1YXRlLmNvZmZlZSIsIi9ob21lL2hlcm1hbi9leHBlcmltZW50cy9zaW1wbGlmeS9zcmMvbWF0aC5jb2ZmZWUiLCIvaG9tZS9oZXJtYW4vZXhwZXJpbWVudHMvc2ltcGxpZnkvc3JjL3ByZWZpeGlmeS5jb2ZmZWUiLCIvaG9tZS9oZXJtYW4vZXhwZXJpbWVudHMvc2ltcGxpZnkvc3JjL3Rlc3QuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtDQUFBLEtBQUEsa0pBQUE7O0NBQUEsQ0FBQSxDQUFLLEdBQUw7O0NBQUEsQ0FDQSxDQUFPLENBQVAsRUFEQTs7Q0FBQSxDQUVBLENBQU8sQ0FBUCxFQUZBOztDQUFBLENBSUEsQ0FBTyxDQUFQLEtBQVE7Q0FDTixDQUFPLENBQUEsQ0FBUCxFQUFPO0NBQVAsQ0FDQSxFQUFBO0NBQ0EsR0FBQSxPQUFPO0NBUFQsRUFJTzs7Q0FKUCxDQVNBLENBQWlCLE1BQUEsS0FBakI7Q0FDRSxPQUFBO0NBQUE7R0FBQSxDQUFNLENBQVEsT0FBUjtDQUNKLEdBQUE7Q0FERixJQUFBO3FCQURlO0NBVGpCLEVBU2lCOztDQVRqQixDQWFBLENBQWMsTUFBQSxFQUFkO0NBQ0UsT0FBQTtDQUFBLENBQUEsQ0FBVyxDQUFYLElBQUE7Q0FDQSxFQUFNLENBQUEsT0FBQTtDQUNKLEdBQVksRUFBWixFQUFBO0NBQUEsR0FDQSxFQUFBO0NBSEYsSUFDQTtDQUdBLE9BQUEsR0FBTztDQWxCVCxFQWFjOztDQWJkLENBb0JBLENBQXVCLE1BQUEsV0FBdkI7Q0FD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SEosQ0FJOEIsQ0FBQSxDQUFLLEVBQW5DLEVBQWlCLENBQWpCO0NBSkEsQ0FLNkIsQ0FBQSxDQUFLLEVBQWxDLENBQWlCLEVBQWpCO0NBTEEsQ0FNMkIsRUFBSyxDQUFmLENBQWpCLEdBQUE7QUFDd0QsQ0FBakQsQ0FBcUIsQ0FBQSxDQUFLLENBQVMsQ0FBcEMsR0FBTixJQUFBO0NBUkYsSUFBa0Q7Q0FEcEQsRUFBc0I7O0NBZHRCLENBd0JBLENBQXFCLEtBQXJCLENBQXFCLENBQXJCO0NBQ0ssQ0FBSCxDQUFpQyxNQUFBLEVBQWpDLGlCQUFBO0NBQ0UsU0FBQSwyQkFBQTtDQUFBLEVBQVUsR0FBVixDQUFBLFdBQVU7Q0FBVixFQUNPLENBQVAsRUFBQSxDQUFPLFFBQUE7Q0FEUCxFQUVZLEdBQVosQ0FBWSxFQUFaLFdBQVk7Q0FGWixFQUdXLEdBQVgsQ0FBVyxDQUFYLFdBQVc7Q0FIWCxFQUlJLEdBQUosR0FBSztDQUFlLE1BQVUsQ0FBbkIsQ0FBUyxNQUFUO0NBSlgsTUFJSTtDQUpKLENBS3lCLEdBQXpCLENBQUEsQ0FBYTtDQUxiLENBTXlCLEdBQXpCLENBQUEsQ0FBYTtDQU5iLENBTzZCLEdBQTdCLENBQUEsS0FBYTtDQUNOLENBQXNCLENBQUEsQ0FBSyxFQUE1QixDQUFXLEVBQWpCLElBQUE7Q0FURixJQUFpQztDQURuQyxFQUFxQjtDQXhCckIiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbImF0ID0gdW5kZWZpbmVkXG5jaGFyID0gdW5kZWZpbmVkXG50ZXh0ID0gdW5kZWZpbmVkXG5cbm5leHQgPSAoYykgLT5cbiAgY2hhciA9IHRleHQuY2hhckF0IGF0XG4gIGF0ICs9IDFcbiAgcmV0dXJuIGNoYXJcblxuc2tpcFdoaXRlU3BhY2UgPSAtPlxuICB3aGlsZSBjaGFyIGlzICcgJ1xuICAgIG5leHQoKVxuXG5wYXJzZURpZ2l0cyA9IC0+XG4gIHNlcXVlbmNlID0gJydcbiAgd2hpbGUgY2hhciA+PSAnMCcgYW5kIGNoYXIgPD0gJzknXG4gICAgc2VxdWVuY2UgKz0gY2hhclxuICAgIG5leHQoKVxuICByZXR1cm4gc2VxdWVuY2VcblxucGFyc2VEZWNpbWFsRnJhY3Rpb24gPSAtPlxuICBzdHJpbmcgPSAnJ1xuICBpZiBjaGFyIGlzICcuJ1xuICAgIG5leHQoKVxuICAgIHN0cmluZyArPSAnLicgKyBwYXJzZURpZ2l0cygpXG4gIHJldHVybiBzdHJpbmdcblxucGFyc2VFeHBvbmVudCA9IC0+XG4gIHN0cmluZyA9ICcnXG4gIGlmIGNoYXIgaXMgJ2UnIG9yIGNoYXIgaXMgJ0UnXG4gICAgbmV4dCgpXG4gICAgc3RyaW5nICs9ICdlJ1xuICAgIGlmIGNoYXIgaXMgJy0nXG4gICAgICBzdHJpbmcgKz0gJy0nXG4gICAgICBuZXh0KClcbiAgICBzdHJpbmcgKz0gcGFyc2VEaWdpdHMoKVxuICByZXR1cm4gc3RyaW5nXG5cbnBhcnNlTnVtYmVyID0gLT5cbiAgc3RyaW5nID0gJyc7IF9jaCA9IGNoOyBfYXQgPSBhdFxuICBpZiBjaGFyIGlzICctJ1xuICAgIHN0cmluZyA9ICctJ1xuICAgIG5leHQoKVxuICBzdHJpbmcgKz0gcGFyc2VEaWdpdHMoKVxuICBzdHJpbmcgKz0gcGFyc2VEZWNpbWFsRnJhY3Rpb24oKVxuICBzdHJpbmcgKz0gcGFyc2VFeHBvbmVudCgpXG4gIG51bWJlciA9IE51bWJlciBzdHJpbmdcbiAgaWYgKGlzTmFOIG51bWJlcikgb3Igc3RyaW5nIGlzICcnXG4gICMgdGhpcyBpcyBmb3IgdGhlIHNha2Ugb2YgbWludXMgb3BlcmF0b3JcbiAgICBjaCA9IF9jaDsgYXQgPSBfYXRcbiAgICByZXR1cm4gdW5kZWZpbmVkXG4gIGVsc2VcbiAgICByZXR1cm4gbnVtYmVyXG5cbnBhcnNlU3ltYm9sID0gLT5cbiAgdmFsdWUgPSBjaGFyXG4gIG5leHQoKVxuICByZXR1cm4gdmFsdWVcblxucGFyc2VDb21wbGV4TmFtZSA9IC0+XG4gIG5hbWUgPSAnJ1xuICBpZiBjaGFyIGlzICdgJ1xuICAgIG5leHQoKVxuICAgIHdoaWxlIGNoYXIgaXNudCAnYCdcbiAgICAgIG5hbWUgKz0gY2hhclxuICAgICAgbmV4dCgpXG4gICAgbmV4dCgpXG4gIHJldHVybiBuYW1lXG5cbnBhcnNlTmFtZSA9IC0+XG4gIGlmIGNoYXIgaXMgJ2AnXG4gICAgcmV0dXJuIHBhcnNlQ29tcGxleE5hbWUoKVxuICBlbHNlXG4gICAgcmV0dXJuIHBhcnNlU3ltYm9sKClcblxucGFyc2VMaXN0ID0gLT5cbiAgbGlzdCA9IFtdXG4gIHdoaWxlIGNoYXIgYW5kIGNoYXIgaXNudCAnKSdcbiAgICBza2lwV2hpdGVTcGFjZSgpXG4gICAgbnVtYmVyID0gcGFyc2VOdW1iZXIoKVxuICAgIGlmIG51bWJlciBpc250IHVuZGVmaW5lZFxuICAgICAgbGlzdC5wdXNoIG51bWJlclxuICAgIGVsc2VcbiAgICAgIGlmIGNoYXIgaXMgJygnXG4gICAgICAgIG5leHQoKVxuICAgICAgICBsaXN0LnB1c2ggcGFyc2VMaXN0KClcbiAgICAgIGVsc2VcbiAgICAgICAgbGlzdC5wdXNoIHBhcnNlTmFtZSgpXG4gIG5leHQoKVxuICByZXR1cm4gbGlzdFxuXG5tb2R1bGUuZXhwb3J0cyA9IChzdHJpbmcpIC0+XG4gIHRleHQgPSBzdHJpbmdcbiAgYXQgPSAwXG4gIG5leHQoKVxuICByZXR1cm4gcGFyc2VMaXN0KClcbiIsIiMgZGVwZW5kZW5jeSA9IHJlcXVpcmUgJ3BhdGgvdG8vc2NyaXB0J1xuIyBtb2R1bGUuZXhwb3J0cyA9ICdzb21ldGhpbmcnICMgcmV0dXJuIHdoZW4gcmVxaXJlZFxuY29uc29sZS5sb2cgJ1NjcmlwdCBpcyBydW5uaW5nLidcbiIsIm1vZHVsZS5leHBvcnRzID0gY2xhc3MgT3BlcmF0b3JcbiAgY29uc3RydWN0b3I6IChwYXJhbXMpIC0+XG4gICAgQGRvbWFpbiA9IHBhcmFtcy5kb21haW5cbiAgICBAcmFuZ2UgPSBwYXJhbXMuZG9tYWluXG4gICAgQHByZWNlZGVuY2UgPSBwYXJhbXMucHJlY2VkZW5jZVxuICAgIEBib2R5ID0gLT4gQXJyYXkucHJvdG90eXBlLnJlZHVjZS5jYWxsKGFyZ3VtZW50cywgcGFyYW1zLmJvZHkpXG4iLCJPcGVyYXRvciA9IHJlcXVpcmUgJy4vb3BlcmF0b3IuY29mZmVlJ1xuZXZhbHVhdGUgPSAobGlzdCkgLT5cbiAgZG9udEV2YWx1YXRlID0gZmFsc2VcbiAgZm9yIGl0ZW0sIGluZGV4IGluIGxpc3RcbiAgICBpZiBpbmRleCBpc250IDBcbiAgICAgIGlmIGl0ZW0gaW5zdGFuY2VvZiBBcnJheVxuICAgICAgICBsaXN0W2luZGV4XSA9IGV2YWx1YXRlIGl0ZW1cbiAgICAgIGlmIHR5cGVvZiBsaXN0W2luZGV4XSBpc250ICdudW1iZXInXG4gICAgICAgIGRvbnRFdmFsdWF0ZSA9IHRydWVcbiAgaWYgZG9udEV2YWx1YXRlXG4gICAgcmV0dXJuIGxpc3RcbiAgcmV0dXJuIGxpc3RbMF0uYm9keS5hcHBseShudWxsLCBsaXN0LnNwbGljZSgxKSlcblxubW9kdWxlLmV4cG9ydHMgPSBldmFsdWF0ZVxuIiwiIyMjXG5cXG1hdGhiYntOfSAgTmF0dXJhbFx0MCwgMSwgMiwgMywgNCwgLi4uIG9yIDEsIDIsIDMsIDQsIC4uLlxuXFxtYXRoYmJ7Wn1cdEludGVnZXJzXHQuLi4sIOKIkjUsIOKIkjQsIOKIkjMsIOKIkjIsIOKIkjEsIDAsIDEsIDIsIDMsIDQsIDUsIC4uLlxuXFxtYXRoYmJ7UX1cdFJhdGlvbmFsXHRhL2Igd2hlcmUgYSBhbmQgYiBhcmUgaW50ZWdlcnMgYW5kIGIgaXMgbm90IDBcblxcbWF0aGJie1J9XHRSZWFsXHRUaGUgbGltaXQgb2YgYSBjb252ZXJnZW50IHNlcXVlbmNlIG9mIHJhdGlvbmFsIG51bWJlcnNcblxcbWF0aGJie0N9XHRDb21wbGV4XHRhICsgYmkgb3IgYSArIGliXG4gICAgICAgICAgICB3aGVyZSBhIGFuZCBiIGFyZSByZWFsIG51bWJlcnMgYW5kIGkgaXMgdGhlIHNxdWFyZSByb290IG9mIOKIkjFcbiMjI1xuT3AgPSByZXF1aXJlICcuL29wZXJhdG9yLmNvZmZlZSdcbm1hdGggPSB7fVxubWF0aC5zdW0gPSBuZXcgT3AoXG4gIGRvbWFpbjogJ051bWJlciwgTnVtYmVyJ1xuICByYW5nZTogJ051bWJlcidcbiAgcHJlY2VkZW5jZTogMFxuICBib2R5OiAoeCx5KSAtPiB4ICsgeVxuKVxubWF0aFsnKyddID0gbWF0aC5zdW1cblxubWF0aC50aW1lcyA9IG5ldyBPcChcbiAgZG9tYWluOiAnTnVtYmVyLCBOdW1iZXInXG4gIHJhbmdlOiAnTnVtYmVyJ1xuICBwcmVjZWRlbmNlOiAxXG4gIGJvZHk6ICh4LHkpIC0+IHggKiB5XG4pXG5tYXRoWycqJ10gPSBtYXRoLnRpbWVzXG5cbm1hdGguc3VidHJhY3QgPSBuZXcgT3AoXG4gIGRvbWFpbjogJ051bWJlciwgTnVtYmVyJ1xuICByYW5nZTogJ051bWJlcidcbiAgcHJlY2VkZW5jZTogMFxuICBib2R5OiAoeCx5KSAtPiB4IC0geVxuKVxubWF0aFsnLSddID0gbWF0aC5zdWJ0cmFjdFxubW9kdWxlLmV4cG9ydHMgPSBtYXRoXG4iLCJtYXRoID0gcmVxdWlyZSAnLi9tYXRoLmNvZmZlZSdcbk9wZXJhdG9yID0gcmVxdWlyZSAnLi9vcGVyYXRvci5jb2ZmZWUnXG5cbnN3YXAgPSAobGlzdCwgaTEsIGkyKSAtPlxuICB0bXAgPSBsaXN0W2kxXVxuICBsaXN0W2kxXSA9IGxpc3RbaTJdXG4gIGxpc3RbaTJdID0gdGVtcFxuXG5pc09wZXJhdG9yID0gKHgpIC0+XG4gIHJldHVybiB0eXBlb2YgeCBpcyAnc3RyaW5nJyBhbmQgbWF0aFt4XVxuXG5pbnNlcnRJbXBsaWNpdE9wZXJhdG9ycyA9IChsaXN0KSAtPlxuICByZXN1bHQgPSBbXVxuICBsYXN0SXNOb3RPcGVyYXRvciA9IC0+XG4gICAgcmV0dXJuIG5vdCAocmVzdWx0W3Jlc3VsdC5sZW5ndGggLSAxXSBpbnN0YW5jZW9mIE9wZXJhdG9yKVxuXG4gIGZvciBpdGVtLCBpbmRleCBpbiBsaXN0XG4gICAgaWYgaW5kZXggaXMgMFxuICAgICAgcmVzdWx0LnB1c2ggaXRlbVxuICAgICAgY29udGludWVcbiAgICBpZiBpc09wZXJhdG9yIGl0ZW1cbiAgICAgIHJlc3VsdC5wdXNoIG1hdGhbaXRlbV1cbiAgICBlbHNlXG4gICAgICBpZiBsYXN0SXNOb3RPcGVyYXRvcigpXG4gICAgICAgIGlmIHR5cGVvZiBpdGVtIGlzICdudW1iZXInIGFuZCBpdGVtIDwgMFxuICAgICAgICAgIHJlc3VsdC5wdXNoIG1hdGguc3VtXG4gICAgICAgIGVsc2VcbiAgICAgICAgICByZXN1bHQucHVzaCBtYXRoLnRpbWVzXG4gICAgICByZXN1bHQucHVzaCBpdGVtXG4gIHJldHVybiByZXN1bHRcblxuZ2V0SW5kZXhPZk9wZXJhdG9yV2l0aEhpZ2hlc3RQcmVjZWRlbmNlID0gKGxpc3QpIC0+XG4gIG1heCA9IGxpc3RbMV1cbiAgaW5kZXggPSAxXG4gIGZvciBpdGVtLCBjdXJyZW50IGluIGxpc3RcbiAgICBpZiBpdGVtIGluc3RhbmNlb2YgT3BlcmF0b3IgYW5kIGl0ZW0ucHJlY2VkZW5jZSA+IG1heC5wcmVjZWRlbmNlXG4gICAgICBtYXggPSBpdGVtXG4gICAgICBpbmRleCA9IGN1cnJlbnRcbiAgcmV0dXJuIGluZGV4XG5cbm5lc3RCeVByZWNlZGVuY2UgPSAobGlzdCkgLT5cbiAgd2hpbGUgdHJ1ZVxuICAgIGkgPSBnZXRJbmRleE9mT3BlcmF0b3JXaXRoSGlnaGVzdFByZWNlZGVuY2UobGlzdClcbiAgICBuZXdMaXN0ID0gW2xpc3RbaV0sIGxpc3RbaSAtIDFdLCBsaXN0W2kgKyAxXV1cbiAgICBsaXN0ID0gbGlzdC5zcGxpY2UoMCwgaSAtIDEpLmNvbmNhdChbbmV3TGlzdF0uY29uY2F0KGxpc3Quc3BsaWNlKGkgKyAyKSkpXG4gICAgaWYgbGlzdC5sZW5ndGggaXMgMVxuICAgICAgcmV0dXJuIGxpc3RbMF1cblxucHJlZml4aWZ5ID0gKGxpc3QpIC0+XG4gIGlmIG5vdCAobGlzdCBpbnN0YW5jZW9mIEFycmF5KVxuICAgIHJldHVybiBsaXN0XG5cbiAgaWYgbGlzdC5sZW5ndGggaXMgMVxuICAgIHJldHVybiBsaXN0WzBdXG5cbiAgZm9yIGl0ZW0gaW4gbGlzdFxuICAgIGlmIGl0ZW0gaW5zdGFuY2VvZiBBcnJheVxuICAgICAgcHJlZml4aWZ5IGl0ZW1cblxuICBpZiBpc09wZXJhdG9yIGxpc3RbMF1cbiAgIyBwcmVmaXggbm90YXRpb25cbiAgICBsaXN0WzBdID0gbWF0aFtsaXN0WzBdXVxuICBlbHNlXG4gICMgaW5maXggbm90YXRpb25cbiAgICBsaXN0ID0gbmVzdEJ5UHJlY2VkZW5jZSBpbnNlcnRJbXBsaWNpdE9wZXJhdG9ycyhsaXN0KVxuXG4gIHJldHVybiBsaXN0XG5cblxuIyMjXG5cbiMjI1xubW9kdWxlLmV4cG9ydHMgPSBwcmVmaXhpZnlcbiIsImRlc2NyaWJlICdudW1iZXJzJywgLT5cbiAgaXQgJ3Nob3VsZCBwYXJzZSBudW1iZXJzJywgLT5cbiAgICBwYXJzZSA9IHJlcXVpcmUgJy4vbGlzdGlmeS5jb2ZmZWUnXG4gICAgYXNzZXJ0LmVxdWFsIHBhcnNlKCcxMicpLCAxMlxuICAgIGFzc2VydC5lcXVhbCBwYXJzZSgnLTEyLjknKSwgLTEyLjlcbiAgICBhc3NlcnQuZXF1YWwgcGFyc2UoJy0xMi45ZTInKSwgLTEyOTBcbiAgICBhc3NlcnQuZXF1YWwgcGFyc2UoJy0xMi45ZS0yJyksIC0wLjEyOVxuZGVzY3JpYmUgJ2xpc3RpZnknLCAtPlxuICBpdCAnc2hvdWxkIGxpc3RpZnkgYSBzdHJpbmcnLCAtPlxuICAgIGxpc3RpZnkgPSByZXF1aXJlICcuL2xpc3RpZnkuY29mZmVlJ1xuICAgIGFzc2VydC5kZWVwRXF1YWwgbGlzdGlmeSgnKyAyIDInKSwgWycrJywgMiwgMl1cbiAgICBhc3NlcnQuZGVlcEVxdWFsIGxpc3RpZnkoJyhmIDIgLTEpJyksIFtbJ2YnLCAyLCAtMV1dXG4gICAgYXNzZXJ0LmRlZXBFcXVhbCBsaXN0aWZ5KCcoYG9wZXJhdG9yYCAyIC0xKScpLCBbWydvcGVyYXRvcicsIDIsIC0xXV1cbiAgICBhc3NlcnQuZGVlcEVxdWFsIGxpc3RpZnkoJzIrMicpLCBbMiwgJysnLCAyXVxuZGVzY3JpYmUgJ3ByZWZpeGlmeScsIC0+XG4gIGl0ICdzaG91bGQgY29udmVydCBvcGVyYXRvcnMgdG8gcHJlZml4IG5vdGF0aW9uJywgLT5cbiAgICBsaXN0aWZ5ID0gcmVxdWlyZSAnLi9saXN0aWZ5LmNvZmZlZSdcbiAgICBtYXRoID0gcmVxdWlyZSAnLi9tYXRoLmNvZmZlZSdcbiAgICBwcmVmaXhpZnkgPSByZXF1aXJlICcuL3ByZWZpeGlmeS5jb2ZmZWUnXG4gICAgZiA9IChzKSAtPiBwcmVmaXhpZnkobGlzdGlmeSBzKVxuICAgIGFzc2VydC5kZWVwRXF1YWwgZignMisyKyAzJyksIFttYXRoLnN1bSxbbWF0aC5zdW0sIDIsIDJdLCAzXVxuICAgIGFzc2VydC5kZWVwRXF1YWwgZignKyAyIDInKSwgW21hdGguc3VtLCAyLCAyXVxuICAgIGFzc2VydC5kZWVwRXF1YWwgZignMiAyJyksIFttYXRoLnRpbWVzLCAyLCAyXVxuICAgIGFzc2VydC5kZWVwRXF1YWwgZignMi0yeCcpLCBbbWF0aC5zdW0sIDIgLFttYXRoLnRpbWVzLCAtMiwgJ3gnXV1cbmRlc2NyaWJlICdldmFsdWF0ZScsIC0+XG4gIGl0ICdzaG91bGQgZXZhbHVhdGUgZXhwcmVzc2lvbicsIC0+XG4gICAgbGlzdGlmeSA9IHJlcXVpcmUgJy4vbGlzdGlmeS5jb2ZmZWUnXG4gICAgbWF0aCA9IHJlcXVpcmUgJy4vbWF0aC5jb2ZmZWUnXG4gICAgcHJlZml4aWZ5ID0gcmVxdWlyZSAnLi9wcmVmaXhpZnkuY29mZmVlJ1xuICAgIGV2YWx1YXRlID0gcmVxdWlyZSAnLi9ldmFsdWF0ZS5jb2ZmZWUnXG4gICAgZiA9IChzKSAtPiBldmFsdWF0ZShwcmVmaXhpZnkobGlzdGlmeSBzKSlcbiAgICBhc3NlcnQuZXF1YWwgZignMisyKzMnKSwgN1xuICAgIGFzc2VydC5lcXVhbCBmKCcyKjIrMycpLCA3XG4gICAgYXNzZXJ0LmVxdWFsIGYoJzIgKyAyICogMycpLCA4XG4gICAgYXNzZXJ0LmRlZXBFcXVhbCBmKCd4KzIqMycpLCBbbWF0aC5zdW0sICd4JywgNl1cbiJdfQ==
;