export const updateTaskSummary = async ({ taskId, summary }, context) => {
  if (!context.user) throw new Error('Not logged in');

  const userId = context.user.id;

  const existing = await context.entities.TaskContribution.findFirst({
    where: {
      userId,
      issueId: taskId,
      completed: true, // Only allow editing completed tasks
    },
  });

  if (!existing) {
    throw new Error('Completed task not found or you do not have permission to edit it.');
  }

  return await context.entities.TaskContribution.update({
    where: { id: existing.id },
    data: {
      summary,
    },
  });
};