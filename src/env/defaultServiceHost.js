/**
 * 一般是这种规则:
 * - 开发环境: stg-xxx
 * - 测试环境: stg-xxx
 * - 预发环境: pre-xxx
 * - 正式环境: xxx
 *
 * @param {String} base : base name
 * @returns {Array} default host names in format of `[test, pre, production]`
 */
export const pattern = base => [`stg-${base}`, `pre-${base}`, base];

const DEFAULT = pattern('$');

const SPECIALS = {
  search: pattern('search-api'),

  guide: [
    'stg-guide-customer-api',
    'pre-guide-customer-api',
    'guide-customer-api'
  ],

  order: [
    'stg-order-customer-api',
    'pre-order-customer-api',
    'order-customer-api'
  ],

  misc: pattern('misc-customer-api'),
  mixed: pattern('mixed-customer-api')
};

const SPECIAL_HOSTS = {
  orderGateway: 'order'
};

/**
 * 根据服务名称和开发阶段，返回一个默认的主机名
 * 如:
 *
 * getDefaultServiceHost('m', 'staging')
 * //=> 'pre-m'
 *
 * @param {String} service - 服务名
 * @param {String} devPhrase - 开发阶段，必须为以下值之一:
 *  * dev
 *  * test
 *  * staging
 *  * production
 *  否则是 production
 *
 * @param {Array} customPattern - 模板, 值为 3 元数组，按顺序依次为:
 *    [开发环境/测试环境主机名, 预发环境主机名, 生产环境主机名]
 *  例如:
 *    ['stg5-foo', 'pre-foo', 'foo']
 *  可以用 '$' 代替 service 名称，以上 customPattern 也可以写成:
 *    ['stg5-$', 'pre-$', '$']
 *
 * @returns {String} 主机名
 */
export default (service, devPhrase, customPattern) => {
  const index = either(
    { dev: 0, test: 0, staging: 1, production: 2 }[devPhrase],
    2
  );

  const config = customPattern || SPECIALS[service] || DEFAULT;
  const host   = config[index];
  const serviceHost = SPECIAL_HOSTS[service] || service;
  return host && host.replace('$', serviceHost);
};

function either(x, y) {
  return typeof x === 'undefined' ? y : x;
}
