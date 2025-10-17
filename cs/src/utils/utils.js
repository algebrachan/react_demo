export function genTreeData(data, opts = {}) {
  let {
    parentIdKey = 'parentId',
    childrenKey = 'children',
    idKey = 'id',
    includes: includesKeys = [],
    excludes: excludesKeys = []
  } = opts;
  let idNodes = {}
  let newData = []
  if (Array.isArray(data) && data.length > 0) {
    let fullKeys = Object.keys(data[0]), insertKeys;
    if (includesKeys.length) insertKeys = includesKeys.filter(key => {
      let oldKey
      if (Array.isArray(key)) oldKey = key[0]
      else oldKey = key
      return fullKeys.includes(oldKey)
    })
    else if (excludesKeys.length) insertKeys = fullKeys.filter(key => !excludesKeys.includes(key))
    else insertKeys = fullKeys
    for (let i = 0, l = data.length; i < l; i++) {
      let newNode = {}
      insertKeys.forEach(key => {
        if (Array.isArray(key)) {
          const [oldKey, newKey] = key
          newNode[newKey] = data[i][oldKey]
        } else {
          newNode[key] = data[i][key]
        }
      })
      newNode[childrenKey] = []
      idNodes[data[i][idKey]] = newNode
    }
    for (let i = 0, l = data.length; i < l; i++) {
      if (!idNodes[data[i][parentIdKey]]) newData.push(idNodes[data[i][idKey]])
      else idNodes[data[i][parentIdKey]][childrenKey].push(idNodes[data[i][idKey]])
    }
  }
  return newData
}