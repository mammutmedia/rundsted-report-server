type Skill = {
  [key: string]: number;
};

type Competence = {
  kompetenz: string;
  sum: number;
  skills: Skill;
  averageRating: number;
  percentage?: number;
};

type CompetenceData = {
  [key: string]: Competence;
};
