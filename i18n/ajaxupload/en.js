export default {
    invExtension: function(filename, allowedExtensions) {
        return "The file " + filename + " is not an extension validation.\nValid extensions : " + allowedExtensions;
    },
    invSize: function(filename, filesize, sizeLimit) {
        return "The file " + filename + " of " + filesize + " exceeds the size limit " + sizeLimit;
    },
    emptyFile: function(filename) {
        return "The file " + filename + " is empty";
    }
}

