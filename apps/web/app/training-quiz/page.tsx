"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import KeyboardArrowLeftOutlinedIcon from "@mui/icons-material/KeyboardArrowLeftOutlined";
import VerifiedOutlinedIcon from "@mui/icons-material/VerifiedOutlined";
import Image from "next/image";
import URLUtils from "../../scripts/UrlUtils";
import quizSuccessBackground from "../../assets/quizsuccessimg.svg";
import { useAccountsStore } from "../../state/useAccountsStore";
import { useCourseFileIdStore } from "../../state/useCourseFileIdStore";
import { useCourseTrainingFileStore } from "../../state/useCourseTrainingFileStore";
import { usePageLoaderStore } from "../../state/usePageLoaderStore";
import { useQuizSessionStore } from "../../state/useQuizSessionStore";
import { useRouter, useSearchParams } from "next/navigation";

interface Question {
  _id?: string;
  question: string;
  questionData?: string[];
  options?: string[];
  answer?: string[];
}

interface QuizResponse {
  questions?: {
    fileData?: Question[];
    name?: string;
    title?: string;
  };
  courseId?: string;
  courseName?: string;
  name?: string;
  title?: string;
}

const toPdfBlob = (file: Blob) => {
  if (file.type === "application/pdf") {
    return file;
  }

  return new Blob([file], { type: "application/pdf" });
};

const RESIZE_BREAKPOINT = 1280;
const MIN_PDF_WIDTH = 800;
const MIN_QUESTION_WIDTH = 380;
const DEFAULT_QUESTION_WIDTH = 430;
const RESIZER_WIDTH = 24;
const DEFAULT_PDF_WIDTH_OFFSET = 50;
const DESKTOP_SPLIT_GAP = 16;

const getAvailableSplitWidth = (containerWidth: number) =>
  Math.max(containerWidth - RESIZER_WIDTH - DESKTOP_SPLIT_GAP * 2, 0);

const getPanelBounds = (containerWidth: number) => {
  const availableWidth = getAvailableSplitWidth(containerWidth);

  if (availableWidth <= 0) {
    return {
      availableWidth: 0,
      minPdfWidth: 0,
      maxPdfWidth: 0,
    };
  }

  const minQuestionWidth = Math.min(MIN_QUESTION_WIDTH, Math.max(availableWidth * 0.35, 280));
  const minPdfWidth = Math.min(MIN_PDF_WIDTH, Math.max(availableWidth - minQuestionWidth, 320));
  const maxPdfWidth = Math.max(minPdfWidth, availableWidth - minQuestionWidth);

  return {
    availableWidth,
    minPdfWidth,
    maxPdfWidth,
  };
};

const formatElapsedTime = (totalSeconds: number) => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
};

function CourseQuiz() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setLoading = usePageLoaderStore((state) => state.setLoading);
  const customer = useAccountsStore((state) => state.customer);
  const fileId = useCourseFileIdStore((state) => state.fileId);
  const trainingFileBlob = useCourseTrainingFileStore((state) => state.trainingFileBlob);
  const setTrainingFileBlob = useCourseTrainingFileStore((state) => state.setTrainingFileBlob);

  const [questions, setQuestions] = useState<Question[]>([]);
  const [error, setError] = useState("");
  const [courseId, setCourseId] = useState("");
  const [courseTitle, setCourseTitle] = useState("Course Material");
  const [pdfUrl, setPdfUrl] = useState("");
  const [pdfPanelWidth, setPdfPanelWidth] = useState<number | null>(null);
  const [isResizing, setIsResizing] = useState(false);
  const splitLayoutRef = useRef<HTMLDivElement | null>(null);
  const answers = useQuizSessionStore((state) => state.answers);
  const currentQuestionIndex = useQuizSessionStore((state) => state.currentQuestionIndex);
  const showInlineResults = useQuizSessionStore((state) => state.showInlineResults);
  const finalResult = useQuizSessionStore((state) => state.finalResult);
  const startedAt = useQuizSessionStore((state) => state.startedAt);
  const elapsedSeconds = useQuizSessionStore((state) => state.elapsedSeconds);
  const titleFromQuery = searchParams.get("title")?.trim() || "";
  const initializeSession = useQuizSessionStore((state) => state.initializeSession);
  const setAnswers = useQuizSessionStore((state) => state.setAnswers);
  const setCurrentQuestionIndex = useQuizSessionStore((state) => state.setCurrentQuestionIndex);
  const setShowInlineResults = useQuizSessionStore((state) => state.setShowInlineResults);
  const setFinalResult = useQuizSessionStore((state) => state.setFinalResult);
  const setElapsedSeconds = useQuizSessionStore((state) => state.setElapsedSeconds);
  const resetSession = useQuizSessionStore((state) => state.resetSession);

  useEffect(() => {
    const fetchQuestions = async () => {
      if (!fileId) {
        setQuestions([]);
        return;
      }

      try {
        setLoading(true);
        const res = await URLUtils.get("General-GetQuizQuestions", { fileId });

        if (res.status === 200) {
          const data = res.data as QuizResponse;
          const fetchedQuestions = data.questions?.fileData ?? [];
          const resolvedCourseTitle =
            data.courseName ??
            data.questions?.name ??
            data.questions?.title ??
            data.title ??
            data.name;

          setQuestions(fetchedQuestions);
          initializeSession(fileId, fetchedQuestions.length);
          setCourseId(data.courseId ?? "");
          setCourseTitle(resolvedCourseTitle || titleFromQuery || "Course Material");
        } else {
          setQuestions([]);
        }
      } catch {
        setQuestions([]);
        setError("Failed to fetch questions");
      } finally {
        setLoading(false);
      }
    };

    void fetchQuestions();
  }, [fileId, initializeSession, setLoading, titleFromQuery]);

  useEffect(() => {
    if (!trainingFileBlob) {
      return;
    }

    const nextPdfUrl = URL.createObjectURL(toPdfBlob(trainingFileBlob));
    setPdfUrl((currentUrl) => {
      if (currentUrl) {
        URL.revokeObjectURL(currentUrl);
      }

      return nextPdfUrl;
    });
  }, [trainingFileBlob]);

  useEffect(() => {
    const fetchTrainingFile = async () => {
      if (!fileId || !customer.accountType || trainingFileBlob) {
        return;
      }

      try {
        const res = await URLUtils.post(
          "General-GetTrainingFile",
          { file: fileId, accountType: customer.accountType },
          { responseType: "blob" }
        );

        if (res.status === 200) {
          const normalizedPdfBlob = toPdfBlob(res.data as Blob);
          setTrainingFileBlob(normalizedPdfBlob);
          const nextPdfUrl = URL.createObjectURL(normalizedPdfBlob);
          setPdfUrl((currentUrl) => {
            if (currentUrl) {
              URL.revokeObjectURL(currentUrl);
            }

            return nextPdfUrl;
          });
        }
      } catch {
        setPdfUrl("");
      }
    };

    void fetchTrainingFile();
  }, [customer.accountType, fileId, setTrainingFileBlob, trainingFileBlob]);

  useEffect(() => {
    if (!startedAt || showInlineResults) {
      return;
    }

    const timer = window.setInterval(() => {
      setElapsedSeconds(Math.floor((Date.now() - startedAt) / 1000));
    }, 1000);

    return () => {
      window.clearInterval(timer);
    };
  }, [setElapsedSeconds, showInlineResults, startedAt]);

  useEffect(() => {
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [pdfUrl]);

  useEffect(() => {
    const updatePdfPanelWidth = () => {
      if (typeof window === "undefined" || window.innerWidth < RESIZE_BREAKPOINT) {
        setPdfPanelWidth(null);
        return;
      }

      const containerWidth = splitLayoutRef.current?.clientWidth;
      if (!containerWidth) {
        return;
      }

      const { availableWidth, minPdfWidth, maxPdfWidth } = getPanelBounds(containerWidth);
      const nextWidth = Math.max(
        minPdfWidth,
        Math.min(
          availableWidth - DEFAULT_QUESTION_WIDTH - DEFAULT_PDF_WIDTH_OFFSET,
          maxPdfWidth
        )
      );

      setPdfPanelWidth((currentWidth) => {
        if (currentWidth === null) {
          return nextWidth;
        }

        return Math.max(minPdfWidth, Math.min(currentWidth, maxPdfWidth));
      });
    };

    updatePdfPanelWidth();
    window.addEventListener("resize", updatePdfPanelWidth);

    const resizeObserver =
      typeof ResizeObserver !== "undefined" && splitLayoutRef.current
        ? new ResizeObserver(() => {
            updatePdfPanelWidth();
          })
        : null;

    resizeObserver?.observe(splitLayoutRef.current as HTMLDivElement);

    return () => {
      window.removeEventListener("resize", updatePdfPanelWidth);
      resizeObserver?.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!isResizing) {
      return;
    }

    const handlePointerMove = (event: PointerEvent) => {
      if (typeof window === "undefined" || window.innerWidth < RESIZE_BREAKPOINT) {
        return;
      }

      const container = splitLayoutRef.current;
      if (!container) {
        return;
      }

      const containerRect = container.getBoundingClientRect();
      const { minPdfWidth, maxPdfWidth } = getPanelBounds(containerRect.width);
      const nextWidth = Math.max(
        minPdfWidth,
        Math.min(event.clientX - containerRect.left, maxPdfWidth)
      );

      setPdfPanelWidth(nextWidth);
    };

    const stopResizing = () => {
      setIsResizing(false);
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", stopResizing);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", stopResizing);
    };
  }, [isResizing]);

  const currentQuestion = questions[currentQuestionIndex];
  const currentOptions = currentQuestion?.options ?? [];
  const selectedOption = answers[currentQuestionIndex];
  const answeredCount = answers.filter(Boolean).length;
  const allAnswered = questions.length > 0 && answers.every((answer) => Boolean(answer));
  const progressValue = questions.length > 0 ? answeredCount / questions.length : 0;
  const progressPercent = Math.min(Math.max(progressValue * 100, 0), 100);
  const splitContainerWidth = splitLayoutRef.current?.clientWidth ?? 0;
  const { availableWidth, minPdfWidth, maxPdfWidth } = getPanelBounds(splitContainerWidth);
  const questionPanelWidth =
    pdfPanelWidth !== null && splitLayoutRef.current
      ? availableWidth - pdfPanelWidth
      : null;
  const isExpandedQuestionPanel = questionPanelWidth !== null && questionPanelWidth >= 520;

  const questionHeading = useMemo(() => {
    if (!currentQuestion) {
      return "";
    }

    return currentQuestion.questionData?.[0] ?? currentQuestion.question ?? "";
  }, [currentQuestion]);

  const questionDescription = useMemo(() => {
    if (!currentQuestion?.questionData || currentQuestion.questionData.length <= 1) {
      return [];
    }

    return currentQuestion.questionData.slice(1);
  }, [currentQuestion]);

  const getQuestionStatus = (index: number) => {
    const selectedAnswer = answers[index];
    const correctAnswer = questions[index]?.answer?.[0];

    if (!selectedAnswer) {
      return "unanswered";
    }

    return selectedAnswer === correctAnswer ? "correct" : "wrong";
  };

  const handleOptionChange = (option: string) => {
    setAnswers(
      answers.map((answer, index) => (index === currentQuestionIndex ? option : answer))
    );
    setError("");
  };

  const goToQuestion = (index: number) => {
    setCurrentQuestionIndex(index);
    setError("");
  };

  const goToPrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setError("");
    }
  };

  const goToNext = () => {
    if (!selectedOption) {
      setError("Select an option");
      return;
    }

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setError("");
    }
  };

  const handleSubmitQuiz = async () => {
    if (!allAnswered) {
      setError("Answer all questions before submitting");
      return;
    }
    
    try {
      setLoading(true);
      const userResponses = answers.filter((answer): answer is string => Boolean(answer));
      const res = await URLUtils.post("General-GetQuizResult", {
        form: { userResponses },
        fileId,
        courseId,
      });

      if (res.status === 200) {
        setFinalResult(res.data);
        setShowInlineResults(true);
        setError("");
      } else {
        setError("Failed to fetch result");
      }
    } catch {
      setError("Failed to fetch result");
    } finally {
      setLoading(false);
    }
  };

  const resultStatus = finalResult.percentage >= 75 ? "passed" : "failed";
  const marksObtained = finalResult.correctAnswers ?? finalResult.obtainedMarks ?? 0;
  const totalMarks = finalResult.totalQuestions ?? finalResult.totalMarks ?? questions.length;

  const handleRetryQuiz = () => {
    resetSession(fileId);
    initializeSession(fileId, questions.length);
    setError("");
  };

  return (
    <div className="quiz-container min-h-screen !max-w-none bg-slate-50 px-3 py-4 md:px-5">
      {questions.length === 0 ? (
        <div className="completed-quiz-container">
          <h2 className="completed-quiz-heading">Quiz Not available</h2>
        </div>
      ) : showInlineResults ? (
        <div
          className={`relative flex min-h-[calc(100vh-4rem)] items-center justify-center overflow-hidden rounded-[32px] border ${
            resultStatus === "passed"
              ? "border-emerald-100 bg-white"
              : "border-slate-200 bg-white"
          } px-4 py-10 sm:px-6`}
        >
          {resultStatus === "passed" ? (
            <Image
              src={quizSuccessBackground}
              alt=""
              fill
              priority
              className="pointer-events-none object-cover object-center opacity-100"
            />
          ) : null}

          <div className="relative z-10 flex w-full max-w-[720px] flex-col items-center text-center">
            <div className="flex h-[118px] w-[118px] items-center justify-center rounded-full border border-[#B8E8C2] bg-white shadow-[0_0_0_10px_rgba(255,255,255,0.88)]">
              <div
                className={`flex h-[92px] w-[92px] items-center justify-center rounded-full ${
                  resultStatus === "passed" ? "bg-[#39B54A]" : "bg-[#FF1208]"
                }`}
              >
                {resultStatus === "passed" ? (
                  <VerifiedOutlinedIcon className="!text-[58px] !text-white" />
                ) : (
                  <CancelOutlinedIcon className="!text-[58px] !text-white" />
                )}
              </div>
            </div>

            <h2 className="mt-6 text-[30px] font-semibold leading-tight text-slate-950 sm:text-[40px]">
              {resultStatus === "passed" ? "Congratulations!" : "Ooops!"}
            </h2>

            <p className="mt-2 max-w-[520px] text-sm text-slate-700 sm:text-base">
              {resultStatus === "passed"
                ? "You have passed the Quiz successfully."
                : "You did not meet the required passing criteria for the examination."}
            </p>

            <div className="mt-5 flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-sm font-medium text-slate-900 sm:text-lg">
              <p>
                Marks obtained :{" "}
                <span
                  className={resultStatus === "passed" ? "text-[#39B54A]" : "text-[#FF1208]"}
                >
                  {marksObtained}
                </span>
                /{totalMarks}
              </p>
              <p>
                Percentage :{" "}
                <span
                  className={resultStatus === "passed" ? "text-[#39B54A]" : "text-[#FF1208]"}
                >
                  {finalResult.percentage}%
                </span>
              </p>
              <p>
                Time spent :{" "}
                <span className="text-slate-950">{formatElapsedTime(elapsedSeconds)}</span>
              </p>
            </div>

            <button
              type="button"
              className={`mt-10 inline-flex min-h-[56px] min-w-[220px] items-center justify-center rounded-full px-8 text-base font-semibold text-white transition ${
                resultStatus === "passed"
                  ? "bg-[#39B54A] hover:bg-[#2f9a3f]"
                  : "bg-[#FF1208] hover:bg-[#df1209]"
              }`}
              onClick={() =>
                resultStatus === "passed"
                  ? router.push("/training")
                  : handleRetryQuiz()
              }
            >
              {resultStatus === "passed" ? "View PD Library" : "Try Again"}
            </button>

            {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}
          </div>
        </div>
      ) : (
        <>
          <section className="mx-auto mb-4 flex w-full max-w-[1600px] flex-col gap-4 rounded-[28px] border border-slate-200 bg-white px-4 py-4 shadow-sm lg:flex-row lg:items-center lg:justify-between lg:px-6">
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-400">Course :-</p>
              <h1 className="truncate text-lg font-semibold text-slate-950">{courseTitle}</h1>
            </div>

            <div className="flex w-full max-w-[420px] flex-col gap-2">
              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="font-medium text-slate-600">Progress</span>
                <span className="font-semibold text-slate-900">
                  {answeredCount}/{questions.length}
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-[#39B54A] transition-[width] duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 lg:justify-end">
              <div className="inline-flex min-h-11 items-center gap-2 rounded-full border border-[#F6C445] bg-[#FFF9E8] px-4 text-sm font-semibold text-[#C98A00]">
                <span className="flex h-5 w-5 items-center justify-center rounded-full border border-[#F6C445] text-[11px]">
                  O
                </span>
                {formatElapsedTime(elapsedSeconds)}
              </div>
              <button
                type="button"
                onClick={handleSubmitQuiz}
                className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#1F2A44] px-6 text-sm font-semibold text-white transition hover:bg-[#161f34]"
              >
                Submit Quiz
              </button>
            </div>
          </section>

          <div
            ref={splitLayoutRef}
            className={`relative mx-auto flex w-full max-w-[1600px] flex-col gap-4 xl:min-h-[calc(100vh-10rem)] xl:flex-row ${
              isResizing ? "select-none xl:cursor-col-resize" : ""
            }`}
          >
          {isResizing ? (
            <div className="absolute inset-0 z-20 hidden xl:block" />
          ) : null}
          <section
            className="min-h-[55vh] flex-1 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm xl:min-w-0 xl:flex xl:flex-col"
            style={
              pdfPanelWidth === null
                ? {
                    flex: "1 1 0%",
                  }
                : {
                    width: `${pdfPanelWidth}px`,
                    flex: "0 0 auto",
                  }
            }
          >
            <div className="flex items-center justify-between gap-3 border-b border-slate-200 px-4 py-3">
              <div>
                <p className="text-sm font-semibold text-slate-900">{courseTitle}</p>
                <p className="text-xs text-slate-500">Training document</p>
              </div>
              <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-600">
                PDF
              </span>
            </div>

            <div className="h-[70vh] bg-slate-100 xl:flex-1">
              {pdfUrl ? (
                <iframe
                  src={pdfUrl}
                  width="100%"
                  height="100%"
                  style={{ border: "none", pointerEvents: isResizing ? "none" : "auto" }}
                  title="Training PDF"
                />
              ) : (
                <div className="flex h-full items-center justify-center p-6 text-center text-sm text-slate-500">
                  PDF preview is not available right now.
                </div>
              )}
            </div>
          </section>

          <button
            type="button"
            aria-label="Resize PDF and questionnaire panels"
            aria-valuemin={minPdfWidth || undefined}
            aria-valuemax={maxPdfWidth || undefined}
            aria-valuenow={pdfPanelWidth ?? undefined}
            aria-orientation="vertical"
            onPointerDown={(event) => {
              event.preventDefault();
              setIsResizing(true);
            }}
            className="hidden xl:flex xl:w-6 xl:flex-none xl:items-center xl:justify-center xl:self-stretch xl:touch-none"
          >
            <span
              className={`flex h-24 w-2 rounded-full bg-slate-200 transition ${
                isResizing ? "bg-[#0E74BC]" : "hover:bg-slate-300"
              }`}
            />
          </button>

          <aside
            className="w-full rounded-3xl border border-slate-200 bg-white p-4 shadow-sm xl:flex-none"
            style={
              pdfPanelWidth === null
                ? {
                    width: `${DEFAULT_QUESTION_WIDTH}px`,
                  }
                : {
                    width: `${Math.max(availableWidth - pdfPanelWidth, 0)}px`,
                    minWidth: `${Math.min(MIN_QUESTION_WIDTH, Math.max(availableWidth * 0.35, 280))}px`,
                    flex: "0 0 auto",
                  }
            }
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2
                  className={`font-semibold text-slate-950 ${
                    isExpandedQuestionPanel ? "text-xl" : "text-lg"
                  }`}
                >
                  Question Navigator
                </h2>
                <p className="text-sm text-slate-500">
                  {answeredCount}/{questions.length} answered
                </p>
              </div>
            </div>

            <div
              className={`mt-4 grid gap-2 ${
                isExpandedQuestionPanel ? "grid-cols-8 2xl:grid-cols-10" : "grid-cols-7 sm:grid-cols-8"
              }`}
            >
              {questions.map((question, index) => {
                const status = getQuestionStatus(index);
                const isActive = index === currentQuestionIndex;

                const statusClass =
                  status === "correct"
                    ? "border-green-600 bg-green-600 text-white"
                    : status === "wrong"
                      ? "border-red-600 bg-red-600 text-white"
                      : isActive
                        ? "border-[#0E74BC] bg-[#0E74BC] text-white"
                        : "border-slate-300 bg-white text-slate-700";

                return (
                  <button
                    key={question._id ?? index}
                    type="button"
                    onClick={() => goToQuestion(index)}
                    className={`flex items-center justify-center rounded-md border font-semibold transition ${
                      isExpandedQuestionPanel ? "h-10 w-10 text-sm" : "h-8 w-8 text-xs"
                    } ${statusClass}`}
                  >
                    {index + 1}
                  </button>
                );
              })}
            </div>

            <div
              className={`mt-5 rounded-2xl border border-slate-200 bg-slate-50 ${
                isExpandedQuestionPanel ? "p-5" : "p-4"
              }`}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Question {currentQuestionIndex + 1} of {questions.length}
              </p>
              <h3
                className={`mt-2 font-semibold text-slate-950 ${
                  isExpandedQuestionPanel ? "text-lg leading-7" : "text-base leading-6"
                }`}
              >
                {questionHeading}
              </h3>

              {questionDescription.length > 0 ? (
                <ul
                  className={`mt-3 list-disc pl-5 text-slate-600 ${
                    isExpandedQuestionPanel ? "space-y-2 text-base" : "space-y-1 text-sm"
                  }`}
                >
                  {questionDescription.map((item, index) => (
                    <li key={`${currentQuestion?._id ?? currentQuestionIndex}-detail-${index}`}>
                      {item}
                    </li>
                  ))}
                </ul>
              ) : null}

              <div
                className={`mt-4 grid ${
                  isExpandedQuestionPanel ? "gap-4 xl:grid-cols-2" : "gap-3"
                }`}
              >
                {currentOptions.map((option, index) => {
                  const isChecked = selectedOption === option;

                  return (
                    <label
                      key={`${currentQuestion?._id ?? currentQuestionIndex}-option-${index}`}
                      className={`flex cursor-pointer items-start gap-3 rounded-2xl border transition ${
                        isExpandedQuestionPanel ? "px-4 py-4" : "px-3 py-3"
                      } ${
                        isChecked
                          ? "border-[#0E74BC] bg-blue-50"
                          : "border-slate-200 bg-white hover:border-slate-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name={`question-${currentQuestionIndex}`}
                        checked={isChecked}
                        onChange={() => handleOptionChange(option)}
                        className="mt-1 h-4 w-4 accent-[#0E74BC]"
                      />
                      <span
                        className={`text-slate-800 ${
                          isExpandedQuestionPanel ? "text-base leading-7" : "text-sm leading-6"
                        }`}
                      >
                        {option}
                      </span>
                    </label>
                  );
                })}
              </div>

              {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}

              <div className="mt-5 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={goToPrevious}
                  disabled={currentQuestionIndex === 0}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-slate-300 px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <KeyboardArrowLeftOutlinedIcon className="!text-[18px]" />
                  Previous
                </button>

                <span className="text-sm font-semibold text-slate-500">
                  {currentQuestionIndex + 1} of {questions.length}
                </span>

                {currentQuestionIndex === questions.length - 1 ? (
                  <span className="inline-flex min-h-11 items-center justify-center rounded-full bg-slate-200 px-5 text-sm font-semibold text-slate-600">
                    Last Question
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={goToNext}
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-slate-900 px-5 text-sm font-semibold text-white transition hover:bg-slate-700"
                  >
                    Next
                    <ArrowForwardIcon className="!text-[18px]" />
                  </button>
                )}
              </div>
            </div>
          </aside>
          </div>
        </>
      )}

    </div>
  );
}

export default CourseQuiz;
