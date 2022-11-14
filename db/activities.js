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
  try{
    await client.query(`
    INSERT INTO activities();
    
    `)
  }
  catch(error){
    throw error
  }
}

// return the new activity
async function createActivity({ name, description }) {

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
