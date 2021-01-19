"use strict";
function _classCallCheck(e, t) {
  if (!(e instanceof t))
    throw new TypeError("Cannot call a class as a function");
}
function _defineProperties(e, t) {
  for (var r = 0; r < t.length; r++) {
    var i = t[r];
    (i.enumerable = i.enumerable || !1),
      (i.configurable = !0),
      "value" in i && (i.writable = !0),
      Object.defineProperty(e, i.key, i);
  }
}
function _createClass(e, t, r) {
  return (
    t && _defineProperties(e.prototype, t), r && _defineProperties(e, r), e
  );
}
var Util = require("@alipay/mychain/build/ant3/util"),
  API = require("./api"),
  Event = require("@alipay/mychain/build/ant3/event"),
  VmType = require("@alipay/mychain/build/ant3/config/vmType"),
  MyChain = (function () {
    function i(e, t, r) {
      _classCallCheck(this, i),
        (this.EVM = VmType.EVM),
        (this.WASM = VmType.WASM),
        (this.nonce = e.nonce || "hello world"),
        this.setUserKey(e),
        this.setUserRecoverKey(e),
        this.userSign(),
        this.userRecoverSign(),
        (this.ctr = new API(
          {
            host: e.host,
            port: e.port,
            clients: e.clients || [],
            timeout: e.timeout,
            cert: e.cert,
            ca: e.ca,
            key: e.key,
            passphrase: e.passphrase,
            tx_querytime: e.tx_querytime,
            tx_querycount: e.tx_querycount,
            checkServerIdentity: e.checkServerIdentity,
            mychain: this,
            power: r,
          },
          t
        )),
        (this.event = new Event({ ctr: this.ctr })),
        (this.utils = Util);
    }
    return (
      _createClass(i, [
        {
          key: "getNonce",
          value: function () {
            return this.nonce;
          },
        },
        {
          key: "setUserKey",
          value: function (e) {
            (this.userPublicKey = Util.toBuffer(
              e.userPublicKey ||
                "0x97466f2b32bc3bb76d4741ae51cd1d8578b48d3f1e68da206d47321aec267ce78549b514e4453d74ef11b0cd5e4e4c364effddac8b51bcfc8de80682f952896f"
            )),
              (this.userPrivateKey = Util.toBuffer(
                e.userPrivateKey ||
                  "0x3ecb44df2159c26e0f995712d4f39b6f6e499b40749b1cf1246c37f9516cb6a4"
              )),
              (this.userKeyInfo = {
                privateKey: this.userPrivateKey,
                publicKey: this.userPublicKey,
              });
          },
        },
        {
          key: "userSign",
          value: function (e) {
            (e = e || this.nonce),
              (this.userSignature = Util.sign(e, this.userPrivateKey));
          },
        },
        {
          key: "getUserKey",
          value: function () {
            return this.userKeyInfo;
          },
        },
        {
          key: "getUserSign",
          value: function () {
            return this.userSignature;
          },
        },
        {
          key: "setUserRecoverKey",
          value: function (e) {
            (this.userRecoverPublicKey = Util.toBuffer(
              e.userRecoverPublicKey || this.userPublicKey
            )),
              (this.userRecoverPrivateKey = Util.toBuffer(
                e.userRecoverPrivateKey || this.userPrivateKey
              )),
              (this.userRecoverKeyInfo = {
                privateKey: this.userRecoverPublicKey,
                publicKey: this.userRecoverPrivateKey,
              });
          },
        },
        {
          key: "userRecoverSign",
          value: function (e) {
            (e = e || this.nonce),
              (this.userRecoverSignature = Util.sign(
                e,
                this.userRecoverPrivateKey
              ));
          },
        },
        {
          key: "getUserRecoverKey",
          value: function () {
            return this.userRecoverKeyInfo;
          },
        },
        {
          key: "getUserRecoverSign",
          value: function () {
            return this.userRecoverSignature;
          },
        },
      ]),
      i
    );
  })();
module.exports = MyChain;
