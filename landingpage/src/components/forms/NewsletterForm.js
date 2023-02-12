import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import { useMatomo } from '@datapunt/matomo-tracker-react'
import { USER_URL } from '../../environment/current.js'
import { Redirect } from 'react-router';
import classnames from 'classnames';


const NewsletterForm = ({className}) => {
	const [email, setEmail] = useState();
	const [posted,setPosted] = useState(false);
	const { trackPageView, trackEvent } = useMatomo();
	let history = useHistory();

	useEffect(() => {
		trackPageView()
	}, [history, trackPageView])

	const addUser = () => {
		if(email == null || email === ''){
			return;
		}
		const user = { username: email, password: 'test', 'email': email, createdby: 'rcpopup' };
		trackEvent({ category: 'signup-page', action: 'signup' });
		fetch(USER_URL, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(user),
		})
		.catch((err) => {
			console.error(err)
		});
		setPosted(true);
	}

    if (posted === true) {
        return <Redirect to={'/thanks'} />;
    }


	return (
		<form
			className={classnames(
				'newsletter-form field field-grouped is-revealing',
				className
			)}
		>
			<div className="control control-expanded">
				<input
					className="input"
					type="email"
					name="email"
					placeholder="Your best email&hellip;"
					onChange={e => setEmail(e.target.value)}
					required
				/>
			</div>
			<div className="control">
				<button
					className="button button-primary button-block button-shadow"
					type="submit"
					onClick={() => {addUser()}}
				>
					Get early access
				</button>
			</div>
		</form>
	);
}

export default NewsletterForm;
