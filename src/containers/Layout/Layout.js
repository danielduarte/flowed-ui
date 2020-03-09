import React, {Component, Fragment} from 'react';

import { Navbar, Button, Alignment,ButtonGroup} from '@blueprintjs/core';

class Layout extends Component {

  state = {
    view: 'split',
  };

  componentDidMount() {
    window.renderFlow();
  }

  handleViewChange = (view) => {
    this.setState({ view });
  };

  render() {
    return (
      <Fragment>
        <Navbar className="bp3-dark">
          <Navbar.Group align={Alignment.LEFT}>
            <Navbar.Heading>Flowed UI</Navbar.Heading>
          </Navbar.Group>
          <Navbar.Group align={Alignment.RIGHT}>
            <ButtonGroup>
              <Button
                icon="align-justify"
                active={this.state.view === 'code'}
                onClick={() => this.handleViewChange('code')} />
              <Button
                icon="list-detail-view"
                active={this.state.view === 'split'}
                onClick={() => this.handleViewChange('split')} />
              <Button
                icon="flow-branch"
                active={this.state.view === 'diagram'}
                onClick={() => this.handleViewChange('diagram')} />
            </ButtonGroup>
          </Navbar.Group>
        </Navbar>

        <main style={{position: 'relative', height: 'calc(100% - 50px)'}}>
          {this.props.children}
        </main>
      </Fragment>
    );
  }
}

export default Layout;
