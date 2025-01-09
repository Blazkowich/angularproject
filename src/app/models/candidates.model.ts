export interface Candidate {
  id:string;
  fullName: string;
  idNumber: string;
  dateOfBirth: string;
  age: number;
  gender: string;
  profile: string;
  phone: string;
  email: string;
  address: string;
  experience: string;
  education: string;
  courses: string;
  interests: string;
  personalSummary: string;
  status: 'preferred' | 'rejected' | 'neutral';
  imageUrl: string;
}
