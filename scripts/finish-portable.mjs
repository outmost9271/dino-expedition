import { access, readdir, readFile, writeFile } from 'node:fs/promises'

const folder = new URL('../portable/', import.meta.url)
const indexPath = new URL('index.html', folder)

await access(indexPath)
const html = await readFile(indexPath, 'utf8')
const files = await readdir(folder)

if (!html.includes('<style') || !html.includes('<script type="module">')) {
  throw new Error('便携版的脚本或样式没有正确写入 index.html')
}

if (files.some((name) => name === 'assets')) {
  throw new Error('便携版仍包含外部脚本分块，无法保证双击运行')
}

await writeFile(
  new URL('使用说明.txt', folder),
  [
    '中华恐龙考察队·本地便携版',
    '',
    '使用方法：双击 index.html 即可开始游玩。',
    '推荐使用新版 Microsoft Edge 或 Google Chrome。',
    '',
    '移动方法：复制或移动 portable 整个文件夹。',
    '请不要只移动 index.html，audio 文件夹中保存着游戏旁白。',
    '',
    '本游戏无需安装、无需联网、无需账号，也不会上传个人信息。',
    '游戏进度保存在当前浏览器中。'
  ].join('\r\n'),
  'utf8'
)

process.stdout.write('便携版检查通过：可直接双击 portable/index.html 游玩。\n')
