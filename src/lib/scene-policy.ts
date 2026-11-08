export interface SceneCapabilities {
  width: number;
  finePointer: boolean;
  reducedMotion: boolean;
  saveData: boolean;
  webgl: boolean;
}

export function canRenderScene(capabilities: SceneCapabilities): boolean {
  return capabilities.width >= 1024 && capabilities.finePointer && !capabilities.reducedMotion && !capabilities.saveData && capabilities.webgl;
}
