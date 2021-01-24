export interface Player {
  id: string;
  name: string;
}

export type Role = 'master' | 'insider' | 'citizen';

export interface Settings {
  limitMinute: number;
}
