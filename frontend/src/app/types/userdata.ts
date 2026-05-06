export interface Move {
  _id: string;
  name: string;
  type: string;
  muscleGroup: string;
  isDefault: boolean;
  createdBy: string | null;
}

export interface ExerciseIsSelected {
  move: Move;
  sets: Set[];
  isSelected: boolean;
}

export interface Set {
  reps: number;
  weight: number;
}

export interface Exercise {
  move: Move;
  sets: Set[];
}

export interface TrainingProgram {
  _id: string;
  name: string;
  description: string;
  exercises: Exercise[];
  isDefault: boolean;
  __v: number;
}

export interface TrainingSession {
  _id: string;
  datetime: string;
  exercises: Exercise[];
  breakTimeSeconds: number;
}

export interface UserData {
  _id: string;
  googleId: string;
  name: string;
  email: string;
  level: number;
  xp: number;
  xpToNextLevel: number; // XP:n määrälle seuraavalle levelille
  weightUnit: string;
  trainingPrograms: TrainingProgram[];
  trainingSessions: TrainingSession[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}
