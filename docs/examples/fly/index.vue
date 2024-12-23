<template>
  <div ref="flyContainer" class="fly-container" />
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { PlusThree } from 'plus-three'
// import { Fly } from './Fly'
import {
  Group,
  SphereGeometry,
  TextureLoader,
  SRGBColorSpace,
  MeshLambertMaterial,
  Mesh,
  Color
} from 'three'
import { Fly } from './FlyShader'
import { LightRing } from './LightRing2'

const flyContainer = ref()

onMounted(async () => {
  const group = new Group()

  const geometry = new SphereGeometry(10, 160, 160)
  const texture = new TextureLoader().load('/Earth.png')
  texture.colorSpace = SRGBColorSpace
  const material1 = new MeshLambertMaterial({
    map: texture
  })
  const mesh = new Mesh(geometry, material1)
  // group.add(mesh)

  const points = mesh.geometry.attributes.position
  const count = mesh.geometry.attributes.position.count
  const getRadomPoints = () => {
    const index = Math.floor(Math.random() * count)
    const coord = [points.getX(index), points.getY(index), points.getZ(index)]
    return coord
  }
  const data = Array.from({ length: 50 })
    .map(() => ({
      begin: [0, 10, 0],
      end: getRadomPoints(),
      height: 3
    }))
    .filter(item => item.end[1] > 2)

  const fly = new Fly(data)
  group.add(fly)

  const lightRing = new LightRing()

  group.add(lightRing)

  const plusThree = new PlusThree(flyContainer.value, group, {
    width: 680,
    height: 400,
    camera: {
      far: 20000,
      fov: 70,
      position: { x: 1, y: 1, z: 20 }
    },
    light: true,
    helper: { axesHelper: true },
    render: () => {
      lightRing.tween.update()
      fly.tweenGroup.update()
    }
  })

  plusThree.renderer.setClearColor(new Color(0x004444), 0.5)

  console.log(plusThree, 'plusThree')
})
</script>
