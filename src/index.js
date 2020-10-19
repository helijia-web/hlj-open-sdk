import hljurl, { go } from '@hlj/hljurl';
import ajax from '@hlj/ajax';
import Login from '@hlj/widget/Login';
import track from '@hlj/track';
import Share from '@hlj/share';
import imgurl from '@hlj/imgurl';
import bridge from '@hlj/bridge';
import env, { isApp } from '@hlj/env';
import uploadImage from './uploadImage';

import '@hlj/widget/style/app.scss';

const trackAction = track.action.bind(track);
const trackPage = track.page.bind(track);

const setShare = shareInfo => {
  Share.props = shareInfo;
};

const isAuthError = code => Login.isAuthError(code);

const checkLogin = () => Login.check().then(() => true, () => false);
const login = (succ, opts) => Login.appLogin(succ, opts);

const getPlatform = () => {
  const o = env();
  return o && o.platform;
};

const doShare = () => {
  if (isApp()) {
    bridge.Share.doShare();
    return true;
  }
  console.log('not support');  // eslint-disable-line
  return false;
};


export {
  ajax,
  imgurl,
  trackAction,
  trackPage,
  hljurl,
  go,
  setShare,
  isAuthError,
  checkLogin,
  login,
  uploadImage,
  getPlatform,
  doShare
};

