import { register } from "./store.js";
export function createPlayer(name) {
  let result = {
    name,
    location: {
      room: undefined,
      x: 0,
      y: 0
    }
  };
  register(result);
  console.log(result);
  return result;
}