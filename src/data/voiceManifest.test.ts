import { existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { missions } from './gameData'
import { voiceManifest } from './voiceManifest'

describe('预录中文语音资源', () => {
  it('每个任务说明都有对应语音', () => {
    for (const mission of missions) {
      expect(voiceManifest[mission.instruction], mission.instruction).toBeTruthy()
    }
  })

  it('清单中的每段语音文件都存在', () => {
    expect(Object.keys(voiceManifest)).toHaveLength(54)
    for (const url of Object.values(voiceManifest)) {
      expect(existsSync(resolve(process.cwd(), 'public', url.replace(/^\.\//, ''))), url).toBe(true)
    }
  })
})
