import { CSS2DRenderer, CSS3DRenderer } from 'three/examples/jsm/Addons.js'

function createCSSRenderer(
  type: '2d' | '3d',
  container: HTMLDivElement | HTMLElement,
  width: number,
  height: number
) {
  const CSSLabelRenderer = type === '2d' ? new CSS2DRenderer() : new CSS3DRenderer()
  CSSLabelRenderer.setSize(width, height)
  CSSLabelRenderer.domElement.style.position = 'absolute'
  // 相对标签原位置位置偏移大小
  CSSLabelRenderer.domElement.style.top = '0px'
  CSSLabelRenderer.domElement.style.left = '0px'
  // //设置.pointerEvents=none，以免模型标签HTML元素遮挡鼠标选择场景模型
  CSSLabelRenderer.domElement.style.pointerEvents = 'none'
  container.appendChild(CSSLabelRenderer.domElement)
  return CSSLabelRenderer
}

/**
 *  创建一个CSS2渲染器CSS2DRenderer
 * @returns
 */
export function createCSS2DRenderer(
  container: HTMLDivElement | HTMLElement,
  width: number,
  height: number
) {
  const CSS3LabelRenderer = createCSSRenderer('2d', container, width, height)
  return CSS3LabelRenderer
}

/**
 *  创建一个CSS3渲染器CSS3DRenderer
 * @returns
 */
export function createCSS3DRenderer(
  container: HTMLDivElement | HTMLElement,
  width: number,
  height: number
) {
  const CSS3LabelRenderer = createCSSRenderer('3d', container, width, height)
  return CSS3LabelRenderer
}
