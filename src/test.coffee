describe 'Parse', ->
  describe 'numbers', ->
    it 'should parse numbers', ->
      parse = require './listify.coffee'
      assert.equal parse('12'), 12
      assert.equal parse('-12.9'), -12.9
      assert.equal parse('-12.9e2'), -1290
      assert.equal parse('-12.9e-2'), -0.129
  describe 'listify', ->
    it 'should listify a string', ->
      listify = require './listify.coffee'
      assert.deepEqual listify('+ 2 2'), ['+', 2, 2]
      assert.deepEqual listify('(f 2 -1)'), [['f', 2, -1]]
      assert.deepEqual listify('(`operator` 2 -1)'), [['operator', 2, -1]]
      assert.deepEqual listify('2+2'), [2, '+', 2]
  describe 'normalize', ->
    it 'should normalize operators to prefix notation', ->
      listify = require './listify.coffee'
      math = require './math.coffee'
      normalize = require './normalize.coffee'
      f = (s) -> normalize(listify s)
      assert.deepEqual f('+ 2 2'), [math.sum, 2, 2]
      #assert.deepEqual f('2+ 2+2'), [math.sum, [math.sum, 2, 2], 2]
