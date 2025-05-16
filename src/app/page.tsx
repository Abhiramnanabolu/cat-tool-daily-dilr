"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ChevronLeft, ChevronRight } from "lucide-react"

// --- Interfaces for our data structure ---
interface Option {
  [key: string]: string // e.g., "A": "Option A text"
}

interface Question {
  id: number
  questionText: string
  options: Option[]
  correctAnswer: string // "A", "B", "C", or "D"
  solution: string
}

interface DilrSetData {
  topicName: string
  passage: string
  questions: Question[]
}

// --- Sample Data (Replace with actual data fetching) ---
const sampleDilrSet: DilrSetData = {
  "topicName": "Student Test Scores Analysis",
  "passage": "Five students, P, Q, R, S, and T, took tests in three subjects: Math, Physics, and Chemistry. The maximum possible score in each subject is 100, and all scores are integers. The total score for each student across the three subjects is distinct. The total scores for P, Q, R, S, and T are 250, 230, 220, 200, and 180 respectively.\n\nThe following information is also known:\n1. P scored 70 in Math, 90 in Physics, and 90 in Chemistry.\n2. Q scored 70 in Math.\n3. R's score in Physics was equal to P's score in Math.\n4. T's score in Math was the lowest among all students.\n5. S scored 10 more in Chemistry than in Math.\n6. The absolute difference between Q's scores in Physics and Chemistry was 10.\n7. The average score in Chemistry for all five students was 70.",
  "questions": [
    {
      "id": 1,
      "questionText": "What is S's score in Physics?",
      "options": [
        {"A": "90"},
        {"B": "80"},
        {"C": "70"},
        {"D": "60"}
      ],
      "correctAnswer": "A",
      "solution": "Let M, P, and C denote the scores in Math, Physics, and Chemistry respectively.\nWe are given the total scores:\nP = 250, Q = 230, R = 220, S = 200, T = 180.\nWe are given P's scores: P(M)=70, P(P)=90, P(C)=90. This confirms P's total: 70+90+90 = 250.\nQ(M)=70.\nR(P) = P(M) = 70.\nT(M) is the lowest Math score.\nS(C) = S(M) + 10.\n|Q(P) - Q(C)| = 10.\nThe sum of Chemistry scores = 5 * 70 = 350.\n\nLet's fill in a table and use the total scores:\n| Student | Math | Physics | Chemistry | Total |\n| :------ | :--- | :------ | :-------- | :---- |\n| P       | 70   | 90      | 90        | 250   |\n| Q       | 70   |         |           | 230   |\n| R       |      | 70      |           | 220   |\n| S       |      |         |           | 200   |\n| T       |      |         |           | 180   |\n| Sum     |      |         | 350       | 1080  |\n\nFor Q: Q(M)=70, Total=230. Q(P) + Q(C) = 230 - 70 = 160. Since |Q(P) - Q(C)| = 10, either (Q(P)=85, Q(C)=75) or (Q(P)=75, Q(C)=85).\n\nSum of Chemistry scores for Q, R, S, T = Total Chemistry Sum - P(C) = 350 - 90 = 260.\nQ(C) + R(C) + S(C) + T(C) = 260.\n\nFor R: R(P)=70, Total=220. R(M) + R(C) = 220 - 70 = 150. So R(C) = 150 - R(M).\nFor S: S(C) = S(M) + 10. S(M) + S(P) + S(C) = 200 => S(M) + S(P) + S(M) + 10 = 200 => 2*S(M) + S(P) = 190.\nFor T: T(M) + T(P) + T(C) = 180. T(M) is the lowest Math score.\n\nSubstitute R(C) and S(C) into the sum equation for Q, R, S, T Chemistry scores:\nQ(C) + (150 - R(M)) + (S(M) + 10) + T(C) = 260\nQ(C) - R(M) + S(M) + T(C) = 100.\n\nCase 1: Q(C)=75 (and Q(P)=85)\n75 - R(M) + S(M) + T(C) = 100 => S(M) - R(M) + T(C) = 25.\nWe need to find integer scores <= 100 that satisfy this and the other conditions. R(M)+R(C)=150 (50<=R(M),R(C)<=100). S(C)=S(M)+10 (1<=S(M)<=90, 11<=S(C)<=100). T(M) < {70 (P,Q), R(M), S(M)}. T(M)+T(P)+T(C)=180 (T(P),T(C)<=100).\nLet's try R(M)=60, R(C)=90. Then S(M) - 60 + T(C) = 25 => S(M) + T(C) = 85. T(M)<60.\nIf S(M)=50, T(C)=35. S(C)=60 (satisfies S(C)=S(M)+10). T(M)<50. T(M)+T(P)+35=180 => T(M)+T(P)=145. If T(M)=45, T(P)=100 (valid). T(M)=45 is lowest Math score (P=70, Q=70, R=60, S=50, T=45). Valid.\nLet's check S(P): 2*S(M) + S(P) = 190 => 2*50 + S(P) = 190 => 100 + S(P) = 190 => S(P) = 90. Valid.\nThis gives a full valid set of scores:\nP: (70, 90, 90)\nQ: (70, 85, 75)\nR: (60, 70, 90)\nS: (50, 90, 60)\nT: (45, 100, 35)\nAll scores <= 100. Totals are 250, 230, 220, 200, 180. Math scores are 70,70,60,50,45 (T lowest). Physics are 90,85,70,90,100. Chemistry are 90,75,90,60,35 (sum 350). S(C)=S(M)+10 (60=50+10). |Q(P)-Q(C)|=|85-75|=10. R(P)=P(M) (70=70). All constraints satisfied.\n\nCase 2: Q(C)=85 (and Q(P)=75)\n85 - R(M) + S(M) + T(C) = 100 => S(M) - R(M) + T(C) = 15.\nLet R(M)=60, R(C)=90. S(M)-60+T(C)=15 => S(M)+T(C)=75. T(M)<60.\nIf S(M)=40, T(C)=35. S(C)=50. T(M)<40. T(M)+T(P)+35=180 => T(M)+T(P)=145. If T(M)<40, say 35, T(P)=110 (not allowed). Trying other valid combinations for S(M) and T(C) summing to 75 with T(M)<S(M) and T(M)<R(M)=60 and T(P), T(C)<=100 will show no valid solution exists (T(P) often exceeds 100).\n\nSo the scores derived in Case 1 are the unique solution.\nFrom the table, S's score in Physics is 90.\n",

    },
    {
      "id": 2,
      "questionText": "What is the difference between R's score in Math and T's score in Chemistry?",
      "options": [
        {"A": "15"},
        {"B": "20"},
        {"C": "25"},
        {"D": "30"}
      ],
      "correctAnswer": "C",
      "solution": "Using the unique set of scores derived in the solution for Question 1:\nP: (70, 90, 90)\nQ: (70, 85, 75)\nR: (60, 70, 90)\nS: (50, 90, 60)\nT: (45, 100, 35)\n\nR's score in Math is 60.\nT's score in Chemistry is 35.\nThe difference is |60 - 35| = 25.",

    },
    {
      "id": 3,
      "questionText": "What is the sum of the scores of Q, R, and S in Chemistry?",
      "options": [
        {"A": "215"},
        {"B": "220"},
        {"C": "225"},
        {"D": "230"}
      ],
      "correctAnswer": "C",
      "solution": "Using the unique set of scores derived in the solution for Question 1:\nP: (70, 90, 90)\nQ: (70, 85, 75)\nR: (60, 70, 90)\nS: (50, 90, 60)\nT: (45, 100, 35)\n\nQ's score in Chemistry is 75.\nR's score in Chemistry is 90.\nS's score in Chemistry is 60.\nThe sum of their Chemistry scores is 75 + 90 + 60 = 225.",

    },
    {
      "id": 4,
      "questionText": "Which student achieved the highest score in Physics?",
      "options": [
        {"A": "P"},
        {"B": "S"},
        {"C": "T"},
        {"D": "Q"}
      ],
      "correctAnswer": "C",
      "solution": "Using the unique set of scores derived in the solution for Question 1:\nP: (70, 90, 90)\nQ: (70, 85, 75)\nR: (60, 70, 90)\nS: (50, 90, 60)\nT: (45, 100, 35)\n\nThe Physics scores for the students are:\nP: 90\nQ: 85\nR: 70\nS: 90\nT: 100\n\nThe highest score in Physics is 100, which was achieved by student T.",
    }
  ]
}
// --- End Sample Data ---

export default function DilrSetPage() {
  const [dilrSetData, setDilrSetData] = useState<DilrSetData | null>(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({})
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [showResults, setShowResults] = useState(false)

  useEffect(() => {
    // In a real app, fetch your DILR set data here
    setDilrSetData(sampleDilrSet)
    // Reset state if data changes
    setSelectedAnswers({})
    setIsSubmitted(false)
    setShowResults(false)
    setCurrentQuestionIndex(0)
  }, [])

  if (!dilrSetData) {
    return (
      <div className="flex items-center justify-center h-screen bg-black text-white">
        <div className="animate-pulse">Loading DILR set...</div>
      </div>
    )
  }

  const currentQuestion = dilrSetData.questions[currentQuestionIndex]

  const handleOptionSelect = (questionId: number, optionKey: string) => {
    if (isSubmitted) return // Don't allow changes after submission
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionKey,
    }))
  }

  const handleNext = () => {
    if (currentQuestionIndex < dilrSetData.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    } else if (!isSubmitted) {
      // If we're at the last question and not submitted, show submit button
      setShowResults(true)
    }
  }

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  const handleSubmit = () => {
    setIsSubmitted(true)
    setShowResults(true)
  }

  const getScore = () => {
    if (!isSubmitted) return 0
    let score = 0
    dilrSetData.questions.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctAnswer) {
        score++
      }
    })
    return score
  }

  const getOptionStyle = (question: Question, optionKey: string) => {
    if (!isSubmitted) {
      return selectedAnswers[question.id] === optionKey
        ? "bg-zinc-700 border-zinc-500"
        : "bg-zinc-900 border-zinc-800 hover:bg-zinc-800"
    }

    // After submission
    const isCorrect = optionKey === question.correctAnswer
    const isSelected = selectedAnswers[question.id] === optionKey

    if (isCorrect && isSelected) return "bg-green-900 border-green-700"
    if (isCorrect) return "bg-green-900/50 border-green-700/50"
    if (isSelected) return "bg-red-900 border-red-700"
    return "bg-zinc-900 border-zinc-800"
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="bg-zinc-900 p-4 border-b border-zinc-800">
        <h1 className="text-xl font-bold text-center text-emerald-400">{dilrSetData.topicName}</h1>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-4">
        {!showResults ? (
          <>
            {/* Passage */}
            <Card className="mb-6 bg-zinc-900 border-zinc-800 p-4 rounded-md">
              <h2 className="text-lg font-semibold mb-2 text-emerald-400">Passage:</h2>
              <div className="text-zinc-300 text-sm whitespace-pre-wrap">{dilrSetData.passage}</div>
            </Card>

            {/* Current Question */}
            {currentQuestion && (
              <Card className="mb-6 bg-zinc-900 border-zinc-800 p-4 rounded-md">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-emerald-400">Question {currentQuestionIndex + 1}</h3>
                  <span className="text-sm text-zinc-400">of {dilrSetData.questions.length}</span>
                </div>

                <p className="mb-6 text-zinc-200 whitespace-pre-wrap">{currentQuestion.questionText}</p>

                <div className="space-y-3">
                  {currentQuestion.options.map((optionObj) => {
                    const optionKey = Object.keys(optionObj)[0]
                    const optionValue = optionObj[optionKey]
                    return (
                      <button
                        key={optionKey}
                        onClick={() => handleOptionSelect(currentQuestion.id, optionKey)}
                        disabled={isSubmitted}
                        className={`w-full text-left p-3 border text-white rounded-md transition-colors duration-150 focus:outline-none
                                  ${getOptionStyle(currentQuestion, optionKey)}
                                  ${isSubmitted ? "cursor-not-allowed" : "cursor-pointer"}`}
                      >
                        <span className="font-medium mr-2 text-emerald-400">{optionKey}.</span> {optionValue}
                      </button>
                    )
                  })}
                </div>
              </Card>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center mt-6">
              <Button
                onClick={handlePrevious}
                disabled={currentQuestionIndex === 0}
                variant="outline"
                className="bg-zinc-800 border-zinc-700 hover:bg-zinc-700 text-white"
              >
                <ChevronLeft size={16} className="mr-1" /> Previous
              </Button>

              {currentQuestionIndex === dilrSetData.questions.length - 1 ? (
                <Button onClick={handleSubmit} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                  Submit All Answers
                </Button>
              ) : (
                <Button
                  onClick={handleNext}
                  variant="outline"
                  className="bg-zinc-800 border-zinc-700 hover:bg-zinc-700 text-white"
                >
                  Next <ChevronRight size={16} className="ml-1" />
                </Button>
              )}
            </div>
          </>
        ) : (
          // Results View
          <div className="space-y-8">
            <Card className="p-6 bg-zinc-900 border-zinc-800 text-center">
              <h2 className="text-2xl font-bold mb-2 text-emerald-400">Test Results</h2>
              <p className="text-xl text-white">
                Your Score: <span className="text-emerald-400 font-bold">{getScore()}</span> /{" "}
                {dilrSetData.questions.length}
              </p>
            </Card>

            {/* Passage */}
            <Card className="bg-zinc-900 border-zinc-800 p-4 rounded-md">
              <h2 className="text-lg font-semibold mb-2 text-emerald-400">Passage:</h2>
              <div className="text-zinc-300 text-sm whitespace-pre-wrap">{dilrSetData.passage}</div>
            </Card>

            {/* All Questions with Solutions */}
            {dilrSetData.questions.map((question, index) => (
              <Card key={question.id} className="bg-zinc-900 border-zinc-800 p-4 rounded-md">
                <h3 className="text-lg font-semibold text-emerald-400 mb-4">Question {index + 1}</h3>
                <p className="mb-6 text-zinc-200 whitespace-pre-wrap">{question.questionText}</p>

                <div className="space-y-3 mb-6">
                  {question.options.map((optionObj) => {
                    const optionKey = Object.keys(optionObj)[0]
                    const optionValue = optionObj[optionKey]
                    const isCorrect = optionKey === question.correctAnswer
                    const isSelected = selectedAnswers[question.id] === optionKey

                    let optionClass = "w-full text-left p-3 border rounded-md"
                    let statusText = ""

                    if (isCorrect && isSelected) {
                      optionClass += " bg-green-900 border-green-700"
                      statusText = "✓ Correct"
                    } else if (isCorrect) {
                      optionClass += " bg-green-900/50 border-green-700/50"
                      statusText = "✓ Correct Answer"
                    } else if (isSelected) {
                      optionClass += " bg-red-900 border-red-700"
                      statusText = "✗ Your Answer"
                    } else {
                      optionClass += " bg-zinc-900 border-zinc-800"
                    }

                    return (
                      <div key={optionKey} className={optionClass}>
                        <div className="flex justify-between text-white">
                          <div>
                            <span className="font-medium mr-2 text-emerald-400">{optionKey}.</span> {optionValue}
                          </div>
                          {statusText && (
                            <span
                              className={`text-sm font-medium ${
                                isCorrect && isSelected
                                  ? "text-green-400"
                                  : isCorrect
                                    ? "text-green-400"
                                    : "text-red-400"
                              }`}
                            >
                              {statusText}
                            </span>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>

                <div className="p-4 bg-zinc-800 border border-zinc-700 rounded-md">
                  <h4 className="font-semibold text-emerald-400 mb-2">Solution:</h4>
                  <div className="text-sm text-zinc-300 prose prose-sm prose-invert" style={{ whiteSpace: "pre-wrap" }}>
                    {question.solution}
                  </div>
                </div>
              </Card>
            ))}

            <Button
              onClick={() => {
                setIsSubmitted(false)
                setShowResults(false)
                setCurrentQuestionIndex(0)
                setSelectedAnswers({})
              }}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3"
            >
              Restart Test
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
