// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,

  apiUrl: 'http://localhost:53145/api/',
  profileImageUrl: 'http://localhost:53145/Profile/',
  attachmentUrl: 'http://localhost:53145/Attachment/',

  zoomApiAuthorizationUrl: 'https://zoom.us/oauth/authorize?client_id={CLIENT_ID}&redirect_uri={REDIRECT_URI}&response_type=code&scope=user',
  zoomApiRedirectUri: 'http://localhost:4200/teacherDashboard/',
  zoomApiClientId: '{CLIENTID}',

  zoomSdkKey: '{KEY}',
  zoomSdkSecret: '{SECRET}',
  zoomMeetingLeaveUrl: 'http://localhost:4200/',

  stripeApiKey: '{KEY}',
};

