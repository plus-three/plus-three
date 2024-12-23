import {
  Object3D,
  Vector3,
  CatmullRomCurve3,
  BufferGeometry,
  Color,
  LineBasicMaterial,
  Line,
  Float32BufferAttribute,
  ShaderMaterial,
  Points
} from 'three'
import { Tween, Group as TweenGroup } from '@tweenjs/tween.js'

interface flyLineBegin2End {
  begin: number[]
  end: number[]
  height: number
}

export class Fly extends Object3D {
  data: flyLineBegin2End[]
  routeColor: string | number
  flyColor: string | number
  duration: number
  /**
   * tween Group
   */
  tweenGroup: TweenGroup

  constructor(
    data: flyLineBegin2End[],
    options?: {
      routeColor?: string | number
      flyColor?: string | number
      duration?: number
    }
  ) {
    super()
    this.routeColor = options?.routeColor || 0x004444
    this.flyColor = options?.flyColor || 0xffff00
    this.duration = options?.duration || 2000
    this.data = data
    this.tweenGroup = new TweenGroup()
    this.draw()
  }

  /**
   * 绘制
   * @returns
   */
  draw() {
    this.data.map(data => {
      const points = this.getPoints(data)
      const fixedLine = this.createFixedLine(points)
      const movedLine = this.createMovedLine(points)

      this.add(fixedLine, movedLine)

      // 创建动画
      const tween = new Tween({ index: 0 })
        .to({ index: 1000 }, this.duration)
        .onUpdate(function (t) {
          const id = Math.ceil(t.index)
          movedLine.material.uniforms.uTime.value = id
        })
        .repeat(Infinity)
      tween.start()

      this.tweenGroup.add(tween)
    })
    return this
  }

  /**
   * 获取点
   * @param data
   * @returns
   */
  getPoints(data: any) {
    const [x1, y1, z1] = data.begin // 起始点
    const [x2, y2, z2] = data.end // 终点
    const curveH = data.height // 飞线最大高

    // 三点创建弧线几何体
    const pointInLine = [
      new Vector3(x1, y1, z1),
      new Vector3(
        //
        (x1 + x2) / 2,
        //
        (y1 + y2) / 2 + curveH,
        //
        (z1 + z2) / 2
      ),
      new Vector3(x2, y2, z2)
    ]

    const curve = new CatmullRomCurve3(pointInLine)
    const points = curve.getSpacedPoints(1000)

    return points
  }

  /**
   * 创建轨迹的线
   * @param points
   * @returns
   */
  createFixedLine(points: Vector3[]) {
    return new Line(
      new BufferGeometry().setFromPoints(points),
      new LineBasicMaterial({
        color: this.routeColor,
        transparent: true,
        opacity: 0.5
      })
    )
  }

  /**
   * 创建飞线
   * @param points
   * @returns
   */
  createMovedLine(points: Vector3[]) {
    const indexList: number[] = []
    points.forEach((item, index) => {
      indexList.push(index)
    })

    const geometry = new BufferGeometry().setFromPoints(points)
    geometry.setAttribute('aIndex', new Float32BufferAttribute(indexList, 1))

    const material = new ShaderMaterial({
      uniforms: {
        uColor: {
          value: new Color(this.flyColor)
        },
        uTime: {
          value: 0
        },
        uLength: {
          value: points.length
        }
      },
      vertexShader: `
      attribute float aIndex;

      uniform float uTime;
      uniform vec3 uColor;

      varying float vSize;

      void main(){
          vec4 viewPosition = viewMatrix * modelMatrix *vec4(position,1);
          gl_Position = projectionMatrix * viewPosition;

          if(aIndex < uTime + 100.0 && aIndex > uTime - 100.0){
            vSize = (aIndex + 100.0 - uTime) / 60.0;
          } 
          gl_PointSize =vSize;
      }
    `,
      fragmentShader: `
      varying float vSize;
      uniform vec3 uColor;
      void main(){

          if(vSize<=0.0){
              gl_FragColor = vec4(1,0,0,0);
          }else{
              gl_FragColor = vec4(uColor,1);
          }
          
      }
    `,
      transparent: true
    })

    return new Points(geometry, material)
  }
}
