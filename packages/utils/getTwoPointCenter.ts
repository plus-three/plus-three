import { Vector3 } from 'three'

/**
 * 获取2点的中心点
 * @param p1
 * @param p2
 * @returns
 */
export const getTwoPointCenter = (p1: Vector3, p2: Vector3) => {
  const center: Vector3 = new Vector3().addVectors(p1, p2).divideScalar(2)
  return center
}
