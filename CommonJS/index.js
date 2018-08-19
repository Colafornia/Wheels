var fs = require('fs');
var path = require('path');

function Module (id) {
  // Class
  this.id = id;
  this.exports = {};
}

var _cached = {};

function _getAbsolutePath(pathname) {
  if (path.isAbsolute(pathname)) {
    return pathname;
  } else if (pathname[0] === '.') {
    return path.resolve(__dirname, pathname);
  } else {
    return path.resolve('/node_modules', pathname);
  }
  return '';
}

function _getRealPath(pathname) {
  var extList = ['.js', '.json', '.node'];
  var statObj;
  try {
    statObj = fs.lstatSync(pathname);
  } catch (e) {}

  if (statObj) {
      if (statObj.isFile()) {
          return pathname;
      } else if (statObj.isDirectory()) {
          pathname = path.join(pathname, 'index');
      }
  }
  for (var i = 0; i < extList.length; i++) {
    var fullName = pathname + extList[i];
    try {
      fs.lstatSync(fullName);
      return fullName
    } catch (e) {
      // dosth
    };
  }
  throw new Error(`${pathname} not found`);
}

function _require(path) {
  var sourceCode = fs.readFileSync(path, 'utf8')
  var moduleExportsFunc = new Function('module', 'exports', `${sourceCode}; return module.exports;`)
  var module = new Module(path);
  // Self execting
  var res = moduleExportsFunc(module, module.exports)
  return res
}

function $require (pathname) {
  if (!pathname) {
    throw new Error(`file path or name is required`);
  }
  var modulePath = _getAbsolutePath(pathname);
  if (!modulePath) {
    throw new Error(`${pathname} not found`);
  }
  modulePath = _getRealPath(modulePath);
  if (_cached[modulePath]) {
    return _cached[modulePath];
  }
  _cached[modulePath] = _require(modulePath);
  return _cached[modulePath];
}

