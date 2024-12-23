<template>
  <div ref="mapContainer" class="map-container" />
</template>

<script lang="ts" setup>
/* eslint-disable @typescript-eslint/ban-ts-comment */
import type { ShallowRef } from 'vue'
import { ref, onMounted, shallowRef } from 'vue'
import type { DirectionalLight, MeshLambertMaterial } from 'three'
import {
  Group,
  Mesh,
  MeshPhysicalMaterial,
  TextureLoader,
  Vector2,
  Color,
  Shape,
  EllipseCurve,
  ExtrudeGeometry,
  SRGBColorSpace,
  FileLoader
} from 'three'
import { PlusThree, getBox3, createCSS3DObject } from 'plus-three'
import { Tween, Group as TweenGroup } from '@tweenjs/tween.js'
import { LightRing } from '../fly/LightRing2'
import { Fly } from '../fly/FlyShader'
import { getPoints } from './getPoints'
import { getOutLine, getLine } from './shape'
import type { Coord } from './type'

const mapContainer = ref()
const plusThree = shallowRef() as ShallowRef<PlusThree>

onMounted(async () => {
  const model = new Group()
  model.name = 'rootModel'

  const loader = new FileLoader()
  loader.setResponseType('json')

  const data = (await loader.loadAsync('/china.json')) as any

  const centerPoints: Coord[] = []

  // 访问所有国家边界坐标数据:data.features
  data.features.forEach((area: any) => {
    // "Polygon":国家area有一个封闭轮廓
    // "MultiPolygon":国家area有多个封闭轮廓

    const center = area.properties.center

    const not =
      area.properties.name !== '香港特别行政区' && area.properties.name !== '澳门特别行政区'

    if (center && not) {
      // 把"Polygon"和"MultiPolygon"的geometry.coordinates数据结构处理为一致
      const coordinates = (area.geometry.coordinates =
        area.geometry.type === 'Polygon' ? [area.geometry.coordinates] : area.geometry.coordinates)

      const group = new Group()

      group.name = area.properties.adcode
      group.userData = area.properties

      coordinates.forEach((item: Coord[][]) => {
        const points = getPoints(item)

        // 线
        const line = getLine(points)
        line.userData = area.properties

        // 面
        const outline = getOutLine(points)
        outline.userData = area.properties

        //  发光圆柱
        const material = new MeshPhysicalMaterial({
          color: 0x1eb3bf,
          emissive: 0x00ff00,
          roughness: 0,
          metalness: 0.5
        })
        const h = Math.ceil(Math.random() * 3)
        const shape = new Shape()
        const curve = new EllipseCurve(0, 0, 0.3, 0.3)
        const points1 = curve.getSpacedPoints(100)
        shape.setFromPoints(points1.map(item => new Vector2(item.x, item.y)))
        const geometry = new ExtrudeGeometry(shape, {
          depth: h
        })
        const cylinder = new Mesh(geometry, material)
        cylinder.position.set(center[0], center[1], 1.5)
        const tween = new Tween({ index: 1 })
          .to({ index: 100 }, 1000)
          .onUpdate(t => {
            cylinder.scale.set(1, 1, t.index * 0.01)
          })
          .repeat(Infinity)
          .start()

        // @ts-ignore
        cylinder.tween = tween
        // @ts-ignore
        cylinder.isCylinder = true
        cylinder.userData = area.properties

        group.add(line, outline, cylinder)
      })

      centerPoints.push(center)

      // 光圈
      const lightRing = new LightRing(0x1eb3bf, area.properties)
      lightRing.position.set(center[0], center[1], 1.2)

      group.add(lightRing)

      const CSS3d = createCSS3DObject(area.properties.name, {
        tag: 'div',
        class: 'text',
        style: { color: '#fff', pointerEvents: 'none' },
        attrs: { id: 'CSS3D-' + area.properties.adcode },
        position: [center[0], center[1], 1.5],
        scale: 0.04
      })

      CSS3d.name = 'CSS3D-' + area.properties.adcode

      group.add(CSS3d)

      model.add(group)
    }
  })

  const { center } = getBox3(model)

  //  飞线
  const flyPoints = centerPoints.map(item => ({
    begin: [108.948024, 34.263161, 1.5],
    end: [item[0], item[1], 1.5],
    height: 3
  }))
  const fly = new Fly(flyPoints, { routeColor: 0x1eb3bf })
  model.add(fly)

  plusThree.value = new PlusThree(mapContainer.value, model, {
    width: 680,
    height: 400,
    CSSRenderer: { '3d': true },
    camera: {
      type: 'orthographic',
      range: 30,
      position: {
        x: 113.90161473271833,
        y: -7.908343606103124,
        z: 92.64623920580718
      }
    },
    light: { directional: { intensity: 8 } },
    // helper: { axesHelper: true },
    render: instance => {
      instance.model.traverse(item => {
        // @ts-ignore
        if (item.tween || item.tweenGroup) {
          // @ts-ignore
          item.tween?.update()
          // @ts-ignore
          item.tweenGroup?.update()
        }
      })
    }
  })

  let preObj: Mesh | null = null

  plusThree.value.on('mousemove', () => {
    console.log(plusThree.value, '  plusThree.value')
  })

  plusThree.value.on('click', ({ object: obj }) => {
    console.log(obj, 'obj1')
    plusThree.value.renderer.domElement.style.cursor = obj ? 'pointer' : 'default'

    const pre = document.querySelector('.tag-active')
    if (pre) {
      pre.classList.remove('tag-active')
    }
    if (preObj) {
      // @ts-ignore
      if (preObj.tweenGroup) {
        // @ts-ignore
        preObj.tweenGroup.removeAll && preObj.tweenGroup.removeAll()
        // @ts-ignore
        preObj.tweenGroup = null
      }

      const code = preObj.userData.adcode
      const target = model.getObjectByName(code)!
      // target?.scale.set(1, 1, 1)
      target.position.z = 0
      // target.position.y = 0
      ;(preObj.material as MeshLambertMaterial).color = new Color(0x004444)

      const currentCSS3D = target.getObjectByName('CSS3D-' + code)
      // @ts-ignore
      currentCSS3D.position.y -= 0.5
    }

    if (obj) {
      const code = obj.userData.adcode
      const target = model.getObjectByName(code)!
      const div = document.querySelector(`#CSS3D-${code}`)
      if (!div) return
      div.classList.add('tag-active')

      // @ts-ignore
      if (!obj.tweenGroup) {
        const group = new TweenGroup()
        const tween = new Tween({ z: 0 }, group)
          .to({ z: 3 }, 100)
          .onUpdate(({ z }) => {
            target.position.z = z
          })
          .start()
          .onComplete(() => {
            group.removeAll()
            console.log(tween, 'tween')
          })

        // @ts-ignore
        obj.tweenGroup = group
      }

      // target.position.y = 1
      // @ts-ignore
      // eslint-disable-next-line @typescript-eslint/no-extra-semi
      ;(obj.material as MeshLambertMaterial).color = new Color(0x1eb3bf)

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const currentCSS3D = target.getObjectByName('CSS3D-' + code)!

      // @ts-ignore
      currentCSS3D.position.y += 0.5
    }
    // @ts-ignore
    preObj = obj
  })

  // 设置背景
  plusThree.value.renderer.setClearColor('rgb(255,255,255)', 0)

  const textureLoader = new TextureLoader()
  const texture = textureLoader.load('/back1.jpg')
  texture.colorSpace = SRGBColorSpace
  plusThree.value.scene.background = texture
  ;(plusThree.value.light.directional as DirectionalLight).shadow.mapSize.set(1024, 1024)
  ;(plusThree.value.light.directional as DirectionalLight).shadow.radius = 3
  // 开启光源阴影的计算功能
  ;(plusThree.value.light.directional as DirectionalLight).castShadow = true
  // 设置渲染器，允许光源阴影渲染
  plusThree.value.renderer.shadowMap.enabled = true
  plusThree.value.scene.receiveShadow = true
  // 设置相机
  plusThree.value.camera.lookAt(center.x, center.y, 0)
  // 设置控制器
  plusThree.value.controls?.target.set(center.x, center.y, 0)
  plusThree.value.controls?.update()
})
</script>

<style lang="scss">
.tag-active {
  color: #def01e !important;
}
.map-container > div {
  left: 20px !important;
  top: 182px !important;
}
</style>
