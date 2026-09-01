import { execFile } from 'node:child_process'
import { createHash } from 'node:crypto'
import { mkdir, stat, writeFile } from 'node:fs/promises'
import { promisify } from 'node:util'

const execFileAsync = promisify(execFile)

const missionInstructions = [
  '请按任务卡，选出正确的考察装备。',
  '看清数量，再把正确的补给装上车。',
  '观察颜色和图案，补上问号的位置。',
  '先选一块化石，再点它应该回去的位置。',
  '先想好整条路线，再按出发。',
  '数一数图表里的发现，再选择答案。',
  '听清三件装备的名字，把它们找出来。',
  '看一看原来有多少，又送来了多少。',
  '从头读一遍规律，再选择答案。',
  '选中化石，转到合适方向，再放进轮廓。',
  '观察石头的位置，设计一条不会碰到它的路。',
  '先看每一行有几个，再进行比较。',
  '顺序也很重要，装好后再仔细检查。',
  '先看原来的总数，再拿走已经用掉的部分。',
  '注意一组里可能有三个不同的图案。',
  '比较细节、调整方向，再把每块化石归位。',
  '避开岩石，用方向指令走到观察站。',
  '根据图表进行合并或比较，再选择答案。'
]

const equipmentPrompts = [
  '第1张任务卡，请带上地图、水壶',
  '第2张任务卡，请带上软刷、放大镜',
  '第3张任务卡，请带上手套、记录本',
  '第1张任务卡，请带上地图、软刷、记录本',
  '第2张任务卡，请带上水壶、手套、安全绳',
  '第3张任务卡，请带上放大镜、手电筒、记录本',
  '第1张任务卡，请带上地图、水壶、软刷、记录本',
  '第2张任务卡，请带上手套、放大镜、手电筒、安全绳',
  '第3张任务卡，请带上记录本、软刷、地图、手套',
  '请按顺序带上地图、水壶、软刷、记录本',
  '请按顺序带上手套、放大镜、手电筒、安全绳',
  '请按顺序带上记录本、软刷、地图、手套',
  '没关系，再仔细检查一次'
]

const supplyPrompts = [
  '补给车需要三只水壶，选出正确的数量。',
  '请给考察队准备五个苹果。',
  '营地需要四份餐盒。',
  '营地原来有三箱，又送来两箱，一共有多少箱？',
  '车上有四只水壶，又装上三只，一共有多少只？',
  '红筐有五个苹果，绿筐有四个，合起来有多少？',
  '原来有八份餐盒，用掉三份，还剩多少份？',
  '十只水壶送去四只，车上还剩多少只？',
  '九箱补给搬进营地两箱，车上还剩多少箱？',
  '别着急，再数一数'
]

const recordQuestions = [
  '今天发现了几枚脚印？',
  '今天发现了几片蛋壳？',
  '今天发现了几片叶子印迹？',
  '哪一种发现最多？',
  '哪一种发现最少？',
  '哪两种发现一样多？',
  '脚印比蛋壳多几个？',
  '蛋壳和叶片合起来有几个？',
  '三种发现一共有几个？'
]

const sharedPrompts = [
  '仔细观察，从头读一遍规律，问号的位置应该是什么？',
  '先选一块化石，再点它相同形状的位置',
  '选中化石，转到正确方向，再放进相同的轮廓',
  '观察起点、岩石和红旗，先排好整条路线，再按出发'
]

const lines = [...new Set([
  ...missionInstructions,
  ...equipmentPrompts,
  ...supplyPrompts,
  ...recordQuestions,
  ...sharedPrompts
])]

const outputDirectory = new URL('../public/audio/voice/', import.meta.url)
const manifestPath = new URL('../src/data/voiceManifest.ts', import.meta.url)
const uvx = process.env.UVX_BIN ?? 'uvx'

await mkdir(outputDirectory, { recursive: true })

function filenameFor(text) {
  return `${createHash('sha1').update(text).digest('hex').slice(0, 12)}.mp3`
}

async function exists(path) {
  try {
    return (await stat(path)).size > 0
  } catch {
    return false
  }
}

async function generate(text) {
  const filename = filenameFor(text)
  const target = new URL(filename, outputDirectory)
  if (await exists(target)) return

  process.stdout.write(`生成：${text}\n`)
  await execFileAsync(uvx, [
    '--from', 'edge-tts',
    'edge-tts',
    '--voice', 'zh-CN-XiaoxiaoNeural',
    '--rate=-3%',
    '--pitch=+4Hz',
    '--text', text,
    '--write-media', target.pathname
  ], { maxBuffer: 1024 * 1024 })
}

const concurrency = 4
for (let index = 0; index < lines.length; index += concurrency) {
  await Promise.all(lines.slice(index, index + concurrency).map(generate))
}

const manifest = Object.fromEntries(
  lines.map((text) => [text, `./audio/voice/${filenameFor(text)}`])
)

await writeFile(
  manifestPath,
  `// 此文件由 scripts/generate-voice.mjs 自动生成。\nexport const voiceManifest: Readonly<Record<string, string>> = ${JSON.stringify(manifest, null, 2)}\n`,
  'utf8'
)

process.stdout.write(`完成：${lines.length} 条儿童友好中文语音。\n`)
