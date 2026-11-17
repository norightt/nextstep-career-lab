import {skills, roles} from './data.mjs';

const norm = (s) => String(s ?? '').toLocaleLowerCase('ru-RU').replace(/ё/g,'е');
const escapeRegExp = (s) => s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');

// Short abbreviations must be complete words: "ai" is not a skill inside "email".
// Longer Russian stems deliberately use substring matching to handle inflection.
function matchesAlias(text, alias) {
  const part=norm(alias);
  if (!part) return false;
  const short = /^[a-zа-я0-9]{2,4}$/u.test(part);
  return short ? new RegExp(`(^|[^\\p{L}\\p{N}])${escapeRegExp(part)}(?=$|[^\\p{L}\\p{N}])`, 'u').test(text) : text.includes(part);
}
export function extractSkills(profile) {
  const text=norm(profile);
  return skills.filter(({aliases})=>aliases.some(alias=>matchesAlias(text,alias))).map(s=>s.id);
}
export function getSkillName(id) {return skills.find(x=>x.id===id)?.label ?? id;}

export function analyzeProfile(profile, preferred='all') {
  if(typeof profile!=='string' || profile.trim().length<30) throw Error('Опиши свой опыт чуть подробнее — минимум 30 символов.');
  if(profile.length>5000) throw Error('Описание слишком длинное. Максимум 5000 символов.');
  const found=extractSkills(profile);
  const ranked=roles.map(role=>{
    const total=role.req.reduce((sum,[,weight])=>sum+weight,0);
    const matched=role.req.filter(([skill])=>found.includes(skill));
    const missing=role.req.filter(([skill])=>!found.includes(skill));
    const coverage=Math.round(100*matched.reduce((sum,[,weight])=>sum+weight,0)/total);
    const preference=(preferred==='all'||preferred===role.category)?0:-5;
    return {...role, matched, missing, coverage,rankScore:coverage+preference};
  }).sort((a,b)=>b.rankScore-a.rankScore || a.title.localeCompare(b.title,'ru'));
  return {found,ranked,top:ranked[0],date:new Date().toISOString()};
}
export function getPlan(role) {
  const gaps=[...role.missing].sort((a,b)=>b[1]-a[1]).slice(0,3);
  if(!gaps.length) return ['Выбрать практическую задачу и обозначить критерий успеха','Показать результат двум людям и собрать обратную связь','Оформить небольшой кейс с выводами'];
  return gaps.map(([id])=>role.steps?.[id] ?? `Сделать мини-проект, демонстрирующий навык «${getSkillName(id)}»`);
}
export function getReflectionQuestions(role) {
  return [
    `В каких проектах уже встречались навыки из области «${role.title}» и что получилось в результате?`,
    `Какой из недостающих навыков я могу проверить на практике за 14 дней?`,
    'По каким признакам я пойму, что это направление мне интересно?'
  ];
}
