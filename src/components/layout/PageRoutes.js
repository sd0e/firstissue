import React from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';

import Layout from './Layout';
import Home from '../../pages/Home';
import PageNotFound from '../../pages/PageNotFound';

export default function PageRoutes() {
	const location = useLocation();

	return (
		<Layout>
			<Routes location={location} key={location.pathname}>
				<Route path="/" element={<Home />} />
				<Route path="*" element={<PageNotFound />} />
			</Routes>
		</Layout>
	)
}