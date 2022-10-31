import axios from 'axios';
import React, { useState } from 'react';
import styles from './ResetPassword.module.css';

const ResetPassword = () => {
	const [password1, setPassword1] = useState('');
	const [password2, setPassword2] = useState('');

	const queryString = window.location.search;
	const email = new URLSearchParams(queryString).get('email');
	const password1Input = document.getElementById('password1');
	const password2Input = document.getElementById('password2');
	const warning = document.getElementById('warning');

	const handleSubmit = (e) => {
		e.preventDefault();

		if (password1 !== password2) {
			password1Input.style.border = '1px solid red';
			password2Input.style.border = '1px solid red';
			warning.style.display = 'block';
		} else {
			password1Input.style.border = '0.5px solid black';
			password2Input.style.border = '0.5px solid black';
			warning.style.display = 'none';
		}

		if (password1 === '' || password2 === '') {
			password1Input.style.border = '1px solid red';
			password2Input.style.border = '1px solid red';
			warning.style.display = 'block';
			warning.innerText = 'Both password fields must be filled';
		} else {
			password1Input.style.border = '0.5px solid black';
			password2Input.style.border = '0.5px solid black';
			warning.style.display = 'none';

			// use localhost:5000 in dev

			axios
				.post(
					'http://happiness-tracker-extension-dev.us-east-2.elasticbeanstalk.com/change-password',
					{
						password: password1,
						email,
					}
				)
				.then((res) => {
					console.log(res.data);
					alert(res.data.message);
				})
				.catch((err) => console.log(err));
		}
	};

	return (
		<div className={styles.resetPassword}>
			<h2>Set new password</h2>
			<p>Your new password must be different from previously used passwords.</p>
			<form onSubmit={handleSubmit}>
				<label htmlFor='password1'>Password</label>
				<input
					type='password'
					name='password1'
					id='password1'
					value={password1}
					onChange={(e) => setPassword1(e.target.value)}
				/>

				<label htmlFor='password2'>Confirm password</label>
				<input
					type='password'
					name='password2'
					id='password2'
					value={password2}
					onChange={(e) => setPassword2(e.target.value)}
				/>
				<p className={styles.warning} id='warning'>
					Both passwords must match!
				</p>
				<button type='submit'>Reset Password</button>
			</form>
		</div>
	);
};

export default ResetPassword;
