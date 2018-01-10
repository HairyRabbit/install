import Bar from '../lib/bar'

class MockWriteable {
  value = ''
  write(str) {
    this.value = str
  }
}

test('Bar instace', () => {
  const bar = new Bar()
  expect(bar.progress).toBe(0)
  expect(bar.columns).toBe(process.stderr.columns)
})

test('render 0', () => {
  const context = new MockWriteable()
  const bar = new Bar(0, 10)
  bar.stdout = context
  bar.render()
  expect(context.value).toBe('          ')
})

test('render 1', () => {
  const context = new MockWriteable()
  const bar = new Bar(1, 10)
  bar.stdout = context
  bar.render()
  expect(context.value).toBe('==========')
})

test('render 0.5', () => {
  const context = new MockWriteable()
  const bar = new Bar(0.5, 10)
  bar.stdout = context
  bar.render()
  expect(context.value).toBe('=====     ')
})

test('render 0.42', () => {
  const context = new MockWriteable()
  const bar = new Bar(0.42, 10)
  bar.stdout = context
  bar.render()
  expect(context.value).toBe('====      ')
})

test('set progress', () => {
  const context = new MockWriteable()
  const bar = new Bar(0, 10)
  bar.stdout = context
  bar.render()
  expect(context.value).toBe('          ')
  bar.progress = 0.2
  expect(context.value).toBe('==        ')
  bar.progress = 0.15
  expect(context.value).toBe('=         ')
  bar.progress = 0.99
  expect(context.value).toBe('========= ')
  bar.progress = 1
  expect(context.value).toBe('==========')
})


test('char and pad', () => {
  const context = new MockWriteable()
  const bar = new Bar(0.4, 10, '#', '啧')
  bar.stdout = context
  bar.render()
  expect(context.value).toBe('####啧啧啧啧啧啧')
})
