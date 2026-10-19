import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding ZeForm database...");

  // 1. Create or ensure Master Admin (ceo.shubhampathak@gmail.com)
  const adminUser = await prisma.user.upsert({
    where: { email: "ceo.shubhampathak@gmail.com" },
    update: { role: "ADMIN" },
    create: {
      email: "ceo.shubhampathak@gmail.com",
      name: "Shubham Pathak (CEO)",
      role: "ADMIN",
    },
  });

  // 2. Create demo user
  const demoUser = await prisma.user.upsert({
    where: { email: "pathak@zenstro.space" },
    update: { role: "USER" },
    create: {
      email: "pathak@zenstro.space",
      name: "Zenstro Team",
      role: "USER",
    },
  });

  // 3. Create sample quiz form with custom subdomain
  const sampleForm = await prisma.form.upsert({
    where: { slug: "developer-skills-2026" },
    update: {},
    create: {
      title: "Fullstack & Cloud Developer Assessment",
      description: "Welcome to ZeForm! Test your knowledge on modern cloud infrastructure and subdomains.",
      slug: "developer-skills-2026",
      userId: adminUser.id,
      isPublished: true,
      isAcceptingResponses: true,
      isQuiz: true,
      showScoreAfterSubmit: true,
      thankYouTitle: "Assessment Completed!",
      thankYouMessage: "Thank you for submitting your evaluation through ZeForm*. Your answers and auto-scores have been recorded.",
      questions: {
        create: [
          {
            title: "What is your full name?",
            type: "short_text",
            isRequired: true,
            orderIndex: 0,
            points: 0,
          },
          {
            title: "Which DNS record enables *.zeform.zenstro.space wildcard routing in Cloudflare?",
            type: "multiple_choice",
            isRequired: true,
            options: JSON.stringify(["CNAME *.zeform -> target", "TXT record", "MX record", "PTR record"]),
            correctAnswer: "CNAME *.zeform -> target",
            points: 10,
            orderIndex: 1,
          },
          {
            title: "Which feature of ZeForm automatically grades responses upon submission?",
            type: "multiple_choice",
            isRequired: true,
            options: JSON.stringify(["Auto-Score Quiz Engine", "Manual Grading Sheet", "Email Bot"]),
            correctAnswer: "Auto-Score Quiz Engine",
            points: 10,
            orderIndex: 2,
          },
          {
            title: "Rate your experience with ZeForm so far:",
            type: "rating",
            isRequired: false,
            points: 5,
            orderIndex: 3,
          },
          {
            title: "What features would you like to see next in ZeForm?",
            type: "paragraph",
            isRequired: false,
            points: 0,
            orderIndex: 4,
          },
        ],
      },
    },
  });

  console.log("Database seeded successfully with sample form:", sampleForm.slug);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
