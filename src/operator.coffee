module.exports = class Operator
  constructor: (params) ->
    @domain = params.domain
    @range = params.domain
    @precedence = params.precedence
    @body = -> Array.prototype.reduce.call(arguments, params.body)
