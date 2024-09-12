export interface ITrainee{
  id: string;
  name: string;
  grade: number|null;
  email?:string;
  date: Date|null;
  address?: string;
  city?: string;
  country?:string;
  zip?:string;
  subject:string;
}
