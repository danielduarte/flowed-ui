import React, {Component, Fragment} from 'react';

import { Navbar, Button, Alignment,ButtonGroup} from '@blueprintjs/core';

class Layout extends Component {

  render() {
    return (
      <Fragment>
        <Navbar className="bp3-dark">
          <Navbar.Group align={Alignment.LEFT}>
            <Navbar.Heading>Flowed UI</Navbar.Heading>
          </Navbar.Group>
          <Navbar.Group align={Alignment.RIGHT}>
            <ButtonGroup>
              <Button icon="flow-branch" />
              <Button icon="align-justify" />
              <Button icon="list-detail-view" active={true}/>
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
