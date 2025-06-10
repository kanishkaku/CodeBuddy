export const completeTask = async ({ taskId, prUrl, summary }, context) => {
  if (!context.user) throw new Error('Not logged in');

  return await context.entities.TaskContribution.updateMany({
    where: {
      userId: context.user.id,
      issueId: taskId,
    },
    data: {
      completed: true,
      prUrl,
      summary,
    }
  });
};
