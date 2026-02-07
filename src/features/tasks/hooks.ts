import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  addComment,
  createTask,
  deleteTask,
  fetchTasks,
  updateTask
} from "./api"
import { Task } from "./types"

export function useTasks() {
  return useQuery({
    queryKey: ["tasks"],
    queryFn: fetchTasks,
    staleTime: Infinity,
    gcTime: Infinity
  })
}

export function useCreateTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createTask,
    onSuccess: (newTask) => {
      // Optimistically add to cache instead of refetching
      queryClient.setQueryData<Task[]>(["tasks"], (old) => {
        if (!old) return [newTask]
        return [...old, newTask]
      })
    }
  })
}

export function useUpdateTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateTask,
    onMutate: async (updatedTask) => {
      await queryClient.cancelQueries({ queryKey: ["tasks"] })

      const previousTasks = queryClient.getQueryData<Task[]>(["tasks"])

      queryClient.setQueryData<Task[]>(["tasks"], (old) => {
        if (!old) return []
        return old.map((task) =>
          task.id === updatedTask.id ? updatedTask : task
        )
      })

      return { previousTasks }
    },
    onError: (_err, _updatedTask, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(["tasks"], context.previousTasks)
      }
    }
  })
}

export function useDeleteTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteTask,
    onMutate: async (taskId) => {
      await queryClient.cancelQueries({ queryKey: ["tasks"] })

      const previousTasks = queryClient.getQueryData<Task[]>(["tasks"])

      queryClient.setQueryData<Task[]>(["tasks"], (old) => {
        if (!old) return []
        return old.filter((task) => task.id !== taskId)
      })

      return { previousTasks }
    },
    onError: (_err, _taskId, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(["tasks"], context.previousTasks)
      }
    }
  })
}

export function useAddComment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      taskId,
      text,
      author
    }: {
      taskId: string
      text: string
      author: string
    }) => addComment(taskId, text, author),
    onMutate: async ({ taskId, text, author }) => {
      await queryClient.cancelQueries({ queryKey: ["tasks"] })

      const previousTasks = queryClient.getQueryData<Task[]>(["tasks"])

      const newComment = {
        id: Date.now(),
        text,
        author,
        createdAt: new Date().toISOString()
      }

      queryClient.setQueryData<Task[]>(["tasks"], (old) => {
        if (!old) return []
        return old.map((task) =>
          task.id === taskId
            ? { ...task, comments: [...(task.comments || []), newComment] }
            : task
        )
      })

      return { previousTasks }
    },
    onError: (_err, _vars, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(["tasks"], context.previousTasks)
      }
    }
  })
}
