"use strict";
function _typeof(t) {
  return (_typeof =
    "function" == typeof Symbol && "symbol" == typeof Symbol.iterator
      ? function (t) {
          return typeof t;
        }
      : function (t) {
          return t &&
            "function" == typeof Symbol &&
            t.constructor === Symbol &&
            t !== Symbol.prototype
            ? "symbol"
            : typeof t;
        })(t);
}
function _classCallCheck(t, e) {
  if (!(t instanceof e))
    throw new TypeError("Cannot call a class as a function");
}
function _defineProperties(t, e) {
  for (var n = 0; n < e.length; n++) {
    var i = e[n];
    (i.enumerable = i.enumerable || !1),
      (i.configurable = !0),
      "value" in i && (i.writable = !0),
      Object.defineProperty(t, i.key, i);
  }
}
function _createClass(t, e, n) {
  return (
    e && _defineProperties(t.prototype, e), n && _defineProperties(t, n), t
  );
}
function _possibleConstructorReturn(t, e) {
  return !e || ("object" !== _typeof(e) && "function" != typeof e)
    ? _assertThisInitialized(t)
    : e;
}
function _assertThisInitialized(t) {
  if (void 0 === t)
    throw new ReferenceError(
      "this hasn't been initialised - super() hasn't been called"
    );
  return t;
}
function _getPrototypeOf(t) {
  return (_getPrototypeOf = Object.setPrototypeOf
    ? Object.getPrototypeOf
    : function (t) {
        return t.__proto__ || Object.getPrototypeOf(t);
      })(t);
}
function _inherits(t, e) {
  if ("function" != typeof e && null !== e)
    throw new TypeError("Super expression must either be null or a function");
  (t.prototype = Object.create(e && e.prototype, {
    constructor: { value: t, writable: !0, configurable: !0 },
  })),
    e && _setPrototypeOf(t, e);
}
function _setPrototypeOf(t, e) {
  return (_setPrototypeOf =
    Object.setPrototypeOf ||
    function (t, e) {
      return (t.__proto__ = e), t;
    })(t, e);
}
var ApiParamFormat = require("./config/apiParamFormat"),
  Util = require("@alipay/mychain/build/ant3/util"),
  BaseEvent = require("@alipay/mychain/build/ant3/baseEvent"),
  E = (function (t) {
    function s(t) {
      var i,
        e = t.eventCtr,
        n = t.ctr,
        r = t.eventListen,
        o = t.watchListen;
      return (
        _classCallCheck(this, s),
        ((i = _possibleConstructorReturn(
          this,
          _getPrototypeOf(s).call(this)
        )).eventCtr = e),
        (i.ctr = n),
        (i.filter_id = null),
        (i.watchListen = o),
        r(function (t, e, n) {
          i.filter_id = t ? "error" : e.filter_id;
        }),
        (i.isWatch = !0),
        i
      );
    }
    return (
      _inherits(s, BaseEvent),
      _createClass(s, [
        {
          key: "watch",
          value: function () {
            var i = this;
            this.isWatch &&
              null !== this.filter_id &&
              "error" !== this.filter_id &&
              this.watchListen(this.filter_id, function (t, e, n) {
                i.fire(t, e, n);
              });
          },
        },
        {
          key: "stop",
          value: function () {
            this.isWatch = !1;
          },
        },
        {
          key: "start",
          value: function () {
            this.isWatch = !0;
          },
        },
        {
          key: "close",
          value: function (i) {
            var r = this;
            return (
              this.eventCtr.removeEvent(this, function (t, e, n) {
                r.destroyEvent(), "function" == typeof i && i(t, e, n);
              }),
              this
            );
          },
        },
      ]),
      s
    );
  })(),
  Event = (function () {
    function n(t) {
      var e = t.ctr;
      _classCallCheck(this, n),
        (this.ctr = e),
        (this.loopTime = 6e3),
        (this.timer = null),
        (this.isLoop = !1),
        (this.events = []),
        this.runLoop();
    }
    return (
      _createClass(n, [
        {
          key: "setLoopTime",
          value: function (t) {
            (this.loopTime = parseInt(t) || this.loopTime), this.runLoop();
          },
        },
        {
          key: "runLoop",
          value: function () {
            var i = this;
            this.timer && (clearTimeout(this.timer), (this.timer = null)),
              (function n() {
                (i.isLoop = !0),
                  (i.timer = setTimeout(function () {
                    for (var t = i.events, e = 0; e < t.length; e++)
                      t[e].watch();
                    n();
                  }, i.loopTime));
              })();
          },
        },
        {
          key: "stopLoop",
          value: function () {
            this.timer && (clearTimeout(this.timer), (this.timer = null)),
              (this.isLoop = !1);
          },
        },
        {
          key: "_removeEvent",
          value: function (n) {
            var i = this;
            function t() {
              for (var t = i.events, e = 0; e < t.length; e++)
                if (n === t[e]) {
                  t.splice(e, 1);
                  break;
                }
            }
            this.isLoop ? (this.stopLoop(), t(), this.runLoop()) : t();
          },
        },
        {
          key: "removeEvent",
          value: function (i, r) {
            var o = this;
            i.filter_id
              ? this.ctr.EventCancel(
                  { filter_id: i.filter_id },
                  function (t, e, n) {
                    !t && e && 0 === e.return_code && o._removeEvent(i),
                      r(t, e, n);
                  }
                )
              : "error" === i.filter_id
              ? this._removeEvent(i)
              : setTimeout(function () {
                  o.removeEvent(i, r);
                }, 500);
          },
        },
        {
          key: "_addEvent",
          value: function (t, e, r) {
            var n = this,
              o = e.to,
              s = e.type,
              c = "";
            switch (t) {
              case 0:
                c = "Account";
                break;
              case 1:
                c = "Contract";
                break;
              case 2:
                c = "Topics";
                break;
              case 3:
                c = "Block";
            }
            var i = new E({
              eventCtr: this,
              ctr: this.ctr,
              eventListen: function (i) {
                n.ctr["Event" + c](
                  { identity: o, type: s },
                  function (t, e, n) {
                    "function" == typeof r && r(t, e, n), i(t, e, n);
                  }
                );
              },
              watchListen: function (t, r) {
                n.ctr.EventFetch({ filter_id: t }, function (t, e, n) {
                  if (e.event_data) {
                    var i = ApiParamFormat.eventDataFormat(
                      c,
                      Util.rlp_decode(e.event_data)
                    );
                    i && (e.event_data = i), r(t, e, n);
                  }
                });
              },
            });
            return this.events.push(i), i;
          },
        },
        {
          key: "account",
          value: function (t, e) {
            return this._addEvent(0, t, e);
          },
        },
        {
          key: "contract",
          value: function (t, e) {
            return this._addEvent(1, t, e);
          },
        },
        {
          key: "topic",
          value: function (t, e) {
            return this._addEvent(2, t, e);
          },
        },
        {
          key: "block",
          value: function (t, e) {
            return this._addEvent(3, t, e);
          },
        },
      ]),
      n
    );
  })();
module.exports = Event;
