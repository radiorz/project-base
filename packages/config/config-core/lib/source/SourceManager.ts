/**
 * @author
 * @file SourceManager.ts
 * @fileBase SourceManager
 * @path packages\config\config-core\lib\source\SourceManager.ts
 * @from 
 * @desc 
 * @example
 */

import { mergeOptions } from "@tikkhun/utils-core";
import { type Source } from "./source";
import { ConfigValue } from "../config.type";

export interface SourceManagerOptions {
    source: Source[]
}

export class SourceManager {
    static defaultOptions: SourceManagerOptions = Object.freeze({
        source: []
    })
    options: SourceManagerOptions
    constructor(public sources: Source[], options?: Partial<SourceManagerOptions>) {
        this.options = Object.assign({}, SourceManager.defaultOptions, options);
    }
    inited = false;
    // 初始化
    async init() {
        const results = Promise.all(
            this.sources
                .filter((source) => source.init)
                .map((source) => {
                    return source.init!();
                }),
        );
        this.inited = true;
        return results;
    }
    // 加载配置
    async load() {
        if (!this.inited) {
            throw new Error('请先初始化')
        }
        // 目前都是同步
        const results = await Promise.all(this.sources.map((source) => source.load()));
        // 合并各个数据
        const originConfig = mergeOptions(...results);
        return originConfig
    }
    async sync(path: string, data: any) {
        return Promise.all(this.sources.map((source) => source.save?.(path, data)))
    }
    addSource(source: Source) {
        if (this.sources.includes(source)) {
            return true
        }
        this.sources.push(source);
    }
    removeSource(source: Source) {
        this.sources = this.sources.filter((sourceItem) => sourceItem !== source)
    }
}