import React from 'react';
import { Link } from 'react-router-dom';
const electron = window.require('electron');

class ServerDetails extends React.Component {
  render() {
    const { serverName } = this.props.match.params;
    const { servers } = this.context.storage;
    const server = servers[serverName];
    const domains = server && server.domains || [];

    return (
      <div>
        <div className="row">
          <div className="col-xs-12">
            <h1 className="page-header">Server {serverName}</h1>
            <a className="btn btn-default" onClick={this.handleDisconnect.bind(this)}>
              <span className="glyphicon glyphicon-remove"></span>&nbsp;
              Disconnect
            </a>&nbsp;
            <a className="btn btn-default" onClick={this.handleLogin.bind(this)}>
              <span className="glyphicon glyphicon-log-in"></span>&nbsp;
              Login to Plesk UI
            </a>
          </div>
        </div>
        <div className="row top-buffer">
          <div className="col-xs-5">
            <table className="table table-bordered table-hover">
              <tbody>
                <tr>
                  <th>Version</th>
                  <td>{server && server.details && server.details.version}</td>
                </tr>
                <tr>
                  <th>OS</th>
                  <td>{server && server.details && `${server.details.os} ${server.details.osVersion}`}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="col-xs-5">
            <table className="table table-bordered table-hover">
              <tbody>
                <tr>
                  <th>Subscriptions</th>
                  <td>{server && server.domains && server.domains.length || 0}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className="row">
          <div className="col-xs-12">
            <Link to={`/server/subscription/${serverName}`} className="btn btn-default">
              <span className="glyphicon glyphicon-plus"></span>&nbsp;
              Create Subscription
            </Link>
          </div>
        </div>
        <div className="row top-buffer">
          <div className="col-xs-12">
            <table className="table table-bordered table-hover">
              <thead>
                <tr>
                  <th>Subscription</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {domains.map((domain) => {
                  return (
                    <tr key={domain.domain}>
                      <td>{domain.domain}</td>
                      <td>
                        <a href="#" data-id={domain.domain} className="btn btn-default btn-xs" onClick={this.handleLoginSubscription.bind(this)}>
                          <span className="glyphicon glyphicon-log-in"></span>&nbsp;
                          Login
                        </a>&nbsp;
                        <a href="#" data-id={domain.domain} className="btn btn-default btn-xs" onClick={this.handleRemoveSubscription.bind(this)}>
                          <span className="glyphicon glyphicon-remove"></span>&nbsp;
                          Remove
                        </a>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  handleDisconnect(event) {
    event.preventDefault();

    const {serverName} = this.props.match.params;

    this.context.storage.disconnectServer(serverName);

    this.props.history.push('/');
  }

  handleLogin(event) {
    event.preventDefault();

    const { serverName } = this.props.match.params;
    const { servers } = this.context.storage;

    const { login, password } = servers[serverName];
    const loginUrl = `http://${serverName}:8880/login_up.php?login_name=${login}&passwd=${password}`;
    electron.shell.openExternal(loginUrl);
  }

  handleLoginSubscription(event) {
    event.preventDefault();
    const domain = event.target.getAttribute('data-id');
    const { serverName } = this.props.match.params;
    const { servers } = this.context.storage;
    const { domains } = servers[serverName];
    const domainDetails = domains.find((item) => item.domain == domain)
    const loginUrl = `http://${domainDetails.ip}:8880/login_up.php?login_name=admin&passwd=${domainDetails.password}`;
    electron.shell.openExternal(loginUrl);
  }

  handleRemoveSubscription(event) {
    event.preventDefault();
    const domain = event.target.getAttribute('data-id');
    const { serverName } = this.props.match.params;
    this.context.storage.removeSubscription(serverName, domain);
  }
}
ServerDetails.contextTypes = {
  storage: React.PropTypes.object,
};

export default ServerDetails;
