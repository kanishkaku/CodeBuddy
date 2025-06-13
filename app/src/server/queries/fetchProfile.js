export const fetchProfile = async (args, context) => {
  if (!context.user) throw new Error('Not logged in');

  return await context.entities.Resume.findFirst({
    where: { userId: context.user.id },
    select: {
      title: true,
      summary: true,
      skills: true,
      experience: true,
      education: true,
    },
  });
};
