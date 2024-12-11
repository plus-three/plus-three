import { CSS3DObject, CSS2DObject } from 'three/examples/jsm/Addons.js'
import type { CSSProperties } from '@plus-three/types'
import type { Position } from '@plus-three/utils'
import { getPosition } from '@plus-three/utils'

export type CSSObjectOptions = {
  /**
   * 标签
   */
  tag?: string
  /**
   * 标签样式
   */
  style?: CSSProperties
  /**
   * 标签属性
   */
  attrs?: Record<string, any>
  /**
   * 标签class
   */
  class?: string | string[]
  /**
   * 位置
   * @default{x:0,y:0,z:0}
   */
  position?: Position
  /**
   * 缩放
   * @default 1
   */
  scale?: number
}

const createCSSObject = (type: '2d' | '3d', content: string, options?: CSSObjectOptions) => {
  const tag = options?.tag || 'div'
  const position = options?.position
  const scale = options?.scale || 1
  const element = document.createElement(tag)
  element.innerHTML = content
  element.style.pointerEvents = 'none'

  // attrs
  if (options?.attrs && typeof options?.attrs === 'object') {
    Object.keys(options?.attrs).forEach(attr => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      element[attr] = options?.attrs[attr]
    })
  }

  // class
  if (options?.class) {
    const classList = Array.isArray(options?.class) ? options?.class : [options?.class]
    element.classList.add(...classList)
  }

  // style
  if (options?.style && typeof options?.style === 'object') {
    Object.keys(options?.style).forEach(item => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      element.style[item] = options?.style[item]
    })
  }

  const CSSObject = type === '2d' ? new CSS2DObject(element) : new CSS3DObject(element)
  const { x, y, z } = getPosition({ x: 0, y: 0, z: 0 }, position)
  CSSObject.position.set(x, y, z)
  CSSObject.scale.set(scale, scale, scale)

  return CSSObject
}

/**
 *  创建一个CSS2DObject
 * @param content  标签内容，可以是文字或者html字符串
 * @param options
 * @returns
 */
export function createCSS2DObject(content: string, options?: CSSObjectOptions) {
  const CSSLabelObject = createCSSObject('2d', content, options) as CSS2DObject
  return CSSLabelObject
}

/**
 *  *  创建一个CCS3DObject
 * @param content 标签内容，可以是文字或者html字符串
 * @param options
 * @returns
 */
export function createCSS3DObject(content: string, options?: CSSObjectOptions) {
  const CSSLabelObject = createCSSObject('3d', content, options) as CSS3DObject
  return CSSLabelObject
}
