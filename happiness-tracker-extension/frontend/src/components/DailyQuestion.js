import { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './DailyQuestion.module.css';

// const baseUrl = 'http://localhost:5000/api/v1/';
const baseUrl = 'http://happiness-tracker-extension-dev.us-east-2.elasticbeanstalk.com/api/v1/';

const DailyQuestion = ({
	today,
	todayParsed,
	tomorrowDate,
	tomorrowDateParsed,
	user,
	answerForDailyQuestion,
	answerToDailyQuestion,
	setQuestionDailyQ,
	dailyQuestion,
}) => {
	const [question, setQuestion] = useState(dailyQuestion);
	const [name, setName] = useState('');

	const userLatest = JSON.parse(localStorage.getItem('user'));

	useEffect(() => {
		if (userLatest) {
			setName(userLatest.name);
		} else {
			setName('');
		}
	}, [userLatest]);

	const differentDateFormat = (date) => {
		const dateArray = date.split('-');
		const months = [
			'Jan',
			'Feb',
			'Mar',
			'Apr',
			'May',
			'Jun',
			'Jul',
			'Aug',
			'Sep',
			'Oct',
			'Nov',
			'Dec',
		];
		const month = months[parseInt(dateArray[1]) - 1];
		return `${dateArray[0]}-${month}-${dateArray[2]}`;
	};

	useEffect(() => {
		const todayQuestion = localStorage.getItem(
			`beatific-question-${todayParsed}`
		);
		const tomorrowQuestion = localStorage.getItem(
			`beatific-question-${tomorrowDateParsed}`
		);

		if (todayQuestion) {
			setQuestion(todayQuestion);
		} else {
			axios
				.get(
					`http://happiness-tracker-extension-dev.us-east-2.elasticbeanstalk.com/api/v1/questions/${today}`,
					{
						headers: {
							Authorization: `Bearer ${userLatest && userLatest.token}`,
						},
						params: {
							date: today,
						},
					}
				)
				.then((res) => {
					if (res.data.question) {
						localStorage.setItem(
							`beatific-question-${todayParsed}`,
							res.data.text
						);
						setQuestion(res.data.text);
					} else {
						localStorage.setItem(
							`beatific-question-${todayParsed}`,
							'What does happiness mean to you?'
						);
						setQuestion('What does happiness mean to you?');
					}
				})
				.catch((err) => {
					localStorage.setItem(
						`beatific-question-${todayParsed}`,
						'What does happiness mean to you?'
					);
					setQuestion('What does happiness mean to you?');
				});
		}

		axios
			.get(
				`http://happiness-tracker-extension-dev.us-east-2.elasticbeanstalk.com/api/v1/questions/${today}T00:00:00.000Z`,
				{
					headers: {
						Authorization: `Bearer ${userLatest && userLatest.token}`,
					},
					params: {
						date: today,
					},
				}
			)
			.then((res) => {
				if (res.data.text && res.data.text.toString() !== todayQuestion) {
					localStorage.removeItem(`beatific-question-${todayParsed}`);
					localStorage.setItem(
						`beatific-question-${todayParsed}`,
						res.data.text
					);
				}
			})
			.catch((err) => {});

		if (!tomorrowQuestion) {
			axios
				.get(
					`http://happiness-tracker-extension-dev.us-east-2.elasticbeanstalk.com/api/v1/questions/${tomorrowDate}T00:00:00.000Z`,
					{
						headers: {
							Authorization: `Bearer ${userLatest && userLatest.token}`,
						},
						params: {
							date: today,
						},
					}
				)
				.then((res) => {
					localStorage.setItem(
						`beatific-question-${tomorrowDateParsed}`,
						res.data.text
					);
				})
				.catch((err) => {
					localStorage.setItem(
						`beatific-question-${tomorrowDateParsed}`,
						'What does happiness mean to you?'
					);
				});
		}

		axios
			.get(
				`http://happiness-tracker-extension-dev.us-east-2.elasticbeanstalk.com/api/v1/questions/${tomorrowDate}T00:00:00.000Z`,
				{
					headers: {
						Authorization: `Bearer ${userLatest && userLatest.token}`,
					},
					params: {
						date: tomorrowDate,
					},
				}
			)
			.then((res) => {
				if (res.data.text && res.data.text.toString() !== tomorrowQuestion) {
					localStorage.removeItem(`beatific-question-${tomorrowDateParsed}`);
					localStorage.setItem(
						`beatific-question-${tomorrowDateParsed}`,
						res.data.text
					);
				}
			})
			.catch((err) => {});
	}, [todayParsed, tomorrowDateParsed, today, tomorrowDate, userLatest]);

	const firstwordInQuestion = question.split(' ')[0];
	const restOfQuestion = question.split(' ').slice(1).join(' ');

	const handleSubmit = () => {};

	const [fadedOut, setFadedOut] = useState(false);

	useEffect(() => {
		let timer;
		let whenMouseMoves = () => {
			setFadedOut(false);
			clearTimeout(timer);
			timer = setTimeout(() => setFadedOut(true), 10000);
		};
		whenMouseMoves();
		window.addEventListener('mousemove', whenMouseMoves);

		return () => {
			window.removeEventListener('mousemove', whenMouseMoves);
		};
	}, []);

	return (
		<div
			className={styles.questionContainer}
			style={fadedOut ? { opacity: '0.04' } : { transition: '0.3s' }}
		>
			{question ? (
				<div className={styles.inner}>
					<h1>Hi {name}</h1>
					<form onSubmit={handleSubmit}>
						<label htmlFor='answer'>
							<em>{firstwordInQuestion}</em> {restOfQuestion}
						</label>
						<input
							type='text'
							name='answer'
							id='answer'
							placeholder='I...'
							value={answerToDailyQuestion}
							onKeyDown={(e) => {
								if (e.code === 'Enter' || e.code === 'NumpadEnter') {
									e.preventDefault();
									const data = {
										dailyQuestion: {
											user: user._id,
											question: question,
											answer: answerToDailyQuestion,
										},
									};
									axios
										.post(
											`http://happiness-tracker-extension-dev.us-east-2.elasticbeanstalk.com/api/v1/plans/${
												user._id
											}/${new Date(differentDateFormat(today))}`,
											data,
											{
												headers: {
													Authorization: `Bearer ${user && user.token}`,
												},
											}
										)
										.then((res) => {
											console.log(res.data);
										})
										.catch((err) => {
											console.log(err);
										});
								}
							}}
							onChange={(e) => {
								answerForDailyQuestion(e.target.value);
							}}
						/>
					</form>
				</div>
			) : (
				' '
			)}
		</div>
	);
};

export default DailyQuestion;
