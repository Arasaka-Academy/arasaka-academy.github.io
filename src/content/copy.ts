export type Locale = 'zh-CN' | 'en';

interface SiteCopy {
  title: string;
  description: string;
  skip: string;
  projects: string;
  inside: string;
  about: string;
  github: string;
  menu: string;
  language: string;
  heroEyebrow: string;
  heroTitle: string;
  heroLine1: string;
  heroLine2: string;
  heroDescription: string;
  explore: string;
  scroll: string;
  sceneLabel: string;
  sceneCaption: string;
  ecosystemEyebrow: string;
  ecosystemTitle: string;
  ecosystemDescription: string;
  repository: string;
  documentation: string;
  insideEyebrow: string;
  insideTitle: string;
  insideDescription: string;
  softwareLabel: string;
  softwareTitle: string;
  softwareDescription: string;
  softwareCaption: string;
  hardwareLabel: string;
  hardwareTitle: string;
  hardwareDescription: string;
  hardwareCaption: string;
  aboutEyebrow: string;
  aboutTitle: string;
  principles: readonly { number: string; title: string; description: string }[];
  joinEyebrow: string;
  joinTitle: string;
  joinDescription: string;
  joinAction: string;
  footer: string;
  top: string;
}

export const copy: Record<Locale, SiteCopy> = {
  'zh-CN': {
    title: 'Arasaka Academy — 构建属于你的赛博世界',
    description: '探索 Arasaka Academy 的 Cyber 生态：从个人 AI 操作系统，到开放硬件、边缘视觉、本地语音与统一设计语言。',
    skip: '跳转到主要内容', projects: '项目生态', inside: '深入现场', about: '关于我们', github: '前往 GITHUB', menu: '导航菜单', language: 'Switch to English',
    heroEyebrow: '独立构建。自由连接。',
    heroTitle: '构建属于你的赛博世界。', heroLine1: '构建属于你的', heroLine2: '赛博世界。',
    heroDescription: '让软件拥有身体，让硬件拥有智能。\n从一行代码，到一个真实运转的世界。',
    explore: '探索项目生态', scroll: '向下探索', sceneLabel: '生态装置 / 设计示意', sceneCaption: '软件 × 硬件 × 人的想象力',
    ecosystemEyebrow: 'THE ECOSYSTEM / 项目生态', ecosystemTitle: '不同形态。\n同一个赛博世界。',
    ecosystemDescription: '系统是起点，不是边界。让数据、感知、声音与控制，在你自己的设备上相遇。',
    repository: '查看源码', documentation: '探索项目',
    insideEyebrow: 'BEYOND THE INTERFACE / 深入现场', insideTitle: '不止于屏幕之内。',
    insideDescription: '可以阅读的源码。可以拆解的结构。把想象，变成可探索的真实细节。',
    softwareLabel: '01 / SOFTWARE', softwareTitle: '你的数据。你的工作空间。',
    softwareDescription: 'CyberOS 把文件、媒体、AI 工作流与主机管理放进同一个本地优先的工作空间。',
    softwareCaption: 'CyberOS 真实界面 · 仅使用演示数据',
    hardwareLabel: '02 / HARDWARE', hardwareTitle: '从设计文件，到每一个零件。',
    hardwareDescription: '进入 CyberMachine 的数字结构，探索五盘位 NAS 的设计、零件与装配关系。',
    hardwareCaption: 'CyberMachine R2 数字装配示意 · 非实物制造验收',
    aboutEyebrow: 'THE WAY WE BUILD / 构建理念', aboutTitle: '技术应该成为你的延伸。\n而不是你的边界。',
    principles: [
      { number: '01', title: '自己掌握', description: '从本地数据到自己的设备，我们关心技术与使用者之间的主动权。' },
      { number: '02', title: '连接现实', description: '不让软件停在屏幕里。让计算、感知和控制，成为现实世界的一部分。' },
      { number: '03', title: '持续构建', description: '分享过程，保留好奇。每一个项目，都是下一次探索的起点。' },
    ],
    joinEyebrow: 'THE NEXT CHAPTER / 下一章', joinTitle: '下一个可能，\n由你构建。',
    joinDescription: '阅读源码、讨论想法、一起动手。\n这个世界，还有很多值得创造的东西。', joinAction: '在 GITHUB 上找到我们',
    footer: '独立构建的技术共同体。', top: '返回顶部',
  },
  en: {
    title: 'Arasaka Academy — Build Your Own Cyber World',
    description: 'Explore the Arasaka Academy Cyber ecosystem: personal AI systems, open hardware, edge vision, local audio, and a shared design language.',
    skip: 'Skip to main content', projects: 'Ecosystem', inside: 'Inside the work', about: 'Our approach', github: 'EXPLORE GITHUB', menu: 'Navigation menu', language: '切换到中文',
    heroEyebrow: 'INDEPENDENT MINDS. CONNECTED MACHINES.',
    heroTitle: 'BUILD YOUR OWN CYBER WORLD.', heroLine1: 'BUILD YOUR OWN', heroLine2: 'CYBER WORLD.',
    heroDescription: 'Give software a body. Give hardware intelligence.\nFrom a line of code to a world of your own.',
    explore: 'EXPLORE THE ECOSYSTEM', scroll: 'SCROLL TO DISCOVER', sceneLabel: 'ECOSYSTEM OBJECT / CONCEPT', sceneCaption: 'SOFTWARE × HARDWARE × HUMAN IMAGINATION',
    ecosystemEyebrow: 'THE ECOSYSTEM', ecosystemTitle: 'DIFFERENT FORMS.\nONE CYBER WORLD.',
    ecosystemDescription: 'A system is a beginning, not a boundary. Bring data, perception, voice, and control together on your own devices.',
    repository: 'SOURCE CODE', documentation: 'EXPLORE PROJECT',
    insideEyebrow: 'BEYOND THE INTERFACE', insideTitle: 'NOT JUST ON A SCREEN.',
    insideDescription: 'Source you can read. Structures you can take apart. Turn an idea into something you can explore.',
    softwareLabel: '01 / SOFTWARE', softwareTitle: 'YOUR DATA. YOUR WORKSPACE.',
    softwareDescription: 'CyberOS brings files, media, AI workflows, and host management into one local-first workspace.',
    softwareCaption: 'Actual CyberOS interface · demonstration data only',
    hardwareLabel: '02 / HARDWARE', hardwareTitle: 'FROM A DESIGN TO EVERY DETAIL.',
    hardwareDescription: 'Step inside CyberMachine: explore the design, parts, and assembly of a five-bay NAS.',
    hardwareCaption: 'CyberMachine R2 digital assembly · not physical manufacturing validation',
    aboutEyebrow: 'THE WAY WE BUILD', aboutTitle: 'TECHNOLOGY SHOULD EXTEND YOU.\nNOT DEFINE YOUR LIMITS.',
    principles: [
      { number: '01', title: 'OWN YOUR WORLD', description: 'From local data to personal devices, we care about keeping the human on the other side in control.' },
      { number: '02', title: 'CONNECT TO REALITY', description: 'Software should reach beyond the screen. Bring computing, perception, and control into the physical world.' },
      { number: '03', title: 'KEEP BUILDING', description: 'Share the process. Stay curious. Every project is a starting point for the next exploration.' },
    ],
    joinEyebrow: 'THE NEXT CHAPTER', joinTitle: 'THE NEXT POSSIBILITY.\nBUILT BY YOU.',
    joinDescription: 'Read the source. Start a conversation. Build with us.\nThere is still so much worth creating.', joinAction: 'FIND US ON GITHUB',
    footer: 'An independent technology collective.', top: 'BACK TO TOP',
  },
};

export function getLanguageHref(locale: Locale, hash = '') {
  const allowed = ['#top', '#projects', '#inside', '#about', '#join'];
  const section = allowed.includes(hash) ? hash : '';
  return `${locale === 'en' ? '/en/' : '/'}${section}`;
}
