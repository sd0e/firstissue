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
				'-apple-system',
				'BlinkMacSystemFont',
				'"Segoe UI"',
				'Roboto',
				'"Helvetica Neue"',
				'Arial',
				'sans-serif',
				'"Apple Color Emoji"',
				'"Segoe UI Emoji"',
				'"Segoe UI Symbol"',
				'sans-serif',
			].join(','),
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
			}, 
			MuiTextField: {
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
