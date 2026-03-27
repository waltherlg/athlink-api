export type CreateTrainingEntryInput = {
  result?: string;
  coachNotes?: string;
  privateNotes?: string;
};

export type TrainingEntryAthleteView = {
  id: string;
  trainingLogId: string;
  result: string | null;
  coachNotes: string | null;
  privateNotes: string | null;
  createdAt: string;
  updatedAt: string;
};

export type TrainingEntryCoachView = {
  id: string;
  userName: string;
  trainingLogId: string;
  result: string | null;
  coachNotes: string | null;
  createdAt: string;
  updatedAt: string;
};
