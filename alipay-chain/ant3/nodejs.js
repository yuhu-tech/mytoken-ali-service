"use strict";
function _objectSpread(n) {
  for (var e = 1; e < arguments.length; e++) {
    var t = null != arguments[e] ? arguments[e] : {},
      a = Object.keys(t);
    "function" == typeof Object.getOwnPropertySymbols &&
      (a = a.concat(
        Object.getOwnPropertySymbols(t).filter(function (e) {
          return Object.getOwnPropertyDescriptor(t, e).enumerable;
        })
      )),
      a.forEach(function (e) {
        _defineProperty(n, e, t[e]);
      });
  }
  return n;
}
function _defineProperty(e, n, t) {
  return (
    n in e
      ? Object.defineProperty(e, n, {
          value: t,
          enumerable: !0,
          configurable: !0,
          writable: !0,
        })
      : (e[n] = t),
    e
  );
}
function _classCallCheck(e, n) {
  if (!(e instanceof n))
    throw new TypeError("Cannot call a class as a function");
}
function _defineProperties(e, n) {
  for (var t = 0; t < n.length; t++) {
    var a = n[t];
    (a.enumerable = a.enumerable || !1),
      (a.configurable = !0),
      "value" in a && (a.writable = !0),
      Object.defineProperty(e, a.key, a);
  }
}
function _createClass(e, n, t) {
  return (
    n && _defineProperties(e.prototype, n), t && _defineProperties(e, t), e
  );
}
var TLS = require("@alipay/mychain/build/ant3/tls"),
  ApiParamFormat = require("./config/apiParamFormat"),
  requestGenerator = {
    count: 0,
    callbackMap: {},
    getCount: function () {
      return this.count;
    },
    addCount: function () {
      return this.count++, this.count;
    },
    setRequest: function (e) {
      var n = this.addCount();
      return (this.callbackMap[n] = e), n;
    },
    getRequest: function (e) {
      var n = this.callbackMap[e];
      if (n) return (this.callbackMap[e] = null), delete this.callbackMap[e], n;
    },
  },
  Nodejs = (function () {
    function e() {
      var c = this;
      _classCallCheck(this, e),
        (this.sender = null),
        (this.sendCache = []),
        (this.session_id = ""),
        (this.callback = null),
        (this.sendCallback = function (e, n) {
          var t = ApiParamFormat.responseTransform(n);
          if ("Handshake" === t.api) {
            if (
              ((c.session_id = t.session_id || ""),
              "function" == typeof c.callback &&
                (c.callback(e, t), (c.callback = null)),
              c.sendCache.length)
            )
              for (var a = c.sendCache.shift(); a; )
                c._send(a.apiName, a.data, a.baseData, a.callback),
                  (a = c.sendCache.shift());
          } else {
            var r = t.sequence,
              s = requestGenerator.getRequest(r);
            "function" == typeof s && s(e, t, n);
          }
        });
    }
    return (
      _createClass(e, [
        {
          key: "makeSenderFunc",
          value: function (a) {
            var r = this;
            return function (e, n, t) {
              r.session_id
                ? r._send(a, e, n, t)
                : r.sendCache.push({
                    apiName: a,
                    data: e,
                    baseData: n,
                    callback: t,
                  });
            };
          },
        },
        {
          key: "_send",
          value: function (e, n, t, a) {
            var r = requestGenerator.setRequest(function (e, n, t) {
              "function" == typeof a && a(e, n, t);
            });
            (t.sequence = r),
              (t.transaction_type = ApiParamFormat[e].transaction_type);
            var s = {},
              c = ApiParamFormat[e];
            c && "function" == typeof c.nodeInput && (s = c.nodeInput(e, n, t)),
              this.send(ApiParamFormat.requestTransform(e, s));
          },
        },
        {
          key: "send",
          value: function (e) {
            this.sender.send(e);
          },
        },
        {
          key: "setSender",
          value: function (e, n, t) {
            var a = this;
            return (
              (this.callback = t),
              (this.sender = TLS(
                _objectSpread({}, e, { sendCallback: this.sendCallback }),
                function (e) {
                  e
                    ? "function" == typeof a.callback &&
                      (a.callback(e), (a.callback = null))
                    : a.handshake(n);
                }
              )),
              this.sender
            );
          },
        },
        {
          key: "handshake",
          value: function (e) {
            this.sender.send([e.nonce, e.userPublicKey, e.userSignature, 0]);
          },
        },
      ]),
      e
    );
  })();
module.exports = Nodejs;
