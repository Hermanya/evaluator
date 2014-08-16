at = undefined
char = undefined
text = undefined

next = (c) ->
  char = text.charAt at
  at += 1
  return char

skipWhiteSpace = ->
  while char is ' '
    next()

parseDigits = ->
  sequence = ''
  while char >= '0' and char <= '9'
    sequence += char
    next()
  return sequence

parseDecimalFraction = ->
  string = ''
  if char is '.'
    next()
    string += '.' + parseDigits()
  return string

parseExponent = ->
  string = ''
  if char is 'e' or char is 'E'
    next()
    string += 'e'
    if char is '-'
      string += '-'
      next()
    string += parseDigits()
  return string

parseNumber = ->
  string = ''; _ch = ch; _at = at
  if char is '-'
    string = '-'
    next()
  string += parseDigits()
  string += parseDecimalFraction()
  string += parseExponent()
  number = Number string
  if (isNaN number) or string is ''
  # this is for the sake of minus operator
    ch = _ch; at = _at
    return undefined
  else
    return number

parseSymbol = ->
  value = char
  next()
  return value

parseComplexName = ->
  name = ''
  if char is '`'
    next()
    while char isnt '`'
      name += char
      next()
    next()
  return name

parseName = ->
  if char is '`'
    return parseComplexName()
  else
    return parseSymbol()

parseList = ->
  list = []
  while char and char isnt ')'
    skipWhiteSpace()
    number = parseNumber()
    if number isnt undefined
      list.push number
    else
      if char is '('
        next()
        list.push parseList()
      else
        list.push parseName()
  next()
  return list

module.exports = (string) ->
  text = string
  at = 0
  next()
  return parseList()
