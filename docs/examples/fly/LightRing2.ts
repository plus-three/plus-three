import {
  Object3D,
  TextureLoader,
  Mesh,
  DoubleSide,
  CircleGeometry,
  MeshLambertMaterial
} from 'three'
import { Tween } from '@tweenjs/tween.js'

export class LightRing extends Object3D {
  /**
   * tween 动画
   */
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
    this.color = color || 0x1eb3bf
    this.createShape()
    this.tween = this.animation()
  }

  createShape() {
    const loader = new TextureLoader()
    const texture = loader.load('/标注光圈.png')
    const geometry = new CircleGeometry()
    const material = new MeshLambertMaterial({
      color: this.color,
      map: texture,
      transparent: true,
      side: DoubleSide,
      depthTest: false
    })
    material.needsUpdate = true

    const mesh = new Mesh(geometry, material)
    mesh.userData = this.userData
    this.add(mesh)
  }

  /**
   * 动画
   */
  animation() {
    const tween = new Tween({ index: 1 })
      .to({ index: 150 }, 3000)
      .onUpdate(t => {
        let _s = 1 + t.index * 0.01
        this.traverse(item => {
          // @ts-ignore
          if (item.isMesh) {
            item.scale.set(_s, _s, _s)
            // @ts-ignore
            item.material.opacity = 1 - (_s - 1) / 1.5 //缩放2.5对应0 缩放1.0对应1
          }
        })
      })
      .repeat(Infinity)
      .start()
    return tween
  }
}
