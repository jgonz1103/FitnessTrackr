/* eslint-disable no-useless-catch */
const client = require("./client")

// database functions
async function getAllActivities() {
  try {
    const { rows: activityIds } = await client.query(`
    SELECT id FROM activities;
    `)

    const activities = await Promise.all(activityIds.map(
        activity => getPostById( activity.id )
    ));
    return activities
  } 
  catch (error) {
    throw error;
  }
}

async function getActivityById(id) {
  try {
    const { rows: [ activity ]  } = await client.query(`
      SELECT * FROM posts
      WHERE id=$1;
    `, [activityId]);
    return activity;
  } catch (error) {
    throw error;
  }
}

async function getActivityByName(name) {
  try {
    const { rows: activityIds } = await client.query(`
      SELECT activities.id
      FROM activities
    `, [name]);

    return await Promise.all(activityIds.map(
      activity => getPostById(activity.id)
    ));
  } catch (error) {
    throw error;
  }
}

// select and return an array of all activities
async function attachActivitiesToRoutines(routines) {
  // no side effects
  const routinesToReturn = [...routines];
  const binds = routines.map((_, index) => `$${index + 1}`).join(', ');
  const routineIds = routines.map(routine => routine.id);
  if (!routineIds?.length) return [];
  
  try {
    // get the activities, JOIN with routine_activities (so we can get a routineId), and only those that have those routine ids on the routine_activities join
    const { rows: activities } = await client.query(`
      SELECT activities.*, routine_activities.duration, routine_activities.count, routine_activities.id AS "routineActivityId", routine_activities."routineId"
      FROM activities 
      JOIN routine_activities ON routine_activities."activityId" = activities.id
      WHERE routine_activities."routineId" IN (${ binds });
    `, routineIds);

    // loop over the routines
    for(const routine of routinesToReturn) {
      // filter the activities to only include those that have this routineId
      const activitiesToAdd = activities.filter(activity => activity.routineId === routine.id);
      // attach the activities to each single routine
      routine.activities = activitiesToAdd;
    }
    return routinesToReturn;
  } catch (error) {
    throw error;
  }
}

// return the new activity
async function createActivity({ 
    name, 
    description 
  }) {
    try{
        const {rows: createActivity } = await client.query(`
          Id SERIAL PRIMARY KEY
          name VARCHAR(255) UNIQUE NOT NULL
          description TEXT NOT NULL
          `, [ name, description]);
        return createActivity;
    } catch (error) {
      throw error;
    }
  }

// don't try to update the id
// do update the name and description
// return the updated activity
async function updateActivity({ id, ...fields }) {

}


module.exports = {
  getAllActivities,
  getActivityById,
  getActivityByName,
  attachActivitiesToRoutines,
  createActivity,
  updateActivity,
}
