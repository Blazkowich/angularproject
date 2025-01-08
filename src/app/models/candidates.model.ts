export interface Candidate {
  id:string;
  fullName: string;
  age: number;
  status: 'preferred' | 'rejected' | 'neutral';
  imageUrl: string;
}
