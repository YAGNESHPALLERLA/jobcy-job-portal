
export type Experience = {
  id: string | number;
  company: string;
  position: string;
  startDate: string;
  endDate?: string;
  current?: boolean;
  location: string;
  description?: string;
};
