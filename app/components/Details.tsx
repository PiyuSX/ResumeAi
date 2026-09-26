import { cn } from "~/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionHeader,
  AccordionItem,
} from "./Accordion";

const ScoreBadge = ({ score }: { score: number }) => {
  return (
    <div
      className={cn(
        "flex flex-row gap-1 items-center px-2 py-0.5 rounded-[96px]",
        score > 69
          ? "bg-badge-green"
          : score > 39
            ? "bg-badge-yellow"
            : "bg-badge-red",
      )}
    >
      <img
        src={score > 69 ? "/icons/check.svg" : "/icons/warning.svg"}
        alt="score"
        className="size-4"
      />
      <p
        className={cn(
          "text-sm font-medium",
          score > 69
            ? "text-badge-green-text"
            : score > 39
              ? "text-badge-yellow-text"
              : "text-badge-red-text",
        )}
      >
        {score}/100
      </p>
    </div>
  );
};

const CategoryHeader = ({
  title,
  categoryScore,
}: {
  title: string;
  categoryScore: number;
}) => {
  return (
    <div className="flex flex-row gap-4 items-center py-2">
      <p className="text-2xl font-semibold">{title}</p>
      <ScoreBadge score={categoryScore} />
    </div>
  );
};

const CategoryContent = ({
  tips,
}: {
  tips: { type: "good" | "improve"; tip: string; explanation: string }[];
}) => {
  return (
    <div className="flex flex-col gap-4 items-center w-full">
      <div className="bg-gray-50 w-full rounded-lg px-5 py-4 grid grid-cols-2 gap-4">
        {tips.map((tip, index) => (
          <div className="flex flex-row gap-2 items-center" key={index}>
            <img
              src={
                tip.type === "good" ? "/icons/check.svg" : "/icons/warning.svg"
              }
              alt="score"
              className="size-5"
            />
            <p className="text-xl text-gray-500 ">{tip.tip}</p>
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-4 w-full">
        {tips.map((tip, index) => (
          <div
            key={index + tip.tip}
            className={cn(
              "flex flex-col gap-2 rounded-2xl p-4",
              tip.type === "good"
                ? "bg-green-50 border border-green-200 text-green-700"
                : "bg-yellow-50 border border-yellow-200 text-yellow-700",
            )}
          >
            <div className="flex flex-row gap-2 items-center">
              <img
                src={
                  tip.type === "good"
                    ? "/icons/check.svg"
                    : "/icons/warning.svg"
                }
                alt="score"
                className="size-5"
              />
              <p className="text-xl font-semibold">{tip.tip}</p>
            </div>
            <p>{tip.explanation}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const Details = ({ feedback }: { feedback: any }) => {
      return (
    <div className="flex flex-col gap-4 w-full">
      <Accordion>
        <AccordionItem id="ats">
          <AccordionHeader itemId="ats">
            <CategoryHeader
              title="ATS Parsing"
              categoryScore={
                ((feedback.ats_parsing_quality?.score_out_of_25 ?? 0) / 25) *
                100
              }
            />
          </AccordionHeader>

          <AccordionContent itemId="ats">
            <CategoryContent
              tips={
                feedback.ats_parsing_quality?.recommendations?.map(
                  (tip: string) => ({
                    type: "improve",
                    tip,
                    explanation: tip,
                  }),
                ) ?? []
              }
            />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem id="content">
          <AccordionHeader itemId="content">
            <CategoryHeader
              title="Content Quality"
              categoryScore={
                ((feedback.content_quality?.score_out_of_25 ?? 0) / 25) * 100
              }
            />
          </AccordionHeader>

          <AccordionContent itemId="content">
            <CategoryContent
              tips={
                feedback.content_quality?.gaps_vs_job_description?.map(
                  (tip: string) => ({
                    type: "improve",
                    tip,
                    explanation: tip,
                  }),
                ) ?? []
              }
            />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem id="keywords">
          <AccordionHeader itemId="keywords">
            <CategoryHeader
              title="Keyword Relevance"
              categoryScore={
                ((feedback.keyword_and_relevance?.score_out_of_30 ?? 0) / 30) *
                100
              }
            />
          </AccordionHeader>

          <AccordionContent itemId="keywords">
            <CategoryContent
              tips={
                feedback.keyword_and_relevance?.recommendations?.map(
                  (tip: string) => ({
                    type: "improve",
                    tip,
                    explanation: tip,
                  }),
                ) ?? []
              }
            />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem id="skills">
          <AccordionHeader itemId="skills">
            <CategoryHeader title="Skills Review" categoryScore={75} />
          </AccordionHeader>

          <AccordionContent itemId="skills">
            <CategoryContent
              tips={
                feedback.skills_review?.recommendations?.map((tip: string) => ({
                  type: "improve",
                  tip,
                  explanation: tip,
                })) ?? []
              }
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default Details;
