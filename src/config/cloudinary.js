export const CLOUDINARY_CONFIG = {
  cloudName: 'drc8bufjn',
  uploadPreset: 'Portfolio',
  apiBase: `https://api.cloudinary.com/v1_1/drc8bufjn/image/upload`
};

export const uploadToCloudinary = async (file, onProgress = null) => {
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_CONFIG.uploadPreset);
    formData.append('cloud_name', CLOUDINARY_CONFIG.cloudName);

    const xhr = new XMLHttpRequest();

    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable && onProgress) {
        const progress = Math.round((e.loaded * 100) / e.total);
        onProgress(progress);
      }
    });

    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        const response = JSON.parse(xhr.responseText);
        resolve(response.secure_url);
      } else {
        reject(new Error('Upload failed'));
      }
    });

    xhr.addEventListener('error', () => {
      reject(new Error('Upload failed'));
    });

    xhr.open('POST', CLOUDINARY_CONFIG.apiBase);
    xhr.send(formData);
  });
};