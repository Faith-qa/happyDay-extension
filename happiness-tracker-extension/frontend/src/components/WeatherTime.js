import { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './WeatherTime.module.css';

const WeatherTime = ({ displayWeather, displayTime, twentyFourHours }) => {
	const [date, setDate] = useState(new Date());
	const [latitude, setLatitude] = useState('');
	const [longitude, setLongitude] = useState('');
	const [location, setLocation] = useState('');
	const [temperature, setTemperature] = useState('');
	const [icon, setIcon] = useState('');

	// const locationIQAccessToken = 'pk.4c254ad503ed859b7d86df8f4913771f';
	const openWeatherAPIKey = '76090957e5a6635e8f6f6dec898ba58d';

	useEffect(() => {
		const interval = setInterval(() => setDate(new Date()), 30000);
		if ('geolocation' in navigator) {
			navigator.geolocation.getCurrentPosition(
				function (position) {
					// setLatitude(position.coords.latitude);
					// setLongitude(position.coords.longitude);

					axios
						.get(
							`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}&localityLanguage=en`
						)
						.then((res) => {
							setLocation(res.data.locality);
						})
						.catch((err) => {
							console.log(err);
						});

					axios
						.get(
							`https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${openWeatherAPIKey}&units=metric`
						)
						.then((res) => {
							setTemperature(res.data.main.temp);
							setIcon(res.data.weather[0].icon);
						})
						.catch((err) => {
							console.log(err);
						});
				},
				(err) => {
					console.log('Something went wrong: ' + err);
				}
			);
		} else {
			alert('Please allow location');
		}

		return () => clearInterval(interval);
	}, []);

	return (
		<div className={styles.weatherTimeContainer}>
			{displayTime && (
				<div className={styles.time}>
					<div className='clock'>
						{
							date
								.toLocaleString('en-US', {
									hour: 'numeric',
									minute: 'numeric',
									hour12: twentyFourHours,
								})
								.split(' ')[0]
						}
					</div>
					<div className={styles.ampm}>
						{date
							.toLocaleString('en-US', {
								hour: 'numeric',
								minute: 'numeric',
								hour12: twentyFourHours,
							})
							.split(' ')[1]
							? date
									.toLocaleString('en-US', {
										hour: 'numeric',
										minute: 'numeric',
										hour12: twentyFourHours,
									})
									.split(' ')[1]
							: ''}
					</div>
				</div>
			)}
			{displayTime && displayWeather && <div className={styles.hr}>&nbsp;</div>}
			{displayWeather && (
				<div className={styles.weather}>
					<div className={styles.temp}>
						{icon !== '' ? (
							<img
								style={{ width: '40px', height: '40px', objectFit: 'contain' }}
								src={`http://openweathermap.org/img/wn/${icon}@2x.png`}
								alt='Weather icon'
							/>
						) : (
							<p>Icn</p>
						)}
						<p className={styles.tempString}>
							{temperature} <span>&deg;</span>
						</p>
					</div>
					<p>{location}</p>
				</div>
			)}
		</div>
	);
};

export default WeatherTime;
