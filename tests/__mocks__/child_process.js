module.exports.spawn = function() {
  return {
    stdout: {
      on(str, cb) { cb('') }
    },
    stderr: {
      on(str, cb) { cb('') }
    },
    on(str, cb) { cb(2) }
  }
}
