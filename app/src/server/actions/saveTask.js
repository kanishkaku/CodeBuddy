export const saveTask = async ({ task }, context) => {
  if (!context.user) {
    throw new Error('User not logged in');
  }

  const existing = await context.entities.TaskContribution.findFirst({
    where: {
      userId: context.user.id,
      issueId: task.githubIssueId,
    },
  });

  if (existing) {
    return await context.entities.TaskContribution.update({
      where: { id: existing.id },
      data: { saved: true },
    });
  }

  return await context.entities.TaskContribution.create({
    data: {
      userId: context.user.id,
      issueId: task.githubIssueId,
      repo: task.repository,
      title: task.title,
      description: task.description,
      url: task.url,
      labels: JSON.stringify(task.labels || []),
      saved: true,
    },
  });
};
