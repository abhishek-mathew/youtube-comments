export function calculateScore(
  likes: number,
  replies: number,
  createdAt: string
): number {
  const hoursSinceCreation =
    (Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60);
  return likes * 2 + replies * 3 + 1 / (hoursSinceCreation + 1); // Adding 1 to avoid division by zero
}
