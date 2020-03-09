import React, {Component} from 'react';

class Flowed extends Component {

  componentDidMount() {
    window.Flow.init(this.props.spec);
    window.Flow.renderFlow();
  }

  render() {
    return (
      <div
        className={this.props.className}
        id="rete" />
    );
  }
}

export default Flowed;
