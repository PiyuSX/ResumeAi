import { Link } from "react-router";
import ScoreCircle from "./ScoreCircle";

const ResumeCard = ({
  resume,
  clickable = true,
  imageUrl,
}: {
  resume: Pick<
    Resume,
    "id" | "companyName" | "jobTitle" | "feedback" | "imagePath"
  >;
  clickable?: boolean;
  imageUrl?: string | null;
}) => {
  const card = (
    <>
      <div className="flex flex-col gap-2">
        <h2 className="!text-black font-bold break-words">
          {resume.companyName}
        </h2>

        <h3 className="text-lg break-words text-gray-500">
          {resume.jobTitle}
        </h3>
        {!clickable && (
          <p className="text-sm text-gray-500">Sample preview</p>
        )}
      </div>

      <div className="flex-shrink-0">
        <ScoreCircle
          score={resume.feedback.ats_score.overall_score_out_of_100}
        />
      </div>

      <div className="gradient-border animate-in fade-in duration-1000">
        <div className="w-full h-full">
          {imageUrl !== null && (
            <img
              src={imageUrl ?? resume.imagePath}
              alt="resume"
              className="w-full h-[350px] max-sm:h-[200px] object-cover"
            />
          )}
        </div>
      </div>
    </>
  );

  if (!clickable) {
    return (
      <article
        aria-label="Sample resume preview"
        className="resume-card animate-in fade-in duration-1000"
      >
        {card}
      </article>
    );
  }

  return (
    <Link
      to={`/resume/${resume.id}`}
      className="resume-card animate-in fade-in duration-1000"
    >
      {card}
    </Link>
  );
};

export default ResumeCard;
