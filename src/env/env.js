import qs          from 'query-string';
import getHost     from './getHost';
import loadScript  from '../loadScript';
import { Promise } from 'es6-promise';

const UA         = window.navigator.userAgent;
const REG_HLJ_UA = /hlj-(\w+)\/([\d\.]+)/i;


let __mock = {};

export function mock(data) {
  __mock = data;
}

function ua() {
  return __mock.userAgent || UA;
}

/* eslint camelcase: 0 */


function getPlatform() {
  if (isApp()) {
    return (ua().match(REG_HLJ_UA) || [])[1];
  }

  if (isWechat()) {
    return 'wx';
  }

  if (UNSAFE_isAliapp()) {
    return 'aliapp';
  }

  return 'wap';
}

function isWechat() {
  return (/micromessenger/i).test(ua());
}

function getSystem() {
  if (isAndroid()) {
    return 'android';
  }

  if (isIos()) {
    return 'ios';
  }

  return 'unkown';
}

function isAndroid() {
  return (/android/i).test(ua()) || (/hlj-android/i).test(ua());
}

function isIos() {
  return (/iphone|ipad|ipod|ios/i).test(ua()) || (/hlj-ios/i).test(ua());
}

function isWeapp() {
  const uaTest = (/miniProgram/i).test(ua());
  return __mock.weapp ||
    window.__wxjs_environment === 'miniprogram' ||
    (uaTest && !isAlipay());
}

function isAlipay() {
  return __mock.alipay || (/AlipayClient/i).test(ua());
}

/**
* @returns {promise}
*
* Usage:
* Example 1:
*
* ifAliapp().then(inAliapp => {
*   console.log(inAliapp ? 'in aliapp' : 'not in aliapp');
* });
*
* Example 2:
*
* const info = { isAliapp: await ifAliapp() }
 */
function ifAliapp() {
  if (__mock.aliapp) {
    return Promise.resolve(__mock.aliapp);
  }

  if (!isAlipay()) {
    return Promise.resolve(false);
  }

  return loadScript('https://appx/web-view.min.js').then(
    () => {
      return new Promise((resolve, reject) => {
        window.my.getEnv(res => {
          window.isAliapp = res.miniprogram;
          resolve(res.miniprogram);
        },
          () => reject(false)
        );
      });
    }
  ).catch(() => Promise.resolve(false));
}

/**
 * 检测是否处于支付宝小程序的环境中
 *
 * @returns {Boolean} 是/否
 *
 * 这个方法并不是特别可靠。使用时需要注意。
 * 1. 第一个判断依据是看 url 参数中是否有 hlj-aliapp, 如果有，则为 true
 *    依赖支付宝小程序中的注入，并且保证每个页面继续传递。
 * 2. 第二个判断依据是动态加载支付宝小程序 JSSDK，运行检测。这个过程是
 *    一个异步过程，存在延迟。在中间过程时可能存在检测不准确的情况。
 *
 * 如果需要很精准的判断，建议使用 `await ifAliapp()` 这个方法.
 */
function UNSAFE_isAliapp() {
  if (__mock.aliapp) {
    return __mock.aliapp;
  }

  if (getQuery('hlj-aliapp')) {
    return true;
  }

  return !!window.isAliapp;
}


// 淘宝系相关平台的环境检测，如：淘宝、天猫等。
// 使用方法：`await getTidaEnv()`, 返回值如下：
/*
{
  isETao: false,
  isTaoBaoLit: false,
  isTaobao: false,
  isTmall: false
}
*/
function getTidaEnv() {
  const jssdk = 'https://g.alicdn.com/tmapp/tida/3.3.51/tida.js?appkey=27804803';
  return loadScript(jssdk).then(
    () => Promise.resolve(window.Tida.appinfo)
  ).catch((e) => Promise.resolve({
    success: false,
    errorMsg: e
  }));
}


function env() {
  let deviceId;

  if ('HLJBindJavaScript' in window) {
    try {
      deviceId = window.HLJBindJavaScript.getDeviceInfo();
    } catch (e) {
      // ignore
    }
  }

  return {
    ua         : ua(),
    app        : isApp(),
    android    : isAndroid(),
    ios        : isIos(),
    iphonex    : isIphoneX(),
    iphonexs   : isIphoneXS(),
    platform   : getPlatform(),
    appVersion : getAppVersion(),
    id         : deviceId,
    system     : getSystem(),
    devPhrase  : getDevPhrase()
  };
}

function getDeviceInfo() {
  const info = env();
  if (isApp()) {
    return {
      y_order_id  : info.id,
      deviceModel : info.id,
      device_type : info.platform,
      platform    : info.platform,
      version     : info.appVersion
    };
  }

  return {
    deviceType : info.platform,
    platform   : info.platform,
    system     : info.system
  };
}

function isApp() {
  return !!REG_HLJ_UA.test(ua());
}

function getDevPhrase(host) {
  host = host || window.location.hostname;
  return tryGetDevPhraseFromSearch() ||
      tryGetDevPhraseFromMeta() ||
      tryGetDevPhraseFromHost(host);
}


/*
 * 可以在url中传递环境参数
 * 用于支持单页面多环境场景
 */
function tryGetDevPhraseFromSearch() {
  return getQuery('hlj-env') || null;
}

function getQuery(key) {
  const search = __mock.search || window.location.search;
  if (search) {
    const thisenv = qs.parse(search)[key];
    if (thisenv) {
      return thisenv;
    }
  }
  return null;
}

/*
 * 可以在页面上写 <meta name="hlj-env" content="test" />
 * 指定环境名称
 */
function tryGetDevPhraseFromMeta() {
  const dom = document.querySelector('meta[name=hlj-env]');
  if (dom && dom.content) {
    return dom.content;
  }
  return null;
}

function tryGetDevPhraseFromHost(host) {
  switch (host) {
    case 'www.stg.helijia.com':
    case 'www-stg.helijia.com':
      return 'test';

    case 'webpub.helijia.com':
      return 'staging';

    case 'dev-m.helijia.com':
    case 'dev-linli.helijia.com':
      return 'dev';

    default:
      // keep empty
  }

  if ((/\w+-ali\.helijia\.com$/).test(host)) {
    return 'aliyun';
  }

  if ((/^pre-.+\.helijia\.com$/).test(host)) {
    return 'staging';
  }

  if ((/^stg-.+\.helijia\.com$/).test(host)) {
    return 'test';
  }

  return 'production';
}


function getWebHost(opts = {}) {
  const TEST_HOST    = 'www.stg.helijia.com';
  const STAGING_HOST = 'webpub.helijia.com';
  const PROD_HOST    = 'www.helijia.com';
  const ALI_HOST     = 'www-ali.helijia.com';
  const schema       = opts.schema || 'https://';
  const devPhrase    = opts.devPhrase || getDevPhrase(opts.host);

  return {
    dev     : '/www',
    test    : schema + TEST_HOST,
    staging : schema + STAGING_HOST,
    aliyun  : schema + ALI_HOST
  }[devPhrase] || schema + PROD_HOST;
}

function getApiHost(opts = {}) {
  const TEST_HOST    = 'stg-app.helijia.com';
  const STAGING_HOST = 'apppub.helijia.com';
  const PROD_HOST    = 'app.helijia.com';
  const ALI_HOST     = 'app-ali.helijia.com';
  const schema       = opts.schema || 'https://';
  const devPhrase    = opts.devPhrase || getDevPhrase(opts.host);

  return {
    dev     : schema + TEST_HOST,
    test    : schema + TEST_HOST,
    staging : schema + STAGING_HOST,
    aliyun  : schema + ALI_HOST
  }[devPhrase] || schema + PROD_HOST;
}

function getMobileHost(opts = {}) {
  const devPhrase = opts.devPhrase || getDevPhrase(opts.pageHost);

  // 部分测试环境使用当前域名
  if (isMobileWebPage(opts.pageHost) && (devPhrase === 'test' || devPhrase === 'dev')) {
    return '';
  }

  const TEST_HOST    = 'stg-m.helijia.com';
  const STAGING_HOST = 'pre-m.helijia.com';
  const PROD_HOST    = 'm.helijia.com';
  const ALIYUN_HOST  = 'm-ali.helijia.com';
  const schema       = 'https://';

  const host = {
    dev     : '',
    test    : schema + TEST_HOST,
    staging : schema + STAGING_HOST,
    aliyun  : schema + ALIYUN_HOST
  }[devPhrase];

  return host === undefined ? schema + PROD_HOST : host;
}


function isMobileWebPage(host) {
  return (/\bm(\d*|-.+)\.helijia.com$/).test(host || window.location.hostname);
}


/**
 * 用于方便地获得调用接口的API Host
 *
 * @param {Object} opts  - Options
 * @return {String}      - api host
 */
function getMobileApiHost(opts) {
  return getServiceHost('m', opts);
}

function getServiceHost(service, opts = {}) {
  opts = {
    ...opts,
    devPhrase: opts.devPhrase || getDevPhrase(opts.pageHost)
  };
  return getHost(service, opts);
}


/**
 * 获取河狸家 app 版本号
 * @returns {String} app 版本号
 */
function getAppVersion() {
  return isApp() ? ((ua().match(REG_HLJ_UA) || [])[2] || null) : null;
}

function isIphoneX() {
  const height = __mock.screenHeight || screen.height;
  const width = __mock.screenWidth || screen.width;

  return (/iphone/gi).test(ua()) &&
    (height === 812 && width === 375);
}

function isIphoneXS() {
  const height = __mock.screenHeight || screen.height;
  const width = __mock.screenWidth || screen.width;

  return (/iphone/gi).test(ua()) &&
    (height === 896 && width === 414);
}

/**
 * 通过env获取魔方appName 使用场景：M站 乐高 活动页
 * @return {String} 魔方AppName
 * weapp | aliapp | h5 | iOS | android
 */
function getMagicAppName() {
  return (isIos() && isApp()) ? 'iOS'
    : (isAndroid() && isApp()) ? 'android'
    : isWeapp() ? 'weapp'
    : UNSAFE_isAliapp() ? 'aliapp'
    : 'h5';
}

ifAliapp();

export {
  env as default,
  isAndroid,
  isIos,
  isIphoneX,
  isIphoneXS,
  isWechat,
  isWeapp,
  isAlipay,
  ifAliapp,
  UNSAFE_isAliapp,
  getDeviceInfo,
  isApp,
  getDevPhrase,
  getWebHost,
  getApiHost,
  getMobileHost,
  isMobileWebPage,
  getMobileApiHost,
  getServiceHost,
  getTidaEnv,
  getMagicAppName
};
