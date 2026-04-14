/**
 * HostCapabilityTree 管理端可见的能力树节点.
 * 设计原因: 用稳定数据结构描述可调用面,让前端无需依赖运行时代码即可渲染控制面板.
 */
export interface HostCapabilityTree {
  /**
   * name 能力名称,用于调用路由.
   */
  name: string;
  /**
   * title 能力展示标题.
   */
  title?: string;
  /**
   * description 能力描述,用于前端展示与文档生成.
   */
  description?: string;
  /**
   * methods 方法列表.
   * 设计原因: 以树形结构暴露可调用面,让管理端可以动态渲染控制面板.
   */
  methods: Array<{
    /**
     * name 方法名称.
     */
    name: string;
    /**
     * title 方法展示标题.
     */
    title?: string;
    /**
     * description 方法描述.
     */
    description?: string;
  }>;
}

/**
 * HostHostTree 管理端可见的设备树描述.
 * 设计原因: 把设备能力与 schema 放在同一个对象中,便于一次注册广播完成发现与渲染.
 */
export interface HostHostTree {
  /**
   * id 设备或主机标识.
   */
  id: string;
  /**
   * name 设备或主机名称.
   */
  name?: string;
  /**
   * capabilities 能力树列表.
   */
  capabilities: HostCapabilityTree[];
  /**
   * configSchema 配置 schema,用于管理端生成配置表单.
   */
  configSchema?: Record<string, any>;
  /**
   * statusSchema 状态 schema,用于管理端生成状态视图.
   */
  statusSchema?: Record<string, any>;
}
