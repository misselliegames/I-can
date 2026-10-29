/* Persisted short sessions. Every verb appears as a target or visible alternative. */
globalThis.WordCoveragePlanner=(()=>{
 function shuffle(values,rng){const a=[...values];for(let i=a.length-1;i>0;i--){const j=Math.floor(rng()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
 function build({scenes,distractors,chapter,rng=Math.random,firstIndex=null}){
  const ids=scenes.map(s=>s.id),full=(1<<ids.length)-1,masks=scenes.map(s=>[s.id,...distractors[s.id]].reduce((mask,id)=>mask|(1<<ids.indexOf(id)),0)),covers=[];
  function search(start,chosen,mask){if(chosen.length===8){if(mask===full&&(firstIndex===null||chosen.includes(firstIndex)))covers.push([...chosen]);return}for(let i=start;i<=scenes.length-(8-chosen.length);i++){chosen.push(i);search(i+1,chosen,mask|masks[i]);chosen.pop()}}
  search(0,[],0);if(!covers.length)throw Error('Cannot cover all vocabulary in eight pictures');
  function order(indices){let remaining=shuffle(indices,rng),seen=new Set(),out=[];while(remaining.length){let candidates=remaining.filter(i=>!seen.has(ids[i]));if(!candidates.length)candidates=remaining;let i=out.length===0&&firstIndex!==null?firstIndex:candidates[Math.floor(rng()*candidates.length)];out.push(i);remaining=remaining.filter(x=>x!==i);for(const id of [ids[i],...distractors[ids[i]]])seen.add(id)}return out}
  function actors(indices){if(chapter==='ivan')return indices.map(()=>'ivan');
   const forcedBoo=new Set(['take-a-selfie','speak-Russian','talk-to-spiders']),eligible=indices.map((i,k)=>forcedBoo.has(ids[i])?-1:k).filter(k=>k>=0),valid=[];
   for(let mask=0;mask<(1<<eligible.length);mask++){let a=indices.map(()=>'boo');eligible.forEach((k,j)=>{if(mask&(1<<j))a[k]='simon'});const boo=a.filter(x=>x==='boo').length,simon=a.length-boo,negative=a.filter((x,k)=>x==='boo'&&!scenes[indices[k]].booCan).length;if(boo>=4&&simon>=2&&negative>boo-negative&&a.every((x,k)=>k<2||x!==a[k-1]||x!==a[k-2]))valid.push(a)}
   return valid.length?valid[Math.floor(rng()*valid.length)]:null;
  }
  for(const candidate of shuffle(covers,rng)){const indices=order(candidate),subjects=actors(indices);if(!subjects)continue;
   return indices.map((index,k)=>({index,subject:subjects[k],askYou:chapter==='boo',choices:shuffle([ids[index],...distractors[ids[index]]],rng)}));
  }
  throw Error('Cannot assign clear, balanced characters');
 }
 return {build};
})();

