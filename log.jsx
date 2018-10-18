LogViewer.OutputPane.prototype.add = function( /*Map*/ data ) {}
LogViewer.OutputPane.prototype.clear = function() {}

$(".fetch-actions").append('<button onclick="window.clearLog()" id="clearLog" class="clear-logs">Clear Log</button>');
$(".filter-actions").append('<div class="filter-text"><input placeholder="Search..." id="filterText"/></div>');
$(".log-output-container").empty();

window.logOutputContainer = $(".log-output-container")[0];
window.filterTextInput = document.getElementById("filterText");

$.getScript("https://cdnjs.cloudflare.com/ajax/libs/react/0.13.0/react.min.js", function() {
  class Log extends React.Component {
    constructor(props) {
      super(props);
      this.state = { expanded: false };
    }

    handleOnClick() {
      if (this.props.metadata == null || this.props.metadata.length == 0) {
        return;
      }

      this.setState({ expanded: !this.state.expanded });
    }

    render() {
      return (
        <div onClick={this.handleOnClick.bind(this)} className={"log-line severity-" + this.props.type.toUpperCase() + (this.props.metadata == null ? "" : " has-a") + (this.props.visible ? "" : " hidden")}>
          <div className="log-block">
            {
              this.props.metadata == null || this.props.metadata.length == 0 ? null : !this.state.expanded ? <a href="#" title="Expand Metadata Section" className="metadata-icon icon-plus-sign" /> : <a href="#" title="Collapse Metadata Section" className="metadata-icon icon-minus-sign" />
            }
            <span className="date">{this.props.date}</span>
            <span className="time">{this.props.time}</span>
            <span className="type">{this.props.type}</span>
            <span className="message">{this.props.message}</span>
          </div>
          {
            !this.state.expanded || this.props.metadata == null || this.props.metadata.length == 0? null : <div className="metadata-block">
              {this.props.metadata}
            </div>
          }
        </div>
      );
    }
  }

  class Logger extends React.Component {
    constructor(props) {
      super(props);
      window.logger = this;
      var me = this;
      me.state = { logs: [] };

      LogViewer.OutputPane.prototype.add = function( /*Map*/ data ) {
        if (!data.lines || data.lines.length === 0)
        {
          return;
        }

        let newLogs = me.state.logs;

        for (var line = 0; line < data.lines.length; line++) {
          var logData = data.lines[ line ];

          if ('break' in logData) {
            return { 'html': logString + logData.break };
          } else {

            let date = logData.d == null ? "" : logData.d;
            let time = logData.t == null ? "" : logData.t;
            let type = logData.v == null ? "" : logData.v;
            let message = logData.m == null ? "" : logData.m;
            let metadata = "";

            if ('e' in logData) {
              try {
                metadata = JSON.stringify( logData['e'], null, 4 );
              }
              catch( err ) {
                metadata = "JSON.stringify error: " + err;
              }
            }

            newLogs.push({
              date: date,
              time: time,
              type: type,
              message: message,
              metadata: metadata,
              visible: true
            });
          }
        }

        me.setState({logs: newLogs});
      };

			var wto;

			$('#filterText').keyup(function(e) {
				clearTimeout(wto);
				wto = setTimeout(function() {
					console.log(e.target.value);
          var text = e.target.value.toLowerCase();
          me.setState({filter: text});
				}, 500);
			});

      window.maxLogs = null;
      window.refreshLog = () => {
        me.setState({});
      }

      window.clearLog = me.clear;
      LogViewer.OutputPane.prototype.clear = me.clear;
    }

    clear() {
      window.logger.setState({logs: []});
    }

    render() {
      let filteredLogs = [];
      let filter = this.state.filter;
      let logs = this.state.logs;

      if (window.maxLogs && logs.length > window.maxLogs) {
        logs = logs.slice(Math.max(logs.length - window.maxLogs, 0))
      }

      filteredLogs = logs.map((l) => {
        l.visible = (filter == null || filter.length == 0) || l.message.toLowerCase().includes(filter);
        return l;
      });

      let logRows = [];
      for(let log of filteredLogs) {
        logRows.push(<Log visible={log.visible} date={log.date} time={log.time} type={log.type} message={log.message} metadata={log.metadata} />);
      }

      return (
        <div className="log-output">
          {logRows}
        </div>
      );
    }
  }

  React.render(<Logger />, window.logOutputContainer);
});

var styleEl = document.createElement('style');
styleEl.innerHTML = `
.log-viewer-heading, .log-output-header, .toggle-show-hide-filters, .logo_image {
	display: none;
}

#main {
	top: 35px !important;
    left: 38px !important;
    background: white !important;
}

.logoheader {
	height: 23px !important;
}

.user-profile {
	right: 24px !important;
}

.module-logs .level-two {
	display: none;
}

.log-block {
    padding-left: 110px;
    position: relative;
  }

  .log-output .metadata-icon {
    opacity: 0.4;
    top: 8px;
    left: 7px !important;
  }

  .log-block span {
      display: inline-block;
      overflow: hidden;
      padding: 2px 0;
      min-height: 26px;
      vertical-align: top;
      padding-left: 18px;
  }

  .filter-actions > * {
    display: inline-block !important;
  }
    
  .filter-text {
      vertical-align: middle;
  }

  .hidden {
    display: none;
  }

  .filter-text input {
    border: 1px solid #aaa;
      min-width: 150px;
      width: 20vw;
      margin-left: 5px;
      margin-top: 0px;
      border-radius: 4px;
      font-size: 12px;
      padding: 4px 6px;
  }

  .log-block .date {
      position: absolute;
      left: 7px;
      top: 1px;
      font-size: 10px;
      opacity: 0.5;
  }

  .log-block .time {
      position: absolute;
      left: 8px;
      top: 11px;
      font-size: 12px;
      opacity: 1;
  }

  .log-block .type {
      opacity: 0.3;
      font-weight: bold;
      max-width: 20px;
  }

  .log-block .message {
      max-width: 88%;
      white-space: normal;
  }

  .log-output .log-line {
      background: #fff !important;
    border-bottom: 1px solid #f2f4f6;
  }

  .log-output .log-line.severity-INFO {
  	color: #0a6684;
  }
  
  .log-output .log-line.severity-WARNING {
      background: #FFED8B !important;
    border-bottom: 1px solid #ead876;
  }
  
  .log-output .log-line.severity-ERROR, .log-output .log-line.severity-CRITICAL {
    background: #FFA6A6 !important;
    border-bottom: 1px solid #FF7171;
  }

  .log-output .log-line.severity-WARNING.has-a:hover {
    background: #e6bf31 !important;
  }

  .log-output .log-line.severity-ERROR.has-a:hover {
    background: #FF7171 !important;
  }
  
  .log-output .log-line.severity-CRITICAL.has-a:hover {
    background: #BC0000 !important;
  }

  .log-output .log-line.severity-WARNING.has-a:hover .metadata-block {
    background: #e6bf31 !important;
  }

  .log-output .log-line.severity-ERROR.has-a:hover .metadata-block {
    background: #FF7171 !important;
  }
  
  .log-output .log-line.severity-CRITICAL.has-a:hover .metadata-block {
    background: #BC0000 !important;
  }

  .log-output {
    display: flex;
    flex-direction: column-reverse;
  }

  .log-output .log-line {
    cursor: default;
  }

  .log-output .log-line.has-a:hover {
    background: #8bd4f5 !important;
  }
  .log-output .log-line.has-a:hover .metadata-block {
    background: #8bd4f5 !important;
  }

  .log-output .metadata-block {
    background-color: transparent !important;
      max-height: 200px;
      overflow: auto;
      display: none;
      outline: none !important;
      border-bottom: none !important;
      padding: 10px 10px !important;
  }

  @keyframes flash {
    0% { opacity: 0; }  
    50% { opacity: 1; background: #9e9ede; }
    100% { opacity: 1; background: transparent; }
  }

  .log-line {
    animation: flash linear 0.6s;
  }

  .log-output .metadata-block {
    display: block !important;
  }
  
  .severity-TRACE, .severity-NOTICE {
    opacity:0.5;
  }
`;
document.head.appendChild(styleEl);