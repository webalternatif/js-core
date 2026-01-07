export default {
  invExtension: function invExtension(filename, allowedExtensions) {
    return "Le fichier " + filename + " ne possède pas une extension valide.\nExtensions valides : " + allowedExtensions;
  },
  invSize: function invSize(filename, filesize, sizeLimit) {
    return "Le fichier " + filename + " de taille " + filesize + " excède la taille limite autorisée de " + sizeLimit;
  },
  emptyFile: function emptyFile(filename) {
    return "Le fichier " + filename + " est vide";
  }
};