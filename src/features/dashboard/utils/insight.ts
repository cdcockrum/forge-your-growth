function insight(consistency: number, areasN: number, skillsN: number) {
  if (areasN === 0) return "Begin by naming the areas of life you want to become expert in. The forge waits for the first strike.";
  if (skillsN === 0) return "Add the skills that will move you toward who you're becoming. Direction precedes discipline.";
  if (consistency >= 80) return "Excellence is not an act, but a habit. You are showing up. Double down on your current rhythm.";
  if (consistency >= 50) return "The blade is not made by the intensity of the heat, but by the regularity of the strike. Return tomorrow.";
  return "True discipline is not about control, but about remembering what you want most. Start with one session today.";
}
