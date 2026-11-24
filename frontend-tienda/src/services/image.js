export function imagePath(value = '') {
 const image = String(value ?? '').trim();
 if (!image) return '';
 if (/^(https?:\/\/|data:image\/|blob:|\/)/i.test(image)) return image;
 return '/' + image;
}
