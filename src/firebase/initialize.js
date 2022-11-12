import { initializeApp } from "firebase/app";
import { initializeAnalytics } from "firebase/analytics";

const firebaseConfig = {
	apiKey: "AIzaSyDQmyZQW8FXMKBurg-k7nzkYsT3DI6dLb4",
	authDomain: "first-issue.firebaseapp.com",
	projectId: "first-issue",
	storageBucket: "first-issue.appspot.com",
	messagingSenderId: "685939909492",
	appId: "1:685939909492:web:48f485f1b54ed5cfba8221",
	measurementId: "G-V5NLY0WCET"
};

const firebaseApp = initializeApp(firebaseConfig);
initializeAnalytics(firebaseApp);

export default firebaseApp;