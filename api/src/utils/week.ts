import { User, UserWithId, Users } from "../models/user"

export const getWeekNumber = (date: Date): number => {
  const startOfYear = new Date(date.getFullYear(), 0, 1)
  const startOfWeek = new Date(
    startOfYear.setDate(startOfYear.getDate() - startOfYear.getDay() + 1)
  )
  const diff = date.getTime() - startOfWeek.getTime()
  const weekNumber = Math.ceil(diff / (1000 * 60 * 60 * 24 * 7))
  return weekNumber
}

export const getCurrentWeek = (stage: string, createdAt: string) => {
  const currentStage = stage
  const accountCreationData = createdAt
  // Also get the consieve date
  // const consiveDate = ''

  // based upon the stage and consiveDate get the current week
  let createdAtWeek = getWeekNumber(new Date(accountCreationData))
  let currentWeek = getWeekNumber(new Date())

  if (currentStage === 'pre-conception') {
    currentWeek = (currentWeek - createdAtWeek) + 1
    if (currentWeek > 4) {
      currentWeek = 4
    }
  } else if (currentStage === "pregnancy") {
    currentWeek = 5
  }

  return currentWeek
}

export const getCurrentWeekFromConsiveDate = (consiveDate: string, createdAt: string) => {
  let givenDate = new Date(consiveDate);
  let currentDate = new Date();

  givenDate.setHours(0, 0, 0, 0);
  currentDate.setHours(0, 0, 0, 0);

  let weeks = 0; // Initialize weeks to 0, as the current week is considered as the first week.

  // Check if givenDate is greater than currentDate, as we want to find past dates.
  while (givenDate > currentDate) {
    givenDate.setDate(givenDate.getDate() - 7);
    weeks += 1;
  }

  return {week: 40 - weeks, date: givenDate};
}


export const getDaysOfWeekForWeek = ({weekNumber, createdAt, consiveDate}: {weekNumber: number, createdAt?: Date, consiveDate?: Date}) => {
  const daysInWeek = 7;
  const daysOfWeek = [];

  if (consiveDate) {
    let givenDate = new Date(consiveDate);
    let currentDate = new Date();
  
    givenDate.setHours(0, 0, 0, 0);
    currentDate.setHours(0, 0, 0, 0);
  
    let weeks = 40; // Initialize weeks to 0, as the current week is considered as the first week.
  
    // Check if givenDate is greater than currentDate, as we want to find past dates.
    while (weeks !== weekNumber) {
      weeks -= 1;
      givenDate.setDate(givenDate.getDate() - 7);
    }
  
    const targetWeekStart = new Date(givenDate);
    targetWeekStart.setHours(0, 0, 0, 0)
  
    for (let i = 0; i < daysInWeek * 4; i++) {
      const date = new Date(targetWeekStart);
      daysOfWeek.push(date);
      date.setDate(targetWeekStart.getDate() + i);
    }

    return daysOfWeek
  } 

  const startDate = new Date()
  // return 4 weeks from current date
  for (let i = 0; i < daysInWeek * 4; ++i) {
    const currentDate = new Date(startDate)
    daysOfWeek.push(currentDate)
    currentDate.setDate(startDate.getDate() + i)
  }

  return daysOfWeek
  
  // if (createdAt) {
  //   // Calculate the start date of the specified week
  //   const targetWeekStart = new Date(createdAt);
  //   targetWeekStart.setHours(0, 0, 0, 0)
  //   targetWeekStart.setDate(createdAt.getDate() + (weekNumber - 1) * daysInWeek);

  //   for (let i = 0; i < daysInWeek * 4; i++) {
  //     const currentDate = new Date(targetWeekStart);
  //     daysOfWeek.push(currentDate);
  //     currentDate.setDate(targetWeekStart.getDate() + i);
  //   }
  // } else if (consiveDate) {
  //   // Calculate the start date of the specified week
  //   const targetWeekStart = new Date(consiveDate);
  //   targetWeekStart.setHours(0, 0, 0, 0)

  //   for (let i = 0; i < daysInWeek * 4; i++) {
  //     const currentDate = new Date(targetWeekStart);
  //     daysOfWeek.push(currentDate);
  //     currentDate.setDate(targetWeekStart.getDate() + i);
  //   }
  // }

  // return daysOfWeek;
}

export const getDaysOfWeekFromWeekAndConsiveDate = ({ weekNumber, consiveDate, createdAt }: {weekNumber: number, consiveDate?: string, createdAt?: string}) => {
  const daysInWeek = 7;
  const daysOfWeek = []

  if (consiveDate) {
    let givenDate = new Date(consiveDate);
    let currentDate = new Date();
  
    givenDate.setHours(0, 0, 0, 0);
    currentDate.setHours(0, 0, 0, 0);
  
    let weeks = 40; // Initialize weeks to 0, as the current week is considered as the first week.
  
    // Check if givenDate is greater than currentDate, as we want to find past dates.
    while (weeks !== weekNumber) {
      weeks -= 1;
      givenDate.setDate(givenDate.getDate() - 7);
    }
  
    const targetWeekStart = new Date(givenDate);
    targetWeekStart.setHours(0, 0, 0, 0)
  
    for (let i = 0; i < daysInWeek * 4; i++) {
      const date = new Date(targetWeekStart);
      daysOfWeek.push(date);
      date.setDate(targetWeekStart.getDate() + i);
    }

    return daysOfWeek
  } 

  const startDate = new Date()
  // return 4 weeks from current date
  for (let i = 0; i < daysInWeek * 4; ++i) {
    const currentDate = new Date(startDate)
    daysOfWeek.push(currentDate)
    currentDate.setDate(startDate.getDate() + i)
  }

  return daysOfWeek

  // if (createdAt) {
  //   const createdAtDate = new Date(createdAt)
  //   const targetWeekStart = new Date(createdAt);
  //   targetWeekStart.setHours(0, 0, 0, 0)
  //   targetWeekStart.setDate(createdAtDate.getDate() + (weekNumber - 1) * daysInWeek);

  //   for (let i = 0; i < daysInWeek * 4; i++) {
  //     const currentDate = new Date(targetWeekStart);
  //     daysOfWeek.push(currentDate);
  //     currentDate.setDate(targetWeekStart.getDate() + i);
  //   }

  //   return daysOfWeek
  // }

  // return []
}

export const getWeekFromUser = async (user: Omit<UserWithId, 'password' | 'salt'> & { root: boolean }, reqWeek?: number, calander?: boolean) => {
  try {
    let week = getCurrentWeek(user.stage, user.createdAt)
    let date;
    let days: Array<Date> = [];
    // if (user?.partnerId && user.root === false) {
    //   const partneredUser = await Users.findOne({ _id: user.partnerId });
    //   if (partneredUser) {
    //     week = getCurrentWeek(partneredUser.stage, partneredUser.createdAt)
    //     date = partneredUser.createdAt
    //     week = reqWeek ? reqWeek : week

    //     if (calander) {
    //       days = getDaysOfWeekFromWeekAndConsiveDate({ weekNumber: week, createdAt: date?.toLocaleString()})
    //     }
    //   }

    //   if (partneredUser?.consiveDate) {
    //     const cw = getCurrentWeekFromConsiveDate(partneredUser.consiveDate, partneredUser.createdAt)
    //     week = cw.week
    //     date = cw.date

    //     week = reqWeek ? reqWeek : week

    //     if (calander) {
    //       days = getDaysOfWeekFromWeekAndConsiveDate({ weekNumber: week, consiveDate: date?.toLocaleString()})
    //     }
    //   }
    // } else {
      week = getCurrentWeek(user.stage, user.createdAt)
      date = user.createdAt

      week = reqWeek ? reqWeek : week

      if (calander) {
        days = getDaysOfWeekFromWeekAndConsiveDate({ weekNumber: week, createdAt: date?.toLocaleString()})
      }
      
      if (user?.consiveDate) {
        const cw  = getCurrentWeekFromConsiveDate(user!.consiveDate, user!.createdAt)
        week = cw.week
        date = cw.date

        week = reqWeek ? reqWeek : week

        if (calander) {
          days = getDaysOfWeekFromWeekAndConsiveDate({ weekNumber: week, consiveDate: date?.toLocaleString()})
        }
      }
    // }

    if (user?.email === "demo@babysteps.world") {
      return { week: 10, days }
    }
    
    return { week, days }
  } catch (err) {
    throw (err);
  }
}
