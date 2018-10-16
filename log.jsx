LogViewer.OutputPane.prototype.add = function( /*Map*/ data ) {}

class Log extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className={"log-line severity-" + this.props.type.toUpperCase() + (this.props.metadata == null ? "" : " has-a") + (this.props.hidden == null ? " hidden" : "")}>
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
            metadata: metadata
          });
        }
      }

      me.setState({logs: newLogs});
    };

    $('#filterText').on('input',function(e){
      var text = e.target.value.toLowerCase();
      me.setState({filter: text});
    });

    window.clearLog = this.clear;
  }

  clear() {
    this.setState({logs: []});
  }

  render() {
    let filteredLogs = [];
    let filter = this.state.filter;

    if (filter != null && filter.length > 0) {
      filteredLogs = this.state.logs.map((l) => {
        l.hidden = !r.message.toLowerCase().includes(filter)
      });
    } else {
      filteredLogs = this.state.logs;
    }

    let logs = [];
    for(let log of filteredLogs) {
      logs.push(<Log hidden={log.hidden} date={log.date} time={log.time} type={log.type} message={log.message} metadata={log.metadata} />);
    }

    return (
      <div className="log-output">
        {logs}
      </div>
    );
  }
}

React.render(<Logger />, window.logOutputContainer);
