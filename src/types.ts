export type Role = 'prosecutor' | 'defender' | 'judge';

export interface Round {
  prosecutor: string;
  defender: string;
}

export interface Summary {
  verdict: 'guilty' | 'not_guilty' | 'hung';
  lines: string[]; // 3 golden lines
  slogan: string;
}

export interface DebateCase {
  topic: string;
  rounds: Round[]; // 3 rounds
  summary?: Summary;
}
