<template>
  <div ref="container" />
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { AnimationMixer, Clock } from 'three'
import { PlusThree, loadGLTF } from 'plus-three'

const container = ref()

onMounted(async () => {
  const model = await loadGLTF('/model/鸟.glb')

  model.scene.scale.set(0.05, 0.05, 0.05)
  const mixer = new AnimationMixer(model.scene)
  const clipAction = mixer.clipAction(model.animations[0])
  clipAction.play()

  const clock = new Clock()

  const plusThree = new PlusThree(container.value, model.scene, {
    width: 680,
    height: 400,
    render: () => {
      const frameT = clock.getDelta()
      // 更新播放器相关的时间
      mixer.update(frameT)
    },
    light: {
      ambient: { color: 0xffffff, intensity: 0.5 }
    }
  })

  plusThree.renderer.setClearColor('white', 1)
})
</script>
