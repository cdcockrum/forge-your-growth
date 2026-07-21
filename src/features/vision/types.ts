export type Vision = {
  id: string;
  user_id: string;
  mission: string;
  north_star: string;
  core_values: string[];
  identities: string[];
  themes: string[];
  created_at: string;
  updated_at: string;
};

export type VisionInput = {
  mission: string;
  north_star: string;
  core_values: string[];
  identities: string[];
  themes: string[];
};