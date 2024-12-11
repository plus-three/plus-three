import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js'
import type { CSSProperties } from '@plus-three/types'
import { isPlainObject } from '@plus-three/utils'

/**
 * 创建GUI
 */
export const createGUI = (GUIStyle?: CSSProperties) => {
  const gui = new GUI()
  gui.title('控制器')
  gui.domElement.style.right = '0px'
  if (isPlainObject(GUIStyle)) {
    Object.keys(GUIStyle).forEach(key => {
      Reflect.set(
        gui.domElement.style,
        key,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        Reflect.get(GUIStyle, key)
      )
    })
  }
  return gui
}
