import { Request, Response, NextFunction } from 'express'
import { ObjectId } from 'mongodb';
import { Todos } from '../../todos/todo.model';
import { UserTodos } from '../../../models/userTodo';

export async function getChecklistsByWeek(
    req: Request<{}, {}, {}, { week: string, weekId: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { week, weekId } = req.query
      const [checklists, userChecklists] = await Promise.all([
        Todos.aggregate([
            {
                $match: {
                    week: { $in: [weekId] }
                }
            }
        ]).toArray(),
        UserTodos.aggregate([
            {
              $match: {
                week
              }
            },
            {
              $lookup: {
                from: "todos",
                localField: "adminTodo",
                foreignField: "_id",
                as: "todo"
              }
            },
            {
              $unwind: {
                path: "$todo",
                preserveNullAndEmptyArrays: true
              }
            }
          ]).toArray()
      ])

      const checklistsByWeek: {
        users: string[],
        checklist: string,
        completed: number,
        addeded: number,
        assigned: number,
        dateAdded: number
      }[] = []

      let checklistsLeft = userChecklists

      checklists.forEach(checklist => {
        const adminTodo = checklist._id.toString();
        const userWithChecklists = checklistsLeft.filter(userChecklist => userChecklist?.adminTodo && userChecklist.adminTodo.toString() === adminTodo);
        const users = userWithChecklists.map(userChecklist => userChecklist.userId.toString());

        checklistsLeft = checklistsLeft.filter(userChecklist => userChecklist?.adminTodo && userChecklist.adminTodo.toString() !== adminTodo);
        
        const existingChecklist = checklistsByWeek.find(c => c.checklist === checklist.title);
        const completed = userWithChecklists.filter(userChecklist => userChecklist.completed).length;
        const assigned = userWithChecklists.filter(userChecklist => userChecklist.assignPartner).length;
        const dateAdded = userWithChecklists.filter(userChecklist => userChecklist.completionDate).length

        if (!existingChecklist) {
          checklistsByWeek.push({
            users: users,
            checklist: checklist.title,
            completed,
            assigned,
            dateAdded,
            addeded: 0
          });
        }
      });

      // Push the symptoms that are left
      // symptoms.forEach(symptom => {
      //   const existingChecklist = checklistsByWeek.find(s => s.symptom === symptom.name);
      //   if (!existingChecklist) {
      //     checklistsByWeek.push({
      //       users: [],
      //       symptom: symptom.name,
      //       selected: false,
      //       addeded: false
      //     });
      //   }
      // });

      // Push user symtpoms that are added
      checklistsLeft.forEach(checklist => {
        const adminTodo = checklist.todo._id.toString();
        const similarChecklists = checklistsLeft.filter(userChecklist => userChecklist?.adminTodo && userChecklist.adminTodo.toString() === adminTodo);
        const userIds = similarChecklists.map(userChecklist => userChecklist.userId.toString());

        if (!similarChecklists.length) {
          checklistsByWeek.push({
            users: [checklist.userId],
            checklist: checklist.todo.title,
            addeded: 1,
            completed: checklist.completed ? 1 : 0,
            assigned: checklist.assignPartner ? 1 : 0,
            dateAdded: checklist.completionDate ? 1 : 0 
          });
        }
        const existingChecklist = checklistsByWeek.find(c => c.checklist === checklist.todo.title);
        const completed = similarChecklists.filter(userChecklist => userChecklist.completed).length;
        const assigned = similarChecklists.filter(userChecklist => userChecklist.assignPartner).length;
        const dateAdded = similarChecklists.filter(userChecklist => userChecklist.completionDate).length

        if (!existingChecklist) {
          checklistsByWeek.push({
            users: userIds,
            checklist: checklist.todo.title,
            completed,
            assigned,
            dateAdded,
            addeded: similarChecklists.length
          });
        }
      })
  
      
      res.status(200)
      res.send(checklistsByWeek)
    } catch (err) {
      next(err)
    }
  }