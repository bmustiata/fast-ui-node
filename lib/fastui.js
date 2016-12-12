var fs = require("fs");

/**
 * Package all the files from the input folder into a javascript object, serialized into the targetfile.
 * @param inputFolder
 * @param targetFile
 * @param varName
 */
var pack = function(inputFolder, targetFile, varName) {
    var fileNames,
        fileName,
        fileContent,
        i,
        filePack = {};

    varName = varName || "uiDefinition";

    fileNames = readFileNames(inputFolder);

    for (i = 0; i < fileNames.length; i++) {
        fileName = fileNames[i];
        fileContent = readFileContent(inputFolder + "/" + fileName);
        filePack[fileName] = fileContent;
    }

    writeAsJson(targetFile, varName, filePack);

    console.log("Updated:", targetFile);
};

/**
 * Writes an object as var={..} statement. All values will be converted to string..
 * @param targetFile
 * @param varName
 * @param obj
 */
var writeAsJson = function(targetFile, varName, obj) {
    var fileContent = "var " + varName + " = " + JSON.stringify(obj, null, 2) + ";";

    fs.writeFileSync(targetFile, fileContent, "utf-8");
};

/**
 * Read all the file names from the input folder.
 * @param inputFolder
 * @returns {*}
 */
var readFileNames = function(inputFolder) {
    // FIXME: filtering maybe for folders, or extensions?
    var result = fs.readdirSync(inputFolder);

    return result;
};

/**
 * Reads the content of the given file into a string.
 * @param fileName
 * @returns {*}
 */
var readFileContent = function(fileName) {
    return fs.readFileSync(fileName, "utf-8");
};

var escapeSingleQuote = function(str) {
    return str.replace(/\n/g, "\\n")
        .replace(/'/g, "\\'");
};


exports.pack = pack;
