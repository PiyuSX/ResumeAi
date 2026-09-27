interface Job {
    title: string;
    description: string;
    location: string;
    requiredSkills: string[];
}


interface Resume {
  id: string;
  companyName?: string;
  jobTitle?: string;
  imagePath: string;
  resumePath: string;
  feedback: Feedback;
}

interface Feedback {
  ats_score: {
    overall_score_out_of_100: number;
    rating_summary: string;
  };

  ats_parsing_quality: {
    score_out_of_25: number;
    issues_found: string[];
    recommendations: string[];
  };

  content_quality: {
    score_out_of_25: number;
    gaps_vs_job_description: string[];
    missing_sections: string[];
    recommendations: string[];
  };

  keyword_and_relevance: {
    score_out_of_30: number;
    keywords_present: string[];
    keywords_missing_or_understated: string[];
    recommendations: string[];
  };

  skills_review: {
    score_out_of_20: number;
    current_skills: string[];
    assessment: string;
    recommendations: string[];
  };

  experience_review: {
    current_experience: string[];
    improvement_suggestions: string[];
    example_bullet_templates: string[];
  };

  overall_action_plan: string[];
}