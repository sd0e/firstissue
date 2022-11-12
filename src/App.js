import { createTheme, ThemeProvider } from '@mui/material';
import { BrowserRouter } from 'react-router-dom';

import PageRoutes from './components/layout/PageRoutes';

function App() {
	const theme = createTheme({
		palette: {
			mode: 'dark',
		},
		typography: {
			fontFamily: [
				'"Inter"',
				'sans-serif'
			],
		},
		components: {
			MuiButton: {
				styleOverrides: {
					root: {
						fontWeight: 500,
						textTransform: 'none',
						fontFamily: '"Inter", sans-serif',
					}
				}
			}
		}
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
