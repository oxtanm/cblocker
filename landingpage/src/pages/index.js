import React from 'react';
import Layout from '../layouts/index';
import Hero from '../components/hero/Hero';
import HeroIllustration from '../components/hero/HeroIllustration';

export default function IndexPage() {
	return (
		<Layout>
			<Hero
				title="Remove Cookie Popups"
				content="RCPopup is the only chrome extension that auto answers all the cookie popups so you don’t have to. Set it up once and RCPopup will remove the cookie popups by answering for you."
				illustration={HeroIllustration}
			/>
		</Layout>
	);
}
