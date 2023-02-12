import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import ContactPage from './pages/contact';
import AboutPage from './pages/about';
import FaqsPage from './pages/faqs';
import SupportPage from './pages/support';
import IndexPage from './pages';
import ThanksPage from './pages/tanks';

class App extends Component {
	render() {
		return (
			<Router basename={process.env.PUBLIC_URL}>
				<Switch>
					<Route exact path="/contact" component={ContactPage} />
					<Route exact path="/about" component={AboutPage} />
					<Route exact path="/faqs" component={FaqsPage} />
					<Route exact path="/support" component={SupportPage} />
					<Route exact path="/thanks" component={ThanksPage} />
					<Route exact path="/" component={IndexPage} />
				</Switch>
			</Router>
		);
	}
}

export default App;
