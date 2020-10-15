import React from 'react';
import ReactDOM from 'react-dom';

export default class Hello extends React.Component {
  render() {
    return (
      <div>
        <h1>
          Hello, {this.props.firstname} {this.props.lastname}
        </h1>
      </div>
    );
  }
}
