const ANALYTICS = {
  VALUE: 'analytics',
  VIEW_VALUE: 'Analytics'
} as const;

const APPLICATIONS = {
  VALUE: 'applications',
  VIEW_VALUE: 'Applications'
} as const;

const JOB_BOARDS = {
  VALUE: 'job_boards',
  VIEW_VALUE: 'Job Boards'
} as const;

const NO_RESPONSE = {
  VALUE: 'no_response',
  VIEW_VALUE: 'No Response'
} as const;

const OFFERS = {
  VALUE: 'offers',
  VIEW_VALUE: 'Offers'
} as const;

const REJECTIONS = {
  VALUE: 'rejections',
  VIEW_VALUE: 'Rejections'
} as const;

const SIGN_IN = {
  VALUE: 'sign_in',
  VIEW_VALUE: 'Sign in',
  ROUTE: '/auth/sign-in'
} as const;

const SIGN_UP = {
  VALUE: 'sign_up',
  VIEW_VALUE: 'Sign up',
  ROUTE: '/auth/sign-up'
} as const;

export { ANALYTICS, APPLICATIONS, JOB_BOARDS, NO_RESPONSE, OFFERS, REJECTIONS, SIGN_IN, SIGN_UP };
