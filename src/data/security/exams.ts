import { EXAM_SEEDS } from './exam-seeds';
import { ADVANCED_SEEDS } from './exam-seeds-advanced';
import { MULTIPLE_SEEDS } from './exam-multiple';
import { EXAM_PRACTICALS } from './practicals';
import { SECURITY_OBJECTIVES } from './objectives';
import { question, text, type Option } from './helpers';
import { LEARNING_REVISION, type AssessmentForm } from '../../lib/securityLearning';
const seeds=[...EXAM_SEEDS,...ADVANCED_SEEDS];
for(const replacement of MULTIPLE_SEEDS) { const at=seeds.findIndex(x=>x.objective===replacement.objective);seeds[at]=replacement; }
export const EXAM_FORMS:AssessmentForm[]=['A','B','C'].map((form,variant)=>{
  const items=[1,2,3,4,5].flatMap(domain=>seeds.filter(s=>Number(s.objective[0])===domain).slice(0,[11,20,15,22,18][domain-1]).map((s,i)=>{
    const [prompt,correct]=s.cases[variant]; const objective=SECURITY_OBJECTIVES.find(o=>o.id===s.objective)!;
    return question(`exam-${form}-d${domain}-${i+1}`,s.objective,domain,text(prompt,prompt),
      s.options.map((label,n)=>[label,label,s.reasons[n]] as Option),correct,{lessonId:objective.lessons[0]},'analyze');
  }));
  return {id:`form-${form}`,revision:LEARNING_REVISION,title:`Security+ · forma ${form}`,minutes:90,items:[...EXAM_PRACTICALS[form],...items]};
});
