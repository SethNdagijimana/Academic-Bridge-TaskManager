import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { createTask, deleteTask, fetchTasks, updateTask } from "./api"
import { Task } from "./types"

export function useTasks() {
  return useQuery({
    queryKey: ["tasks"],
    queryFn: fetchTasks
  })
}

export function useCreateTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] })
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
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] })
    }
  })
}

export function useDeleteTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] })
    }
  })
}
