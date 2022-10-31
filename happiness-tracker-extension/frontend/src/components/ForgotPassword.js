import React, { useRef, useState } from 'react';
import styles from './ForgotPassword.module.css';
import coloredLock from '../images/coloredLock.png';
import mail from '../images/482947.svg';
import arrowForward from '../images/arrowOnly.svg';
import arrowBtnSignUp from '../images/arrowBtnLoginTransparent.svg';

import axios from 'axios';

const ForgotPassword = ({ wantToSignUp, goToForgotPassword }) => {
	const [email, setEmail] = useState('');
	const [submitted, setSubmitted] = useState(false);
	const [messageFromBackend, setMessageFromBackend] = useState('');
	const emailRef = useRef(null);

	const warning = document.getElementById('warning');
	const inputSection = document.getElementById('emailGroup');

	const validated = (email) => {
		const emailRegex = /\S+@\S+\.\S+/;

		return emailRegex.test(email);
	};

	const handleEmailChange = (e) => {
		setEmail(e.target.value);

		if (email) {
			warning.style.display = 'none';
			inputSection.style.border = 'none';
		}
	};

	const handleEmailSubmit = (e) => {
		e.preventDefault();

		if (!validated(email)) {
			warning.style.display = 'block';
			inputSection.style.border = '1px solid red';
		} else {
			warning.style.display = 'none';
			inputSection.style.border = 'none';
			axios
				.post(
					`http://happiness-tracker-extension-dev.us-east-2.elasticbeanstalk.com/reset-password/${email}`
				)
				.then((res) => {
					setMessageFromBackend(res.data.message);
					setSubmitted(true);
				})
				.catch((err) => console.log(err));
		}
	};

	return (
		<div className={styles.forgotPassword}>
			<div className={styles.emojiSection}>
				<img
					width={68}
					height={68}
					src={coloredLock}
					className={styles.coloredLockImg}
					alt='Emoji of padlock'
				/>
				<p>Forgot Password</p>
			</div>
			{submitted ? (
				<h2>{messageFromBackend}</h2>
			) : (
				<div className={styles.formSection}>
					<form onSubmit={handleEmailSubmit}>
						<div className={styles.inputAndWarning}>
							<p
								id='warning'
								style={{ color: '#FF0000' }}
								className={styles.warning}
							>
								Invalid email address. Valid e-mail can contain only latin
								letters, numbers, '@' and '.'
							</p>
							<div id='emailGroup' className={styles.formInput}>
								<span className={styles.icon}>
									<img src={mail} className={styles.mail} alt='mail icon' />
								</span>
								<input
									style={{ paddingLeft: '10px' }}
									ref={emailRef}
									type='email'
									name='email'
									id='email'
									placeholder='email'
									onChange={handleEmailChange}
									onKeyDown={(e) => {
										if (e.code === 'Enter') {
											e.preventDefault();
											handleEmailSubmit(e);
										}
									}}
									value={email}
									required
								/>
							</div>
						</div>
						<button type='submit' className={styles.forwardBtn}>
							<img
								src={arrowForward}
								className={styles.arrowBtn}
								alt='go to next form step'
							/>
						</button>
					</form>
				</div>
			)}
			{submitted && (
				<button onClick={handleEmailSubmit}>RESEND INSTRUCTIONS</button>
			)}
			<div className={styles.footerLinks}>
				<p>GO BACK TO LOGIN</p>
				<button
					type='button'
					onClick={() => {
						goToForgotPassword(false);
						wantToSignUp(false);
					}}
				>
					<img src={arrowBtnSignUp} className={styles.arrow} alt='Arrow' />
				</button>
			</div>
		</div>
	);
};

export default ForgotPassword;
