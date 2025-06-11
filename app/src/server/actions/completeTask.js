export const completeTask = async ({ taskId, prUrl, summary }, context) => {
  if (!context.user) throw new Error('Not logged in');

  const userId = context.user.id;

  const existing = await context.entities.TaskContribution.findFirst({
    where: {
      userId,
      issueId: taskId,
    },
  });

  if (!existing) {
    throw new Error(
      'Task not found. Make sure it was saved before marking as complete.'
    );
  }

  return await context.entities.TaskContribution.update({
    where: { id: existing.id },
    data: {
      completed: true,
      saved: true,
      prUrl,
      summary,
    },
  });
};
