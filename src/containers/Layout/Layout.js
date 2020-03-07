import React, {Component, Fragment} from 'react';

class Layout extends Component {

  render() {
    return (
      <Fragment>
        <header>header</header>
        <main>
          {this.props.children}
        </main>
      </Fragment>
    );
  }
}

export default Layout;
