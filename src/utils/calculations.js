export function totals(semesters) {
 const courses = semesters.flatMap(s => s.subjects || []);
 const credits = courses.reduce((n,s) => n + Number(s.credits),0);
 const points = courses.reduce((n,s) => n + Number(s.credits)*Number(s.points),0);
 return { credits, gpa: credits ? points/credits : 0 };
}
export function requiredGpa(current, completed, target, next) {
 if (![current,completed,target,next].every(Number.isFinite) || completed<0 || next<=0 || current<0 || target<0) throw new Error('Enter valid grades and credits. Next semester credits must be greater than zero.');
 return (target*(completed+next)-current*completed)/next;
}
export const formatGpa = n => Number(n).toFixed(2);
