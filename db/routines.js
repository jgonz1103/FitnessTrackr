/* eslint-disable no-useless-catch */
const { attachActivitiesToRoutines } = require('./activities');
const client = require('./client');

async function getRoutineById(id){
  try {
    const { rows: [ routine ]  } = await client.query(`
      SELECT * FROM routines
      WHERE id=$1;
    `, [id]);
    return routine;
  } catch (error) {
    throw error;
  }
}

async function getRoutinesWithoutActivities(){
const {rows: allRoutines} = await client.query(`
SELECT *
FROM routines;
`)

return allRoutines
}

async function getAllRoutines() {
    const {rows: routines} = await client.query(`
   SELECT routines.*, users.username AS "creatorName"
   FROM routines
   JOIN users ON "creatorId"=users.id
   WHERE "isPublic" = TRUE;
    `)
   console.log(routines,"does this work?")

    return routines

}

async function getAllRoutinesByUser({username}) {
  try{
    const { rows: routineIds } = await client.query(`
        SELECT * FROM routines 
        WHERE author=${username};
    `)
    const routine = await Promise.all(routineIds.map(
        routine => getRoutineById( routine.id )
    ))
    return routine
  }
  catch(error){
    throw error
  }
}

async function getPublicRoutinesByUser({username}) {
}

async function getAllPublicRoutines() {
}

async function getPublicRoutinesByActivity({id}) {
}

async function createRoutine({creatorId, isPublic, name, goal}) {
  try{
    const {rows: createRoutine } = await client.query(`
      INSERT INTO routines("creatorId", "isPublic", name, goal) 
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (name) DO NOTHING
      RETURNING *;
    `, [creatorId, isPublic, name, goal]);
  return createRoutine;
  } catch (error) {
    throw error;
  }
}

async function updateRoutine({id, ...fields}) {

  const setString = Object.keys(fields).map(
    (key, index) => `"${ key }"=$${ index + 1 }`
  ).join(', ');

try{

// if (setString.length === 0) {
//     return;
// }

if (setString.length > 0) {
    const { rows: [ routine ] } = await client.query(`
        UPDATE routines
        SET ${ setString }
        WHERE id=${ id }
        RETURNING *;
        `, Object.values(fields));

    return {rows: [ routine ]};
}

return await getRoutineById(id);

}

catch(error){
    throw error
}
}

async function destroyRoutine(id) {
}

module.exports = {
  getRoutineById,
  getRoutinesWithoutActivities,
  getAllRoutines,
  getAllPublicRoutines,
  getAllRoutinesByUser,
  getPublicRoutinesByUser,
  getPublicRoutinesByActivity,
  createRoutine,
  updateRoutine,
  destroyRoutine,
}