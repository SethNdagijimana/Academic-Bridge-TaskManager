/* eslint-disable @typescript-eslint/no-explicit-any */
import type { VercelRequest, VercelResponse } from "@vercel/node"

const tasksData = {
  tasks: [
    {
      id: "a1b2",
      title: "Review and Update Recruitment Process",
      description:
        "Analyze current recruitment workflow and suggest improvements for better candidate experience",
      status: "todo",
      priority: "high",
      startDate: "2026-02-05",
      dueDate: "2026-02-12",
      progress: 0,
      tags: ["recruitment", "process"],
      assignees: [
        {
          id: 1,
          name: "Sarah Chen",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
          color: "bg-blue-500"
        },
        {
          id: 2,
          name: "Mike Johnson",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike",
          color: "bg-purple-500"
        }
      ],
      comments: [
        {
          id: 1,
          text: "Started reviewing the current process",
          author: "Sarah Chen",
          createdAt: "2026-02-05T10:00:00Z"
        }
      ],
      attachments: [
        {
          id: 1,
          name: "current_process.pdf",
          url: "#",
          type: "pdf"
        }
      ]
    },
    {
      id: "c3d4",
      title: "Employee Onboarding Documentation",
      description:
        "Create comprehensive onboarding guide for new hires including company policies and procedures",
      status: "in-progress",
      priority: "high",
      startDate: "2026-02-01",
      dueDate: "2026-02-08",
      progress: 65,
      tags: ["onboarding", "documentation"],
      assignees: [
        {
          id: 3,
          name: "Emma Wilson",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma",
          color: "bg-green-500"
        }
      ],
      comments: [
        {
          id: 1,
          text: "First draft is ready for review",
          author: "Emma Wilson",
          createdAt: "2026-02-04T14:30:00Z"
        },
        {
          id: 2,
          text: "Added benefits section",
          author: "Emma Wilson",
          createdAt: "2026-02-05T09:15:00Z"
        }
      ],
      attachments: []
    },
    {
      id: "e5f6",
      title: "Q1 Performance Reviews",
      description:
        "Schedule and conduct quarterly performance reviews for all team members",
      status: "in-progress",
      priority: "medium",
      startDate: "2026-01-28",
      dueDate: "2026-02-15",
      progress: 40,
      tags: ["performance", "reviews"],
      assignees: [
        {
          id: 1,
          name: "Sarah Chen",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
          color: "bg-blue-500"
        },
        {
          id: 4,
          name: "James Lee",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=James",
          color: "bg-orange-500"
        }
      ],
      comments: [
        {
          id: 1,
          text: "Completed 5 out of 12 reviews",
          author: "Sarah Chen",
          createdAt: "2026-02-04T16:00:00Z"
        }
      ],
      attachments: [
        {
          id: 1,
          name: "review_template.docx",
          url: "#",
          type: "docx"
        }
      ]
    },
    {
      id: "g7h8",
      title: "Update Benefits Package Information",
      description:
        "Revise employee benefits documentation with new healthcare options",
      status: "done",
      priority: "low",
      startDate: "2026-01-20",
      dueDate: "2026-02-01",
      progress: 100,
      tags: ["benefits", "documentation"],
      assignees: [
        {
          id: 5,
          name: "Lisa Anderson",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa",
          color: "bg-pink-500"
        }
      ],
      comments: [],
      attachments: [
        {
          id: 1,
          name: "benefits_guide_2026.pdf",
          url: "#",
          type: "pdf"
        }
      ]
    },
    {
      id: "i9j0",
      title: "Team Building Event Planning",
      description: "Organize Q1 team building activities and book venue",
      status: "todo",
      priority: "medium",
      startDate: "2026-02-10",
      dueDate: "2026-03-01",
      progress: 0,
      tags: ["team-building", "events"],
      assignees: [
        {
          id: 2,
          name: "Mike Johnson",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike",
          color: "bg-purple-500"
        },
        {
          id: 3,
          name: "Emma Wilson",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma",
          color: "bg-green-500"
        }
      ],
      comments: [],
      attachments: []
    },
    {
      id: "k1l2",
      title: "Diversity Training Module",
      description:
        "Develop and implement diversity and inclusion training for all staff",
      status: "done",
      priority: "high",
      startDate: "2026-01-15",
      dueDate: "2026-02-28",
      progress: 55,
      tags: ["training", "diversity"],
      assignees: [
        {
          id: 4,
          name: "James Lee",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=James",
          color: "bg-orange-500"
        }
      ],
      comments: [
        {
          id: 1,
          text: "First module completed and tested",
          author: "James Lee",
          createdAt: "2026-02-03T11:20:00Z"
        }
      ],
      attachments: [
        {
          id: 1,
          name: "training_outline.pdf",
          url: "#",
          type: "pdf"
        }
      ]
    },
    {
      id: "o5p6",
      title: "Remote Work Policy Update",
      description:
        "Review and update remote work guidelines based on team feedback",
      status: "todo",
      priority: "low",
      startDate: "2026-02-15",
      dueDate: "2026-03-15",
      progress: 0,
      tags: ["policy", "remote-work"],
      assignees: [
        {
          id: 5,
          name: "Seth",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Seth",
          color: "bg-pink-500"
        }
      ],
      comments: [],
      attachments: []
    },
    {
      id: "12b9",
      title: "Testing task by date",
      description: " task by date",
      status: "todo",
      priority: "medium",
      progress: 0,
      startDate: "2026-02-05T22:00:00.000Z",
      dueDate: "2026-02-06T22:00:00.000Z",
      comments: [
        {
          id: 1770385916001,
          text: "testing comment",
          author: "Seth N.",
          createdAt: "2026-02-06T13:51:56.001Z"
        },
        {
          id: 1770385937415,
          text: "testing comment",
          author: "Seth N.",
          createdAt: "2026-02-06T13:52:17.415Z"
        }
      ]
    }
  ]
}

export default function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
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
