import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

interface Params {
  params: { slug: string };
}

export async function POST(req: NextRequest, { params }: Params) {
  try {
    const { slug } = params;
    const body = await req.json();
    const { answers, respondentEmail: providedEmail, respondentName: providedName } = body;

    const form = await prisma.form.findUnique({
      where: { slug },
      include: {
        questions: true,
      },
    });

    if (!form || !form.isPublished) {
      return NextResponse.json({ error: "Form not found" }, { status: 404 });
    }

    if (!form.isAcceptingResponses) {
      return NextResponse.json({ error: "Form is no longer accepting responses" }, { status: 400 });
    }

    if (form.expiresAt && new Date() > new Date(form.expiresAt)) {
      return NextResponse.json({ error: "This form has expired" }, { status: 400 });
    }

    // Check if Google Login was required
    const session = await getServerSession(authOptions);
    let capturedEmail = session?.user?.email || providedEmail || null;
    let capturedName = session?.user?.name || providedName || null;

    if (form.requireGoogleLogin && !session?.user?.email) {
      return NextResponse.json(
        { error: "Google Sign-in is required to submit this form" },
        { status: 403 }
      );
    }

    // Process answers and calculate quiz scores if enabled
    let totalScore = 0;
    let maxScore = 0;
    const answerRecords: Array<{
      questionId: string;
      value: string;
      pointsAwarded: number;
      isCorrect: boolean | null;
    }> = [];

    for (const question of form.questions) {
      const rawAnswer = answers?.[question.id];

      // Check required validation
      if (question.isRequired && (rawAnswer === undefined || rawAnswer === null || rawAnswer === "")) {
        return NextResponse.json(
          { error: `Field "${question.title}" is required.` },
          { status: 400 }
        );
      }

      let stringValue = "";
      if (Array.isArray(rawAnswer)) {
        stringValue = JSON.stringify(rawAnswer);
      } else if (rawAnswer !== undefined && rawAnswer !== null) {
        stringValue = String(rawAnswer).trim();
      }

      let pointsAwarded = 0;
      let isCorrect: boolean | null = null;

      if (form.isQuiz) {
        maxScore += question.points;

        if (question.correctAnswer) {
          try {
            // Check if correct answer is a JSON array (for checkboxes)
            const parsedCorrect = JSON.parse(question.correctAnswer);
            if (Array.isArray(parsedCorrect)) {
              let parsedUserAnswer: string[] = [];
              try {
                parsedUserAnswer = Array.isArray(rawAnswer) ? rawAnswer : JSON.parse(stringValue);
              } catch {
                parsedUserAnswer = [stringValue];
              }

              // Check set equality
              const setA = new Set(parsedCorrect.map((s) => String(s).trim().toLowerCase()));
              const setB = new Set(parsedUserAnswer.map((s) => String(s).trim().toLowerCase()));
              const match = setA.size === setB.size && Array.from(setA).every((val) => setB.has(val));

              if (match) {
                pointsAwarded = question.points;
                isCorrect = true;
              } else {
                isCorrect = false;
              }
            } else {
              // Direct string comparison
              if (stringValue.toLowerCase() === String(parsedCorrect).trim().toLowerCase()) {
                pointsAwarded = question.points;
                isCorrect = true;
              } else {
                isCorrect = false;
              }
            }
          } catch {
            // Plain text comparison
            if (stringValue.toLowerCase() === question.correctAnswer.trim().toLowerCase()) {
              pointsAwarded = question.points;
              isCorrect = true;
            } else {
              isCorrect = false;
            }
          }
          totalScore += pointsAwarded;
        }
      }

      answerRecords.push({
        questionId: question.id,
        value: stringValue,
        pointsAwarded,
        isCorrect,
      });
    }

    // Save response to database
    const savedResponse = await prisma.formResponse.create({
      data: {
        formId: form.id,
        respondentEmail: capturedEmail,
        respondentName: capturedName,
        totalScore: form.isQuiz ? totalScore : null,
        maxScore: form.isQuiz ? maxScore : null,
        answers: {
          create: answerRecords,
        },
      },
    });

    return NextResponse.json({
      success: true,
      responseId: savedResponse.id,
      totalScore: form.isQuiz ? totalScore : null,
      maxScore: form.isQuiz ? maxScore : null,
      showScoreAfterSubmit: form.showScoreAfterSubmit,
      isQuiz: form.isQuiz,
      thankYouTitle: form.thankYouTitle,
      thankYouMessage: form.thankYouMessage,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
