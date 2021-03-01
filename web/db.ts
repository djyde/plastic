import type { PlasticAdapter } from "./plastic";

// @ts-expect-error
const remote = global.require("electron").remote;

const DB = remote.require('./db')

export default {
  get() {
    return DB.get(remote.getCurrentWindow().id) as PlasticAdapter
  },
  open: DB.open
}