(()=>{'use strict';
const register=document.querySelector('.research-register');if(!register)return;
const search=register.querySelector('#research-search'),year=register.querySelector('#research-year'),buttons=[...register.querySelectorAll('[data-research-type]')],entries=[...register.querySelectorAll('.research-entry')],count=register.querySelector('#research-count'),reset=register.querySelector('#research-reset'),empty=register.querySelector('#research-empty');
let type='all';
const normal=value=>value.normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
const records=entries.map(element=>({element,text:normal(element.textContent),category:element.dataset.category,year:element.dataset.year}));
function filter(){const words=normal(search.value.trim()).split(/\s+/).filter(Boolean);let visible=0;
for(const record of records){const match=(type==='all'||type===record.category)&&(year.value==='all'||year.value===record.year)&&words.every(word=>record.text.includes(word));record.element.hidden=!match;if(match)visible++;}
count.textContent=visible+' '+(visible===1?'work':'works')+(visible!==entries.length?' of '+entries.length:'');empty.hidden=visible!==0;reset.hidden=type==='all'&&year.value==='all'&&!search.value;}
for(const button of buttons)button.addEventListener('click',()=>{type=button.dataset.researchType;for(const b of buttons)b.setAttribute('aria-pressed',String(b===button));filter();});
search.addEventListener('input',filter);year.addEventListener('change',filter);
reset.addEventListener('click',()=>{type='all';search.value='';year.value='all';for(const b of buttons)b.setAttribute('aria-pressed',String(b.dataset.researchType==='all'));filter();search.focus();});
register.querySelector('.research-tools').hidden=false;filter();
})();
