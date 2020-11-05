export interface Player {
  id: string;
  name: string;
  role: Role;
}

export type Role = 'master' | 'insider' | 'citizen';
