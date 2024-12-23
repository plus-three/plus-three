import { Vector3 } from 'three'
import { Coord } from './type'

export const getPoints = (item: Coord[][]) => {
  const points: Vector3[] = []

  item.forEach((ite: Coord[]) => {
    ite.forEach((i: Coord) => {
      const [x, y] = i as Coord
      points.push(new Vector3(x, y, 0))
    })
  })

  return points
}
