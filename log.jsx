LogViewer.OutputPane.prototype.add = function( /*Map*/ data ) {}

class Log extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="log-line">
        <div className="log-block">
          {
            this.props.metadata == null ? null : <a href="javascript:void(0)" title="Expand Metadata Section" className="metadata-icon icon-plus-sign" />
          }
          <span className="date">{this.props.date}</span>
          <span className="time">{this.props.time}</span>
          <span className="type">{this.props.type}</span>
          <span className="message">{this.props.message}</span>
        </div>
        {
          this.props.metadata == null ? null : <div className="metadata-block">
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
              metadata = JSON.stringify( logData[metadataKey], null, 4 );
            }
            catch( err ) {
              metadata = "JSON.stringify error: " + err;
            }
          }

          newLogs.push(<Log date={date} time={time} type={type} message={message} metadata={metadata} />);
        }
      }

      me.setState({logs: newLogs});
    };
  }

  render() {
    return (
      <div className="log-output">
        {this.state.logs}
      </div>
    );
  }
}

React.render(<Logger />, window.logOutputContainer);
