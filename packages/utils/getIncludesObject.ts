import type { Object3D, Object3DEventMap } from 'three'
import { isArray, isString } from './is'

/**
 * 向上递归 获取object 包含指定属性（默认名称）的 mesh/其他
 * @param name
 * @param object
 * @param attr
 * @returns
 */
export const getIncludesObject = (
  name: string | string[],
  object?: Object3D<Object3DEventMap>,
  attr = 'name'
) => {
  if (!object) return undefined
  // 需要查的名称集合
  const nameList = isArray(name) ? name : isString(name) ? [name] : []

  // 存储父对象
  let parentObject: undefined | null | Object3D<Object3DEventMap> = object

  // 循环查
  while (parentObject) {
    const item: undefined | null | Object3D<Object3DEventMap> = parentObject
    const attrValue = item ? Reflect.get(item, attr) : undefined
    if (attrValue && nameList.includes(attrValue)) {
      parentObject = null
      return item
    } else {
      parentObject = item?.parent
    }
  }

  return undefined
}
