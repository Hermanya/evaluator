math = require './math.coffee'
Operator = require './operator.coffee'

swap = (list, i1, i2) ->
  tmp = list[i1]
  list[i1] = list[i2]
  list[i2] = temp

isOperator = (x) ->
  return typeof x is 'string' and math[x]

insertImplicitOperators = (list) ->
  result = []
  lastIsNotOperator = ->
    return not (result[result.length - 1] instanceof Operator)

  for item, index in list
    if index is 0
      result.push item
      continue
    if isOperator item
      result.push math[item]
    else
      if lastIsNotOperator()
        if typeof item is 'number' and item < 0
          result.push math.sum
        else
          result.push math.times
      result.push item
  return result

getIndexOfOperatorWithHighestPrecedence = (list) ->
  max = list[1]
  index = 1
  for item, current in list
    if item instanceof Operator and item.precedence > max.precedence
      max = item
      index = current
  return index

nestByPrecedence = (list) ->
  while true
    i = getIndexOfOperatorWithHighestPrecedence(list)
    newList = [list[i], list[i - 1], list[i + 1]]
    list = list.splice(0, i - 1).concat([newList].concat(list.splice(i + 2)))
    if list.length is 1
      return list[0]

prefixify = (list) ->
  if not (list instanceof Array)
    return list

  if list.length is 1
    return list[0]

  for item in list
    if item instanceof Array
      prefixify item

  if isOperator list[0]
  # prefix notation
    list[0] = math[list[0]]
  else
  # infix notation
    list = nestByPrecedence insertImplicitOperators(list)

  return list


###

###
module.exports = prefixify
