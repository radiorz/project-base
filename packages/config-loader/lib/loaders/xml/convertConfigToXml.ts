import { XMLBuilder, XmlBuilderOptions } from 'fast-xml-parser';
import { Config, convertFromConfig } from '../type';

export const convertConfigToXml: convertFromConfig = async function saveToXml(
  config: Config,
  options?: XmlBuilderOptions,
) {
  const builder = new XMLBuilder(options);
  const xml = builder.build(config);
  return xml;
};
