var fs = require('fs'),
  _path = require('path'),
  underscore = require('underscore');
/*
* Utility functions that can be used everywhere
* */
global['_'] = underscore;

/*
* This will generate a random key based on the given length. If unspecified, defaults to 32.
* */
global.UniqueId = function UniqueId(len) {
  var _p = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890",
    r = "",
    strLen = _p.length,
    length = typeof len == "number" ? len : 16;
  if(length <=0) length = 32;
  for(var i=0; i< length; i++) {
    r += _p.charAt(Math.floor(Math.random() * strLen));
  }
  return r;
};

/*
 * Recursively reads inside a given folder path and returns an array with files that have the specified extension.
 * Arguments:
 * <path> - the full path to the directory.
 * <extension> - the file extension we wish to read.
 * */
global.ReadDirectory = function ReadDirectory(path, extension, str) {
  if(typeof str != 'object' || !(str instanceof Array)) {
    var str = [];
  }
  var checkExtension = (typeof extension == 'undefined' ? false : true);
  var dirs = fs.readdirSync(path);
  var files = [];
  for(var i in dirs) {
    var item = dirs[i];
    if(checkExtension && item.indexOf("." + extension) == -1) { // we have dir
      var subPath = _path.join(path, item);
      try {
        str = global.ReadDirectory(subPath, extension, str);
      } catch(e) {} // not a dir.
    } else {
      var file = item.replace("." + extension,"");
      files.push(_path.join(path, item));
    }
  }
  for(var f = 0; f< files.length; f++) {
    str.push(files[f]);
  }
  return str;
};