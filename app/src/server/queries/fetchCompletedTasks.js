export const fetchCompletedTasks = async (_args, context) => {
  if (!context.user) throw new Error('Not logged in');

  const results = await context.entities.TaskContribution.findMany({
    where: { userId: context.user.id, completed: true },
  });

  return results;
};
