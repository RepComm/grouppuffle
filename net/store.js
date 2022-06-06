export const store = new Map();
export function generateId() {
  let result = Math.floor(Math.random() * Math.random() * Number.MAX_SAFE_INTEGER) ^ 251;
  return result.toString();
}
export function register(target, keys, maxDepth = 5, depth = 0) {
  let result = target;
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
export function isPropObj(target, key) {
  return (//target must exist
    target && //key must exist
    key && target[key] && //target must be an object
    typeof target[key] === "object" && //target must not be an array
    !Array.isArray(target[key])
  );
}
export function isTargetItem(target) {
  return target.__item_isItem === true;
}
export function isPropItem(target, key) {
  return target && key && target[key] && isTargetItem(target[key]);
}
export function hashStringArray(array) {
  let code = 0;

  for (let i = 0; i < array.length; i++) {
    let n = 0;

    for (let j = 0; j < array[i].length; j++) {
      n = n * 251 ^ array[i].charCodeAt(j);
    }

    code ^= n;
  }

  return code;
}
;
export function recalculateItem(item, force = false, forceChildren = false) {
  let result = false;

  if (item.__item_isDirty || force) {
    let strs = [];

    for (let key of item.__item_Keys) {
      if (item[key] === undefined) {
        continue;
      } else if (isPropItem(item, key)) {
        let childItem = item[key];
        recalculateItem(childItem, forceChildren, forceChildren);
        strs.push(childItem.__item_Hash);
      } else {
        let str;

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

export function cashout(requireAll = false) {
  let result = [];

  for (let [id, item] of store) {
    let itemChanged = recalculateItem(item, false, false);

    if (itemChanged || requireAll) {
      result.push(id);
    }
  }

  return result;
}
window["cashout"] = cashout;