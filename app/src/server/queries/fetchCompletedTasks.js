export const fetchCompletedTasks = async (args, context) => {
  if (!context.user) throw new Error('Not logged in');

  return await context.entities.TaskContribution.findMany({
    where: {
      userId: context.user.id,
      completed: true,
    },
  });
};
