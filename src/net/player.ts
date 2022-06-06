
import { Location } from "./location.js";
import { register } from "./store.js";

export interface Player {
  name: string;
  location: Location;
}

export function createPlayer (name: string): Player {
  let result: Player = {
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
