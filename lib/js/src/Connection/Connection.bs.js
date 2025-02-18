// Generated by ReScript, PLEASE EDIT WITH CARE
'use strict';

var Js_exn = require("rescript/lib/js/js_exn.js");
var Caml_js_exceptions = require("rescript/lib/js/caml_js_exceptions.js");
var Util$AgdaModeVscode = require("../Util/Util.bs.js");
var Config$AgdaModeVscode = require("../Config.bs.js");
var Parser$AgdaModeVscode = require("../Parser/Parser.bs.js");
var Request$AgdaModeVscode = require("../Request.bs.js");
var Json_Encode$JsonCombinators = require("@glennsl/rescript-json-combinators/lib/js/src/Json_Encode.bs.js");
var Client__LSP$LanguageServerMule = require("language-server-mule/lib/js/src/Client/Client__LSP.bs.js");
var Connection__LSP$AgdaModeVscode = require("./LSP/Connection__LSP.bs.js");
var Connection__Emacs$AgdaModeVscode = require("./Emacs/Connection__Emacs.bs.js");
var Connection__Probe$AgdaModeVscode = require("./Connection__Probe.bs.js");

function getFromConfig() {
  var param = {
    commandLineOptions: Config$AgdaModeVscode.Connection.getCommandLineOptions()
  };
  return {
          commandLineOptions: Json_Encode$JsonCombinators.array(function (prim) {
                  return prim;
                })(param.commandLineOptions)
        };
}

var singleton = {
  contents: undefined
};

function toStatus(conn) {
  if (conn.TAG === "Emacs") {
    var match = Connection__Emacs$AgdaModeVscode.getInfo(conn._0);
    return {
            TAG: "Emacs",
            _0: match[0],
            _1: match[1],
            [Symbol.for("name")]: "Emacs"
          };
  }
  var conn$1 = conn._0;
  return {
          TAG: "LSP",
          _0: conn$1.version,
          _1: Client__LSP$LanguageServerMule.getMethod(conn$1.client),
          [Symbol.for("name")]: "LSP"
        };
}

async function start(globalStorageUri, useLSP, onDownload) {
  var conn = singleton.contents;
  if (conn !== undefined) {
    return {
            TAG: "Ok",
            _0: toStatus(conn),
            [Symbol.for("name")]: "Ok"
          };
  }
  if (useLSP) {
    var match = await Connection__Probe$AgdaModeVscode.probeLSP(globalStorageUri.toString(), onDownload);
    var result = match[0];
    if (result === undefined) {
      return {
              TAG: "Error",
              _0: {
                TAG: "CannotAcquireHandle",
                _0: "Agda Language Server",
                _1: match[1],
                [Symbol.for("name")]: "CannotAcquireHandle"
              },
              [Symbol.for("name")]: "Error"
            };
    }
    var error;
    try {
      error = await Client__LSP$LanguageServerMule.make("agda", "Agda Language Server", result, getFromConfig());
    }
    catch (raw_error){
      var error$1 = Caml_js_exceptions.internalToOCamlException(raw_error);
      if (error$1.RE_EXN_ID === Js_exn.$$Error) {
        return {
                TAG: "Error",
                _0: {
                  TAG: "LSP",
                  _0: {
                    TAG: "ConnectionError",
                    _0: error$1._1,
                    [Symbol.for("name")]: "ConnectionError"
                  },
                  [Symbol.for("name")]: "LSP"
                },
                [Symbol.for("name")]: "Error"
              };
      }
      throw error$1;
    }
    if (error.TAG !== "Ok") {
      return {
              TAG: "Error",
              _0: {
                TAG: "LSP",
                _0: {
                  TAG: "ConnectionError",
                  _0: error._0,
                  [Symbol.for("name")]: "ConnectionError"
                },
                [Symbol.for("name")]: "LSP"
              },
              [Symbol.for("name")]: "Error"
            };
    }
    var error$2 = await Connection__LSP$AgdaModeVscode.make(error._0);
    if (error$2.TAG !== "Ok") {
      return {
              TAG: "Error",
              _0: {
                TAG: "LSP",
                _0: error$2._0,
                [Symbol.for("name")]: "LSP"
              },
              [Symbol.for("name")]: "Error"
            };
    }
    var conn$1 = error$2._0;
    var method = Client__LSP$LanguageServerMule.getMethod(conn$1.client);
    singleton.contents = {
      TAG: "LSP",
      _0: conn$1,
      [Symbol.for("name")]: "LSP"
    };
    return {
            TAG: "Ok",
            _0: {
              TAG: "LSP",
              _0: conn$1.version,
              _1: method,
              [Symbol.for("name")]: "LSP"
            },
            [Symbol.for("name")]: "Ok"
          };
  }
  var match$1 = await Connection__Probe$AgdaModeVscode.probeEmacs();
  var result$1 = match$1[0];
  if (result$1 !== undefined) {
    var error$3 = await Connection__Emacs$AgdaModeVscode.make(result$1);
    if (error$3.TAG !== "Ok") {
      return {
              TAG: "Error",
              _0: {
                TAG: "Emacs",
                _0: error$3._0,
                [Symbol.for("name")]: "Emacs"
              },
              [Symbol.for("name")]: "Error"
            };
    }
    var conn$2 = error$3._0;
    singleton.contents = {
      TAG: "Emacs",
      _0: conn$2,
      [Symbol.for("name")]: "Emacs"
    };
    var match$2 = Connection__Emacs$AgdaModeVscode.getInfo(conn$2);
    return {
            TAG: "Ok",
            _0: {
              TAG: "Emacs",
              _0: match$2[0],
              _1: match$2[1],
              [Symbol.for("name")]: "Emacs"
            },
            [Symbol.for("name")]: "Ok"
          };
  }
  var name = Config$AgdaModeVscode.Connection.getAgdaVersion();
  return {
          TAG: "Error",
          _0: {
            TAG: "CannotAcquireHandle",
            _0: name,
            _1: match$1[1],
            [Symbol.for("name")]: "CannotAcquireHandle"
          },
          [Symbol.for("name")]: "Error"
        };
}

async function stop() {
  var match = singleton.contents;
  if (match === undefined) {
    return {
            TAG: "Ok",
            _0: undefined,
            [Symbol.for("name")]: "Ok"
          };
  }
  if (match.TAG === "Emacs") {
    singleton.contents = undefined;
    await Connection__Emacs$AgdaModeVscode.destroy(match._0);
    return {
            TAG: "Ok",
            _0: undefined,
            [Symbol.for("name")]: "Ok"
          };
  }
  singleton.contents = undefined;
  var error = await Connection__LSP$AgdaModeVscode.destroy(match._0);
  if (error.TAG === "Ok") {
    return {
            TAG: "Ok",
            _0: undefined,
            [Symbol.for("name")]: "Ok"
          };
  } else {
    return {
            TAG: "Error",
            _0: {
              TAG: "LSP",
              _0: error._0,
              [Symbol.for("name")]: "LSP"
            },
            [Symbol.for("name")]: "Error"
          };
  }
}

async function sendRequest(globalStorageUri, onDownload, useLSP, $$document, request, handler) {
  var encodeRequest = function ($$document, version) {
    var filepath = Parser$AgdaModeVscode.filepath($$document.fileName);
    var libraryPath = Config$AgdaModeVscode.getLibraryPath();
    var highlightingMethod = Config$AgdaModeVscode.Highlighting.getHighlightingMethod();
    var backend = Config$AgdaModeVscode.getBackend();
    return Request$AgdaModeVscode.encode($$document, version, filepath, backend, libraryPath, highlightingMethod, request);
  };
  var match = singleton.contents;
  if (match !== undefined) {
    if (match.TAG === "Emacs") {
      var conn = match._0;
      var match$1 = Connection__Emacs$AgdaModeVscode.getInfo(conn);
      var handler$1 = function (x) {
        return handler(Util$AgdaModeVscode.Result.mapError(x, (function (err) {
                          return {
                                  TAG: "Emacs",
                                  _0: err,
                                  [Symbol.for("name")]: "Emacs"
                                };
                        })));
      };
      var error = await Connection__Emacs$AgdaModeVscode.sendRequest(conn, encodeRequest($$document, match$1[0]), handler$1);
      if (error.TAG === "Ok") {
        return {
                TAG: "Ok",
                _0: toStatus({
                      TAG: "Emacs",
                      _0: conn,
                      [Symbol.for("name")]: "Emacs"
                    }),
                [Symbol.for("name")]: "Ok"
              };
      }
      await stop();
      return {
              TAG: "Error",
              _0: {
                TAG: "Emacs",
                _0: error._0,
                [Symbol.for("name")]: "Emacs"
              },
              [Symbol.for("name")]: "Error"
            };
    }
    var conn$1 = match._0;
    var handler$2 = function (x) {
      return handler(Util$AgdaModeVscode.Result.mapError(x, (function (err) {
                        return {
                                TAG: "LSP",
                                _0: err,
                                [Symbol.for("name")]: "LSP"
                              };
                      })));
    };
    var error$1 = await Connection__LSP$AgdaModeVscode.sendRequest(conn$1, encodeRequest($$document, conn$1.version), handler$2);
    if (error$1.TAG === "Ok") {
      return {
              TAG: "Ok",
              _0: toStatus({
                    TAG: "LSP",
                    _0: conn$1,
                    [Symbol.for("name")]: "LSP"
                  }),
              [Symbol.for("name")]: "Ok"
            };
    }
    await stop();
    return {
            TAG: "Error",
            _0: {
              TAG: "LSP",
              _0: error$1._0,
              [Symbol.for("name")]: "LSP"
            },
            [Symbol.for("name")]: "Error"
          };
  }
  var error$2 = await start(globalStorageUri, useLSP, onDownload);
  if (error$2.TAG === "Ok") {
    return await sendRequest(globalStorageUri, onDownload, useLSP, $$document, request, handler);
  } else {
    return {
            TAG: "Error",
            _0: error$2._0,
            [Symbol.for("name")]: "Error"
          };
  }
}

var Module = {
  start: start,
  stop: stop,
  sendRequest: sendRequest
};

var $$Error;

var $$Scheduler;

var Emacs;

var LSP;

exports.$$Error = $$Error;
exports.$$Scheduler = $$Scheduler;
exports.Emacs = Emacs;
exports.LSP = LSP;
exports.Module = Module;
exports.start = start;
exports.stop = stop;
exports.sendRequest = sendRequest;
/* Util-AgdaModeVscode Not a pure module */
