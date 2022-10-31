import { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './QuoteOrBible.module.css';

const QuoteOrBible = ({ quoteOrBible, user, today }) => {
	const [display, setDisplay] = useState('');

	useEffect(() => {
		const config = {
			headers: { Authorization: `Bearer ${user && user.token}` },
			params: {
				date: today,
			},
		};

		// const baseUrl = 'http://localhost:5000/api/v1/';
		const baseUrl =
			'http://happiness-tracker-extension-dev.us-east-2.elasticbeanstalk.com/api/v1/';

		const whatToGet =
			quoteOrBible === 'quote'
				? `quotes/${today}T00:00:00.000Z`
				: `bible/${today}T00:00:00.000Z`;

		axios
			.get(baseUrl + whatToGet, config)
			.then((res) => {
				console.log(res.data);
				setDisplay(res.data?.text);
			})
			.catch((err) => {
				console.log(err);
			});
	}, [quoteOrBible, user, today]);

	return (
		<div className={styles.quoteContainer}>
			{display ? <p>"{display}"</p> : ' '}
		</div>
	);
};

export default QuoteOrBible;
