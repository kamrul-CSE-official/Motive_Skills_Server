export const subscriptionTypes = ['single-course', 'all-courses'] as const;
export const subscriptionDurations = ['6-months', '1-year'] as const;
export const userRole = ['user', 'student', 'admin', 'super-admin', 'instructor'] as const;
export const userRoleConst = {user: 'user', student: 'student', admin:'admin', superAdmin:'super-admin', instructor: 'instructor'} as const;


// Type based on subscriptionTypes and subscriptionDurations
export type SubscriptionType = (typeof subscriptionTypes)[number];
export type SubscriptionDuration = (typeof subscriptionDurations)[number];
export type UserRole = (typeof userRole)[number];