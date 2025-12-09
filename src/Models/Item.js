export function createItem(data) {
  return {
    id: crypto.randomUUID(),
    userId: data.userId,
    type: data.type, // "todo" | "habit" | "event"
    title: data.title || "",
    description: data.description || "",

    category: data.category || null,
    deadline: data.deadline || null,
    timeEstimate: data.timeEstimate || null,
    done: data.done ?? false,

    repetitions: data.repetitions || 0,
    priority: data.priority || null,

    startDate: data.startDate || null,
    endDate: data.endDate || null,
  };
}
