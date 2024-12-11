import { AxesHelper } from 'three'

/**
 *  创建 axesHelper 辅助
 * @param size  default  `2000`
 * @returns
 */
export const createAxesHelper = (size = 2000) => {
  const axesHelper = new AxesHelper(size)
  return axesHelper
}
