import { upload } from '@hlj/ajax';


export default function uploadImage(file) {
  const uploadUrl = 'https://zelda.helijia.com/api/v1/file_upload';
  return upload(file, uploadUrl)
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


function parseUrl(url) {
  const prefix = 'https://img-ucdn-static.helijia.com/zmw';
  const path = url.replace(prefix, '');
  return { path, url };
}
