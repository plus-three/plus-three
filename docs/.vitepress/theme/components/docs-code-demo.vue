<template>
  <ClientOnly>
    <div class="docs-example-showcase">
      <AppAsyncComponent />
    </div>
    <div class="docs-example-btns">
      <el-tooltip content="在 GitHub 中编辑">
        <el-icon :size="size" @click="handleEdit"><EditPen /></el-icon>
      </el-tooltip>
      <el-tooltip content="复制代码">
        <el-icon :size="size"><DocumentCopy v-copy="content" /></el-icon>
      </el-tooltip>
      <el-tooltip :content="show ? '收起源代码' : '查看源代码'">
        <el-icon :size="size" @click="handleToggle">
          <ArrowUp v-if="show" />
          <ArrowDown v-else />
        </el-icon>
      </el-tooltip>
    </div>
    <div
      :style="{
        display: show ? 'block' : 'none'
      }"
      class="docs-example-language-vue language-vue"
    >
      <div class="content">
        <highlightjs language="js" :code="decoded"></highlightjs>
      </div>
      <div class="line-numbers-wrapper">
        <template v-for="item in total" :key="item">
          <span class="line-number">
            {{ item }}
          </span>
          <br />
        </template>
      </div>
    </div>
  </ClientOnly>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { DocumentCopy, ArrowDown, ArrowUp, EditPen } from '@element-plus/icons-vue'
import { getComponent } from '../../utils/getComponent'

// 编辑地址
const editUrl = 'https://github.com/plus-three/plus-three/edit/master/docs/examples'

// 自动加载 asyncRouter 文件夹下所有的异步路由
const moduleFiles = import.meta.glob('../../../examples/**/*.vue', {
  eager: true
})

const props = defineProps<{
  source: string
  path: string
  rawSource: string
}>()

const show = ref(false)
const total = ref(0)
const size = 18

const AppAsyncComponent = getComponent(moduleFiles, props.path)

const handleToggle = () => {
  show.value = !show.value
}

const decoded = computed(() => decodeURIComponent(props.source))
const content = computed(() => decodeURIComponent(props.rawSource))

// add line-number
const tem = content.value.split('\r\n')
total.value = tem.length

// 去github编辑
const handleEdit = () => {
  const url = `${editUrl}/${props.path}.vue`
  window.open(url, '_blank')
}
</script>

<style lang="scss" scoped>
.docs-example-showcase {
  border: 1px solid #dcdfe6;
  border-radius: 4px 4px 0 0;
  padding: 20px;
  overflow: auto;
}
.docs-example-btns {
  border: 1px solid #dcdfe6;
  border-top: 0;
  padding: 20px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  border-radius: 0 0 4px 4px;
  .el-icon {
    cursor: pointer;
    margin-left: 20px;
    color: #747578;
  }
}
.content {
  padding-left: 32px;
}

.line-numbers-wrapper {
  border-color: #dcdfe6;
  line-height: 1.4;
  padding-top: 11px;
  user-select: none;
  .line-number {
    color: #aaa;
    line-height: 1.4;
  }
}
</style>
