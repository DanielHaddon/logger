"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

LogViewer.OutputPane.prototype.add = function ( /*Map*/data) {};

var Log = function (_React$Component) {
  _inherits(Log, _React$Component);

  function Log(props) {
    _classCallCheck(this, Log);

    var _this = _possibleConstructorReturn(this, (Log.__proto__ || Object.getPrototypeOf(Log)).call(this, props));

    _this.state = {};
    return _this;
  }

  _createClass(Log, [{
    key: "render",
    value: function render() {
      return React.createElement(
        "div",
        { className: "log-line" },
        React.createElement(
          "div",
          { className: "log-block" },
          this.props.metadata == null ? null : React.createElement("a", { href: "javascript:void(0)", title: "Expand Metadata Section", className: "metadata-icon icon-plus-sign" }),
          React.createElement(
            "span",
            { className: "date" },
            this.props.date
          ),
          React.createElement(
            "span",
            { className: "time" },
            this.props.time
          ),
          React.createElement(
            "span",
            { className: "type" },
            this.props.type
          ),
          React.createElement(
            "span",
            { className: "message" },
            this.props.message
          )
        ),
        this.props.metadata == null ? null : React.createElement(
          "div",
          { className: "metadata-block" },
          this.props.metadata
        )
      );
    }
  }]);

  return Log;
}(React.Component);

var Logger = function (_React$Component2) {
  _inherits(Logger, _React$Component2);

  function Logger(props) {
    _classCallCheck(this, Logger);

    var _this2 = _possibleConstructorReturn(this, (Logger.__proto__ || Object.getPrototypeOf(Logger)).call(this, props));

    var me = _this2;
    me.state = { logs: [] };

    LogViewer.OutputPane.prototype.add = function ( /*Map*/data) {
      if (!data.lines || data.lines.length === 0) {
        return;
      }

      var newLogs = me.state.logs;

      for (var line = 0; line < data.lines.length; line++) {
        var logData = data.lines[line];

        if ('break' in logData) {
          return { 'html': logString + logData.break };
        } else {

          var date = logData.d == null ? "" : logData.d;
          var time = logData.t == null ? "" : logData.t;
          var type = logData.v == null ? "" : logData.v;
          var message = logData.m == null ? "" : logData.m;
          var metadata = "";

          if ('e' in logData) {
            try {
              metadata = JSON.stringify(logData[metadataKey], null, 4);
            } catch (err) {
              metadata = "JSON.stringify error: " + err;
            }
          }

          logs.push(React.createElement(Log, { date: date, time: time, type: type, message: message, metadata: metadata }));
        }
      }

      me.setState({ logs: newLogs });
    };
    return _this2;
  }

  _createClass(Logger, [{
    key: "render",
    value: function render() {
      return React.createElement("div", null);
    }
  }]);

  return Logger;
}(React.Component);

React.render(React.createElement(Logger, null), window.logOutput);