import consola from 'consola'
import fsExtra from 'fs-extra'
import { copyFile, writeFile, readFile } from 'fs/promises'

import { resolve } from 'path'
import { dts } from './dts'
import { moduleBuilder } from './modules'
import { typesOutDir, output, projRoot, pkgRoot, outputDist } from './common'

const isDev = process.env.NODE_ENV === 'development'

const defaultTask = [moduleBuilder(), , dts()]
const task = isDev ? defaultTask : [...defaultTask]

const copyFiles = () =>
  Promise.all([
    copyFile(resolve(pkgRoot, 'plus-three/package.json'), resolve(output, 'package.json')),
    copyFile(resolve(projRoot, 'README.md'), resolve(output, 'README.md')),
    copyFile(resolve(projRoot, 'README.zh-CN.md'), resolve(output, 'README.zh-CN.md'))
  ])

const copyDts = async () => {
  const src = resolve(typesOutDir)
  await fsExtra.remove(resolve(typesOutDir, 'packages'))

  /**
   * copy es dts
   */
  const targetES = resolve(outputDist, 'es')
  await fsExtra.copy(src, targetES)

  /**
   * copy lib dts
   */
  const targetLib = resolve(outputDist, 'lib')
  await fsExtra.copy(src, targetLib)

  /**
   * remove  typesOutDir
   */
  await fsExtra.remove(src)
}

const updateVersion = async () => {
  const pcOutputPkg = resolve(output, 'package.json')
  const mainPackageInfo = await readFile(pcOutputPkg, 'utf-8')
  const packageInfo = await readFile(resolve(projRoot, 'package.json'), 'utf-8')
  const mainPkg = JSON.parse(mainPackageInfo)
  const pkg = JSON.parse(packageInfo)
  mainPkg.version = pkg.version
  await writeFile(pcOutputPkg, JSON.stringify(mainPkg, null, 2) + '\n')
}

consola.start('Build...')

Promise.all(task)
  .then(async () => {
    await copyDts()
    await copyFiles()
    await updateVersion()
    consola.success('✅ build completed')
  })
  .catch((error: Error) => {
    consola.fail(error.message)
  })
