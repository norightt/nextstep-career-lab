import {sampleText,studyText} from './data.mjs';
import {analyzeProfile,getSkillName,getPlan,getReflectionQuestions} from './engine.mjs';

const $ = id => document.getElementById(id);
const esc = value => String(value ?? '').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
const EVENT_KEY='nextstep_lab_events_v1';
const PLAN_KEY='nextstep_lab_plans_v1';
let analysis=null;
let selected=null;
let activePage='candidate';
let rated=false;
let toastTimer=null;

function getStored(key) {
  try {const value=JSON.parse(localStorage.getItem(key)||'[]');return Array.isArray(value)?value:[];}
  catch {return [];}
}
function store(key,value) {
  try {localStorage.setItem(key,JSON.stringify(value));return true;}
  catch {return false;}
}
function getPlans(){return getStored(PLAN_KEY);}
function getEvents(){return getStored(EVENT_KEY);}
function track(event,props={}) {
  // Never log profile text, names, emails, or full AI requests.
  const allowed=new Set(['role','direction','section','rating','skill_count','done']);
  const clean=Object.fromEntries(Object.entries(props).filter(([key,val])=>allowed.has(key)&&(typeof val==='string'||typeof val==='number'||typeof val==='boolean')));
  store(EVENT_KEY,[...getEvents(),{event,props:clean,at:new Date().toISOString()}].slice(-250));
  updateEventCount();
}
function updateEventCount(){if($('event-count'))$('event-count').textContent=`${getEvents().length} событий`;}
function notice(message){const el=$('toast');el.textContent=message;el.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('show'),4200);}
function updatePlanCount(){if($('saved-count'))$('saved-count').textContent=String(getPlans().length);}

function showPage(page){
  activePage=page;
  document.querySelectorAll('.page').forEach(el=>el.classList.toggle('active',el.id===`page-${page}`));
  document.querySelectorAll('[data-page]').forEach(el=>{
    const isActive=el.dataset.page===page;
    el.classList.toggle('active',isActive);
    if(isActive)el.setAttribute('aria-current','page');else el.removeAttribute('aria-current');
  });
  $('main-navigation').classList.remove('open');
  $('menu-toggle').setAttribute('aria-expanded','false');
  if(page==='saved')renderPlans();
  window.scrollTo({top:0,behavior:'smooth'});
  track('section_opened',{section:page});
}

document.querySelectorAll('[data-page]').forEach(el=>el.addEventListener('click',()=>showPage(el.dataset.page)));
$('menu-toggle').addEventListener('click',()=>{
  const open=$('main-navigation').classList.toggle('open');
  $('menu-toggle').setAttribute('aria-expanded',String(open));
});
$('home-link').addEventListener('click',()=>showPage('candidate'));
$('jump-cta').addEventListener('click',()=>{
  if(activePage!=='candidate')showPage('candidate');
  setTimeout(()=>$('workspace').scrollIntoView({behavior:'smooth',block:'start'}),80);
});
$('profile').addEventListener('input',()=>{
  $('char-count').textContent=`${$('profile').value.length} / 5000`;
  $('form-error').hidden=true;
});
let sampleIndex=0;
$('sample-btn').addEventListener('click',()=>{
  $('profile').value=sampleIndex++%2===0?sampleText:studyText;
  $('profile').dispatchEvent(new Event('input'));
  track('sample_loaded');
  notice('Пример добавлен в поле ввода');
});
$('analyze-btn').addEventListener('click',()=>{
  $('form-error').hidden=true;
  try {
    track('analysis_started',{direction:$('interest').value});
    analysis=analyzeProfile($('profile').value,$('interest').value);
    selected=analysis.top;
    rated=false;
    renderResult();
    track('results_viewed',{role:selected.id,skill_count:analysis.found.length});
    if(window.innerWidth<760)$('result-panel').scrollIntoView({behavior:'smooth',block:'start'});
  }catch(error){$('form-error').textContent=error.message;$('form-error').hidden=false;}
});

function renderResult(){
  $('empty-result').hidden=true;
  $('actual-result').hidden=false;
  const role=selected;
  const known=role.matched.length?role.matched.map(([id])=>`<span class="skill-tag">✓ ${esc(getSkillName(id))}</span>`).join(''):'<span class="skill-tag missing">Навыки пока не распознаны — попробуй уточнить описание</span>';
  const gaps=role.missing.slice(0,6).map(([id])=>`<span class="skill-tag missing">+ ${esc(getSkillName(id))}</span>`).join('')||'<span class="skill-tag">Основные навыки найдены</span>';
  const suggestions=[...analysis.ranked.slice(0,4),role].filter((r,i,arr)=>arr.findIndex(x=>x.id===r.id)===i).map(r=>`<button class="recommendation ${r.id===role.id?'selected':''}" data-role="${esc(r.id)}" aria-pressed="${r.id===role.id}"><div><h4>${esc(r.title)}</h4><p>${esc(r.badge)}</p></div><span>${r.coverage}% ↗</span></button>`).join('');
  const plan=getPlan(role).map(text=>`<li>${esc(text)}</li>`).join('');
  const reflections=getReflectionQuestions(role).map(text=>`<li>${esc(text)}</li>`).join('');
  const isSaved=getPlans().some(p=>p.id===role.id);
  $('actual-result').innerHTML=`<div class="report-kicker">РЕЗУЛЬТАТ АНАЛИЗА</div>
    <div class="report-top"><h3>${esc(role.title)}</h3><p>${esc(role.summary)}</p></div>
    <div class="score-wrap"><div class="score-ring" style="--score:${role.coverage}%"><div class="score-inner"><strong>${role.coverage}%</strong><span>покрытие</span></div></div><div class="score-copy"><h4>Совпадение навыков</h4><p>${esc(role.why)} Процент — доля навыков, найденных в твоём тексте, с учётом учебных весов. Он не измеряет квалификацию.</p></div></div>
    <div class="tag-title">Упомянуто в описании</div><div class="tag-list">${known}</div>
    <div class="tag-title">Можно изучить дополнительно</div><div class="tag-list">${gaps}</div>
    <div class="tag-title">Сравнение с другими направлениями</div><div class="report-list">${suggestions}</div>
    <div class="roadmap"><h4>✳ Идеи для практики на 14 дней</h4><ol>${plan}</ol></div>
    <details class="report-details"><summary>Вопросы для самооценки</summary><ol>${reflections}</ol></details>
    <div class="report-actions"><button id="save-plan" class="action-main">${isSaved?'↻ Обновить сохранённый план':'♡ Сохранить план'}</button><button id="report-download">Скачать TXT ↓</button></div>
    <div class="report-actions"><button id="ai-btn">✳ AI-комментарий (необязательно)</button><button id="feedback-btn">${rated?'Спасибо за отзыв ✓':'Полезная рекомендация ♡'}</button></div>
    <div id="ai-output" class="ai-output" hidden><h4>AI-комментарий</h4><p id="ai-output-text"></p></div>
    <div class="mode-line">Сравнение и план работают без AI. Для дополнительного комментария нужен настроенный серверный API.</div>
    <div class="report-note">Справочник направлений учебный и неполный. Не используй эти проценты для кадровых решений.</div>`;
  $('actual-result').querySelectorAll('[data-role]').forEach(btn=>btn.addEventListener('click',()=>{
    selected=analysis.ranked.find(role=>role.id===btn.dataset.role);
    rated=false;renderResult();track('role_compared',{role:selected.id});
  }));
  $('save-plan').addEventListener('click',saveCurrentPlan);
  $('report-download').addEventListener('click',exportReport);
  $('ai-btn').addEventListener('click',requestAiComment);
  $('feedback-btn').addEventListener('click',()=>{
    if(rated)return notice('Оценка уже сохранена в локальном журнале');
    rated=true;track('feedback_given',{rating:'helpful',role:selected.id});
    $('feedback-btn').textContent='Спасибо за отзыв ✓';notice('Спасибо! Отзыв записан только на этом устройстве');
  });
}

function saveCurrentPlan(){
  if(!selected)return;
  const plans=getPlans();
  const old=plans.find(plan=>plan.id===selected.id);
  const tasks=getPlan(selected).map(text=>({text,done:old?.tasks?.find(item=>item.text===text)?.done===true}));
  const item={id:selected.id,title:selected.title,coverage:selected.coverage,matched:selected.matched.map(([id])=>getSkillName(id)),missing:selected.missing.map(([id])=>getSkillName(id)),tasks,savedAt:new Date().toISOString()};
  const next=[item,...plans.filter(plan=>plan.id!==item.id)];
  if(!store(PLAN_KEY,next))return notice('Не получилось сохранить план: браузер запретил локальное хранилище');
  track('plan_saved',{role:selected.id});updatePlanCount();renderPlans();renderResult();
  notice('План сохранён во вкладке «Мои планы»');
}

function renderPlans(){
  const plans=getPlans();
  updatePlanCount();
  $('saved-summary').textContent=plans.length?`${plans.length} ${plans.length===1?'направление':'направления'} · данные только в этом браузере`:'Пока нет сохранённых планов';
  $('export-plans').disabled=!plans.length;
  if(!plans.length){
    $('saved-list').innerHTML=`<div class="saved-empty"><div class="saved-empty-icon">✳</div><h2>Здесь будут твои планы</h2><p>Сравни направления на карте навыков и сохрани одно из них. Тогда можно будет отмечать выполненные задания.</p><button class="secondary-btn" id="empty-goto">Перейти к анализу ↗</button></div>`;
    $('empty-goto').addEventListener('click',()=>showPage('candidate'));
    return;
  }
  $('saved-list').innerHTML=plans.map(plan=>{
    const done=plan.tasks.filter(task=>task.done).length;
    const progress=Math.round(100*done/(plan.tasks.length||1));
    return `<article class="panel saved-card" data-saved-role="${esc(plan.id)}">
      <div class="saved-card-top"><div><div class="panel-overline">СОХРАНЁННЫЙ ПЛАН</div><h2>${esc(plan.title)}</h2></div><span class="saved-coverage">${Number(plan.coverage)||0}% <small>покрытие</small></span></div>
      <p class="saved-muted">Распознанные навыки: ${plan.matched.length?esc(plan.matched.slice(0,4).join(', ')):'не определены'}</p>
      <div class="saved-progress-line"><span>${done} из ${plan.tasks.length} заданий</span><b>${progress}%</b></div><div class="saved-progress-track"><span style="width:${progress}%"></span></div>
      <div class="saved-task-list">${plan.tasks.map((task,index)=>`<label class="saved-task"><input type="checkbox" data-task="${index}" ${task.done?'checked':''}/><span>${esc(task.text)}</span></label>`).join('')}</div>
      <div class="saved-actions"><button class="quiet-btn" data-remove="${esc(plan.id)}">Удалить план</button></div>
    </article>`;
  }).join('');
  $('saved-list').querySelectorAll('[data-task]').forEach(box=>box.addEventListener('change',()=>{
    const id=box.closest('[data-saved-role]').dataset.savedRole;
    const index=Number(box.dataset.task);
    const current=getPlans();const plan=current.find(p=>p.id===id);
    if(!plan||!plan.tasks[index])return;
    plan.tasks[index].done=box.checked;
    if(!store(PLAN_KEY,current)){notice('Не удалось сохранить изменения');box.checked=!box.checked;return;}
    track('practice_task_toggled',{role:id,done:box.checked});renderPlans();
  }));
  $('saved-list').querySelectorAll('[data-remove]').forEach(btn=>btn.addEventListener('click',()=>{
    const id=btn.dataset.remove;
    if(!store(PLAN_KEY,getPlans().filter(p=>p.id!==id)))return notice('Не удалось удалить план');
    track('plan_removed',{role:id});renderPlans();
    if(selected?.id===id)renderResult();
    notice('План удалён с этого устройства');
  }));
}
function saveFile(name,contents,mime){
  const url=URL.createObjectURL(new Blob([contents],{type:mime}));
  const a=document.createElement('a');a.href=url;a.download=name;a.click();
  setTimeout(()=>URL.revokeObjectURL(url),1000);
}
function exportReport(){
  if(!selected)return;
  const r=selected;
  const lines=['NEXTSTEP LAB — КАРТА НАВЫКОВ','',`Направление: ${r.title}`,`Покрытие учебного профиля: ${r.coverage}%`,'',`Упомянутые навыки: ${r.matched.map(([id])=>getSkillName(id)).join(', ')||'не обнаружены'}`,`Для изучения: ${r.missing.map(([id])=>getSkillName(id)).join(', ')||'нет'}`,'','Практика на 14 дней:',...getPlan(r).map((step,index)=>`${index+1}. ${step}`),'','Вопросы для самооценки:',...getReflectionQuestions(r).map((text,i)=>`${i+1}. ${text}`),'','Проценты отражают только учебную эвристику, не уровень компетентности.'];
  saveFile('nextstep-skill-map.txt',lines.join('\n'),'text/plain;charset=utf-8');track('report_exported',{role:r.id});notice('Отчёт скачан в формате TXT');
}

async function requestAiComment(){
  const button=$('ai-btn'),out=$('ai-output'),text=$('ai-output-text');
  button.disabled=true;button.textContent='Генерация…';out.hidden=false;text.textContent='Проверяем подключение к AI…';
  track('ai_comment_requested',{role:selected.id});
  const payload={profile:$('profile').value.slice(0,4000),role:selected.title,matched:selected.matched.map(([id])=>getSkillName(id)),missing:selected.missing.slice(0,5).map(([id])=>getSkillName(id))};
  const send=async password=>{
    const headers={'Content-Type':'application/json'};
    if(password)headers['X-Demo-Password']=password;
    const response=await fetch('/api/coach',{method:'POST',headers,body:JSON.stringify(payload)});
    const data=await response.json().catch(()=>({}));
    return {response,data};
  };
  try{
    let {response,data}=await send();
    if(response.status===401&&data.code==='password_required'){
      const code=window.prompt('Владелец этого стенда включил AI-доступ по коду. Введи код:');
      if(!code)throw Error('Для дополнительного AI-комментария нужен код доступа.');
      ({response,data}=await send(code));
    }
    if(!response.ok){
      if(response.status===404||response.status===405)throw Error('AI-функция недоступна на этом сервере. Основной анализ работает без неё.');
      throw Error(data.error||'AI-сервис сейчас недоступен.');
    }
    if(typeof data.advice!=='string')throw Error('AI вернул неожиданный формат ответа.');
    text.textContent=data.advice;
    track('ai_comment_received',{role:selected.id});
  }catch(error){text.textContent=`${error.message}\n\nСравнение направлений и планы практики доступны без AI.`;}
  finally{button.disabled=false;button.textContent='↻ Повторить AI-комментарий';}
}

$('export-plans').addEventListener('click',()=>{
  const plans=getPlans();if(!plans.length)return;
  saveFile('nextstep-my-plans.json',JSON.stringify({app:'NextStep Lab',plans},null,2),'application/json');
  track('plans_exported');notice('Планы экспортированы в JSON');
});
$('export-events').addEventListener('click',()=>{
  saveFile('nextstep-local-events.json',JSON.stringify(getEvents(),null,2),'application/json');notice('Журнал экспортирован');
});
$('clear-events').addEventListener('click',()=>{
  try{localStorage.removeItem(EVENT_KEY);notice('Журнал очищен');}catch{notice('Браузер не разрешил очистить журнал');}
  updateEventCount();
});
renderPlans();updateEventCount();track('page_opened',{section:'candidate'});
