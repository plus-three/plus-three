/* eslint-disable  @typescript-eslint/ban-ts-comment */
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
import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  Raycaster,
  Vector2,
  OrthographicCamera,
  CameraHelper
} from 'three'
import { set, get } from 'lodash-es'
import type { CSS2DRenderer, CSS3DRenderer } from 'three/examples/jsm/Addons.js'
import { OrbitControls } from 'three/examples/jsm/Addons.js'
import type { CSSProperties } from '@plus-three/types'
import Stats from 'three/examples/jsm/libs/stats.module.js'
import { isArray, getPosition, isFunction, isPlainObject } from '@plus-three/utils'
import type { Position } from '@plus-three/utils'
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js'
import { createStats } from './Stats'
import { createCSS2DRenderer, createCSS3DRenderer } from './CSSRenderer'
import type { DirectionalLightOptions, AmbientLightOptions } from './Light'
import { createDirectionalLight, createDirectionalLightHelper, createAmbientLight } from './Light'
import { createGUI } from './GUI'
import { createAxesHelper } from './AxesHelper'

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

  /*
   * 相机参数，默认是透视相机
   */
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
    instance?: Camera & { [index: string]: any }

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
export class PlusThree {
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
  } = {}

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
  } = {}

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
  options: PlusThreeOptions = {}

  /**
   * 事件对象
   */
  events: Record<keyof HTMLElementEventMap, ((...arg: any[]) => void)[]> | Record<string, any> = {}

  /**
   * requestAnimationFrame  id
   */
  private requestAnimationFrameId?: number
  /**
   * 记录resize 回调函数
   */
  private selfResizeHandle: (...arg: any) => void = () => ({})

  constructor(container: HTMLDivElement | HTMLElement, model: Model, options?: PlusThreeOptions) {
    if (!container) {
      console.error('container is null or undefined!')
    }
    if (!model) {
      console.error('model is null or undefined!')
    }

    this.options = options || {}
    // 初始化canvas容器
    this.container = container
    // 初始化场景
    this.scene = this.createScene()
    // 初始化相机
    this.camera = this.createCamera()
    // 初始化渲染器
    this.renderer = this.createRenderer()

    // 初始化控制器
    if (this.options.controls !== false) {
      this.controls = this.createControls()
    }

    // 初始化光照
    this.createLight()

    // 辅助对象
    this.createHelper()

    // 模型添加到场景
    this.model = model
    this.scene.add(model)

    // 渲染
    if (this.options.renderType === 'controlsChangeRender') {
      this.controlsChangeRender()
    } else {
      this.render()
    }

    // CSS2Renderer
    if (this.hasCSS2DRenderer) {
      this.CSS2DRenderer = createCSS2DRenderer(container, this.width, this.height)
    }

    // CSS3Renderer
    if (this.hasCSS3DRenderer) {
      this.CSS3DRenderer = createCSS3DRenderer(container, this.width, this.height)
    }

    // 控制窗口自适应
    this.resize()
  }

  /**
   * 获取canvas 宽
   * @returns
   */
  get width() {
    return isFunction(this.options?.width)
      ? this.options.width()
      : this.options?.width || window.innerWidth
  }

  /**
   * 获取canvas 高
   * @returns
   */
  get height() {
    return isFunction(this.options?.height)
      ? this.options.height()
      : this.options?.height || window.innerHeight
  }

  /**
   * 获取canvas 宽/高
   * @returns
   */
  get aspect() {
    return this.options?.camera?.aspect ?? this.width / this.height
  }

  /**
   * 获取正交相机的参数
   * @returns
   */
  get rect() {
    const aspect = this.aspect
    const s = this.options?.camera?.range ?? 40
    const left = -s * aspect
    const right = s * aspect
    const top = s
    const bottom = -s
    return { left, right, top, bottom }
  }

  /**
   * 是否需要CSS2D 渲染器
   * @returns
   */
  get hasCSS2DRenderer() {
    return !!Reflect.get(this.options?.CSSRenderer || {}, '2d')
  }

  /**
   * 是否需要CSS3D 渲染器
   * @returns
   */
  get hasCSS3DRenderer() {
    return !!Reflect.get(this.options?.CSSRenderer || {}, '3d')
  }

  /**
   * 创建场景
   */
  private createScene() {
    const scene = new Scene()
    // 其他属性
    Object.keys(this.options.scene || {}).forEach(key => {
      set(scene, key, get(this.options.scene, key))
    })
    return scene
  }

  /**
   * 创建相机
   */
  private createCamera() {
    let camera: OrthographicCamera | PerspectiveCamera

    const aspect = this.aspect
    const near = this.options.camera?.near ?? 0.1
    const far = this.options.camera?.far ?? 2000

    if (this.options.camera?.instance) {
      camera = this.options.camera?.instance as any
    }
    // 正交相机
    else if (this.options.camera?.type === 'orthographic') {
      // 控制left, right, top, bottom范围大小
      const { left, right, top, bottom } = this.rect
      camera = new OrthographicCamera(left, right, top, bottom, near, far)
    } else {
      // 透视相机
      camera = new PerspectiveCamera(this.options.camera?.fov ?? 50, aspect, near, far)
    }
    const position = this.options.camera?.position
    const { x, y, z } = getPosition({ x: 10, y: 10, z: 10 }, position)
    // 相机位置
    camera.position.set(x, y, z)
    // 相机往哪看
    camera.lookAt(this.scene.position)
    // 更新相机矩阵
    camera.updateProjectionMatrix()

    return camera
  }

  /**
   * 创建 渲染器
   */
  private createRenderer() {
    const renderer = new WebGLRenderer({
      antialias: true,
      logarithmicDepthBuffer: true,
      ...this.options.rendererParameters
    })
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(this.width, this.height)
    this.container?.appendChild(renderer.domElement)
    return renderer
  }

  /**
   * 创建控制器
   */
  private createControls() {
    const controls = new OrbitControls(this.camera, this.renderer.domElement)
    const { position, ...rest } = isPlainObject(this.options.controls)
      ? this.options.controls
      : ({} as ControlsOptions)

    const { x, y, z } = getPosition({ x: 0, y: 0, z: 0 }, position)
    controls.target.set(x, y, z)
    // 其他属性
    Object.keys(rest).forEach(key => {
      set(controls, key, get(rest, key))
    })
    controls.update()
    return controls
  }

  /**
   * 创建光
   */
  private createLight() {
    if (!this.options.light) return
    const optionsLight = this.options.light as LightOptions

    // 平行光
    if (optionsLight?.directional !== false) {
      const directionalLightOptions = (this.options.light as LightOptions)?.directional

      // 多个
      if (isArray(directionalLightOptions)) {
        const directionalLights = directionalLightOptions.map((item: DirectionalLightOptions) =>
          createDirectionalLight(item as DirectionalLightOptions)
        )
        directionalLights.forEach(item => {
          this.scene.add(item)
        })
        this.light.directional = directionalLights
      } else {
        // 单个
        const directionalLight = createDirectionalLight(
          directionalLightOptions as DirectionalLightOptions
        )
        // 添加到场景
        this.scene.add(directionalLight)
        this.light.directional = directionalLight
      }
    }

    // 环境光
    if (optionsLight?.ambient !== false) {
      const ambientLightOptions: AmbientLightOptions =
        (this.options.light as LightOptions)?.ambient || {}
      const ambientLight = createAmbientLight(ambientLightOptions)
      this.scene.add(ambientLight)
      this.light.ambient = ambientLight
    }

    return this.light
  }

  /**
   * 创建 辅助对象
   */
  private createHelper() {
    // 平行光辅助
    if (this.light?.directional && this.options.helper?.directionalLightHelper) {
      if (isArray(this.light.directional)) {
        const directionalLightHelpers = this.light.directional.map(item =>
          createDirectionalLightHelper(item)
        )
        directionalLightHelpers.forEach(item => {
          this.scene.add(item)
        })
        this.helper.directionalLightHelper = directionalLightHelpers
      } else {
        this.helper.directionalLightHelper = createDirectionalLightHelper(
          this.light?.directional as DirectionalLight
        )
        this.scene.add(this.helper.directionalLightHelper)
      }
    }

    // 相机辅助
    if (this.options.helper?.cameraHelper) {
      this.helper.cameraHelper = new CameraHelper(this.camera)
      this.scene.add(this.helper.cameraHelper)
    }

    // x,y,z轴对象辅助
    if (this.options.helper?.axesHelper) {
      this.helper.axesHelper = createAxesHelper(
        (this.options.helper?.axesHelper as { size: number })?.size
      )
      this.scene.add(this.helper.axesHelper)
    }

    // 帧率 辅助
    if (this.options.helper?.stats) {
      const stats = createStats(this.options.helper?.stats as CSSProperties)
      this.container?.appendChild(stats.dom)
      this.helper.stats = stats
    }

    // gui
    if (this.options.helper?.gui) {
      const gui = createGUI(this.options.helper?.gui as CSSProperties)
      this.helper.gui = gui
    }
    return this.helper
  }

  /**
   * 基础渲染
   */
  baseRender() {
    this.renderer.render(this.scene, this.camera)

    // CSS2Renderer
    if (this.hasCSS2DRenderer) {
      this.CSS2DRenderer?.render(this.scene, this.camera)
    }

    // CSS3Renderer
    if (this.hasCSS3DRenderer) {
      this.CSS3DRenderer?.render(this.scene, this.camera)
    }

    // stats
    if (this.helper.stats) {
      this.helper.stats.update()
    }
  }

  /**
   * 动画渲染
   */
  private render() {
    this.baseRender()
    //  需要连续渲染中执行的函数
    if (isFunction(this.options.render)) {
      this.options.render(this)
    }
    this.requestAnimationFrameId = requestAnimationFrame(() => {
      this.render()
    })
  }

  /**
   * 控制器改变渲染
   */
  private controlsChangeRender() {
    if (this.controls) {
      this.controls.addEventListener('change', () => {
        this.baseRender()
      })
    }
  }

  /**
   * 随着窗口实际执行函数
   */
  private resizeHandle() {
    this.renderer.setSize(this.width, this.height)
    this.controls?.update()

    if (this.options.camera?.type === 'orthographic') {
      const { left, right, top, bottom } = this.rect
      ;(this.camera as OrthographicCamera).left = left
      ;(this.camera as OrthographicCamera).right = right
      ;(this.camera as OrthographicCamera).top = top
      ;(this.camera as OrthographicCamera).bottom = bottom
    } else {
      // eslint-disable-next-line @typescript-eslint/no-extra-semi
      ;(this.camera as PerspectiveCamera).aspect = this.aspect
    }

    // CSS2Renderer
    if (this.hasCSS2DRenderer) {
      this.CSS2DRenderer?.setSize(this.width, this.height)
    }

    // CSS3Renderer
    if (this.hasCSS3DRenderer) {
      this.CSS3DRenderer?.setSize(this.width, this.height)
    }

    this.camera.updateProjectionMatrix()

    //  当使用控制器 Change render 时需要重新渲染
    if (this.options.renderType === 'controlsChangeRender') {
      this.baseRender()
    }
  }

  /**
   * 画布尺寸随着窗口变化
   */
  private resize() {
    this.selfResizeHandle = () => this.resizeHandle()
    window.addEventListener('resize', this.selfResizeHandle)
  }

  /**
   * 选择物体
   * @param event  事件
   * @param condition  选择物体（几何体）条件， 默认 isMesh 存在
   * @returns
   */
  private select<T extends Object3D = Mesh>(
    event: MouseEvent,
    condition?: (item: T) => boolean
  ): Partial<Intersection<T>> {
    const { offsetX: x, offsetY: y } = event
    const { width, height } = this.renderer.domElement
    const raycaster = new Raycaster()
    // 鼠标在裁剪空间中的点位
    const pointer = new Vector2()
    // 鼠标的canvas坐标转裁剪坐标
    pointer.set((x / width) * 2 - 1, -(y / height) * 2 + 1)
    // 基于鼠标点的裁剪坐标位和相机设置射线投射器
    raycaster.setFromCamera(pointer, this.camera)
    raycaster.params.Points.threshold = 5
    // 选择
    const meList: Mesh[] = []

    // @ts-ignore
    const conditionFunc = condition || (item => item.isMesh)
    this.model.traverse(item => {
      if (conditionFunc(item as T)) {
        // @ts-ignore
        meList.push(item)
      }
    })
    const intersect =
      (raycaster.intersectObjects(meList, false)[0] as Partial<Intersection<T>>) || {}
    const callbackParams = { event, ...intersect }
    return callbackParams
  }

  /**
   * 事件
   * @param {string | Array } params  事件类型 或者 [ 事件类型，选择物体（几何体）条件（ 默认 isMesh 存在）]
   * @param callback 事件回调
   */
  on<T extends Object3D = Mesh>(
    params: keyof HTMLElementEventMap | [keyof HTMLElementEventMap, (item: T) => boolean],
    callback: (obj: Partial<Intersection<T>>) => void
  ) {
    let eventType: keyof HTMLElementEventMap
    let condition: undefined | ((item: T) => boolean)

    if (isArray(params)) {
      const [key, fun] = params
      eventType = key
      condition = fun
    } else {
      eventType = params
    }

    const handle = (event: MouseEvent) => {
      const intersectObj = this.select<T>(event, condition)
      isFunction(callback) && callback(intersectObj)
    }

    // @ts-ignore
    if (!this.events[eventType]) {
      // @ts-ignore
      this.events[eventType] = []
    }

    // @ts-ignore
    this.events[eventType].push(handle)

    // @ts-ignore
    this.renderer.domElement.addEventListener(eventType, handle)
  }

  /**
   * 重写traverse 方法，用来支持ts泛型
   *
   * 对此对象和所有后代执行回调
   * @marks 注意：不鼓励在回调内修改场景图
   * @param 回调第一个参数为{@link Browse 3D}对象的函数
   */
  traverse<T extends Object3D = Object3D>(callback: (object: T) => any) {
    // @ts-ignore
    this.scene.traverse(callback)
  }

  /**
   * 销毁dom, 销毁AnimationFrame，移除事件监听，销毁场景、渲染器、控制器、几何体、材质、纹理等
   */
  destroy() {
    // 销毁AnimationFrame
    this.requestAnimationFrameId && cancelAnimationFrame(this.requestAnimationFrameId)

    // 销毁helper dom
    this.helper.gui?.destroy()
    this.helper.stats?.dom?.remove()

    //  销毁 CSS2Renderer dom
    if (this.hasCSS2DRenderer) {
      this.CSS2DRenderer?.domElement?.remove()
    }

    // 销毁 CSS3Renderer dom
    if (this.hasCSS3DRenderer) {
      this.CSS3DRenderer?.domElement?.remove()
    }

    // 移除事件监听，废弃几何体、材质
    window.removeEventListener('resize', this.selfResizeHandle)
    Object.keys(this.events).forEach(eventType => {
      // @ts-ignore
      this.events[eventType as keyof HTMLElementEventMap]?.forEach(handle => {
        this.renderer.domElement.removeEventListener(eventType, handle)
      })
    })

    // 废弃几何体、材质、纹理
    this.scene.traverse(item => {
      // @ts-ignore
      item.geometry && item.geometry.dispose()

      // @ts-ignore
      if (item?.material) {
        // @ts-ignore
        if (isArray(item?.material)) {
          // @ts-ignore
          item?.material.forEach(material => {
            Object.values(material).forEach(i => {
              // @ts-ignore
              i?.isTexture && i?.dispose()
            })
            material?.dispose()
          })
        } else {
          // @ts-ignore
          Object.values(item.material).forEach(i => {
            // @ts-ignore
            i?.isTexture && i?.dispose()
          })

          // @ts-ignore
          item?.material?.dispose()
        }
      }
      // @ts-ignore
      item = null
    })

    // @ts-ignore
    this.model = null

    // 销毁 renderer
    this.renderer.forceContextLoss()
    this.renderer.dispose()
    // @ts-ignore
    this.renderer.domElement.remove()
    // @ts-ignore
    this.renderer = null

    // 销毁 scene
    this.scene.remove(this.model)
    this.scene.clear()

    // @ts-ignore
    this.scene = null

    // 销毁相机
    //  @ts-ignore
    this.camera = null

    // 销毁控制器
    this.controls?.dispose()
    // @ts-ignore
    this.controls = null

    // @ts-ignore
    this.container = null

    // 其他
    // @ts-ignore
    this.helper = null
    // @ts-ignore
    this.options = null
    // @ts-ignore
    this.events = null
    // @ts-ignore
    this.light = null
  }
}
