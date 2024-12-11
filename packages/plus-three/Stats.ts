import Stats from 'three/examples/jsm/libs/stats.module.js'
import type { CSSProperties } from '@plus-three/types'
import { isPlainObject } from '@plus-three/utils'

/**
 * 创建 Stats
 */
export const createStats = (statsStyle?: CSSProperties) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const stats = new Stats()
  stats.dom.style.position = 'absolute'
  stats.dom.style.bottom = '0px'
  stats.dom.style.zIndex = '1'
  stats.dom.style.height = '80px'

  if (isPlainObject(statsStyle)) {
    Object.keys(statsStyle).forEach(key => {
      Reflect.set(
        stats.dom.style,
        key,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        Reflect.get(statsStyle, key)
      )
    })
  }

  return stats
}
