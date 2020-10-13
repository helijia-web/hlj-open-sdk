import hljurl, { go } from '@hlj/hljurl';
import ajax, { upload } from '@hlj/ajax';
import Login from '@hlj/widget/Login';
import track from '@hlj/track';
import Share from '@hlj/share';
import imgurl from '@hlj/imgurl';

const trackAction = track.action;
const trackPage = track.page;

const setShare = shareInfo => {
  Share.props = shareInfo;
}

const isAuthError = code => Login.isAuthError(code);

const checkLogin = () => Login.check().then(() => true, () => false);
const login = (succ, opts) => Login.appLogin(succ, opts);

const uploadImage = file => {
  const url = 'https://zelda.helijia.com/api/v1/file_upload';
  return upload(file, url).then(({data}) => 
    ({path: data}),
    ({apiMessage}) => ({errorMessage: apiMessage})
  )
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