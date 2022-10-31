import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
	Elements,
	CardElement,
	useStripe,
	useElements,
} from '@stripe/react-stripe-js';
import axios from 'axios';
import { io } from 'socket.io-client';
import arrowForward from '../images/arrowOnly.svg';
import arrowBack from '../images/backArrow.svg';
import badge from '../images/badgeMark.svg';
import star from '../images/ratingStar.svg';
import priceBadge from '../images/pricebadge.svg';
import lock from '../images/2886699.svg';
import styles from './Subscribe.module.css';
import Loader from './Loader';

const stripePromise = loadStripe(
	'pk_test_51KddlyDk6SusXP09fF6dnGqxnXpKOz3vB215G4WPbtoI3wvrrPifNbnZXIe9Q9Lu0SP8Paebt8JfxJkYWGVZxPgm00UBWt8TvU'
);

const newSocket = io('http://happiness-tracker-extension-dev.us-east-2.elasticbeanstalk.com');

const Subscribe = ({ user, isSubscribed }) => {
	return (
		<Elements stripe={stripePromise}>
			<Child user={user} isSubscribed={isSubscribed} />
		</Elements>
	);
};

const Child = ({ user, isSubscribed }) => {
	const [payPeriod, setPayPeriod] = useState('monthly');
	const [step, setStep] = useState('1');
	const [loading, setLoading] = useState(false);
	const [subAmounts, setSubAmounts] = useState({
		left: '$0.99',
		mid: '$3.99',
		right: '$9.99',
	});
	const [subscriptionAmount, setSubscriptionAmount] = useState(
		subAmounts['mid']
	);

	const stripe = useStripe();
	const elements = useElements();

	// handling socket stuff
	useEffect(() => {
		newSocket.on('transaction-end', (msg) => {
			console.log(msg);
			if (msg === 'success') {
				setLoading(false);
				isSubscribed(true);
				// eslint-disable-next-line no-restricted-globals
				location.reload();
			} else if (msg === 'failed') {
				alert('Something went wrong. Please try again');
			}
		});

		return () => newSocket.close();
	}, [isSubscribed]);

	const inputStyle = {
		width: '499px',
		height: '51px',
		border: '1px solid #E8E8E8',
		borderRadius: '90px',
		fontSize: '18px',
		color: '#000000',
		background: '#FFFFFFBA 0% 0% no-repeat padding-box',
		padding: '14px 22px 11px 22px',
		margin: 'auto',
	};

	const handleSubmitSub = async (e) => {
		e.preventDefault();
		setLoading(true);

		const userData = {
			name: user.name,
			email: user.email,
			password: user.password,
		};

		const user = await axios.post(
			'http://happiness-tracker-extension-dev.us-east-2.elasticbeanstalk.com/api/v1/users',
			userData
		);
		if (user) {
			localStorage.setItem('user', JSON.stringify(user.data));
			axios
				.post(
					'http://happiness-tracker-extension-dev.us-east-2.elasticbeanstalk.com/stripe/create-sub',
					{
						name: user.name,
						email: user.email,
						subscriptionAmount,
					}
				)
				.then((res) => {
					window.open(res.data.url, '_blank');
				})
				.catch((err) => console.log(err));
		}
	};

	const getText = () => {
		if (subscriptionAmount === '$0.99' || subscriptionAmount === '$11.88') {
			return 'Join our family';
		} else if (
			subscriptionAmount === '$3.99' ||
			subscriptionAmount === '$47.88'
		) {
			return 'Join our family and pay forward for one person';
		} else if (
			subscriptionAmount === '$9.99' ||
			subscriptionAmount === '$119.88'
		) {
			return 'Join our family and pay forward for two people';
		}
	};

	return (
		<div className={styles.subscribeView}>
			<div className={styles.welcome}>
				<div className={styles.mainSection}>
					{user.name &&
						(user.name ? (
							<p>I'm {user.name} it feels good to</p>
						) : (
							<p>It feels good to</p>
						))}
					<h2>Pay Forward</h2>
					<div className={styles.innerContainer}>
						<div className={styles.promoSection}>
							<p>5.0</p>
							<div className={styles.starSection}>
								<img src={star} alt='icon of rating star' />
								<img src={star} alt='icon of rating star' />
								<img src={star} alt='icon of rating star' />
								<img src={star} alt='icon of rating star' />
								<img src={star} alt='icon of rating star' />
							</div>
							<article>5000+ LIVES CHANGED</article>
						</div>
						<div className={styles.monthlyOrYearlyTab}>
							<div className={styles.monthlyOrYearly}>
								<button
									type='button'
									onClick={() => {
										setPayPeriod('monthly');
										setSubAmounts({
											left: '$0.99',
											mid: '$3.99',
											right: '$9.99',
										});
									}}
									style={{
										marginRight: '30px',
										opacity: payPeriod === 'monthly' ? 1 : 0.53,
										borderBottom:
											payPeriod === 'monthly' ? '2px solid #FF00c4' : 'none',
									}}
								>
									MONTHLY
								</button>
								<button
									type='button'
									onClick={() => {
										setPayPeriod('yearly');
										setSubAmounts({
											left: '$11.88',
											mid: '$47.88',
											right: '$119.88',
										});
									}}
									style={{
										opacity: payPeriod === 'yearly' ? 1 : 0.53,
										borderBottom:
											payPeriod === 'yearly' ? '2px solid #FF00c4' : 'none',
									}}
								>
									YEARLY
								</button>
							</div>
							{payPeriod === 'monthly' ? (
								<div className={styles.monthlyPrices}>
									<input
										type='radio'
										name='price'
										value='$0.99'
										id='$0.99'
										onChange={(e) => setSubscriptionAmount(subAmounts['left'])}
									/>
									<label
										htmlFor='$0.99'
										className={styles.radioBtnGroup}
										style={{
											backgroundColor:
												subscriptionAmount === '$0.99' ? '#0089ff' : '',
											border:
												subscriptionAmount === '$0.99'
													? '1px solid #ffffff'
													: '',
											color: subscriptionAmount === '$0.99' ? '#ffffff' : '',
										}}
									>
										<img src={priceBadge} alt='badge' />
										$0.99
									</label>
									<input
										type='radio'
										name='price'
										value='$3.99'
										id='$3.99'
										onChange={(e) => setSubscriptionAmount(subAmounts['mid'])}
									/>
									<label
										htmlFor='$3.99'
										className={styles.radioBtnGroup}
										style={{
											backgroundColor:
												subscriptionAmount === '$3.99' ? '#0089ff' : '',
											border:
												subscriptionAmount === '$3.99'
													? '1px solid #ffffff'
													: '',
											color: subscriptionAmount === '$3.99' ? '#ffffff' : '',
										}}
									>
										<img src={priceBadge} alt='badge' />
										$3.99
									</label>
									<input
										type='radio'
										name='price'
										value='$9.99'
										id='$9.99'
										onChange={(e) => setSubscriptionAmount(subAmounts['right'])}
										checked={subscriptionAmount === '$9.99'}
									/>
									<label
										htmlFor='$9.99'
										className={styles.radioBtnGroup}
										style={{
											backgroundColor:
												subscriptionAmount === '$9.99' ? '#0089ff' : '',
											border:
												subscriptionAmount === '$9.99'
													? '1px solid #ffffff'
													: '',
											color: subscriptionAmount === '$9.99' ? '#ffffff' : '',
										}}
									>
										<img src={priceBadge} alt='badge' />
										$9.99
									</label>
								</div>
							) : (
								<div className={styles.yearlyPrices}>
									<input
										type='radio'
										name='price'
										value='$11.88'
										id='$11.88'
										onChange={(e) => setSubscriptionAmount(subAmounts['left'])}
										checked={subscriptionAmount === '$11.88'}
									/>
									<label
										htmlFor='$11.88'
										className={styles.radioBtnGroup}
										style={{
											backgroundColor:
												subscriptionAmount === '$11.88' ? '#0089ff' : '',
											border:
												subscriptionAmount === '$11.88'
													? '1px solid #ffffff'
													: '',
											color: subscriptionAmount === '$11.88' ? '#ffffff' : '',
										}}
									>
										<img src={priceBadge} alt='badge' />
										$11.88
									</label>
									<input
										type='radio'
										name='price'
										value='$47.88'
										id='$47.88'
										onChange={(e) => setSubscriptionAmount(subAmounts['mid'])}
										checked={subscriptionAmount === '$47.88'}
									/>
									<label
										htmlFor='$47.88'
										className={styles.radioBtnGroup}
										style={{
											backgroundColor:
												subscriptionAmount === '$47.88' ? '#0089ff' : '',
											border:
												subscriptionAmount === '$47.88'
													? '1px solid #ffffff'
													: '',
											color: subscriptionAmount === '$47.88' ? '#ffffff' : '',
										}}
									>
										<img src={priceBadge} alt='badge' />
										$47.88
									</label>
									<input
										type='radio'
										name='price'
										value='$119.88'
										id='$119.88'
										onChange={(e) => setSubscriptionAmount(subAmounts['right'])}
										checked={subscriptionAmount === '$119.88'}
									/>
									<label
										htmlFor='$119.88'
										className={styles.radioBtnGroup}
										style={{
											backgroundColor:
												subscriptionAmount === '$119.88' ? '#0089ff' : '',
											border:
												subscriptionAmount === '$119.88'
													? '1px solid #ffffff'
													: '',
											color: subscriptionAmount === '$119.88' ? '#ffffff' : '',
										}}
									>
										<img src={priceBadge} alt='badge' />
										$119.88
									</label>
								</div>
							)}
							<p>{getText()}</p>
							<button
								type='submit'
								onClick={(e) => handleSubmitSub(e)}
								className={styles.buttonWithLoader}
								disabled={subscriptionAmount === ''}
							>
								<span>{loading ? <Loader /> : 'PAY FORWARD'}</span>
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Subscribe;
