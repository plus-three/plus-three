import {
  Object3D,
  Vector3,
  CatmullRomCurve3,
  BufferGeometry,
  Color,
  BufferAttribute,
  LineBasicMaterial,
  Line
} from 'three'
import { Tween } from '@tweenjs/tween.js'

interface flyLineBegin2End {
  begin: number[]
  end: number[]
  height: number
}

export class Fly extends Object3D {
  data: flyLineBegin2End[]
  routeColor = 0x004444
  flyColor = 0xffff00
  cycle = 2000

  tweenList: Tween<Record<string, any>>[] = []

  constructor(data: flyLineBegin2End[]) {
    super()
    this.data = data
    this._draw()
  }

  _draw() {
    this.data.map(data => {
      const points = this._getPoints(data)
      const fixedLine = this._createFixedLine(points)
      const movedLine = this._createMovedLine(points, 10)

      this.add(fixedLine, movedLine)

      // 创建动画
      const tween = new Tween({ index: 0 })
        .to({ index: 100 }, this.cycle)
        .onUpdate(function (t) {
          const movedLineGeom = movedLine.geometry
          const id = Math.ceil(t.index)
          const pointsList = points.slice(id, id + 10) // 从曲线上获取一段

          movedLineGeom && movedLineGeom.setFromPoints(pointsList)
          movedLineGeom.attributes.position.needsUpdate = true
        })
        .repeat(Infinity)
      tween.start()

      this.tweenList.push(tween)

      console.log(tween, 'tween')
    })
    return this
  }

  _getPoints(data: any) {
    const startPoint = data.begin // 起始点
    const endPoint = data.end // 终点
    const curveH = data.height // 飞线最大高

    // 三点创建弧线几何体
    const pointInLine = [
      new Vector3(startPoint[0], 0, startPoint[0]),
      new Vector3((startPoint[0] + endPoint[0]) / 2, curveH, (startPoint[1] + endPoint[1]) / 2),
      new Vector3(endPoint[0], 0, endPoint[1])
    ]

    const curve = new CatmullRomCurve3(pointInLine)
    const points = curve.getSpacedPoints(100)

    return points
  }

  // 创建轨迹的线
  _createFixedLine(points: Vector3[]) {
    return new Line(
      new BufferGeometry().setFromPoints(points),
      new LineBasicMaterial({
        color: this.routeColor,
        transparent: true,
        opacity: 0.5
      })
    )
  }

  // 创建飞线
  _createMovedLine(points: Vector3[], length: number) {
    const pointsOnLine = points.slice(0, length) // 从曲线上获取一段

    // console.log(pointsOnLine, 'pointsOnLine')

    const flyLineGeom = new BufferGeometry()
    // const flyLineGeom = new LineGeometry()
    flyLineGeom.setFromPoints(pointsOnLine)

    // // 操作颜色
    const colorArr: number[] = []
    for (let i = 0; i < pointsOnLine.length; i++) {
      const color1 = new Color(this.routeColor) // 线颜色
      const color2 = new Color(this.flyColor) // 飞痕颜色
      // 飞痕渐变色
      const color = color1.lerp(color2, i / 5)
      colorArr.push(color.r, color.g, color.b)
    }
    // 设置几何体顶点颜色数据
    flyLineGeom.setAttribute('color', new BufferAttribute(new Float32Array(colorArr), 3))
    flyLineGeom.attributes.position.needsUpdate = true

    const material = new LineBasicMaterial({
      color: 0xffff00,
      vertexColors: true // 使用顶点本身颜色
    })

    const line = new Line(flyLineGeom, material)

    return line
  }
}
