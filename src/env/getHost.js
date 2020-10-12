import { parse } from 'query-string';
import getDefaultServiceHost from './defaultServiceHost';

// 以下是 iOS App 中定义的服务端 host key
// 具体可以咨询 iOS 客户端同学
// 注: 这里没有考虑 Android 的情况
export const SERVICE_STORAGE_KEY = {
  user   : '9',
  search : '8',
  misc   : '13',
  guide  : '11',
  order  : '12',
  orderGateway: '23',
  group  : '14',
  mixed  : '15',
  m      : '99'
};

function getHost(service, opts = {}) {
  const devPhrase = opts.devPhrase || 'production';
  if (devPhrase === 'production') {
    return byDefault(service, opts);
  }

  return fromQuery(service, opts) ||
    fromStorage(service, opts) ||
    fromAppStorage(service, opts) ||
    byDefault(service, opts);
}

function fromQuery(service, opts) {
  const search = parse(opts.search || window.location.search);
  const host   = search[`service-host-${service}`];

  if (host) {
    return toOrigin(host, opts);
  }
}

function toOrigin(host, opts) {
  const schema = opts.schema || 'https://';
  return `${schema}${host}.helijia.com`;
}

function fromStorage(service, opts) {
  const key = `service-host-${service}`;
  const host = window.localStorage && window.localStorage.getItem(key);
  if (host) {
    return toOrigin(host, opts);
  }
}

function fromAppStorage(service) {
  const store = window.localStorage && window.localStorage.getItem('AppHostConfig');
  if (!store) {
    return null;
  }

  try {
    const config = JSON.parse(store)[SERVICE_STORAGE_KEY[service]];
    if (config) {
      return config
        .replace(/\\\//g, '/')
        .replace(/\/+$/, '');
    }
  } catch (e) {
    return null;
  }
}

function byDefault(service, opts) {
  const host = getDefaultServiceHost(service, opts.devPhrase, opts.pattern);

  if (host) {
    return toOrigin(
      host,
      opts
    );
  }
}

export default getHost;
