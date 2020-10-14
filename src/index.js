import hljurl, { go } from '@hlj/hljurl';
import ajax, { upload } from '@hlj/ajax';
import Login from '@hlj/widget/Login';
import track from '@hlj/track';
import Share from '@hlj/share';
import imgurl from '@hlj/imgurl';

const trackAction = track.action.bind(track);
const trackPage = track.page.bind(track);

const setShare = shareInfo => {
  Share.props = shareInfo;
}

const isAuthError = code => Login.isAuthError(code);

const checkLogin = () => Login.check().then(() => true, () => false);
const login = (succ, opts) => Login.appLogin(succ, opts);

const uploadImage = file => {
  const url = 'https://zelda.helijia.com/api/v1/file_upload';
  return upload(file, url)
    .then(res => {
      if (res.success && res.file) {
        const { path, url } = parseUrl(res.file.url);
        return { success: true, path, url };
      }
      return { success: false, errorMessage: res.apiMessage || '上传失败' };
    })
    .catch(res => {
      return { success: false, errorMessage: res.apiMessage || '上传失败' };
    });
}

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
  uploadImage
}


function parseUrl(url) {
  const prefix = 'https://img-ucdn-static.helijia.com/zmw'
  const path = url.replace(prefix, '');
  return { path, url };
}
