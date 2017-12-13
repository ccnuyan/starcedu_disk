import files from './filesActions';
import qiniuFineUploader from './qiniuFineUploader';
import asyncStatus from './asyncStatusActions';

export default {
  files: {
    ...files,
    ...qiniuFineUploader,
  },
  asyncStatus,
};
