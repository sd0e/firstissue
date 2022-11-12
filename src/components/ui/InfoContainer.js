import React from 'react';

export default function InfoContainer({ Title, Description, className }) {
	return (
		<div className={className}>
			<h1 className="font-semibold font-sans text-xl mb-2">{Title}</h1>
			<h1 className="font-semibold font-sans text-l text-semivisible">{Description}</h1>
		</div>
	)
}