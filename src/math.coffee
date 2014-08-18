###
\mathbb{N}  Natural	0, 1, 2, 3, 4, ... or 1, 2, 3, 4, ...
\mathbb{Z}	Integers	..., −5, −4, −3, −2, −1, 0, 1, 2, 3, 4, 5, ...
\mathbb{Q}	Rational	a/b where a and b are integers and b is not 0
\mathbb{R}	Real	The limit of a convergent sequence of rational numbers
\mathbb{C}	Complex	a + bi or a + ib
            where a and b are real numbers and i is the square root of −1
###
Op = require './operator.coffee'
math = {}
math.sum = new Op(
  domain: 'Number, Number'
  range: 'Number'
  precedence: 0
  body: (x,y) -> x + y
)
math['+'] = math.sum

math.times = new Op(
  domain: 'Number, Number'
  range: 'Number'
  precedence: 1
  body: (x,y) -> x * y
)
math['*'] = math.times

math.subtract = new Op(
  domain: 'Number, Number'
  range: 'Number'
  precedence: 0
  body: (x,y) -> x - y
)
math['-'] = math.subtract
module.exports = math
