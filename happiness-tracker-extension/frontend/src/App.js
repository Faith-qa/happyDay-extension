import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import Login from './components/Login';
import ForgotPassword from './components/ForgotPassword';
import SignUp from './components/SignUp';
import Subscribe from './components/Subscribe';
import MainSection from './components/MainSection';
import ResetPassword from './components/ResetPassword';
import { Helmet } from 'react-helmet';
import ReactGA from 'react-ga';

const TRACKINGID = 'G-S9JG17MMY8';
ReactGA.initialize(TRACKINGID);

function App() {
	const [loggedIn, setLoggedIn] = useState(false);
	const [signUp, setSignUp] = useState(false);
	const [subscribed, setSubscribed] = useState(true);
	const [forgotPassword, setForgotPassword] = useState(false);
	const [bgImage, setBgImage] = useState('');
	const [dailyQuestion, setDailyQuestion] = useState('');

	const user = JSON.parse(localStorage.getItem('user'));

	// get today's date
	const now = new Date();
	const yyyy = now.getFullYear();
	let mm = now.getMonth() + 1;
	let dd = now.getDate();
	const tomorrow = new Date(yyyy, mm, dd + 1);
	const dayTomorrow = tomorrow.getDate();
	const monthTomorrow = tomorrow.getMonth();
	const yearTomorrow = tomorrow.getFullYear();

	if (dd < 10) dd = '0' + dd;
	if (mm < 10) mm = '0' + mm;

	const todayParsed = `${yyyy}-${parseInt(mm)}-${parseInt(dd)}`;
	const today = `${yyyy}-${mm}-${dd}`;
	const tomorrowDate = `${yearTomorrow}-${monthTomorrow}-${dayTomorrow}`;
	const tomorrowDateParsed = `${yearTomorrow}-${parseInt(
		monthTomorrow
	)}-${parseInt(dayTomorrow)}`;

	useEffect(() => {
		const todayImg = localStorage.getItem(`beatific-image-${todayParsed}`);
		const tomorrowImg = localStorage.getItem(
			`beatific-image-${tomorrowDateParsed}`
		);

		if (todayImg) {
			setBgImage(todayImg);
		} else {
			axios
				.get(
					`http://happiness-tracker-extension-dev.us-east-2.elasticbeanstalk.com/api/v1/images/${today}`
				)
				.then((res) => {
					if (res.data.image) {
						localStorage.setItem(
							`beatific-image-${todayParsed}`,
							res.data.image
						);
						setBgImage(res.data.image);
					} else if (res.message === 'Image not found') {
						console.log('Image not found');
						localStorage.setItem(
							`beatific-image-${todayParsed}`,
							'https://i.postimg.cc/cLjZm9RS/default-01.jpg'
						);
					}
				})
				.catch((err) => {
					localStorage.setItem(
						`beatific-image-${todayParsed}`,
						'https://i.postimg.cc/cLjZm9RS/default-01.jpg'
					);
				});
		}

		axios
			.get(
				`http://happiness-tracker-extension-dev.us-east-2.elasticbeanstalk.com/api/v1/images/${today}`
			)
			.then((res) => {
				if (res.data.image && res.data.image.toString() !== todayImg) {
					localStorage.setItem(`beatific-image-${todayParsed}`, res.data.image);
				} else if (res.message === 'Image not found') {
					console.log('Image not found');
				}
			})
			.catch((err) => {
				if (!todayImg) {
					localStorage.setItem(
						`beatific-image-${todayParsed}`,
						'https://i.postimg.cc/cLjZm9RS/default-01.jpg'
					);
				}
			});

		if (!tomorrowImg) {
			axios
				.get(
					`http://happiness-tracker-extension-dev.us-east-2.elasticbeanstalk.com/api/v1/images/${tomorrowDate}`
				)
				.then((res) => {
					if (res.data.image) {
						localStorage.setItem(
							`beatific-image-${tomorrowDateParsed}`,
							res.data.image
						);
					} else if (res.message === 'Image not found') {
						console.log('Image not found');
						localStorage.setItem(
							`beatific-image-${tomorrowDateParsed}`,
							'https://i.postimg.cc/cLjZm9RS/default-01.jpg'
						);
					}
				})
				.catch((err) => {
					localStorage.setItem(
						`beatific-image-${tomorrowDateParsed}`,
						'https://i.postimg.cc/cLjZm9RS/default-01.jpg'
					);
				});
		}
	}, [today, tomorrowDate, todayParsed, tomorrowDateParsed, user]);

	useEffect(() => {
		if (user !== null) {
			setLoggedIn(true);
			axios
				.get(
					`http://happiness-tracker-extension-dev.us-east-2.elasticbeanstalk.com/subscribed/${
						user?.email
					}/${new Date().getMonth()}`
				)
				.then((res) => {
					if (res.data.message === 'true') {
						setSubscribed(true);
					} else {
						setSubscribed(false);
					}
				})
				.catch((err) => {});
		}

		if (localStorage.getItem('firstTime') === null) {
			setLoggedIn(false);
			setForgotPassword(false);
			setSignUp(true);
			localStorage.setItem('firstTime', 'true');
		}
	}, [user, today]);

	if (window.location.pathname === '/reset-password') {
		return <ResetPassword />;
	}

	const determineLoggedIn = (loggedInState) => setLoggedIn(loggedInState);
	const wantToSignUp = (goToSignUp) => setSignUp(goToSignUp);
	const subscriptionState = (subscribedOrNot) => setSubscribed(subscribedOrNot);
	const goToForgotPassword = (goOrNot) => setForgotPassword(goOrNot);

	if (loggedIn === false && signUp === false && forgotPassword === false) {
		return (
			<div className='App' style={{ backgroundImage: `url(${bgImage})` }}>
				<Helmet>
					<script
						dangerouslySetInnerHTML={{
							__html: (function (c, l, a, r, i, t, y) {
								c[a] =
									c[a] ||
									function () {
										(c[a].q = c[a].q || []).push(arguments);
									};
								t = l.createElement(r);
								t.async = 1;
								t.src = 'https://www.clarity.ms/tag/' + i;
								y = l.getElementsByTagName(r)[0];
								y.parentNode.insertBefore(t, y);
							})(window, document, 'clarity', 'script', 'cvb4rbbild'),
						}}
					/>
				</Helmet>
				<div className='overlay'>
					<Login
						setLoggedIn={determineLoggedIn}
						wantToSignUp={wantToSignUp}
						forgotPassword={forgotPassword}
						goToForgotPassword={goToForgotPassword}
					/>
				</div>
			</div>
		);
	} else if (
		forgotPassword === true &&
		loggedIn === false &&
		signUp === false
	) {
		return (
			<div className='App' style={{ backgroundImage: `url(${bgImage})` }}>
				<ForgotPassword
					goToForgotPassword={goToForgotPassword}
					wantToSignUp={wantToSignUp}
					forgotPassword={forgotPassword}
				/>
			</div>
		);
	} else if (
		loggedIn === false &&
		signUp === true &&
		forgotPassword === false
	) {
		return (
			<div className='App' style={{ backgroundImage: `url(${bgImage})` }}>
				<div className='overlay'>
					<SignUp
						setLoggedIn={determineLoggedIn}
						wantToSignUp={wantToSignUp}
						isSubscribed={subscriptionState}
					/>
				</div>
			</div>
		);
	} else if (loggedIn === true && subscribed === false) {
		return (
			<div className='App' style={{ backgroundImage: `url(${bgImage})` }}>
				<div className='overlay'>
					<Subscribe user={user} isSubscribed={subscriptionState} />
				</div>
			</div>
		);
	}
	return (
		<div
			style={{
				backgroundImage: `url(${bgImage})`,
			}}
			className='App'
		>
			<div className='overlay'>
				{subscribed ? (
					<MainSection
						dailyQuestion={dailyQuestion}
						today={today}
						todayParsed={todayParsed}
						tomorrowDate={tomorrowDate}
						tomorrowDateParsed={tomorrowDateParsed}
						user={user}
						wantToSignUp={wantToSignUp}
						isLoggedIn={determineLoggedIn}
						yyyy={yyyy}
						mm={mm}
						dd={dd}
					/>
				) : (
					<Subscribe user={user} isSubscribed={subscriptionState} />
				)}
			</div>
		</div>
	);
}

export default App;
