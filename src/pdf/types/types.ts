type Skill = {
  [key: string]: {
    rating: number;
    de: string;
    en: string;
    it: string;
    fr: string;
  };
};

type Competence = {
  kompetenz: string;
  sum: number;
  skills: Skill;
  averageRating: number;
  percentage?: number;
  // Top-level language properties
  de: string;
  en: string;
  it: string;
  fr: string;
};

type CompetenceData = {
  [key: string]: Competence;
};

type Language = 'de' | 'en' | 'it' | 'fr';
