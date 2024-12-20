import cookie from 'js-cookie'
import { ElMessageBox } from 'element-plus'

const isJumpKey = 'Plus-Pro-Components-Jump-Key'
const github = 'plus-pro-components.github.io'
const official = 'plus-pro-components.com'

/**
 * 文档地址自动跳转
 */
export const jump = () => {
  const isZh = navigator.language === 'zh-CN'
  const isGithub = location.host === github
  const isJump = isZh && isGithub && !cookie.get(isJumpKey)

  if (isJump) {
    ElMessageBox.confirm('检测到你的访问地址是国内，是否跳转到国内镜像文档？', {
      confirmButtonText: '是',
      callback: (action: string) => {
        if (action === 'cancel') {
          cookie.set(isJumpKey, '1')
        } else {
          location.href = location.href.replace(github, official)
        }
      }
    })
  }
}
