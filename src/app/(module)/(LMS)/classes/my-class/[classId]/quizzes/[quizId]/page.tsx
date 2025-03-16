"use client"
import { useParams } from "next/navigation"
import React from "react"
import QuizReview from "../../_components/QuizReview"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"

async function getQuizDetails(quizId: number, classId: number) {
  const res = await axios.get(
    `/api/classes/my-class/${classId}/quizzes/${quizId}`
  )
  return res.data.Quiz
}

export default function Page() {
  const { quizId, classId } = useParams()
  const { data: quizDetails } = useQuery({
    queryKey: ["quizDetails", quizId],
    queryFn: () => getQuizDetails(Number(quizId), Number(classId)),
    enabled: !!String(quizId)
  })

  return (
    <div>{quizDetails && <QuizReview quizData={quizDetails?.questions} />}</div>
  )
}
