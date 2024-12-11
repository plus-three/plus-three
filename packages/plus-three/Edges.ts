import type { BufferGeometry, LineBasicMaterialParameters, Object3DEventMap } from 'three'
import { EdgesGeometry, LineBasicMaterial, LineSegments } from 'three'

type Edges<T extends BufferGeometry> = LineSegments<
  EdgesGeometry<T>,
  LineBasicMaterial,
  Object3DEventMap
> & {
  /**
   *自定义属性，表明这是一个Edges物体
   */
  isEdges: boolean
}

/**
 * 根据几何体创建有一个边缘
 * @param geometry
 * @param lineBasicMaterialParameters   default  `{ color: 0x00ffff}`
 * @returns
 */
export const createEdge = <T extends BufferGeometry>(
  geometry: T,
  lineBasicMaterialParameters?: LineBasicMaterialParameters
): Edges<T> => {
  const edges = new EdgesGeometry(geometry)
  const edgesMaterial = new LineBasicMaterial({
    color: 0x00ffff,
    ...lineBasicMaterialParameters
  })
  const edgeLine = new LineSegments(edges, edgesMaterial) as Edges<T>
  edgeLine.isEdges = true
  return edgeLine
}
