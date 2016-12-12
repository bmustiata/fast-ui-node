var fs = require("fs"),
    onceMany = require("once-many").onceMany;

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

    if (!isFileExisting(targetFile) || isFileOlder(targetFile, inputFolder, fileNames)) {
        for (i = 0; i < fileNames.length; i++) {
            fileName = fileNames[i];
            fileContent = readFileContent(inputFolder + "/" + fileName);
            filePack[fileName] = fileContent;
        }

        writeAsJson(targetFile, varName, filePack);
    } else {
        console.log("FastUi: Nothing changed, doing nothing.");
    }
};

var isFileExisting = function(file) {
    return fs.existsSync(file);
};

/**
 *
 * @param { string } file
 * @param { string } inputFolder
 * @param { string[] } potentiallyNewerFiles
 */
var isFileOlder = function(file, inputFolder, potentiallyNewerFiles) {
    var i, fileTimeStamp;

    fileTimeStamp = getFileTimestamp(file);

    for (i = 0; i < potentiallyNewerFiles.length; i++) {
        if (fileTimeStamp < getFileTimestamp( inputFolder + "/" + potentiallyNewerFiles[i] ) ) {
            return true;
        }
    }

    return false;
};

var getFileTimestamp = function(file) {
    return fs.statSync(file).mtime;
};

/**
 * Writes an object as var={..} statement. All values will be converted to string..
 * @param targetFile
 * @param varName
 * @param obj
 */
var writeAsJson = function(targetFile, varName, obj) {
    var comma = onceMany("", ","),
        key,
        fileContent = "var " + varName + " = {";

    for (key in obj) {
        console.log("FastUi: Found resource: `" + key + "`, added to `" + varName + "`package.");
        fileContent += comma.next() + "'" + escapeSingleQuote(key) + "':'" + escapeSingleQuote("" + obj[key]) + "'";
    }

    fileContent += "};\n";

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
