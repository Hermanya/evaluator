math = require './math.coffee'
Operator = require './operator.coffee'

swap = (list, i1, i2) ->
  tmp = list[i1]
  list[i1] = list[i2]
  list[i2] = temp

normalize = (list) ->
  if list instanceof Array
    if list.length is 1
      return list[0]

    fst = list[0]
    if typeof fst is 'string'
      if math[fst]
        list[0] = math[fst]
    # else
    #   it's variable, leave as a string
    else
    # fst is a number, it's infix notation
      snd = list[1]

      if typeof snd is 'string'
        if math[snd]
        # explicit operator
          snd = math[snd]

      newList = undefined

      if snd instanceof Operator
        newList = [snd, list[0], list[2]]
      else
        newList = [math.times, list[0], list[1]]
        
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
