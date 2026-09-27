const createSampleFeedback = (score: number): Feedback => ({
  ats_score: {
    overall_score_out_of_100: score,
    rating_summary: "Sample resume analysis",
  },
  ats_parsing_quality: {
    score_out_of_25: 0,
    issues_found: [],
    recommendations: [],
  },
  content_quality: {
    score_out_of_25: 0,
    gaps_vs_job_description: [],
    missing_sections: [],
    recommendations: [],
  },
  keyword_and_relevance: {
    score_out_of_30: 0,
    keywords_present: [],
    keywords_missing_or_understated: [],
    recommendations: [],
  },
  skills_review: {
    score_out_of_20: 0,
    current_skills: [],
    assessment: "",
    recommendations: [],
  },
  experience_review: {
    current_experience: [],
    improvement_suggestions: [],
    example_bullet_templates: [],
  },
  overall_action_plan: [],
});

export const resumes = [
  {
    id: "1",
    companyName: "Google",
    jobTitle: "Frontend Developer",
    imagePath: "/images/resume_01.png",
    feedback: createSampleFeedback(85),
  },
  {
    id: "2",
    companyName: "Microsoft",
    jobTitle: "Cloud Engineer",
    imagePath: "/images/resume_02.png",
    feedback: createSampleFeedback(55),
  },
  {
    id: "3",
    companyName: "Apple",
    jobTitle: "iOS Developer",
    imagePath: "/images/resume_03.png",
    feedback: createSampleFeedback(75),
  },
] satisfies Pick<
  Resume,
  "id" | "companyName" | "jobTitle" | "imagePath" | "feedback"
>[];

export const AIResponseFormat = `
{
  "ats_score": {
    "overall_score_out_of_100": 0,
    "rating_summary": ""
  },
  "ats_parsing_quality": {
    "score_out_of_25": 0,
    "issues_found": [""],
    "recommendations": [""]
  },
  "content_quality": {
    "score_out_of_25": 0,
    "gaps_vs_job_description": [""],
    "missing_sections": [""],
    "recommendations": [""]
  },
  "keyword_and_relevance": {
    "score_out_of_30": 0,
    "keywords_present": [""],
    "keywords_missing_or_understated": [""],
    "recommendations": [""]
  },
  "skills_review": {
    "score_out_of_20": 0,
    "current_skills": [""],
    "assessment": "",
    "recommendations": [""]
  },
  "experience_review": {
    "current_experience": [""],
    "improvement_suggestions": [""],
    "example_bullet_templates": [""]
  },
  "overall_action_plan": [""]
}
`;

export const prepareInstructions = ({
  jobTitle,
  jobDescription,
}: {
  jobTitle: string;
  jobDescription: string;
}) => `
You are an expert in ATS and resume analysis.

Analyze the supplied resume content against the following job.

Job title:
${jobTitle}

Job description:
${jobDescription}

Return the analysis using exactly this JSON structure:

${AIResponseFormat}

Strict rules:
- Return valid JSON only.
- Do not use markdown or backticks.
- Do not include text outside the JSON.
- Do not add, remove, or rename fields.
- Every score must be a number.
- Every array must contain strings.
- overall_score_out_of_100 must be between 0 and 100.
- score_out_of_25 must be between 0 and 25.
- score_out_of_30 must be between 0 and 30.
- score_out_of_20 must be between 0 and 20.
- Give useful and honest resume feedback.
`;
