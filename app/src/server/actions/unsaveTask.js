export const unsaveTask = async ({ taskId }, context) => {
  if (!context.user) throw new Error('Not logged in');
  const userId = context.user.id;

  console.log('[unsaveTask] Called by userId:', userId);
  console.log('[unsaveTask] Received taskId:', taskId);

  const existing = await context.entities.TaskContribution.findFirst({
    where: {
      userId,
      issueId: taskId,
    },
  });

  console.log('[unsaveTask] Existing task record found:', existing);

  if (!existing) {
    console.warn('[unsaveTask] No matching TaskContribution found for unsave.');
    return;
  }

  // If the task is completed, we only update saved = false
  if (existing.completed) {
    console.log('[unsaveTask] Task is completed — updating saved = false');
    return await context.entities.TaskContribution.update({
      where: { id: existing.id },
      data: { saved: false },
    });
  }

  // Delete only if not completed
  console.log('[unsaveTask] Deleting TaskContribution:', {
    id: existing.id,
    userId: existing.userId,
    issueId: existing.issueId,
    completed: existing.completed,
  });

  return await context.entities.TaskContribution.deleteMany({
    where: {
      id: existing.id,
      userId: existing.userId,
      issueId: existing.issueId,
      completed: false,
    },
  });
};
