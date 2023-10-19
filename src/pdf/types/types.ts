type Skill = {
  [key: string]: number;
};

type Competence = {
  kompetenz: string;
  sum: number;
  skills: Skill;
  averageRating: number;
};

type CompetenceData = {
  [key: string]: Competence;
};
