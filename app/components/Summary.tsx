import ScoreGauge from "~/components/ScoreGauge";
import ScoreBadge from "~/components/ScoreBadge";

const Category = ({
  title,
  score,
}: {
  title: string;
  score: number;
}) => {
  const textColor =
    score > 70
      ? "text-green-600"
      : score > 49
      ? "text-yellow-600"
      : "text-red-600";

  return (
    <div className="resume-summary">
      <div className="category">
        <div className="flex flex-row gap-2 items-center justify-center">
          <p className="text-2xl">{title}</p>
          <ScoreBadge score={score} />
        </div>

        <p className="text-2xl">
          <span className={textColor}>{score}</span>/100
        </p>
      </div>
    </div>
  );
};

const Summary = ({ feedback }: { feedback: any }) => {
  const overallScore =
    feedback?.ats_score?.overall_score_out_of_100 ?? 0;

  const atsParsingScore =
    ((feedback?.ats_parsing_quality?.score_out_of_25 ?? 0) / 25) * 100;

  const contentScore =
    ((feedback?.content_quality?.score_out_of_25 ?? 0) / 25) * 100;

  const keywordScore =
    ((feedback?.keyword_and_relevance?.score_out_of_30 ?? 0) / 30) * 100;

  return (
    <div className="bg-white rounded-2xl shadow-md w-full">
      <div className="flex flex-row items-center p-4 gap-8">
        <ScoreGauge score={overallScore} />

        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-bold">Your Resume Score</h2>

          <p className="text-sm text-gray-500">
            This score is calculated based on the variables listed below.
          </p>
        </div>
      </div>

      <Category
        title="ATS Parsing"
        score={Math.round(atsParsingScore)}
      />

      <Category
        title="Content Quality"
        score={Math.round(contentScore)}
      />

      <Category
        title="Keyword Relevance"
        score={Math.round(keywordScore)}
      />

      <Category
        title="Overall ATS Score"
        score={overallScore}
      />
    </div>
  );
};

export default Summary;