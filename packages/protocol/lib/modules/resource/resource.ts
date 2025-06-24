export interface Resource {
  type: string;
  name: string;
  /**
   * 是否启用
   */
  enabled?: boolean;
}
export const ResourceSchema = {
  type: 'object',
  properties: {
    type: {
      type: 'string',
    },
    name: {
      type: 'string',
    },
    enabled: {
      type: 'boolean',
    },
  },
  required: ['type', 'name'],
};
