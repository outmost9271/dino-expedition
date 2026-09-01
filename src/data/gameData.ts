import type { Chapter, Mission } from '../types/game'

export const missions: Mission[] = [
  {
    id: 'yn-01', chapterId: 'yunnan', number: 1, title: '背包装好了', shortTitle: '准备装备',
    kind: 'equipment', level: 1, icon: '🎒',
    description: '听清楚考察任务，把需要的东西装进背包。',
    instruction: '请按任务卡，选出正确的考察装备。',
    discovery: '出发前先做计划，考察会更顺利。'
  },
  {
    id: 'yn-02', chapterId: 'yunnan', number: 2, title: '营地补给员', shortTitle: '清点补给',
    kind: 'supply', level: 1, icon: '🥤',
    description: '给考察队准备刚刚好的水和食物。',
    instruction: '看清数量，再把正确的补给装上车。',
    discovery: '一个一个地点数，就不会漏掉。'
  },
  {
    id: 'yn-03', chapterId: 'yunnan', number: 3, title: '蛋壳上的密码', shortTitle: '发现规律',
    kind: 'pattern', level: 1, icon: '🥚',
    description: '蛋壳花纹藏着规律，你能找到下一枚吗？',
    instruction: '观察颜色和图案，补上问号的位置。',
    discovery: '重复出现的顺序，就是一种规律。'
  },
  {
    id: 'yn-04', chapterId: 'yunnan', number: 4, title: '第一块化石', shortTitle: '修复化石',
    kind: 'fossil', level: 1, icon: '🦴',
    description: '把散落的化石放回正确的位置。',
    instruction: '先选一块化石，再点它应该回去的位置。',
    discovery: '古生物学家会仔细记录每块化石的位置。'
  },
  {
    id: 'yn-05', chapterId: 'yunnan', number: 5, title: '脚印通向哪里', shortTitle: '规划路线',
    kind: 'route', level: 1, icon: '🐾',
    description: '排列方向指令，带小恐龙走到营地。',
    instruction: '先想好整条路线，再按出发。',
    discovery: '先计划再行动，可以少走弯路。'
  },
  {
    id: 'yn-06', chapterId: 'yunnan', number: 6, title: '小小记录员', shortTitle: '读取记录',
    kind: 'record', level: 1, icon: '📋',
    description: '读懂考察图表，完成今天的记录。',
    instruction: '数一数图表里的发现，再选择答案。',
    discovery: '图表能把许多发现整理得清清楚楚。'
  },
  {
    id: 'sc-01', chapterId: 'sichuan', number: 7, title: '新的考察清单', shortTitle: '记住清单',
    kind: 'equipment', level: 2, icon: '🧭',
    description: '这次要记住更多装备，别被多余物品干扰。',
    instruction: '听清三件装备的名字，把它们找出来。',
    discovery: '把任务分成小步骤，会更容易记住。'
  },
  {
    id: 'sc-02', chapterId: 'sichuan', number: 8, title: '补给车来了', shortTitle: '合并数量',
    kind: 'supply', level: 2, icon: '🚚',
    description: '两批补给合在一起，一共有多少？',
    instruction: '看一看原来有多少，又送来了多少。',
    discovery: '把两部分合起来，可以知道一共有多少。'
  },
  {
    id: 'sc-03', chapterId: 'sichuan', number: 9, title: '岩层的节奏', shortTitle: '复杂规律',
    kind: 'pattern', level: 2, icon: '🪨',
    description: '颜色和形状轮流出现，找出藏起来的一项。',
    instruction: '从头读一遍规律，再选择答案。',
    discovery: '同一组规律，可以用颜色、形状或动作表示。'
  },
  {
    id: 'sc-04', chapterId: 'sichuan', number: 10, title: '转一转再拼好', shortTitle: '旋转化石',
    kind: 'fossil', level: 2, icon: '🔄',
    description: '有些化石转了方向，转正后才能归位。',
    instruction: '选中化石，转到合适方向，再放进轮廓。',
    discovery: '在脑海里转动物体，是很重要的空间能力。'
  },
  {
    id: 'sc-05', chapterId: 'sichuan', number: 11, title: '绕开落石', shortTitle: '避障路线',
    kind: 'route', level: 2, icon: '⛰️',
    description: '路上出现了落石，要换一条安全路线。',
    instruction: '观察石头的位置，设计一条不会碰到它的路。',
    discovery: '遇到障碍时，换一种办法也能到达目标。'
  },
  {
    id: 'sc-06', chapterId: 'sichuan', number: 12, title: '谁发现得最多', shortTitle: '比较记录',
    kind: 'record', level: 2, icon: '📊',
    description: '比较三种发现，找出最多、最少和相同。',
    instruction: '先看每一行有几个，再进行比较。',
    discovery: '比较之前先用同一种方法数清楚。'
  },
  {
    id: 'ln-01', chapterId: 'liaoning', number: 13, title: '队长的四件装备', shortTitle: '按序准备',
    kind: 'equipment', level: 3, icon: '🧤',
    description: '记住四件物品，并按听到的顺序装好。',
    instruction: '顺序也很重要，装好后再仔细检查。',
    discovery: '用图画在心里排一遍，能帮助我们记忆。'
  },
  {
    id: 'ln-02', chapterId: 'liaoning', number: 14, title: '用掉了几份', shortTitle: '数量变化',
    kind: 'supply', level: 3, icon: '🥪',
    description: '考察队用掉一些补给，还剩下多少？',
    instruction: '先看原来的总数，再拿走已经用掉的部分。',
    discovery: '从总数中拿走一部分，就能知道还剩多少。'
  },
  {
    id: 'ln-03', chapterId: 'liaoning', number: 15, title: '羽毛印迹密码', shortTitle: '推理规律',
    kind: 'pattern', level: 3, icon: '🪶',
    description: '更长的规律出现了，耐心观察每一组。',
    instruction: '注意一组里可能有三个不同的图案。',
    discovery: '复杂规律也可以拆成一小组一小组来观察。'
  },
  {
    id: 'ln-04', chapterId: 'liaoning', number: 16, title: '完整的骨架', shortTitle: '骨架复原',
    kind: 'fossil', level: 3, icon: '🦕',
    description: '修复更多化石，让完整骨架重新出现。',
    instruction: '比较细节、调整方向，再把每块化石归位。',
    discovery: '仔细比较形状的边缘，常常能找到线索。'
  },
  {
    id: 'ln-05', chapterId: 'liaoning', number: 17, title: '穿过远古森林', shortTitle: '长线规划',
    kind: 'route', level: 3, icon: '🌲',
    description: '路线更长了，先在心里走一遍再出发。',
    instruction: '避开岩石，用方向指令走到观察站。',
    discovery: '长任务可以分成几段，完成起来更容易。'
  },
  {
    id: 'ln-06', chapterId: 'liaoning', number: 18, title: '考察报告完成', shortTitle: '综合图表',
    kind: 'record', level: 3, icon: '🏅',
    description: '读懂最后一份图表，完成考察报告。',
    instruction: '根据图表进行合并或比较，再选择答案。',
    discovery: '会观察、会记录、会思考，就是优秀的小小考察员。'
  }
]

export const chapters: Chapter[] = [
  {
    id: 'yunnan', number: 1, eyebrow: '第一站', title: '禄丰化石谷',
    subtitle: '从清点装备开始，认识数量与简单规律。', location: '云南 · 红土山谷',
    color: '#dc6d4f', paleColor: '#fff0e8', illustration: 'mountain',
    missionIds: missions.filter((mission) => mission.chapterId === 'yunnan').map((mission) => mission.id)
  },
  {
    id: 'sichuan', number: 2, eyebrow: '第二站', title: '自贡岩层营地',
    subtitle: '合并数量、旋转化石，还要绕开落石。', location: '四川 · 河谷岩层',
    color: '#3a8272', paleColor: '#e9f6ef', illustration: 'river',
    missionIds: missions.filter((mission) => mission.chapterId === 'sichuan').map((mission) => mission.id)
  },
  {
    id: 'liaoning', number: 3, eyebrow: '第三站', title: '辽西远古森林',
    subtitle: '完成更长的计划，读懂完整考察报告。', location: '辽宁 · 湖泊森林',
    color: '#526fa7', paleColor: '#edf2ff', illustration: 'forest',
    missionIds: missions.filter((mission) => mission.chapterId === 'liaoning').map((mission) => mission.id)
  }
]

export const missionById = Object.fromEntries(
  missions.map((mission) => [mission.id, mission])
) as Record<string, Mission>

export const chapterById = Object.fromEntries(
  chapters.map((chapter) => [chapter.id, chapter])
) as Record<string, Chapter>
