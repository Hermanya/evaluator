Operator = require './operator.coffee'
evaluate = (list) ->
  dontEvaluate = false
  for item, index in list
    if index isnt 0
      if item instanceof Array
        list[index] = evaluate item
      if typeof list[index] isnt 'number'
        dontEvaluate = true
  if dontEvaluate
    return list
  return list[0].body.apply(null, list.splice(1))

module.exports = evaluate
