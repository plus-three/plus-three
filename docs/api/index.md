# api

## PlusThree

```ts
import type {
  AxesHelper,
  DirectionalLight,
  DirectionalLightHelper,
  Mesh,
  Object3D,
  WebGLRendererParameters,
  Group,
  AmbientLight,
  Intersection,
  Camera,
  Bone,
  InstancedMesh,
  Line,
  LineLoop,
  LineSegments,
  LOD,
  Points,
  SkinnedMesh,
  Sprite
} from 'three'
import { Scene, PerspectiveCamera, WebGLRenderer, OrthographicCamera, CameraHelper } from 'three'
import type { CSS2DRenderer, CSS3DRenderer } from 'three/examples/jsm/Addons.js'
import { OrbitControls } from 'three/examples/jsm/Addons.js'
import type { CSSProperties } from '../types'
import type Stats from 'three/examples/jsm/libs/stats.module.js'
import type { Position } from '../utils'
import type { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js'
import type { DirectionalLightOptions, AmbientLightOptions } from './Light'
/**
 * 模型
 */
export type Model =
  | Bone
  | Group
  | InstancedMesh
  | Line
  | LineLoop
  | LineSegments
  | LOD
  | Mesh
  | Points
  | SkinnedMesh
  | Sprite
/**
 * 光参数
 */
export type LightOptions = {
  /**
   * 平行光
   */
  directional?: false | DirectionalLightOptions | DirectionalLightOptions[]
  /**
   * 环境光
   */
  ambient?: false | AmbientLightOptions
}
/**
 * 控制器
 */
export type ControlsOptions = Partial<OrbitControls> & {
  /**
   * 控制器位置 target
   *  @default{ x:0 ,y:0 ,z: 0}
   */
  position?: Position
}
/**
 * 参数
 */
export type PlusThreeOptions = {
  /**
   * canvas画布宽
   *  @default window.innerWidth,
   */
  width?: number | (() => number)
  /**
   * canvas画布高
   * @default  window.innerHeight
   */
  height?: number | (() => number)
  /**
   * 辅助对象 默认  false
   */
  helper?: {
    /**
     * 是否需要  x,y,z轴对象辅助
     * @default false
     */
    axesHelper?:
      | boolean
      | {
          /**
           *@default 2000
           */
          size?: number
        }
    /**
     * 是否需要 平行光辅助
     * @default false
     */
    directionalLightHelper?: boolean
    /**
     * 是否需要 帧率
     * @default false
     */
    stats?: boolean | CSSProperties
    /**
     * 是否需要 gui
     * @default false
     */
    gui?: boolean | CSSProperties
    /**
     *  相机辅助
     */
    cameraHelper?: boolean
  }
  /**
   * 是否需要光 (平行光/环境光)  默认不需要
   *
   * @default false
   */
  light?: boolean | LightOptions
  /**
   * WebGLRenderer 参数 ， antialias默认true
   */
  rendererParameters?: WebGLRendererParameters
  camera?: {
    /**
     * 相机类型   perspective：透视相机  orthographic: 正交相机
     *
     * @default 'perspective' 透视相机
     */
    type?: 'perspective' | 'orthographic'
    /**
     * 自定义相机，来自外部的相机
     */
    instance?: Camera & {
      [index: string]: any
    }
    /**
     * 透视  相机的fov
     * @default 50
     */
    fov?: number
    /**
     * 透视/正交 相机的near
     * @default 0.1
     */
    near?: number
    /** 透视/正交 相机的far
     * @default 200
     */
    far?: number
    /**
     * 透视/正交 相机 宽高比
     * @default   window.innerWidth / window.innerHeight
     */
    aspect?: number
    /**
     * 正交相机的范围 控制left, right, top, bottom范围大小
     *
     * cameraType 为 orthographic时生效
     *
     * @default 40
     */
    range?: number
    /**
     * 相机位置
     *
     * @default{ x:10, y:10, z:10 }
     */
    position?: Position
  }
  /**
   * 是否需要控制器
   *
   * @default true
   */
  controls?: boolean | ControlsOptions
  /**
   * CSSRenderer
   */
  CSSRenderer?: {
    /**
     * CSS2DRenderer
     * @default false
     */
    '2d'?: boolean
    /**
     * CSS3DRenderer
     * @default false
     */
    '3d'?: boolean
  }
  scene?: Partial<Scene>
  /**
   * render 类型
   * @default 'render'
   */
  renderType?: 'render' | 'controlsChangeRender'
  /**
   * 需要连续渲染中执行的函数
   * @returns
   */
  render?: (instance: PlusThree) => void
}
/**
 * 基本Three类
 */
export declare class PlusThree {
  /**
   * canvas 容器
   */
  container: HTMLDivElement | HTMLElement | null
  /**
   * 场景
   */
  scene: Scene
  /**
   * 相机
   */
  camera: PerspectiveCamera | OrthographicCamera
  /**
   * 渲染器
   */
  renderer: WebGLRenderer
  /**
   * 控制器
   */
  controls?: OrbitControls
  /**
   * 模型
   */
  model: Model
  /**
   * 辅助
   */
  helper: {
    [index: string]: any
    /**
     * x,y,z轴对象辅助
     */
    axesHelper?: AxesHelper
    /**
     * 平行光辅助
     */
    directionalLightHelper?: DirectionalLightHelper | DirectionalLightHelper[]
    /**
     * 帧率
     */
    stats?: Stats
    /**
     * gui
     */
    gui?: GUI
    /**
     *  相机辅助
     */
    cameraHelper?: CameraHelper
  }
  /**
   * 光
   */
  light: {
    /**
     * 平行光
     */
    directional?: DirectionalLight | DirectionalLight[]
    /**
     * 环境光
     */
    ambient?: AmbientLight
  }
  /**
   * CSS3DRenderer
   */
  CSS2DRenderer?: CSS2DRenderer
  /**
   * CSS3DRenderer
   */
  CSS3DRenderer?: CSS3DRenderer
  /**
   * 默认参数
   */
  options: PlusThreeOptions
  /**
   * 事件对象
   */
  events: Record<keyof HTMLElementEventMap, ((...arg: any[]) => void)[]> | Record<string, any>

  constructor(container: HTMLDivElement | HTMLElement, model: Model, options?: PlusThreeOptions)

  /**
   * 基础渲染
   */
  baseRender(): void
  /**
   * 事件
   * @param {string | Array } params  事件类型 或者 [ 事件类型，选择物体（几何体）条件（ 默认 isMesh 存在）]
   * @param callback 事件回调
   */
  on<T extends Object3D = Mesh>(
    params: keyof HTMLElementEventMap | [keyof HTMLElementEventMap, (item: T) => boolean],
    callback: (obj: Partial<Intersection<T> & { event: MouseEvent }>) => void
  ): void
  /**
   * 重写traverse 方法，用来支持ts泛型
   *
   * 对此对象和所有后代执行回调
   * @marks 注意：不鼓励在回调内修改场景图
   * @param 回调第一个参数为{@link Browse 3D}对象的函数
   */
  traverse<T extends Object3D = Object3D>(callback: (object: T) => any): void
  /**
   * 销毁dom, 销毁AnimationFrame，移除事件监听，销毁场景、渲染器、控制器、几何体、材质、纹理等
   */
  destroy(): void
}
```
