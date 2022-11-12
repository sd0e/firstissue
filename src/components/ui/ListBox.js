import React from 'react'
import Pill from './Pill'

export default function ListBox({ Title, Array, baseURL }) {
	// Array in format [[name, color, page], ...]

	return (
		<div className="border-solid border-2 border-border rounded-lg mt-6">
			<div>
				<span className="font-sans font-semibold block p-4">{Title}</span>
				<hr className="bg-border" style={{ border: 'none', height: '2px' }} />
				<div className="p-4 pb-2">
					{Array.map(item => {
						return <Pill color={item[1]} page={`${baseURL}${item[2]}`} key={item[0]}>{item[0]}</Pill>
					})}
				</div>
			</div>
		</div>
	)
}