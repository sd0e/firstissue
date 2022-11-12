import React from 'react'
import Header from '../Header'

export default function Layout({ children }) {
	return (
		<div>
			<Header />
			<div className="px-6 py-2">
				{children}
			</div>
		</div>
	)
}