import type { Locale } from './copy';

export interface ProjectContent {
  category: string;
  title: string;
  description: string;
  capabilities: readonly string[];
  imageAlt: string;
}

export interface Project {
  id: string;
  name: string;
  number: string;
  repository: string;
  website?: string;
  image: string;
  featured?: boolean;
  content: Record<Locale, ProjectContent>;
}

export const projects: readonly Project[] = [
  {
    id: 'cyberos', name: 'CyberOS', number: '01', featured: true,
    repository: 'https://github.com/Arasaka-Academy/CyberOS', image: '/images/cyberos.webp',
    content: {
      'zh-CN': { category: 'PERSONAL AI SYSTEM', title: '你的数字世界，从这里开始。', description: '把个人文件、媒体、AI 工作流与主机管理，连接成一个本地优先的工作空间。', capabilities: ['本地优先', 'AI 工作流', '文件与媒体'], imageAlt: 'CyberOS 文件工作空间的真实界面，内容全部为公开演示数据' },
      en: { category: 'PERSONAL AI SYSTEM', title: 'A home for your digital world.', description: 'A local-first workspace connecting personal files, media, AI workflows, and host management.', capabilities: ['LOCAL-FIRST', 'AI WORKFLOWS', 'FILES & MEDIA'], imageAlt: 'Actual CyberOS file workspace showing only curated public demonstration data' },
    },
  },
  {
    id: 'cybermachine', name: 'CyberMachine', number: '02', featured: true,
    repository: 'https://github.com/Arasaka-Academy/CyberMachine', website: 'https://arasaka-academy.github.io/CyberMachine/', image: '/images/cybermachine.webp',
    content: {
      'zh-CN': { category: 'HARDWARE / FIVE-BAY NAS', title: '给数字世界，一个实体。', description: '从可编辑 CAD 到数字装配，探索围绕 Radxa Taco 与 CM5 的五盘位 NAS 设计。', capabilities: ['开放设计', '五盘位结构', '数字装配'], imageAlt: 'CyberMachine R2 五盘位 NAS 的数字爆炸结构图，非实物产品照片' },
      en: { category: 'HARDWARE / FIVE-BAY NAS', title: 'A physical home for your world.', description: 'Explore a five-bay NAS built around Radxa Taco and CM5, from editable CAD to digital assembly.', capabilities: ['OPEN DESIGN', 'FIVE BAYS', 'DIGITAL ASSEMBLY'], imageAlt: 'Digital exploded assembly of the CyberMachine R2 five-bay NAS, not a physical product photograph' },
    },
  },
  {
    id: 'cybervisual', name: 'CyberVisual', number: '03',
    repository: 'https://github.com/Arasaka-Academy/CyberVisual', website: 'https://arasaka-academy.github.io/CyberVisual/figure/', image: '/images/cybervisual.svg',
    content: {
      'zh-CN': { category: 'EDGE VISION', title: '让设备，看见世界。', description: '在边缘设备上连接相机、目标检测与云台控制，让感知走向现实。', capabilities: ['边缘视觉', '相机与云台'], imageAlt: '表现相机镜头、取景框与目标检测的 CyberVisual 原创示意插画' },
      en: { category: 'EDGE VISION', title: 'Give your machines a view.', description: 'Connect cameras, object detection, and pan/tilt control at the edge of your world.', capabilities: ['EDGE VISION', 'CAMERA & PTZ'], imageAlt: 'Original CyberVisual illustration showing a camera lens and object detection viewfinder' },
    },
  },
  {
    id: 'cybercontroller', name: 'CyberController', number: '04',
    repository: 'https://github.com/Arasaka-Academy/CyberController', image: '/images/cybercontroller.svg',
    content: {
      'zh-CN': { category: 'PHYSICAL INTERACTION', title: '把交互，握在手里。', description: '基于 StickS3 的设备端控制器，用按键、屏幕与 BLE 语音连接 CyberOS。', capabilities: ['StickS3', 'BLE 语音交互'], imageAlt: 'CyberController StickS3 的原创设备示意，展示屏幕、按键和语音波形' },
      en: { category: 'PHYSICAL INTERACTION', title: 'Put interaction in your hands.', description: 'A StickS3 device controller connecting buttons, a display, and BLE voice interaction to CyberOS.', capabilities: ['StickS3', 'BLE VOICE'], imageAlt: 'Original CyberController StickS3 device illustration with a screen, buttons, and voice waveform' },
    },
  },
  {
    id: 'cyberaudio', name: 'CyberAudio', number: '05',
    repository: 'https://github.com/Arasaka-Academy/CyberAudio', image: '/images/cyberaudio.svg',
    content: {
      'zh-CN': { category: 'LOCAL VOICE INTELLIGENCE', title: '让想法，拥有声音。', description: '面向 Apple Silicon 的本地语音识别与语音合成，让声音成为工作流的一部分。', capabilities: ['本地 ASR / TTS', '原生 macOS'], imageAlt: 'CyberAudio 原创音频波形插画，红色声波围绕语音核心展开' },
      en: { category: 'LOCAL VOICE INTELLIGENCE', title: 'Give your ideas a voice.', description: 'Local speech recognition and synthesis for Apple Silicon, bringing voice into your workflow.', capabilities: ['LOCAL ASR / TTS', 'NATIVE macOS'], imageAlt: 'Original CyberAudio waveform illustration with red audio signals around a voice core' },
    },
  },
  {
    id: 'cyberui', name: 'CyberUI', number: '06',
    repository: 'https://github.com/Arasaka-Academy/CyberUI', website: 'https://arasaka-academy.github.io/CyberUI/', image: '/images/cyberui.svg',
    content: {
      'zh-CN': { category: 'A SHARED DESIGN LANGUAGE', title: '同一种语言，不同种可能。', description: '切角、开放边框与终端节奏，把不同产品连接成一个有辨识度的视觉世界。', capabilities: ['React 组件', '终端设计语言'], imageAlt: 'CyberUI 原创设计语言示意，展示切角按钮、开放边框和红青信号配色' },
      en: { category: 'A SHARED DESIGN LANGUAGE', title: 'One language. Many possibilities.', description: 'Chamfered corners, open frames, and terminal rhythm give different products a recognizable identity.', capabilities: ['REACT COMPONENTS', 'TERMINAL AESTHETICS'], imageAlt: 'Original CyberUI design specimen showing chamfered buttons, open frames, and red/cyan signals' },
    },
  },
];

export function getProject(id: string): Project {
  const project = projects.find((candidate) => candidate.id === id);
  if (!project) throw new Error(`Unknown project: ${id}`);
  return project;
}
