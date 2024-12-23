/* eslint-disable @typescript-eslint/ban-ts-comment */
import { EllipseCurve, Object3D } from 'three'
import { Line2 } from 'three/examples/jsm/lines/Line2'
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial'
import { LineGeometry } from 'three/examples/jsm/lines/LineGeometry'
import { Tween } from '@tweenjs/tween.js'

export class LightRing extends Object3D {
  tween: Tween<Record<string, any>>

  /**
   * 是否是光圈
   */
  isLightRing = true
  /**
   * 颜色
   */
  color: string | number

  constructor(color?: string | number, userData?: Record<string, any>) {
    super()
    this.userData = userData || {}
    this.color = color || 0x004444
    this.createShape()
    this.tween = this.animation()
  }

  createShape() {
    const data = Array.from({ length: 3 }).map((_, index) => (index + 1) * 0.2)

    const material = new LineMaterial({
      color: this.color,
      transparent: true,
      linewidth: 2
    })

    data.forEach(item => {
      const curve = new EllipseCurve(
        // ax, aY
        0,
        0,
        // xRadius, yRadius
        item,
        item,
        // aStartAngle, aEndAngle
        0,
        2 * Math.PI,
        // aClockwise
        false,
        // aRotation
        0
      )
      const points = curve.getPoints(500)

      const geometry = new LineGeometry() // 创建一个几何体对象
      const arr: number[] = []
      for (let i = 0; i < points.length; i++) {
        const item = points[i]
        arr.push(item.x, item.y, 0)
      }
      const vertices = new Float32Array(arr)
      geometry.setPositions(vertices)

      const line = new Line2(geometry, material)
      line.userData = this.userData
      this.add(line)
    })
  }

  /**
   * 动画
   */
  animation() {
    const tween = new Tween({ index: 1 })
      .to({ index: 150 }, 3000)
      .onUpdate(t => {
        const _s = 1 + t.index * 0.01
        this.traverse(item => {
          // @ts-ignore
          if (item.isLine2) {
            item.scale.set(_s, _s, _s)
            // @ts-ignore
            item.material.opacity = 1 - (_s - 1) / 1.5 // 缩放2.5对应0 缩放1.0对应1
          }
        })
      })
      .repeat(Infinity)
      .start()
    return tween
  }
}
