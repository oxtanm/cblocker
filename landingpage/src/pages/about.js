import React from 'react';
import Layout from '../layouts/index';

export default function AboutPage() {
	return (
		<Layout>
			<article className="entry">
				<div className="container">
					<div className="entry-inner">
						<div className="entry-content">
							<div className="container-sm">
								<header className="entry-header">
									<h1 className="entry-title">About</h1>
								</header>

								<div className="entry-body">
									<p>
										RCPopup is a chrome extension to avoid all those cookie popups.
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</article>
		</Layout>
	);
}
