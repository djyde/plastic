const remote = global.require("electron").remote;

const DB = remote.require('./db')

export default {
  get() {
    return DB.get(remote.getCurrentWindow().id)
  },
  open: DB.open
}