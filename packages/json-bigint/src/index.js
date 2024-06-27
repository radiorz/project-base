// 不使用魔数的化，序列化后的大数就成为了字符串了
const MAGIC_STRING = 'voerka-json-bigint-2022'

function replacer(key, value) {
	if (typeof value === 'bigint') {
		return `${MAGIC_STRING}${value.toString()}${MAGIC_STRING}`
	}
	return value
}

function reviver(key, value) {
	if (value != null) {
		if (typeof value === 'string' && /^\d+$/.test(value) && Number(value) > Number.MAX_SAFE_INTEGER) {
			return BigInt(value)
		}

		if (typeof value === 'number' && value > Number.MAX_SAFE_INTEGER) {
			return BigInt(value)
		}
	}
	return value
}

/**
 * 兼容messager的代码
 *
 * @param {*} type 类型构造方法
 * @returns
 */
function getReviver(type) {
	return (key, value) => {
		if (value != null) {
			if (typeof value === 'string' && /^\d+$/.test(value) && Number(value) > Number.MAX_SAFE_INTEGER) {
				return type(BigInt(value))
			}

			if (typeof value === 'number' && value > Number.MAX_SAFE_INTEGER) {
				return type(BigInt(value))
			}
		}
		return value
	}
}

/**
 * JSON大数解析
 *
 * npm上json-bigint是node版本，自己简单实现下web端
 */
export default class JSONBigInt {
	static parse(str, type) {
		// 兼容性代码，messager希望把所有大数都当成字符串
		return JSON.parse(str, type ? getReviver(type) : reviver)
	}

	static stringify(obj) {
		let res = JSON.stringify(obj, replacer)

		if (MAGIC_STRING) {
			res = res.replaceAll(`\"${MAGIC_STRING}`, '').replaceAll(`${MAGIC_STRING}\"`, '')
		}

		return res
	}
}
