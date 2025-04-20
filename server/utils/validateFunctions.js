// Plan Validators
function validateWorkoutPlan(plan) {
  return {
    schedule: plan.schedule,
    exercises: plan.exercises.map((exercise) => ({
      day: exercise.day,
      routines: exercise.routines.map((routine) => ({
        name: routine.name,
        sets:
          typeof routine.sets === "number"
            ? routine.sets
            : parseInt(routine.sets) || 1,
        reps:
          typeof routine.reps === "number"
            ? routine.reps
            : parseInt(routine.reps) || 10,
      })),
    })),
  };
}

function validateDietPlan(plan) {
  return {
    dailyCalories: plan.dailyCalories,
    meals: plan.meals.map((meal) => ({
      name: meal.name,
      foods: meal.foods,
    })),
  };
}

module.exports = { validateWorkoutPlan, validateDietPlan };
