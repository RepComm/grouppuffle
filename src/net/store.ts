
export type TargetJsonValue = string | number | TargetJson | Array<string> | Array<number> | Array<TargetJson>;

export interface TargetJson {
  [key: string]: TargetJsonValue;
}

export interface Item {
  /**Allows random objects to be detected as items*/
  __item_isItem: boolean;

  /**Used to tell store that item needs recalculated/cashed out, aka object has changes*/
  __item_isDirty: boolean;

  /**Unique ID of this item*/
  __item_id: string;

  /**The keys of the target object to track*/
  __item_Keys?: string[];

  /**Hash of the item*/
  __item_Hash: string;
  /**Old hash of the item*/
  __item_HashOld: string;
}

export const store = new Map<string, Item>();

export function generateId(): string {
  let result = Math.floor(
    Math.random() * Math.random() * Number.MAX_SAFE_INTEGER
  ) ^ 251;

  return result.toString();
}

export function register(target: any, keys?: string[], maxDepth: number = 5, depth: number = 0): Item {
  let result = target as Item;

  let id = generateId();

  if (!keys) keys = Object.keys(target);

  result.__item_id = id;
  result.__item_Keys = keys;
  result.__item_Hash = "";
  result.__item_HashOld = "";
  result.__item_isDirty = true;

  store.set(id, result);

  if (depth < maxDepth) {
    for (let key of keys) {
      let value = result[key];

      if (typeof value === "object" && !Array.isArray(value)) {
        register(value, Object.keys(value), maxDepth, depth + 1);
      }

    }

  }

  return result;
}

export type CashoutData = Array<string>;

export function isPropObj(target: any, key: string) {
  return (
    //target must exist
    target &&
    //key must exist
    key &&
    target[key] &&

    //target must be an object
    typeof target[key] === "object" &&
    //target must not be an array
    !Array.isArray(target[key])
  );
}

export function isTargetItem(target: any): boolean {
  return (target as Item).__item_isItem === true;
}
export function isPropItem(target: any, key: string): boolean {
  return (
    target &&
    key &&
    target[key] &&
    isTargetItem(target[key])
  );
}

export function hashStringArray(array: string[]): number {
  let code = 0;
  for (let i = 0; i < array.length; i++) {
    let n = 0;
    for (let j = 0; j < array[i].length; j++) {
      n = n * 251 ^ array[i].charCodeAt(j);
    }
    code ^= n;
  }
  return code
};

export function recalculateItem(item: Item, force: boolean = false, forceChildren: boolean = false): boolean {
  let result = false;

  if (item.__item_isDirty || force) {
    let strs = [];

    for (let key of item.__item_Keys) {
      if (item[key] === undefined) {
        continue;
      } else if (isPropItem(item, key)) {

        let childItem = item[key] as Item;

        recalculateItem(childItem, forceChildren, forceChildren);

        strs.push(childItem.__item_Hash);

      } else {

        let str: string;
        if (typeof item[key] === "string") {
          str = item[key];
        } else {
          str = item[key].toString();
        }

        strs.push(str);
      }

    }

    let oldOldHash = item.__item_HashOld;

    item.__item_HashOld = item.__item_Hash;
    item.__item_Hash = hashStringArray(strs).toString();

    if (item.__item_Hash !== oldOldHash) result = true;

    item.__item_isDirty = false;
  }
  return result;
}

/**Get a list of objects that have changed data*/
export function cashout(requireAll: boolean = false): CashoutData {
  let result: CashoutData = [];

  for (let [id, item] of store) {
    let itemChanged = recalculateItem(item, false, false);
    if (itemChanged || requireAll) {
      result.push(id);
    }
  }

  return result;
}

window["cashout"] = cashout;
