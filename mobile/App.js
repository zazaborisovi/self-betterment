import * as Sentry from '@sentry/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from './src/context/authContext';
import RootNavigator from './src/navigators/RootNavigator';

Sentry.init({
  dsn: 'https://379d41d17b4cd47d4cac0a03abe007a8@o4511157497954304.ingest.us.sentry.io/4511168156139520',

  // Adds more context data to events (IP address, cookies, user, etc.)
  // For more information, visit: https://docs.sentry.io/platforms/react-native/data-management/data-collected/
  sendDefaultPii: true,

  // Enable Logs
  enableLogs: true,

  // Configure Session Replay
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1,
  integrations: [Sentry.mobileReplayIntegration(), Sentry.feedbackIntegration()],

  // uncomment the line below to enable Spotlight (https://spotlightjs.com)
  // spotlight: __DEV__,
});

export default Sentry.wrap(function App() {
  return (
    <NavigationContainer>
      <AuthProvider>
        <RootNavigator />
      </AuthProvider>
    </NavigationContainer>
  );
});