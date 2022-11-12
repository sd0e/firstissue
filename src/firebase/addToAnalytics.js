import { getAnalytics, logEvent } from 'firebase/analytics';

const addToAnalytics = (title, path) => {
	const analytics = getAnalytics();
	logEvent(analytics, 'page_view', {page_title: title, page_location: window.location.href, page_path: path});
}

export default addToAnalytics;