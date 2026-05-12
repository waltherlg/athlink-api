export enum CoachErrorCodeEnum {
  COACH_PROFILE_ALREADY_EXISTS = 'COACH_PROFILE_ALREADY_EXISTS',
  COACH_PROFILE_NOT_FOUND = 'COACH_PROFILE_NOT_FOUND',
}

export const COACH_ERROS = {
  TRAINING_JOURNAL_ALREADY_EXISTS: {
    code: CoachErrorCodeEnum.COACH_PROFILE_ALREADY_EXISTS,
    field: 'sportType',
    message: 'coach profile with this sport type already exist',
  },
  TRAINING_JOURNAL_NOT_FOUND: {
    code: CoachErrorCodeEnum.COACH_PROFILE_NOT_FOUND,
    field: 'coachProfile',
    message: 'coach profile not found',
  },
} as const;
