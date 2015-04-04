
describe 'Simple snap', ->

  it 'should inherit from SimpleModule', ->
    snap = simple.snap()
    expect(snap instanceof SimpleModule).toBe(true)
