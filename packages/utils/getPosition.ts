import type { Vector3 } from 'three'
import { isPlainObject, isArray } from './is'

export type Position =
  | {
      x?: number
      y?: number
      z?: number
    }
  | Vector3
  | [number, number, number]

/**
 *  获取位置
 * @param defaultPosition
 * @param position
 */
export const getPosition = (
  defaultPosition: {
    x: number
    y: number
    z: number
  },
  position?: Position
) => {
  let x: number | undefined = defaultPosition.x
  let y: number | undefined = defaultPosition.y
  let z: number | undefined = defaultPosition.z

  if (position) {
    if (isArray(position)) {
      const [x1, y1, z1] = position
      x = x1 ?? defaultPosition.x
      y = y1 ?? defaultPosition.y
      z = z1 ?? defaultPosition.z
    } else if (isPlainObject(position)) {
      const { x: x2, y: y2, z: z2 } = position || {}
      x = x2 ?? defaultPosition.x
      y = y2 ?? defaultPosition.y
      z = z2 ?? defaultPosition.z
    }
  }

  return { x, y, z }
}
