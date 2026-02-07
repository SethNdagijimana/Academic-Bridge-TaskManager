/* eslint-disable @typescript-eslint/no-explicit-any */
import type { VercelRequest, VercelResponse } from "@vercel/node"

import tasksData from "../db.json"

export default function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Credentials", "true")
  res.setHeader("Access-Control-Allow-Origin", "*")
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS")
  res.setHeader("Access-Control-Allow-Headers", "Content-Type")

  if (req.method === "OPTIONS") {
    return res.status(200).end()
  }

  // GET all tasks
  if (req.method === "GET") {
    return res.status(200).json(tasksData.tasks)
  }

  // POST new task
  if (req.method === "POST") {
    const newTask = req.body
    tasksData.tasks.push(newTask)
    return res.status(201).json(newTask)
  }

  // PUT update task
  if (req.method === "PUT") {
    const urlParts = req.url?.split("/")
    const id = urlParts?.[urlParts.length - 1]

    const updatedTask = req.body
    const index = tasksData.tasks.findIndex((t: any) => t.id === id)

    if (index !== -1) {
      tasksData.tasks[index] = { ...tasksData.tasks[index], ...updatedTask }
      return res.status(200).json(tasksData.tasks[index])
    }

    return res.status(404).json({ error: "Task not found" })
  }

  // DELETE task
  if (req.method === "DELETE") {
    const urlParts = req.url?.split("/")
    const id = urlParts?.[urlParts.length - 1]

    const index = tasksData.tasks.findIndex((t: any) => t.id === id)

    if (index !== -1) {
      const deleted = tasksData.tasks.splice(index, 1)
      return res.status(200).json(deleted[0])
    }

    return res.status(404).json({ error: "Task not found" })
  }

  return res.status(405).json({ error: "Method not allowed" })
}
