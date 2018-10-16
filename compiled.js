"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

LogViewer.OutputPane.prototype.add = function ( /*Map*/data) {};

$(".fetch-actions").append('<button onclick="window.clearLog()" id="clearLog" class="clear-logs">Clear Log</button>');
$(".filter-actions").append('<div class="filter-text"><input placeholder="Search..." id="filterText"/></div>');
$(".log-output-container").empty();

window.logOutputContainer = $(".log-output-container")[0];
window.filterTextInput = document.getElementById("filterText");

import('https://cdnjs.cloudflare.com/ajax/libs/react/0.13.0/react.min.js').then(function (renderedScripty) {
  var Log = function (_React$Component) {
    _inherits(Log, _React$Component);

    function Log(props) {
      _classCallCheck(this, Log);

      var _this = _possibleConstructorReturn(this, (Log.__proto__ || Object.getPrototypeOf(Log)).call(this, props));

      _this.state = { expanded: false };
      return _this;
    }

    _createClass(Log, [{
      key: "handleOnClick",
      value: function handleOnClick() {
        if (this.props.metadata == null || this.props.metadata.length == 0) {
          return;
        }

        this.setState({ expanded: !this.state.expanded });
      }
    }, {
      key: "render",
      value: function render() {
        return React.createElement(
          "div",
          { onClick: this.handleOnClick, className: "log-line severity-" + this.props.type.toUpperCase() + (this.props.metadata == null ? "" : " has-a") + (this.props.hidden ? " hidden" : "") },
          React.createElement(
            "div",
            { className: "log-block" },
            this.props.metadata == null ? null : !this.state.expanded ? React.createElement("a", { href: "#", title: "Expand Metadata Section", className: "metadata-icon icon-plus-sign" }) : React.createElement("a", { href: "#", title: "Collapse Metadata Section", className: "metadata-icon icon-minus-sign" }),
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
          !this.state.expanded || this.props.metadata == null || this.props.metadata.length == 0 ? null : React.createElement(
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

      window.logger = _this2;
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
                metadata = JSON.stringify(logData['e'], null, 4);
              } catch (err) {
                metadata = "JSON.stringify error: " + err;
              }
            }

            newLogs.push({
              date: date,
              time: time,
              type: type,
              message: message,
              metadata: metadata,
              hidden: false
            });
          }
        }

        me.setState({ logs: newLogs });
      };

      $('#filterText').on('input', function (e) {
        var text = e.target.value.toLowerCase();
        me.setState({ filter: text });
      });

      window.clearLog = me.clear;
      return _this2;
    }

    _createClass(Logger, [{
      key: "clear",
      value: function clear() {
        window.logger.setState({ logs: [] });
      }
    }, {
      key: "render",
      value: function render() {
        var filteredLogs = [];
        var filter = this.state.filter;

        if (filter != null && filter.length > 0) {
          filteredLogs = this.state.logs.map(function (l) {
            l.hidden = !l.message.toLowerCase().includes(filter);
            return l;
          });
        } else {
          filteredLogs = this.state.logs;
        }

        var logs = [];
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = filteredLogs[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var log = _step.value;

            logs.push(React.createElement(Log, { hidden: log.hidden, date: log.date, time: log.time, type: log.type, message: log.message, metadata: log.metadata }));
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }

        return React.createElement(
          "div",
          { className: "log-output" },
          logs
        );
      }
    }]);

    return Logger;
  }(React.Component);

  React.render(React.createElement(Logger, null), window.logOutputContainer);
});

var styleEl = document.createElement('style');
styleEl.innerHTML = "\n  .log-block {\n    padding-left: 110px;\n    position: relative;\n  }\n\n  .log-output .metadata-icon {\n    opacity: 0.4;\n    top: 8px;\n    left: 7px !important;\n  }\n\n  .log-block span {\n      display: inline-block;\n      overflow: hidden;\n      padding: 2px 0;\n      min-height: 26px;\n      vertical-align: top;\n      padding-left: 18px;\n  }\n\n  .severity-INFO, .severity-TRACE, .severity-NOTICE {\n    opacity:0.4;\n  }\n\n  .filter-actions > * {\n    display: inline-block !important;\n  }\n    \n  .filter-text {\n      vertical-align: middle;\n  }\n\n  .hidden {\n    display: none;\n  }\n\n  .filter-text input {\n    border: 1px solid #aaa;\n      min-width: 150px;\n      width: 30vw;\n      margin-left: 5px;\n      margin-top: 0px;\n      border-radius: 4px;\n      font-size: 12px;\n      padding: 4px 6px;\n  }\n\n  .log-block .date {\n      position: absolute;\n      left: 7px;\n      top: 1px;\n      font-size: 10px;\n      opacity: 0.5;\n  }\n\n  .log-block .time {\n      position: absolute;\n      left: 8px;\n      top: 11px;\n      font-size: 12px;\n      opacity: 1;\n  }\n\n  .log-block .type {\n      opacity: 0.3;\n      font-weight: bold;\n      max-width: 20px;\n  }\n\n  .log-block .message {\n      max-width: 88%;\n      white-space: normal;\n  }\n\n  .log-output .log-line:nth-child( odd ) {\n      background: #fff !important;\n  }\n\n  .log-output .log-line:nth-child( even ) {\n      background: #fff !important;\n  }\n\n  .log-output .log-line.severity-WARNING:nth-child( odd ) {\n      background: #FFED8B !important;\n  }\n\n  .log-output .log-line.severity-WARNING:nth-child( even ) {\n      background: #FFED8B !important;\n  }\n\n  .log-output .log-line {\n    border-bottom: 1px solid #f2f4f6;\n  }\n\n  .log-output .log-line.severity-WARNING {\n    border-bottom: 1px solid #ead876;\n  }\n\n  .log-output {\n    display: flex;\n    flex-direction: column-reverse;\n  }\n\n  .log-output .log-line {\n    cursor: default;\n  }\n\n  .log-output .log-line.has-a {\n    \n  }\n\n  .log-output .log-line.has-a:hover {\n    background: #8bd4f5 !important;\n  }\n  .log-output .log-line.has-a:hover .metadata-block {\n    background: #8bd4f5 !important;\n  }\n\n  .log-output .metadata-block {\n    background-color: transparent !important;\n      max-height: 200px;\n      overflow: auto;\n      display: none;\n      outline: none !important;\n      border-bottom: none !important;\n      padding: 10px 10px !important;\n  }\n\n  .log-output .log-line.severity-WARNING.has-a:hover {\n    background: #e6bf31 !important;\n  }\n\n  .log-output .log-line.severity-WARNING.has-a:hover .metadata-block {\n    background: #e6bf31 !important;\n  }\n\n  @keyframes flash {\n    0% { opacity: 0; }  \n    50% { opacity: 1; background: #9e9ede; }\n    100% { opacity: 1; background: transparent; }\n  }\n\n  .log-line {\n    animation: flash linear 0.6s;\n  }\n\n";
document.head.appendChild(styleEl);