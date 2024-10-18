export interface ProjectInfo {
  getProjectName: () => string;
  getVersion?: () => string;
  getReleasedAt?: () => string;
  stringify: () => string;
  toJson: () => Record<string, any>;
  parse?: (str: string) => ProjectInfoParsed;
}

export interface ProjectInfoParsed {
  projectName?: string;
  version?: string;
  versionTag?: string;
  releasedAt?: string;
  environment?: string;
}
