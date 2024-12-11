import type { Texture } from 'three'
import {
  AudioListener,
  Audio,
  AudioLoader,
  TextureLoader,
  CubeTextureLoader,
  SRGBColorSpace,
  ObjectLoader
} from 'three'
import {
  GLTFLoader,
  FBXLoader,
  OBJLoader,
  MTLLoader,
  RGBELoader,
  DRACOLoader
} from 'three/examples/jsm/Addons.js'

/**
 *  加载GLTF
 * @param path  路径
 * @param  options  参数
 * @returns
 */
export const loadGLTF = async (
  path: string,
  options?: {
    /** 是否需要解压  */
    draco?: boolean
    /**  解压文件路径，默认/draco/  */
    decoderPath?: string
    /** 加载进度回调函数 */
    onProgress?: (event: ProgressEvent) => void
  }
) => {
  const loader = new GLTFLoader()

  // 解压
  if (options?.draco) {
    const dracoLoader = new DRACOLoader()
    // 设置draco路径
    dracoLoader.setDecoderPath(options?.decoderPath || '/draco/')
    // 设置gltf加载器draco解码器
    loader.setDRACOLoader(dracoLoader)
  }
  const gltf = await loader.loadAsync(path, options?.onProgress)
  return gltf
}

/**
 *  加载FBX
 * @param path  路径
 * @param onProgress 加载进度回调函数
 * @returns
 */
export const loadFBX = async (path: string, onProgress?: (event: ProgressEvent) => void) => {
  const loader = new FBXLoader()
  const fbx = await loader.loadAsync(path, onProgress)
  return fbx
}

/**
 *  加载 OBJ
 * @param path  路径
 * @param onProgress 加载进度回调函数
 * @returns
 */
export const loadOBJ = async (path: string, onProgress?: (event: ProgressEvent) => void) => {
  const loader = new OBJLoader()
  const obj = await loader.loadAsync(path, onProgress)
  return obj
}

/**
 *  加载  MTL
 * @param path  路径
 * @param onProgress 加载进度回调函数
 * @returns
 */
export const loadMTL = async (path: string, onProgress?: (event: ProgressEvent) => void) => {
  const loader = new MTLLoader()
  const mtl = await loader.loadAsync(path, onProgress)
  return mtl
}

/**
 *  加载  Object
 * @param path  路径
 * @param onProgress 加载进度回调函数
 * @returns
 */
export const loadObject = async (path: string, onProgress?: (event: ProgressEvent) => void) => {
  const loader = new ObjectLoader()
  const object = await loader.loadAsync(path, onProgress)
  return object
}

/**
 *  加载纹理，已经默认设置  texture.colorSpace = SRGBColorSpace
 * @param path  路径
 * @param options
 * @returns
 */
export const loadTexture = (
  path: string,
  options?: {
    onLoad?: (data: Texture) => void
    onProgress?: (event: ProgressEvent) => void
    onError?: (err: unknown) => void
  }
) => {
  const textureLoader = new TextureLoader()
  const texture = textureLoader.load(path, options?.onLoad, options?.onProgress, options?.onError)
  texture.colorSpace = SRGBColorSpace
  return texture
}

/**
 *  异步加载纹理，已经默认设置  texture.colorSpace = SRGBColorSpace
 * @param path  路径
 * @param options
 * @returns
 */
export const loadTextureAsync = async (
  path: string,
  options?: {
    onLoad?: (data: Texture) => void
    onProgress?: (event: ProgressEvent) => void
    onError?: (err: unknown) => void
  }
) => {
  const textureLoader = new TextureLoader()
  const texture = await textureLoader.loadAsync(path, options?.onProgress)
  texture.colorSpace = SRGBColorSpace
  return texture
}

/**
 *  加载立方体纹理，已经默认设置  texture.colorSpace = SRGBColorSpace
 * @param path  路径
 * @param names  立方体各个面名称   顺序：  '右' => '左' => '上' => '下' => '前' => '后'
 * @param options
 * @returns
 */
export const loadCubeTexture = (
  path: string,
  names: string[],
  options?: {
    onLoad?: (data: Texture) => void
    onProgress?: (event: ProgressEvent) => void
    onError?: (err: unknown) => void
  }
) => {
  const cubeTextureLoader = new CubeTextureLoader()
  const cubeTexture = cubeTextureLoader
    .setPath(path)
    .load(names, options?.onLoad, options?.onProgress, options?.onError)
  cubeTexture.colorSpace = SRGBColorSpace
  return cubeTexture
}

/**
 *  加载hdr，已经默认设置  texture.colorSpace = SRGBColorSpace
 * @param path  路径
 * @param options
 * @returns
 */
export const loadRGBE = async (path: string, onProgress?: (event: ProgressEvent) => void) => {
  const loader = new RGBELoader()
  const texture = await loader.loadAsync(path, onProgress)
  texture.colorSpace = SRGBColorSpace
  return texture
}

/**
 * 加载声音
 * @param url
 * @param options
 */
export const loadAudio = (
  url: string,
  options?: {
    volume?: number
    loop?: boolean
    onProgress?: (event: ProgressEvent) => void
    onError?: (err: unknown) => void
  }
) => {
  const { volume, loop, onProgress, onError } = options || {}
  // 创建一个监听者
  const listener = new AudioListener()
  // 创建一个非位置音频对象  用来控制播放
  const sound = new Audio(listener)
  // 创建一个音频加载器对象
  const audioLoader = new AudioLoader()
  audioLoader.load(
    url,
    function (buffer) {
      sound.setBuffer(buffer)
      // 播放音量
      sound.setVolume(volume ?? 0.4)
      // 设置循环播放
      loop && sound.setLoop(true)
    },
    onProgress,
    onError
  )
  return sound
}
