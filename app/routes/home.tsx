import { useEffect, useState } from "react";
import type { Route } from "./+types/home";
import Navbar from "~/components/Navbar";
import ResumeCard from "~/components/ResumeCard";
import { resumes as sampleResumes } from "~/constants";
import { usePuterStore } from "~/lib/puter";
import { useNavigate } from "react-router";

type SavedResumeCard = Pick<
  Resume,
  "id" | "companyName" | "jobTitle" | "imagePath" | "feedback"
>;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const isStringArray = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every((item) => typeof item === "string");

const isFeedback = (value: unknown): value is Feedback => {
  if (!isRecord(value)) return false;
  const atsScore = value.ats_score;
  const atsParsing = value.ats_parsing_quality;
  const content = value.content_quality;
  const keywords = value.keyword_and_relevance;
  const skills = value.skills_review;
  const experience = value.experience_review;

  return (
    isRecord(atsScore) &&
    typeof atsScore.overall_score_out_of_100 === "number" &&
    typeof atsScore.rating_summary === "string" &&
    isRecord(atsParsing) &&
    typeof atsParsing.score_out_of_25 === "number" &&
    isStringArray(atsParsing.issues_found) &&
    isStringArray(atsParsing.recommendations) &&
    isRecord(content) &&
    typeof content.score_out_of_25 === "number" &&
    isStringArray(content.gaps_vs_job_description) &&
    isStringArray(content.missing_sections) &&
    isStringArray(content.recommendations) &&
    isRecord(keywords) &&
    typeof keywords.score_out_of_30 === "number" &&
    isStringArray(keywords.keywords_present) &&
    isStringArray(keywords.keywords_missing_or_understated) &&
    isStringArray(keywords.recommendations) &&
    isRecord(skills) &&
    typeof skills.score_out_of_20 === "number" &&
    isStringArray(skills.current_skills) &&
    typeof skills.assessment === "string" &&
    isStringArray(skills.recommendations) &&
    isRecord(experience) &&
    isStringArray(experience.current_experience) &&
    isStringArray(experience.improvement_suggestions) &&
    isStringArray(experience.example_bullet_templates) &&
    isStringArray(value.overall_action_plan)
  );
};

const parseSavedResume = (value: string | null | undefined): SavedResumeCard | null => {
  if (!value) return null;

  try {
    const parsed: unknown = JSON.parse(value);
    if (
      !isRecord(parsed) ||
      typeof parsed.id !== "string" ||
      parsed.id.length === 0 ||
      typeof parsed.imagePath !== "string" ||
      typeof parsed.resumePath !== "string" ||
      !isFeedback(parsed.feedback) ||
      (parsed.companyName !== undefined && typeof parsed.companyName !== "string") ||
      (parsed.jobTitle !== undefined && typeof parsed.jobTitle !== "string")
    ) {
      return null;
    }

    return {
      id: parsed.id,
      companyName: parsed.companyName,
      jobTitle: parsed.jobTitle,
      imagePath: parsed.imagePath,
      feedback: parsed.feedback,
    };
  } catch {
    return null;
  }
};

export function meta({}: Route.MetaArgs) {
  return [
    { title: "ResumeAI" },
    { name: "description", content: "Welcome to ResumeAI!" },
  ];
}

export default function Home() {
  const { auth, isLoading, fs, kv } = usePuterStore();
  const navigate = useNavigate();
  const [savedResumes, setSavedResumes] = useState<SavedResumeCard[]>([]);
  const [imageUrls, setImageUrls] = useState<Record<string, string | null>>({});
  const [isLoadingResumes, setIsLoadingResumes] = useState(true);

  useEffect(() => {
    if (!isLoading && !auth.isAuthenticated) {
      navigate("/auth?next=/");
    }
  }, [auth.isAuthenticated, isLoading, navigate]);

  useEffect(() => {
    if (isLoading || !auth.isAuthenticated) return;

    let active = true;
    const objectUrls: string[] = [];

    const loadResumes = async () => {
      setIsLoadingResumes(true);
      setSavedResumes([]);
      setImageUrls({});

      try {
        const listedKeys = await kv.list("resume:*", false);
        const keys = (listedKeys ?? [])
          .map((item) => (typeof item === "string" ? item : item.key))
          .filter((key) => key.startsWith("resume:"));

        const records = await Promise.all(
          keys.map(async (key) => {
            try {
              const resume = parseSavedResume(await kv.get(key));
              return resume?.id === key.slice("resume:".length)
                ? resume
                : null;
            } catch {
              return null;
            }
          }),
        );
        const loadedResumes = records.filter(
          (resume): resume is SavedResumeCard => resume !== null,
        );

        const loadedImages = await Promise.all(
          loadedResumes.map(async (resume) => {
            try {
              const imageBlob = await fs.read(resume.imagePath);
              if (!imageBlob) return [resume.id, null] as const;
              const imageUrl = URL.createObjectURL(imageBlob);
              objectUrls.push(imageUrl);
              return [resume.id, imageUrl] as const;
            } catch {
              return [resume.id, null] as const;
            }
          }),
        );

        if (active) {
          setSavedResumes(loadedResumes);
          setImageUrls(Object.fromEntries(loadedImages));
        }
      } catch {
        if (active) {
          setSavedResumes([]);
          setImageUrls({});
        }
      } finally {
        if (active) setIsLoadingResumes(false);
      }
    };

    void loadResumes();

    return () => {
      active = false;
      objectUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [auth.isAuthenticated, fs, isLoading, kv]);

  return (
    <main className="bg-[url('/images/bg-main.svg')] bg-cover">
      <Navbar />
      <section className="main-section">
        <div className="page-heading py-16">
          <h1>Track Your Applications &amp; Resume Ratings</h1>
          <h2>Review your submissions and check AI-powered insights</h2>
        </div>

        <section className="resumes-section" aria-label="Saved resumes">
          {isLoadingResumes ? (
            <p role="status">Loading your saved resumes...</p>
          ) : savedResumes.length > 0 ? (
            savedResumes.map((resume) => (
              <ResumeCard
                key={resume.id}
                resume={resume}
                imageUrl={imageUrls[resume.id] ?? null}
              />
            ))
          ) : (
            <p>You have no saved resumes yet. Upload one to get started.</p>
          )}
        </section>

        <section aria-labelledby="sample-previews-heading">
          <h2 id="sample-previews-heading" className="page-heading py-8">
            Sample Previews
          </h2>
          <div className="resumes-section">
            {sampleResumes.map((resume) => (
              <ResumeCard
                key={resume.id}
                resume={resume}
                clickable={false}
              />
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
