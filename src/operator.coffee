reduce = (f, a) -> [].splice.call(a, 0).reduce(f)

module.exports = class Operator
  constructor: (params) ->
    @domain = params.domain
    @range = params.domain
    @body = -> reduce params.body arguments
