import { Provider } from 'react-redux';
import { HashRouter, Route, Switch } from 'react-router-dom';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Landing from '../components/Landing/Landing';
import { pixelBoughtEventListener, getAllBoughtPixels, pollForAddressChange } from '../actions/userActions';

class Routes extends Component {
  componentWillMount() {
    this.props.store.dispatch(pollForAddressChange());
    this.props.store.dispatch(getAllBoughtPixels(true));
    this.props.store.dispatch(pixelBoughtEventListener());
  }

  render() {
    return (
      <Provider store={this.props.store}>
        <HashRouter>
          <Switch>
            <Route exact path="/" component={Landing} />
          </Switch>
        </HashRouter>
      </Provider>
    );
  }
}

Routes.propTypes = {
  store: PropTypes.object.isRequired,
};

export default Routes;
