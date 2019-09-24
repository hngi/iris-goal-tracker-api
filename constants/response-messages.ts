export const responseMessages = {
    /* Error Messages */
    GENERIC: 'Something went wrong. Please try again or contact support.',
    ERROR_NOT_FOUND: 'The resource you tried to access does not exist.',
    ERROR_INVALID_TOKEN: 'You provided an invalid token',
    ERROR_EXPIRED_TOKEN: 'Your session has expired. Please log in again.',
    ERROR_EXPIRED_BID: 'The product you are attempting to buzz on has expired.',
    ERROR_MISSING_TOKEN: 'Token missing',
    ERROR_INVALID_PARAMS: 'Invalid parameter(s)',
    ERROR_INVALID_PURCHASE: 'Unable to purchase item',
    ERROR_USER_NOT_CREATED: 'The user was not created for some reason. Please try again',
    ERROR_FAILED_AUTH: 'There was a problem trying to authenticate you.',
    ERROR_ALREADY_VERIFIED: 'Looks like your account has already been confirmed.',
    ERROR_DUPLICATE_VERIFY: 'A verification email has already been sent to your email address',
    ERROR_FAILED_UPDATE: 'An error occurred while updating. Please try again',
    ERROR_UNABLE_TO_BID: 'We were unable to place your bid',

    resourceNotCreated: (resource: string) => `Sorry, we could create this ${resource}. Please try again.`,
    resourceNotFound:(resource: string) => `Sorry, We could not find ${resource}.`,
    resourceAlreadyExists: (resource: string, name?: string) => `The ${resource} already exists. ${name ? `: ${name}`: ''}`,
    errorSaving:(param: string) => `Sorry, we could not save this ${param}`,
    rateLimitExceeded: (limitType?: string) => `You have made too many ${limitType || ''} requests. Please wait a while and try again.`

    /* Success Messages */
}