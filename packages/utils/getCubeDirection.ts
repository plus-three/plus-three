import type { Vector3 } from 'three'

type DirectionResult = {
  label: '右' | '左' | '上' | '下' | '前' | '后'
  value: 'right' | 'left' | 'up' | 'down' | 'front' | 'back'
}

/**
 * 获取点击立方体的方向
 * @param normal 法向量
 */
export const getCubeDirection = (normal: Vector3): DirectionResult | undefined => {
  const { x, y, z } = normal
  if (x > 0) {
    return { label: '右', value: 'right' }
  }
  if (x < 0) {
    return { label: '左', value: 'left' }
  }

  if (y > 0) {
    return { label: '上', value: 'up' }
  }
  if (y < 0) {
    return { label: '下', value: 'down' }
  }

  if (z > 0) {
    return { label: '前', value: 'front' }
  }
  if (z < 0) {
    return { label: '后', value: 'back' }
  }
}
