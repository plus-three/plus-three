/* eslint-disable @typescript-eslint/ban-ts-comment */
import type { Group, ColorRepresentation } from 'three'
import { Color, Clock } from 'three'
import { getBox3 } from './getBox3'

/**
 * 光带
 * @param group   组
 * @param options 选项
 */
export const lightBand = (
  /**
   * 组
   */
  group: Group,
  /**
   * 选项
   */
  options?: {
    /**
     * 光带方向
     * @default 'z'
     */
    direction?: 'x' | 'y' | 'z'

    /**
     * 速度
     * @default 2
     */
    speed?: number
    /**
     * 光带颜色
     */
    color?: ColorRepresentation
    /**
     * 光带宽度的一半，需要给浮点数
     * @default 0.4
     */
    width?: number
  }
) => {
  group.userData.shader = []
  // 光带颜色
  const color = options?.color ? new Color(options?.color) : new Color(0.96, 0.96, 0.96)
  const rgb = `vec3(${color.r},${color.g},${color.b})`
  // 光带宽度
  const w = options?.width ?? 0.4
  // 光带方向
  const direction = options?.direction || 'z'
  // 光带速度
  const speed = options?.speed ?? 2

  const { box3 } = getBox3(group)
  // 最大值
  const max = box3.max[direction]
  // 初始值
  const min = box3.min[direction]
  const clock = new Clock()

  // 遍历材质
  group.traverse(item => {
    // @ts-ignore
    if (item?.isMesh) {
      // @ts-ignore
      item.material.onBeforeCompile = shader => {
        shader.vertexShader = shader.vertexShader.replace(
          'void main() {',
          `
            varying vec3 vPosition;
            void main() {
                vPosition = vec3(modelMatrix * vec4(position,1.0));
      `
        )

        shader.fragmentShader = shader.fragmentShader.replace(
          'void main() {',
          `
            uniform float ${direction};
            float w = ${w}; // 光带宽度一半
            varying vec3 vPosition;
            void main() {
      `
        )

        shader.fragmentShader = shader.fragmentShader.replace(
          '#include <dithering_fragment>',
          `
          #include <dithering_fragment>
            if(vPosition.${direction} >=${direction}&& vPosition.${direction} < ${direction} + w ){
                float per = (vPosition.${direction}-${direction})/w;  // 范围0~1
                per = pow(per,1.0);
                gl_FragColor.rgb = mix( ${rgb} ,gl_FragColor.rgb, per);
            }
            if(vPosition.${direction} <= ${direction} && vPosition.${direction} > ${direction} - w ){
                float per = (${direction}-vPosition.${direction})/w;  // 范围0~1
                per = pow(per,1.0);
                gl_FragColor.rgb = mix( ${rgb} ,gl_FragColor.rgb, per);
            }
      `
        )

        shader.uniforms[direction] = { value: min }
        group.userData.shader.push(shader)
      }
    }
  })

  /**
   * 更新动画
   */
  const update = () => {
    const deltaTime = clock.getDelta()

    group.userData.shader.forEach((ele: any) => {
      ele.uniforms[direction].value += speed * deltaTime
      if (ele.uniforms[direction].value > max) {
        ele.uniforms[direction].value = min
      }
    })
  }

  return { update }
}
