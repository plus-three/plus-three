import * as THREE from 'three'

/**
 * 轮廓线
 * @param points
 * @returns
 */
const material = new THREE.MeshBasicMaterial({
  color: 0x1eb3bf
})
export function getLine(points: THREE.Vector3[]) {
  const geometry = new THREE.BufferGeometry().setFromPoints(points)
  const line = new THREE.Line(geometry, material.clone())
  line.position.z = 1.2
  return line
}

/**
 * 获取地图轮廓面
 * @param points
 * @returns
 */

const material1 = new THREE.MeshLambertMaterial({
  color: 0x004444,
  side: THREE.DoubleSide,
  transparent: true
})
export const getOutLine = (points: THREE.Vector3[]) => {
  const heartShape = new THREE.Shape()
  heartShape.setFromPoints(
    points.map(item => new THREE.Vector2(item.x, item.y))
  )
  const geometry = new THREE.ExtrudeGeometry(heartShape, {
    depth: 1
  })

  const mesh = new THREE.Mesh(geometry, material1.clone())

  mesh.castShadow = true

  return mesh
}
