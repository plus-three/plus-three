import { AudioListener, Audio, AudioLoader } from 'three'

/**
 * 加载声音
 * @param url
 * @param volume
 */
export const loadAudio = (
  url: string,
  options?: {
    volume?: number
    loop?: boolean
  }
) => {
  const { volume, loop } = options || {}
  // 创建一个监听者
  const listener = new AudioListener()

  // 创建一个非位置音频对象  用来控制播放
  const sound = new Audio(listener)

  // 创建一个音频加载器对象
  const audioLoader = new AudioLoader()
  audioLoader.load(url, function (buffer) {
    sound.setBuffer(buffer)
    // 播放音量
    sound.setVolume(volume ?? 0.4)

    // 设置循环播放
    loop && sound.setLoop(true)
  })

  return sound
}
