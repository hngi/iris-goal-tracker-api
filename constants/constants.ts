export const constants = {
  BODY_PARSER_LIMIT: '50mb',

  EMPTY_STRING: '',
  ZERO: 0,

  ITEMS_PER_PAGE: 10,

  ERROR: 'error',
  SUCCESS: 'success',
  PENDING: 'pending',
  ENABLED: 'enabled',

  VERIFICATION_TYPE_EMAIL: 'email',

  EMAIL_REGEX: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,

  BASE_URL: 'https://iris-goal-tracker-api.herokuapp.com',

  CREATE_ACCOUNT_TEMPLATE: 'accountCreated',
  FORGOT_PASSWORD_TEMPLATE: 'forgotPassword',
  INVITE_USER_TEMPLATE: 'userInvite',
  CREATE_ACCOUNT_SUBJECT: 'Email Verification',
  FORGOT_PASSWORD_SUBJECT: 'Reset your password'
}