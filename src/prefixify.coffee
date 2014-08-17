math = require './math.coffee'
Operator = require './operator.coffee'

swap = (list, i1, i2) ->
  tmp = list[i1]
  list[i1] = list[i2]
  list[i2] = temp

isOperator = (x) ->
  return typeof x is 'string' and math[x]

normalize = (list) ->
  debugger
  if not (list instanceof Array)
    return list

  if list.length is 1
    return list[0]

  for item in list
    if item instanceof Array
      normalize item

  fst = list[0]
  if isOperator fst
  # prefix notation
    list[0] = math[fst]
  else
  # infix notation
    while true # do while loop
      snd = list[1]

      if isOperator snd
      # explicit operator
        fst = [math[snd], fst, list[2]]
        rest = list.splice(3)
        list = [fst].concat rest
      else
      # implicit operator
        if typeof snd is 'number' and snd < 0
          fst = [math.sum, fst, snd]
        else
          fst = [math.times, fst, snd]
        rest = list.splice(2)
        list = [fst].concat rest

      if list.length is 1
        list = list[0]
        break
  return list


###
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



###
module.exports = normalize
