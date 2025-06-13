export const updateProfile = async (args, context) => {
  if (!context.user) throw new Error('Not logged in');

  // Check if resume exists
  const existing = await context.entities.Resume.findFirst({
    where: { userId: context.user.id },
  });

  if (existing) {
    return await context.entities.Resume.update({
      where: { id: existing.id },
      data: {
        title: args.title,
        summary: args.summary,
        skills: args.skills,
        experience: args.experience,
        education: args.education,
      },
    });
  }

  // Create new resume if not exists
  return await context.entities.Resume.create({
    data: {
      userId: context.user.id,
      title: args.title,
      summary: args.summary,
      skills: args.skills,
      experience: args.experience,
      education: args.education,
    },
  });
};
