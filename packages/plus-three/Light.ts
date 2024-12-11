import type { ColorRepresentation } from 'three'
import { DirectionalLight, DirectionalLightHelper, AmbientLight } from 'three'
import { set, get } from 'lodash-es'
import { getPosition } from '@plus-three/utils'
import type { Position } from '@plus-three/utils'

const DefaultPosition = {
  x: 0,
  y: 120,
  z: 120
}

/** 

* 平行光参数
 */
export interface DirectionalLightOptions
  extends Omit<Partial<DirectionalLight>, 'position' | 'shadow' | 'color'> {
  /**
   * 平行光色
   * @default 0xffffff (white)
   */
  color?: ColorRepresentation

  /**
   * 平行光强度/强
   * @default 3
   */
  intensity?: number

  /**
   * 平行光位置
   *
   * @default{ x:0 ,y:120 ,z: 120}
   */
  position?: Position

  /**
   * 阴影参数
   */
  shadow?: Partial<DirectionalLight['shadow']>
}

/**
 *  创建平行光
 * @param options
 * @default{ color:0xffffff, intensity:3 , position:{ x:0 ,y:120 ,z: 120} }
 * @returns
 */
export const createDirectionalLight = (options?: DirectionalLightOptions) => {
  const { color = 0xffffff, intensity = 3, position, shadow, ...rest } = options || {}
  const { x, y, z } = getPosition(DefaultPosition, position)
  const directionalLight = new DirectionalLight(color, intensity)
  // 位置
  directionalLight.position.set(x, y, z)

  // shadow
  const shadowRest = shadow || {}
  Object.keys(shadowRest).forEach(key => {
    set(directionalLight.shadow, key, get(shadowRest, key))
  })

  // 其他属性
  const other = { ...rest }
  Object.keys(other).forEach(key => {
    set(directionalLight, key, get(other, key))
  })

  return directionalLight
}

/**
 * 创建平行光辅助
 * @param light
 * @param size
 * @param color
 * @returns
 */
export const createDirectionalLightHelper = (
  light: DirectionalLight,
  size?: number,
  color?: ColorRepresentation
) => {
  const directionalLightHelper = new DirectionalLightHelper(light, size || 10, color || 'yellow')
  return directionalLightHelper
}

/**
 * 环境光参数
 */
export type AmbientLightOptions = {
  /**
   * 环境光色
   * @default 0xffffff (white)
   */
  color?: string | number

  /**
   * 环境光强度/强
   * @default 1
   */
  intensity?: number
}

/**
 * 创建环境光
 * @param ambientLightOptions
 * @default{color:0xffffff, intensity:1}
 * @returns
 */
export const createAmbientLight = (ambientLightOptions?: AmbientLightOptions) => {
  // 颜色
  const color = ambientLightOptions?.color || 0xffffff
  // 光强
  const intensity = ambientLightOptions?.intensity ?? 1
  const ambientLight = new AmbientLight(color, intensity)
  return ambientLight
}
