import Ajv, { type ValidateFunction } from 'ajv';
import fastJson from 'fast-json-stringify';
import type { HostProtocolMessage, HostProtocolMessageType } from './protocol';

export type JsonSchema = any;

export type HostProtocolControlKey = `${string}.${string}`;

export interface HostProtocolSchemas {
  configValue?: Record<string, JsonSchema>;
  controlArgs?: Record<HostProtocolControlKey, JsonSchema>;
  controlResult?: Record<HostProtocolControlKey, JsonSchema>;
  rpcParams?: Record<string, JsonSchema>;
  rpcResult?: Record<string, JsonSchema>;
  message?: Partial<Record<HostProtocolMessageType, JsonSchema>>;
}

export interface HostProtocolCodecOptions {
  schemas?: HostProtocolSchemas;
  output?: 'object' | 'json';
  strict?: boolean;
  validate?: boolean;
}

export interface HostProtocolCodec {
  encode(message: HostProtocolMessage): unknown;
  decode(input: unknown): HostProtocolMessage | null;
  validate(message: HostProtocolMessage, direction: 'in' | 'out'): boolean;
}

export function createHostProtocolCodec(options?: HostProtocolCodecOptions): HostProtocolCodec {
  const output = options?.output ?? 'object';
  const strict = options?.strict ?? false;
  const validateEnabled = options?.validate ?? true;
  const schemas = options?.schemas;

  const ajv = new Ajv({
    allErrors: true,
    strict: false,
    allowUnionTypes: true,
  });

  const validatorCache = new Map<string, ValidateFunction>();
  const serializerCache = new Map<string, (value: any) => string>();

  const decode = (input: unknown): HostProtocolMessage | null => {
    if (input == null) return null;
    if (typeof input === 'string') {
      try {
        return JSON.parse(input) as HostProtocolMessage;
      } catch {
        return null;
      }
    }
    if (typeof input === 'object') return input as HostProtocolMessage;
    return null;
  };

  const validate = (message: HostProtocolMessage, direction: 'in' | 'out'): boolean => {
    if (!validateEnabled) return true;
    const key = `v:${direction}:${inferSchemaKey(message, schemas)}`;
    const validator = getValidator(key, message);
    return validator(message) as boolean;
  };

  const encode = (message: HostProtocolMessage): unknown => {
    if (!message?.type) return output === 'json' ? 'null' : message;
    validate(message, 'out');
    if (output === 'object') return message;
    const key = `s:${inferSchemaKey(message, schemas)}`;
    const serializer = getSerializer(key, message);
    return serializer(message);
  };

  const getValidator = (cacheKey: string, message: HostProtocolMessage): ValidateFunction => {
    const existing = validatorCache.get(cacheKey);
    if (existing) return existing;
    const schemaKey = inferSchemaKey(message, schemas);
    const schema = buildMessageSchema(message, schemas, strict);
    const compiled = ajv.compile(schema);
    validatorCache.set(`v:in:${schemaKey}`, compiled);
    validatorCache.set(`v:out:${schemaKey}`, compiled);
    return compiled;
  };

  const getSerializer = (cacheKey: string, message: HostProtocolMessage): ((value: any) => string) => {
    const existing = serializerCache.get(cacheKey);
    if (existing) return existing;
    const schema = buildMessageSchema(message, schemas, strict);
    const compiled = fastJson(schema);
    serializerCache.set(cacheKey, compiled);
    return compiled;
  };

  return { encode, decode, validate };
}

function inferSchemaKey(message: HostProtocolMessage, schemas: HostProtocolSchemas | undefined): string {
  const type = message.type;
  if (!schemas) return type;

  if (type === 'config.get' || type === 'config.set' || type === 'config.get.result' || type === 'config.set.result' || type === 'config.changed') {
    const path = (message as any)?.payload?.path;
    if (typeof path === 'string' && path && schemas.configValue?.[path]) return `${type}:${path}`;
    return type;
  }

  if (type === 'control.invoke' || type === 'control.result') {
    const capability = (message as any)?.payload?.capability;
    const method = (message as any)?.payload?.method;
    if (typeof capability === 'string' && capability && typeof method === 'string' && method) {
      const k = `${capability}.${method}`;
      if ((type === 'control.invoke' && schemas.controlArgs?.[k]) || (type === 'control.result' && schemas.controlResult?.[k])) return `${type}:${k}`;
    }
    return type;
  }

  if (type === 'rpc.request' || type === 'rpc.response') {
    const name = (message as any)?.payload?.name;
    if (typeof name === 'string' && name) {
      if ((type === 'rpc.request' && schemas.rpcParams?.[name]) || (type === 'rpc.response' && schemas.rpcResult?.[name])) return `${type}:${name}`;
    }
    return type;
  }

  return type;
}

function buildMessageSchema(message: HostProtocolMessage, schemas: HostProtocolSchemas | undefined, strict: boolean): any {
  const envelopeAdditional = strict ? false : true;
  const payloadAdditional = strict ? false : true;

  const base = {
    type: 'object',
    additionalProperties: envelopeAdditional,
    required: ['type', 'payload'],
    properties: {
      type: { const: message.type },
      ts: { type: 'number' },
      timestamp: { type: 'number' },
      tid: { anyOf: [{ type: 'string' }, { type: 'number' }] },
      sid: { anyOf: [{ type: 'string' }, { type: 'number' }] },
      from: { type: 'string' },
      to: { type: 'string' },
      payload: {},
    },
  } as any;

  const type = message.type;

  const override = schemas?.message?.[type];
  if (override) {
    base.properties.payload = override;
    return base;
  }

  base.properties.payload = defaultPayloadSchema(type, message, schemas, payloadAdditional);
  return base;
}

function defaultPayloadSchema(
  type: HostProtocolMessageType,
  message: HostProtocolMessage,
  schemas: HostProtocolSchemas | undefined,
  additionalProperties: boolean,
): any {
  if (type === 'register') {
    return {
      type: 'object',
      additionalProperties,
      required: ['id'],
      properties: {
        id: { type: 'string' },
        name: { type: 'string' },
        tree: {},
      },
    };
  }

  if (type === 'heartbeat') {
    return {
      type: 'object',
      additionalProperties,
      required: ['id'],
      properties: {
        id: { type: 'string' },
        status: { type: 'object', additionalProperties: true },
      },
    };
  }

  if (type === 'config.changed') {
    const path = (message as any)?.payload?.path;
    const valueSchema = typeof path === 'string' && path ? schemas?.configValue?.[path] : undefined;
    return {
      type: 'object',
      additionalProperties,
      required: ['value'],
      properties: {
        path: { type: 'string' },
        value: valueSchema ?? {},
      },
    };
  }

  if (type === 'config.get') {
    return {
      type: 'object',
      additionalProperties,
      properties: {
        path: { type: 'string' },
      },
    };
  }

  if (type === 'config.get.result') {
    const path = (message as any)?.payload?.path;
    const valueSchema = typeof path === 'string' && path ? schemas?.configValue?.[path] : undefined;
    return {
      type: 'object',
      additionalProperties,
      required: ['ok'],
      properties: {
        path: { type: 'string' },
        ok: { type: 'boolean' },
        value: valueSchema ?? {},
        error: { type: 'string' },
      },
    };
  }

  if (type === 'config.set') {
    const path = (message as any)?.payload?.path;
    const valueSchema = typeof path === 'string' && path ? schemas?.configValue?.[path] : undefined;
    return {
      type: 'object',
      additionalProperties,
      required: ['path'],
      properties: {
        path: { type: 'string' },
        value: valueSchema ?? {},
      },
    };
  }

  if (type === 'config.set.result') {
    return {
      type: 'object',
      additionalProperties,
      required: ['path', 'ok'],
      properties: {
        path: { type: 'string' },
        ok: { type: 'boolean' },
        error: { type: 'string' },
      },
    };
  }

  if (type === 'control.invoke') {
    const capability = (message as any)?.payload?.capability;
    const method = (message as any)?.payload?.method;
    const key =
      typeof capability === 'string' && capability && typeof method === 'string' && method ? (`${capability}.${method}` as const) : null;
    const argsSchema = key ? schemas?.controlArgs?.[key] : undefined;
    return {
      type: 'object',
      additionalProperties,
      required: ['capability', 'method', 'args'],
      properties: {
        capability: { type: 'string' },
        method: { type: 'string' },
        args: argsSchema ?? { type: 'array', items: {} },
      },
    };
  }

  if (type === 'control.result') {
    const capability = (message as any)?.payload?.capability;
    const method = (message as any)?.payload?.method;
    const key =
      typeof capability === 'string' && capability && typeof method === 'string' && method ? (`${capability}.${method}` as const) : null;
    const resultSchema = key ? schemas?.controlResult?.[key] : undefined;
    return {
      type: 'object',
      additionalProperties,
      required: ['capability', 'method', 'ok'],
      properties: {
        capability: { type: 'string' },
        method: { type: 'string' },
        ok: { type: 'boolean' },
        result: resultSchema ?? {},
        error: { type: 'string' },
      },
    };
  }

  if (type === 'relay') {
    return {
      type: 'object',
      additionalProperties,
      required: ['to', 'topic', 'payload'],
      properties: {
        to: { type: 'string' },
        topic: { type: 'string' },
        payload: {},
        from: { type: 'string' },
      },
    };
  }

  if (type === 'rpc.request') {
    const name = (message as any)?.payload?.name;
    const paramsSchema = typeof name === 'string' && name ? schemas?.rpcParams?.[name] : undefined;
    return {
      type: 'object',
      additionalProperties,
      required: ['name'],
      properties: {
        name: { type: 'string' },
        params: paramsSchema ?? {},
      },
    };
  }

  if (type === 'rpc.response') {
    const name = (message as any)?.payload?.name;
    const resultSchema = typeof name === 'string' && name ? schemas?.rpcResult?.[name] : undefined;
    return {
      type: 'object',
      additionalProperties,
      required: ['name', 'ok'],
      properties: {
        name: { type: 'string' },
        ok: { type: 'boolean' },
        result: resultSchema ?? {},
        error: { type: 'string' },
      },
    };
  }

  return { type: 'object', additionalProperties: true };
}

