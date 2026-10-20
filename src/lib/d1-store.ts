import { d1Query, d1Execute } from "./d1";
import { ADMIN_EMAIL, slugify } from "./utils";

export interface DBUser {
  id: string;
  name: string | null;
  email: string;
  role: string;
  image: string | null;
  createdAt: string;
  updatedAt: string;
  formCount?: number;
}

export interface DBForm {
  id: string;
  title: string;
  description: string | null;
  slug: string;
  userId: string;
  isPublished: number | boolean;
  isAcceptingResponses: number | boolean;
  expiresAt: string | null;
  requireGoogleLogin: number | boolean;
  isQuiz: number | boolean;
  showScoreAfterSubmit: number | boolean;
  thankYouTitle: string;
  thankYouMessage: string;
  themeColor: string;
  createdAt: string;
  updatedAt: string;
  user?: DBUser;
  questions?: DBQuestion[];
  _count?: { responses: number };
}

export interface DBQuestion {
  id: string;
  formId: string;
  type: string;
  title: string;
  description: string | null;
  isRequired: number | boolean;
  options: string | null;
  points: number;
  correctAnswer: string | null;
  orderIndex: number;
  createdAt: string;
  updatedAt: string;
}

export interface DBResponse {
  id: string;
  formId: string;
  respondentEmail: string | null;
  respondentName: string | null;
  totalScore: number | null;
  maxScore: number | null;
  submittedAt: string;
  answers?: DBAnswer[];
}

export interface DBAnswer {
  id: string;
  responseId: string;
  questionId: string;
  value: string;
  pointsAwarded: number;
  isCorrect: number | boolean | null;
}

// 1. User operations
export async function getUserByEmail(email: string): Promise<DBUser | null> {
  const norm = email.trim().toLowerCase();
  const rows = await d1Query<DBUser>(
    "SELECT * FROM User WHERE lower(email) = ? LIMIT 1",
    [norm]
  );
  return rows[0] || null;
}

export async function upsertUser(email: string, name?: string | null, image?: string | null, roleParam?: string): Promise<DBUser> {
  const norm = email.trim().toLowerCase();
  const isAdminUser = norm === ADMIN_EMAIL.toLowerCase();
  const role = isAdminUser ? "ADMIN" : roleParam || "USER";
  const now = new Date().toISOString();
  const id = `usr_${norm.replace(/[^a-z0-9]/g, "_")}`;

  await d1Execute(
    `INSERT INTO User (id, name, email, image, role, createdAt, updatedAt)
     VALUES (?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT(email) DO UPDATE SET
       name = COALESCE(excluded.name, User.name),
       image = COALESCE(excluded.image, User.image),
       role = ?,
       updatedAt = ?`,
    [id, name || norm.split("@")[0], norm, image || null, role, now, now, role, now]
  );

  const user = await getUserByEmail(norm);
  if (!user) throw new Error("Failed to retrieve user after upsert");
  return user;
}

export async function getAllUsers(): Promise<DBUser[]> {
  const users = await d1Query<DBUser>(
    `SELECT u.*, COUNT(f.id) as formCount
     FROM User u
     LEFT JOIN Form f ON u.id = f.userId
     GROUP BY u.id
     ORDER BY u.createdAt DESC`
  );
  return users;
}

// 2. Subdomain conflict check
export async function isSubdomainAvailable(slug: string, excludeFormId?: string): Promise<boolean> {
  const normSlug = slugify(slug);
  let sql = "SELECT id FROM Form WHERE slug = ?";
  const params: any[] = [normSlug];

  if (excludeFormId) {
    sql += " AND id != ?";
    params.push(excludeFormId);
  }

  const rows = await d1Query(sql, params);
  return rows.length === 0;
}

// 3. Form operations
export function isFormExpired(form: { expiresAt?: string | null; updatedAt?: string; isAcceptingResponses?: any }): boolean {
  if (!form.expiresAt) return false;
  const expDate = new Date(form.expiresAt).getTime();
  const nowDate = Date.now();
  if (nowDate <= expDate) return false;

  // If expired, check if it was explicitly updated/reopened after expiresAt
  if (form.updatedAt) {
    const upDate = new Date(form.updatedAt).getTime();
    if (upDate > expDate) {
      // Creator explicitly reopened the form after expiration timer passed
      return false;
    }
  }

  return true;
}

export async function getFormsByUser(userId: string): Promise<DBForm[]> {
  const forms = await d1Query<DBForm>(
    `SELECT f.*, COUNT(r.id) as responseCount
     FROM Form f
     LEFT JOIN FormResponse r ON f.id = r.formId
     WHERE f.userId = ?
     GROUP BY f.id
     ORDER BY f.createdAt DESC`,
    [userId]
  );

  return forms.map((f: any) => {
    let accepting = Boolean(f.isAcceptingResponses);
    if (accepting && isFormExpired(f)) {
      accepting = false;
      d1Execute("UPDATE Form SET isAcceptingResponses = 0 WHERE id = ?", [f.id]).catch(() => {});
    }

    return {
      ...f,
      isPublished: Boolean(f.isPublished),
      isAcceptingResponses: accepting,
      requireGoogleLogin: Boolean(f.requireGoogleLogin),
      isQuiz: Boolean(f.isQuiz),
      showScoreAfterSubmit: Boolean(f.showScoreAfterSubmit),
      _count: { responses: Number(f.responseCount || 0) },
    };
  });
}

export async function getAllForms(): Promise<DBForm[]> {
  const forms = await d1Query<any>(
    `SELECT f.*, u.name as userName, u.email as userEmail, COUNT(r.id) as responseCount
     FROM Form f
     JOIN User u ON f.userId = u.id
     LEFT JOIN FormResponse r ON f.id = r.formId
     GROUP BY f.id
     ORDER BY f.createdAt DESC`
  );

  return forms.map((f: any) => {
    let accepting = Boolean(f.isAcceptingResponses);
    if (accepting && isFormExpired(f)) {
      accepting = false;
      d1Execute("UPDATE Form SET isAcceptingResponses = 0 WHERE id = ?", [f.id]).catch(() => {});
    }

    return {
      ...f,
      isPublished: Boolean(f.isPublished),
      isAcceptingResponses: accepting,
      requireGoogleLogin: Boolean(f.requireGoogleLogin),
      isQuiz: Boolean(f.isQuiz),
      showScoreAfterSubmit: Boolean(f.showScoreAfterSubmit),
      user: { id: f.userId, name: f.userName, email: f.userEmail },
      _count: { responses: Number(f.responseCount || 0) },
    };
  });
}

export async function getFormById(id: string): Promise<DBForm | null> {
  const forms = await d1Query<DBForm>("SELECT * FROM Form WHERE id = ? LIMIT 1", [id]);
  if (!forms.length) return null;

  const form = forms[0];
  let accepting = Boolean(form.isAcceptingResponses);
  if (accepting && isFormExpired(form)) {
    accepting = false;
    d1Execute("UPDATE Form SET isAcceptingResponses = 0 WHERE id = ?", [form.id]).catch(() => {});
  }

  const questions = await d1Query<DBQuestion>(
    "SELECT * FROM Question WHERE formId = ? ORDER BY orderIndex ASC, createdAt ASC",
    [id]
  );

  return {
    ...form,
    isPublished: Boolean(form.isPublished),
    isAcceptingResponses: accepting,
    requireGoogleLogin: Boolean(form.requireGoogleLogin),
    isQuiz: Boolean(form.isQuiz),
    showScoreAfterSubmit: Boolean(form.showScoreAfterSubmit),
    questions: questions.map((q) => ({
      ...q,
      isRequired: Boolean(q.isRequired),
    })),
  };
}

export async function getFormBySlug(slug: string): Promise<DBForm | null> {
  const normSlug = slugify(slug);
  const forms = await d1Query<DBForm>("SELECT * FROM Form WHERE slug = ? LIMIT 1", [normSlug]);
  if (!forms.length) return null;

  const form = forms[0];
  let accepting = Boolean(form.isAcceptingResponses);
  if (accepting && isFormExpired(form)) {
    accepting = false;
    d1Execute("UPDATE Form SET isAcceptingResponses = 0 WHERE id = ?", [form.id]).catch(() => {});
  }

  const questions = await d1Query<DBQuestion>(
    "SELECT * FROM Question WHERE formId = ? ORDER BY orderIndex ASC, createdAt ASC",
    [form.id]
  );

  return {
    ...form,
    isPublished: Boolean(form.isPublished),
    isAcceptingResponses: accepting,
    requireGoogleLogin: Boolean(form.requireGoogleLogin),
    isQuiz: Boolean(form.isQuiz),
    showScoreAfterSubmit: Boolean(form.showScoreAfterSubmit),
    questions: questions.map((q) => ({
      ...q,
      isRequired: Boolean(q.isRequired),
    })),
  };
}

export async function createForm(data: {
  userId: string;
  title?: string;
  description?: string;
  slug: string;
  isPublished?: boolean;
  isAcceptingResponses?: boolean;
  expiresAt?: string | null;
  requireGoogleLogin?: boolean;
  isQuiz?: boolean;
  showScoreAfterSubmit?: boolean;
  thankYouTitle?: string;
  thankYouMessage?: string;
  themeColor?: string;
  questions?: any[];
}): Promise<DBForm> {
  const id = `form_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const now = new Date().toISOString();
  const normSlug = slugify(data.slug);

  await d1Execute(
    `INSERT INTO Form (
      id, title, description, slug, userId,
      isPublished, isAcceptingResponses, expiresAt, requireGoogleLogin,
      isQuiz, showScoreAfterSubmit, thankYouTitle, thankYouMessage, themeColor,
      createdAt, updatedAt
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      data.title || "Untitled Form",
      data.description || null,
      normSlug,
      data.userId,
      data.isPublished !== false ? 1 : 0,
      data.isAcceptingResponses !== false ? 1 : 0,
      data.expiresAt || null,
      data.requireGoogleLogin ? 1 : 0,
      data.isQuiz ? 1 : 0,
      data.showScoreAfterSubmit !== false ? 1 : 0,
      data.thankYouTitle || "Thank You!",
      data.thankYouMessage || "Your response has been recorded successfully.",
      data.themeColor || "#4f46e5",
      now,
      now,
    ]
  );

  if (Array.isArray(data.questions) && data.questions.length > 0) {
    for (let i = 0; i < data.questions.length; i++) {
      const q = data.questions[i];
      const qId = `q_${Date.now()}_${i}_${Math.random().toString(36).substring(2, 6)}`;
      await d1Execute(
        `INSERT INTO Question (
          id, formId, type, title, description, isRequired, options, points, correctAnswer, orderIndex, createdAt, updatedAt
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          qId,
          id,
          q.type || "short_text",
          q.title || `Question ${i + 1}`,
          q.description || null,
          q.isRequired ? 1 : 0,
          typeof q.options === "string" ? q.options : JSON.stringify(q.options || []),
          q.points || 0,
          q.correctAnswer ? (typeof q.correctAnswer === "string" ? q.correctAnswer : JSON.stringify(q.correctAnswer)) : null,
          q.orderIndex ?? i,
          now,
          now,
        ]
      );
    }
  }

  const created = await getFormById(id);
  if (!created) throw new Error("Failed to retrieve created form");
  return created;
}

export async function updateForm(
  id: string,
  data: Partial<DBForm> & { questions?: any[] }
): Promise<DBForm | null> {
  const existing = await getFormById(id);
  if (!existing) return null;

  const now = new Date().toISOString();
  const slug = data.slug ? slugify(data.slug) : existing.slug;

  await d1Execute(
    `UPDATE Form SET
      title = COALESCE(?, title),
      description = ?,
      slug = ?,
      isPublished = ?,
      isAcceptingResponses = ?,
      expiresAt = ?,
      requireGoogleLogin = ?,
      isQuiz = ?,
      showScoreAfterSubmit = ?,
      thankYouTitle = COALESCE(?, thankYouTitle),
      thankYouMessage = COALESCE(?, thankYouMessage),
      themeColor = COALESCE(?, themeColor),
      updatedAt = ?
    WHERE id = ?`,
    [
      data.title ?? existing.title,
      data.description !== undefined ? data.description : existing.description,
      slug,
      data.isPublished !== undefined ? (data.isPublished ? 1 : 0) : existing.isPublished ? 1 : 0,
      data.isAcceptingResponses !== undefined ? (data.isAcceptingResponses ? 1 : 0) : existing.isAcceptingResponses ? 1 : 0,
      data.expiresAt !== undefined ? data.expiresAt : existing.expiresAt,
      data.requireGoogleLogin !== undefined ? (data.requireGoogleLogin ? 1 : 0) : existing.requireGoogleLogin ? 1 : 0,
      data.isQuiz !== undefined ? (data.isQuiz ? 1 : 0) : existing.isQuiz ? 1 : 0,
      data.showScoreAfterSubmit !== undefined ? (data.showScoreAfterSubmit ? 1 : 0) : existing.showScoreAfterSubmit ? 1 : 0,
      data.thankYouTitle ?? existing.thankYouTitle,
      data.thankYouMessage ?? existing.thankYouMessage,
      data.themeColor ?? existing.themeColor,
      now,
      id,
    ]
  );

  // If questions are provided, replace them
  if (Array.isArray(data.questions)) {
    await d1Execute("DELETE FROM Question WHERE formId = ?", [id]);
    for (let i = 0; i < data.questions.length; i++) {
      const q = data.questions[i];
      const qId = q.id || `q_${Date.now()}_${i}_${Math.random().toString(36).substring(2, 6)}`;
      await d1Execute(
        `INSERT INTO Question (
          id, formId, type, title, description, isRequired, options, points, correctAnswer, orderIndex, createdAt, updatedAt
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          qId,
          id,
          q.type || "short_text",
          q.title || `Question ${i + 1}`,
          q.description || null,
          q.isRequired ? 1 : 0,
          typeof q.options === "string" ? q.options : JSON.stringify(q.options || []),
          q.points || 0,
          q.correctAnswer ? (typeof q.correctAnswer === "string" ? q.correctAnswer : JSON.stringify(q.correctAnswer)) : null,
          q.orderIndex ?? i,
          now,
          now,
        ]
      );
    }
  }

  return await getFormById(id);
}

export async function deleteForm(id: string): Promise<boolean> {
  await d1Execute("DELETE FROM Form WHERE id = ?", [id]);
  return true;
}

// 4. Response operations
export async function submitFormResponse(data: {
  formId: string;
  respondentEmail?: string | null;
  respondentName?: string | null;
  answers: { questionId: string; value: any }[];
}): Promise<{ responseId: string; totalScore: number; maxScore: number }> {
  const form = await getFormById(data.formId);
  if (!form) throw new Error("Form not found");

  const responseId = `resp_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const now = new Date().toISOString();

  let totalScore = 0;
  let maxScore = 0;

  const processedAnswers: any[] = [];

  for (const q of form.questions || []) {
    const qPoints = q.points || 0;
    maxScore += qPoints;

    const submitted = data.answers.find((a) => a.questionId === q.id);
    const rawVal = submitted ? submitted.value : "";
    const strVal = typeof rawVal === "object" ? JSON.stringify(rawVal) : String(rawVal ?? "");

    let pointsAwarded = 0;
    let isCorrect: boolean | null = null;

    if (form.isQuiz && q.correctAnswer) {
      let isAnswerCorrect = false;
      try {
        const correctParsed = JSON.parse(q.correctAnswer);
        if (Array.isArray(correctParsed)) {
          const submittedArr = Array.isArray(rawVal) ? rawVal : [rawVal];
          isAnswerCorrect =
            correctParsed.length === submittedArr.length &&
            correctParsed.every((val: any) =>
              submittedArr.map((v) => String(v).trim().toLowerCase()).includes(String(val).trim().toLowerCase())
            );
        } else {
          isAnswerCorrect = String(correctParsed).trim().toLowerCase() === String(rawVal).trim().toLowerCase();
        }
      } catch {
        isAnswerCorrect = String(q.correctAnswer).trim().toLowerCase() === String(rawVal).trim().toLowerCase();
      }

      isCorrect = isAnswerCorrect;
      if (isAnswerCorrect) {
        pointsAwarded = qPoints;
        totalScore += qPoints;
      }
    }

    processedAnswers.push({
      id: `ans_${Date.now()}_${processedAnswers.length}_${Math.random().toString(36).substring(2, 6)}`,
      responseId,
      questionId: q.id,
      value: strVal,
      pointsAwarded,
      isCorrect: isCorrect === null ? null : isCorrect ? 1 : 0,
    });
  }

  // Insert response record
  await d1Execute(
    `INSERT INTO FormResponse (id, formId, respondentEmail, respondentName, totalScore, maxScore, submittedAt)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      responseId,
      data.formId,
      data.respondentEmail || null,
      data.respondentName || null,
      form.isQuiz ? totalScore : null,
      form.isQuiz ? maxScore : null,
      now,
    ]
  );

  // Insert answers
  for (const ans of processedAnswers) {
    await d1Execute(
      `INSERT INTO Answer (id, responseId, questionId, value, pointsAwarded, isCorrect)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [ans.id, ans.responseId, ans.questionId, ans.value, ans.pointsAwarded, ans.isCorrect]
    );
  }

  return { responseId, totalScore, maxScore };
}

export async function getFormResponses(formId: string): Promise<DBResponse[]> {
  const responses = await d1Query<DBResponse>(
    "SELECT * FROM FormResponse WHERE formId = ? ORDER BY submittedAt DESC",
    [formId]
  );

  for (const resp of responses) {
    const answers = await d1Query<any>(
      `SELECT a.*, q.title as questionTitle, q.type as questionType
       FROM Answer a
       LEFT JOIN Question q ON a.questionId = q.id
       WHERE a.responseId = ?`,
      [resp.id]
    );
    resp.answers = answers.map((a) => ({
      ...a,
      question: { id: a.questionId, title: a.questionTitle, type: a.questionType },
    }));
  }

  return responses;
}
