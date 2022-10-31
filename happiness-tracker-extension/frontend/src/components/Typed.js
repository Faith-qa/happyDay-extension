import styles from './Typed.module.css';

import { useEffect } from 'react';

const Typed = ({ firstword, restofphrase, dataWait }) => {
	class Type {
		constructor(txtElement, firstword, restofphrase, wait = dataWait) {
			this.txtElement = txtElement;
			this.firstword = firstword;
			this.restofphrase = restofphrase;
			this.txt = '';
			this.wait = parseInt(wait, 10);
			this.wordIndex = 0;
			this.typeOut();
			this.isDeleting = false;
		}
		typeOut() {
			const fullTxt = this.firstword + ' ' + this.restofphrase;

			// check if deleting
			if (this.isDeleting) {
				// remove text
				this.txt = fullTxt.substring(0, this.txt.length - 1);
			} else {
				// add text
				this.txt = fullTxt.substring(0, this.txt.length + 1);
			}

			this.txtElement.innerHTML = `<span class='txt'><em>${
				this.txt.split(' ')[0]
			}</em> ${this.txt.split(' ').slice(1).join(' ')}</span>`;

			let typeSpeed = 150;

			if (this.isDeleting) {
				typeSpeed /= 2;
			}

			// check if word is complete
			if (!this.isDeleting && this.txt === fullTxt) {
				typeSpeed = this.wait;
			}

			setTimeout(() => this.typeOut(), typeSpeed);
		}
	}

	useEffect(() => {
		const txtElement = document.getElementById('txt-type');
		const firstword = txtElement.getAttribute('firstword');
		const restofphrase = txtElement.getAttribute('restofphrase');
		const wait = txtElement.getAttribute('data-wait');

		// initializing Type
		new Type(txtElement, firstword, restofphrase, wait);
	}, []);

	return (
		<div className={styles.container}>
			<span
				id='txt-type'
				className={styles.txtType}
				data-wait={dataWait}
				firstword={firstword}
				restofphrase={restofphrase}
			></span>
		</div>
	);
};

export default Typed;
