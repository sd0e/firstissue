import React from 'react'
import PageHeader from './PageHeader'

export default function Layout({ children }) {
	return (
		<div>
			<PageHeader />
			<div className="px-6 py-2">
				{children}
			</div>
		</div>
	)
}