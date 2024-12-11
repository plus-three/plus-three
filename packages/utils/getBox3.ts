import type { Group, Mesh } from 'three'
import { Box3, Vector3 } from 'three'

/**
 * 用包围盒计算图形的几何中心
 * @param group
 * @returns
 */
export function getBox3(group: Group | Mesh) {
  // 创建一个包围盒
  const box3 = new Box3()

  // 计算层级模型group包
  box3.expandByObject(group)

  // scaleV3表示包围盒长宽高尺寸
  const scaleV3 = new Vector3()

  // 计算包围盒长宽高尺寸
  box3.getSize(scaleV3)

  // scaleV3表示包围盒的几何体中心
  const center = new Vector3()

  // 计算一个层级模型对应包围盒的几何,作为1ookAt()参数
  box3.getCenter(center)

  return { box3, center }
}
