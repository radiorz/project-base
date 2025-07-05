// 获取模型路径
export function getModePath<Mode = string>(name: string, mode?: Mode, local: boolean = false) {
    return [name, mode, local ? 'local' : ''].filter(s => !!s).join('.')
}
// 常见模式
export const Mode = {
    development: 'development',
    test: 'test',
    production: 'production'
} as const;
// 模式等级
export enum ModeLevel {
    main = 0,
    mode = 1,
    local = 2
}
export const getMergePaths = (name: string, mode?: string) => {
    // 获取全部的路径然后config-loader只需要根据这三个路径去获取就行了
    return {
        main: name,
        mode: getModePath(name, mode, false),
        local: getModePath(name, mode, true)
    }
}