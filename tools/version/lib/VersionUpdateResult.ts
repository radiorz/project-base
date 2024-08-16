export interface SuccessOptions {
  message: string;
  oldVersion?: string;
  newVersion: string;
}
export interface ErrorOptions {
  oldVersion: string;
  newVersion?: string;
  message: string;
}
export class VersionUpdateResult {
  static success(opts: SuccessOptions) {
    return { isSuccess: true, isError: false, ...opts };
  }
  static error(opts: ErrorOptions) {
    return { isSuccess: false, isError: true, ...opts };
  }
}
