export function extractDefaultValuesFromJsonSchema(schema = {}, path = '') {
  if (!path) {
    return this.extractDefaultValues(schema);
  }
  const pathSegments = path.split('.');
  let currentSchema = schema;
  // 遍历路径段，逐级查找对应的 schema
  for (const segment of pathSegments) {
    if (currentSchema.properties && currentSchema.properties[segment]) {
      currentSchema = currentSchema.properties[segment];
    } else {
      return {};
    }
  }
  return this.extractDefaultValues(currentSchema);
}

export function extractDefaultValues(schema = {}) {
  if (schema.type !== 'object') {
    return schema.default;
  }
  const result = {};
  // 遍历 schema 的 properties
  if (schema.properties) {
    for (const key in schema.properties) {
      const property = schema.properties[key];
      if (property.default !== undefined) {
        result[key] = property.default;
      }
    }
  }

  // 如果有 nested schemas（嵌套的 schema），递归处理
  if (schema.type === 'object' && schema.properties) {
    for (const key in schema.properties) {
      const nestedSchema = schema.properties[key];
      if (nestedSchema.type === 'object' || nestedSchema.type === 'array') {
        result[key] = this.extractDefaultValues(nestedSchema);
      }
    }
  }
  return result;
}
