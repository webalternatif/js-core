export default {
    invExtension: function(filename, allowedExtensions) {
        return "Le fichier " + filename + " ne possède pas une extension valide.\nExtensions valides : " + allowedExtensions;
    },
    invSize: function(filename, filesize, sizeLimit) {
        return "Le fichier " + filename + " de taille " + filesize + " excède la taille limite autorisée de " + sizeLimit;
    },
    emptyFile: function(filename) {
        return "Le fichier " + filename + " est vide";
    }
}

