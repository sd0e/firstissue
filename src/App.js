import { createTheme, ThemeProvider } from '@mui/material';
import { BrowserRouter } from 'react-router-dom';

import PageRoutes from './components/layout/PageRoutes';

function App() {
	const theme = createTheme({
		palette: {
			mode: 'dark',
		},
	});

	return (
		<ThemeProvider theme={theme}>
			<BrowserRouter>
				<PageRoutes />
			</BrowserRouter>
		</ThemeProvider>
	);
}

export default App;
