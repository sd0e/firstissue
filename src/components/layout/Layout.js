import React from 'react'
import PageHeader from './PageHeader'

export default function Layout({ children, user }) {
	return (
		<div>
			<PageHeader user={user} />
			<div className="px-6 py-2">
				{children}
			</div>
		</div>
	)
}