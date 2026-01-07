export default {
  invExtension: function invExtension(filename, allowedExtensions) {
    return "The file " + filename + " is not an extension validation.\nValid extensions : " + allowedExtensions;
  },
  invSize: function invSize(filename, filesize, sizeLimit) {
    return "The file " + filename + " of " + filesize + " exceeds the size limit " + sizeLimit;
  },
  emptyFile: function emptyFile(filename) {
    return "The file " + filename + " is empty";
  }
};