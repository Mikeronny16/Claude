import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const templates = [
    {
      name: "Flash Sale Post",
      category: "facebook_post",
      promptTemplate: "Create a flash sale announcement post for {product} with {discount}% discount",
      isPremium: false,
    },
    {
      name: "New Product Launch",
      category: "product_description",
      promptTemplate: "Write a product description for {product} highlighting {features}",
      isPremium: false,
    },
    {
      name: "Instagram Reel Caption",
      category: "marketing_caption",
      promptTemplate: "Write an engaging caption for an Instagram reel about {topic}",
      isPremium: true,
    },
    {
      name: "Customer Service Reply",
      category: "email_reply",
      promptTemplate: "Reply to a customer complaint about {issue} professionally",
      isPremium: false,
    },
    {
      name: "Product Hashtags",
      category: "hashtag",
      promptTemplate: "Generate hashtags for {product} targeting {audience}",
      isPremium: false,
    },
    {
      name: "How-To Blog Post",
      category: "blog_outline",
      promptTemplate: "Create a how-to blog outline for {topic} targeting {audience}",
      isPremium: true,
    },
  ];

  for (const template of templates) {
    await prisma.template.upsert({
      where: { id: template.name },
      update: template,
      create: { id: template.name, ...template },
    });
  }

  console.log("✅ Seed completed");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
