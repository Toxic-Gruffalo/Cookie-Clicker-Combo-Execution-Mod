//version 1.0: User Interface created, I'm sure it has no issues whatsoever and works perfectly fine. This is meant to be run by the Cookie Clicker Combo Execution Mod, if run otherwise it will not work.
//version 1.1: Changed the score system slightly, added more injections for seeding
//version 1.11: hotfix: accidentally broke the prompt system lol
//version 2.0: fixed scoring (hopefully), made the UI a bit more versatile, allowing others to create buttons using the lists, and made an example function (MoreTestButtons();) of how this can be done. Hopefully seeding is also fixed at this point
//version 2.01: adjusted score to make all settings give more or less the same score (hopefully)
//version 2.02: added the rebuy and time until next tick buttons
//version 2.03: added time until next golden cookie if you have nat off
//version 2.10: added p for pause, a mod for pausing the game using the P button as well as doing quick resets on R, as well as fixing sleep mode timeout saving the game

Game.sesame=0 //this prevents a crash if opensesame is open, but doesn't get rid of the fps counter. Not sure what to do about that
var FtHoFOutcomes=['random','blood frenzy','click frenzy','building special','frenzy','cursed finger','multiply cookies','cookie storm','free sugar lump','cookie storm drop','blab']
var promptN=0
var maxComboPow=1
var relComboPow=1
var maxBSCount=0
var maxGodz=1
var iniRaw=1
var tickerCount=0
var isClickedGC=false
var testButton='<a class="option neato" '+Game.clickStr+'="for (var i in moreButtons) {moreButtons[i].splice(moreButtons[i].indexOf(testButton),1)}; RedrawCCCEM();">Remove test buttons?</a>'
var iniTimerButton='<a class="option neato" '+Game.clickStr+'="promptN=12; GetPrompt();">Nat Spawn Timer '+iniTimer+' frames</a><br>'
if (typeof pForPauseButtons === 'undefined') {var pForPauseButtons=['<a class="option neato" '+Game.clickStr+'="Game.LoadMod(`https://glander.club/asjs/qdNgUW9y`);">Load P for Pause</a><br>']}
if (typeof moreButtons === 'undefined') {var moreButtons=[[],[],[]]}
var invalidateScore=0

if (typeof CCCEMUILoaded === 'undefined') {
  var CCCEMUILoaded=1
  
  //prevents you from using OpenSesame as this mod removes the debugLog to make it look nice, which breaks the game if you run OpenSesame.
  eval("Game.OpenSesame="+Game.OpenSesame.toString().replace("var str='';","return")) 
  if (l('debugLog')) {l('debugLog').remove();};
  
  //disable saving
  eval("Game.Logic="+Game.Logic.toString().replace("if (canSave) Game.WriteSave();","if (false) Game.WriteSave();"))
  eval("Game.Timeout="+Game.Timeout.toString().replace("Game.WriteSave();","")) 
  eval("Game.Resume="+Game.Resume.toString().replace("Game.LoadSave();",""))
  
  //seed spawn fortunes, GC effects, GC timer, and DEoRL, plus find multipliers when a GC is clicked
  eval("Game.getNewTicker="+Game.getNewTicker.toString().replace("!manual && Game.T>Game.fps*10 && Game.Has('Fortune cookies') && Math.random()<(Game.HasAchiev('O Fortuna')?0.04:0.02)","!manual && Game.T>Game.fps*10 && Game.Has('Fortune cookies') && FortuneTicker(manual)"))
  eval("Game.shimmerTypes.golden.popFunc="+Game.shimmerTypes.golden.popFunc.toString().replace("var list=[];","var list=[]; isClickedGC=true; FindMaxComboPow(); if (seedNats) {Math.seedrandom(Game.seed+'/'+Game.goldenClicks);};"))
  eval("Game.updateShimmers="+Game.updateShimmers.toString().replace("me.time++;","me.time++; if (seedNats) {Math.seedrandom(Game.seed+'/'+(i=='golden'?Game.goldenClicks:Game.reindeerClicked)+'/'+me.time);};")) 
  
  //find combo multipliers when a buff or golden cookie dies
  eval("Game.shimmer.prototype.die="+Game.shimmer.prototype.die.toString().replace("Game.shimmersL.removeChild(this.l);","if (!isClickedGC) {FindMaxComboPow()}; isClickedGC=false; Game.shimmersL.removeChild(this.l);"))
  eval("Game.updateBuffs="+Game.updateBuffs.toString().replace("if (buff.onDie) buff.onDie();","if (buff.onDie) buff.onDie(); FindMaxComboPow();"))
  };

function FortuneTicker(manual) {
  if (!seedTicker) {return (Math.random()<forceFortune)}
  Math.seedrandom(Game.seed+'/'+tickerCount);
  if (!manual) tickerCount++;
  return (Math.random()<forceFortune)
  };

function FindAuraP(a1, a2) {
  var auraSlot1=Game.dragonAura
  var auraSlot2=Game.dragonAura2
  if (!a2) {if (auraSlot1==3 || auraSlot2==3) {a2=3} else {a2=0};};
  Game.dragonAura=0
  Game.dragonAura2=a2
  Game.CalculateGains();
  var noA1=Game.cookiesPs
  Game.dragonAura=a1
  Game.CalculateGains();	
  var yesA1=Game.cookiesPs
  Game.dragonAura=auraSlot1
  Game.dragonAura2=auraSlot2
  Game.recalculateGains=1
  return yesA1/noA1
  };

function FindMaxComboPow() {
  var mComboPow=1;
  var rComboPow=1; 
  var bsCount=0; 
  var isBS=false; 
  var godzPow=1; 
  for (var i in Game.buffs) {
    var buff=Game.buffs[i]; 
    for (var obj in Game.Objects) {
      if (Game.goldenCookieBuildingBuffs[obj][0]==buff.name) {
        isBS=true; 
        bsCount++;
        };
      };
    if (buff.multCpS) {
      mComboPow*=buff.multCpS; 
      if (ConsistentBuffs(isBS?'building special':buff.type.name, bsCount)) {rComboPow*=buff.multCpS; if (isBS) {rComboPow*=(iniBC/10)/buff.multCpS};};
      isBS=false
      }; 
    if (buff.multClick) {
      mComboPow*=buff.multClick
      if (buff.name=='Devastation') {godzPow*=buff.multClick};
      if (ConsistentBuffs(buff.type.name)) {rComboPow*=buff.multClick;};
      };
    };
  if (Game.shimmerTypes['golden'].n>0) {mComboPow*=Math.pow(2.23, Game.shimmerTypes['golden'].n); mComboPow/=FindAuraP(1);};
  if (maxComboPow<mComboPow) {maxComboPow=mComboPow; relComboPow=rComboPow; maxBSCount=bsCount; maxGodz=godzPow}; 
  };

function ConsistentBuffs(buffName, bsCount) {
  var icBuffs=['dragonflight','blood frenzy','click frenzy','frenzy','dragon harvest']
  for (var i=0; i<bsCount; i++) {icBuffs.push('building special')}
  index=icBuffs.indexOf(forceFtHoF); if (forceFtHoF && index!=-1) icBuffs.splice(index, 1);
  index=icBuffs.indexOf('frenzy'); if (iniF && index!=-1) icBuffs.splice(index, 1);
  index=icBuffs.indexOf('dragon harvest'); if (iniDH && index!=-1) icBuffs.splice(index, 1);
  for (var i=0; i<iniBSCount; i++) {index=icBuffs.indexOf('building special'); if (index!=-1) icBuffs.splice(index, 1)};
  if (iniSpawn && iniGC!='R') {index=icBuffs.indexOf(Game.goldenCookieChoices[iniGC].toLowerCase()); if (index!=-1) icBuffs.splice(index, 1)};
  if (iniDO && iniGC2!='R') {index=icBuffs.indexOf(Game.goldenCookieChoices[iniGC2].toLowerCase()); if (index!=-1) icBuffs.splice(icBuffs.indexOf(index, 1))};
  if (iniDEoRL && iniGC3!='R') {index=icBuffs.indexOf(Game.goldenCookieChoices[iniGC3].toLowerCase()); if (index!=-1) icBuffs.splice(icBuffs.indexOf(index, 1))};
  for (var i in icBuffs) {if (icBuffs[i] == buffName) {return false}};
  return true
  };

function AllConsistentBuffsPow() {
  var cBuffs=[];
  var cBuffsPow=1
  if (forceFtHoF!='random') {cBuffs.push(forceFtHoF)};
  if (iniF && !(cBuffs.includes('frenzy'))) {cBuffs.push('frenzy')};
  if (iniDH && !(cBuffs.includes('dragon harvest'))) {cBuffs.push('dragon harvest')};
  if (iniSpawn && iniGC!='R' && (!(cBuffs.includes(Game.goldenCookieChoices[iniGC].toLowerCase())) || Game.goldenCookieChoices[iniGC].toLowerCase()=='building special')) {cBuffs.push(Game.goldenCookieChoices[iniGC].toLowerCase())}
  if (iniDO && iniGC2!='R' && (!(cBuffs.includes(Game.goldenCookieChoices[iniGC2].toLowerCase())) || Game.goldenCookieChoices[iniGC2].toLowerCase()=='building special')) {cBuffs.push(Game.goldenCookieChoices[iniGC2].toLowerCase())}
  if (iniDEoRL && iniGC3!='R' && (!(cBuffs.includes(Game.goldenCookieChoices[iniGC3].toLowerCase())) || Game.goldenCookieChoices[iniGC3].toLowerCase()=='building special')) {cBuffs.push(Game.goldenCookieChoices[iniGC3].toLowerCase())}
  for (var i=0; i<iniBSCount; i++) {cBuffs.push('building special')};
  for (var i in cBuffs) {
    buff=cBuffs[i]
    if (buff=='frenzy') {cBuffsPow*=7}
    else if (buff=='dragon harvest') {cBuffsPow*=Game.Has('Dragon fang')?17:15}
    else if (buff=='dragonflight') {cBuffsPow*=Game.Has('Dragon fang')?1223:1111}
    else if (buff=='building special') {cBuffsPow*=1+(iniBC/10)}
    else if (buff=='click frenzy') {cBuffsPow*=777}
    else if (buff=='blood frenzy') {cBuffsPow*=666}
    else {console.log('score may be inaccurate: consistent golden cookie outcome unregistered (may be due to having some setting as storm or lucky or something like that)')}
    };
  return cBuffsPow
  };

function PrintScore() {
  var cookieGain=Game.cookiesEarned-iniCE
  var scoreRed=(maxComboPow*iniRaw*AllConsistentBuffsPow()/relComboPow);
  var score=cookieGain/scoreRed;
  var icon=[1,7]
  if (score>1e7) {icon=[1,7]}
  if (score>1e6) {icon=[22,7]}
  else if (score>5e5) {icon=[33,4]}
  else if (score>1e5) {icon=[32,4]}
  else if (score>1e4) {icon=[14,5]}
  else if (score>1e3) {icon=[13,5]}
  else if (score>1e2) {icon=[12,5]}
  else if (score>1e1) {icon=[0,2]}
  else if (score>1) {icon=[0,1]}
  else if (score>0) {icon=[0,0]}
  else if (score==0) {icon=[12,8]}

  console.log('Score: '+score,'Combo Strength: '+maxComboPow,'Strength of non-divided buffs: '+relComboPow,'Number of BSs: '+maxBSCount,'Strength of Godzamok: '+maxGodz,'Initial Raw CpS: '+iniRaw,'Years of CpS: '+Beautify(cookieGain/iniRaw/31536000));
  if (invalidateScore==0) {Game.Notify('Score: '+score.toPrecision(3),Beautify(cookieGain/iniRaw/31536000)+' years of CpS, GZ: '+maxGodz.toPrecision(3),icon)} else {Game.Notify('Score invalid', 'Settings changed since reset',[10,6]); invalidateScore=0};
  };

function CycleFtHoF() {
  for (var i=0;i<=FtHoFOutcomes.length;i++) {if (forceFtHoF==FtHoFOutcomes[i]) {if (i!=FtHoFOutcomes.length-1) {return FtHoFOutcomes[i+1]} else {return FtHoFOutcomes[0]};};};
  };

function GetPrompt() {
  Game.Prompt('<id ImportSave><h3>'+"Input to variable"+'</h3><div class="block">'+loc("Please paste what you want the variable to be equal to.")+'<div id="importError" class="warning" style="font-weight:bold;font-size:11px;"></div></div><div class="block"><textarea id="textareaPrompt" style="width:100%;height:128px;">'+'</textarea></div>',[[loc("Load"),';Game.ClosePrompt(); switch (promptN) {case 0: iniLoadSave=(l(\'textareaPrompt\').value); if (iniLoadSave.length<100) {iniLoadSave=false};break;case 1: iniSeed=(l(\'textareaPrompt\').value.trim()); if (iniSeed.length!=5) {iniSeed=\'R\'};break;case 2: iniC=Number(l(\'textareaPrompt\').value);break;case 3: iniCE=Number(l(\'textareaPrompt\').value);break;case 4: iniP=Number(l(\'textareaPrompt\').value);break;case 5: iniLumps=Number(l(\'textareaPrompt\').value);break;case 6: iniBC=Number(l(\'textareaPrompt\').value);break;case 7: wizCount=Number(l(\'textareaPrompt\').value);break;case 8: wizLevel=Number(l(\'textareaPrompt\').value);break;case 9: iniDHdur=Number(l(\'textareaPrompt\').value.replace("s",""));break;case 10: iniBSdur=Number(l(\'textareaPrompt\').value.replace("s",""));break;case 11: toNextTick=Number(l(\'textareaPrompt\').value.replace("s",""));break;case 12: iniTimer=Number(l(\'textareaPrompt\').value.replace("s",""));UpdateMoreButtons();break;};RedrawCCCEM();'],loc("Nevermind")]);
	l('textareaPrompt').focus();
  };

function UpdateMoreButtons() {
  iniTimerButton='<a class="option neato" '+Game.clickStr+'="promptN=12; GetPrompt();">Nat Spawn Timer '+iniTimer+' frames</a><br>';
  moreButtons[2].splice(moreButtons[2].indexOf(iniTimerButton),1); 
  moreButtons[2].push(iniTimerButton);
  };
  
function MoreTestButtons() {
  moreButtons[0].push(testButton)
  moreButtons[1].push(testButton)
  moreButtons[2].push(testButton)
  RedrawCCCEM();
  };

function RedrawCCCEM() {
  invalidateScore=1
  var str='';
  str+='<div class="icon" style="position:absolute;left:-9px;top:-6px;background-position:'+(-28*48)+'px '+(-12*48)+'px;"></div>';
  
  str+='<div id="devConsoleContent">';
  str+='<div class="title" style="font-size:14px;margin:6px;">CCCEM interface</div>';
  
  str+='<a class="option neato" '+Game.clickStr+'="ResetAll(1);">Try again</a>';
  str+='<a class="option neato" '+Game.clickStr+'="PresetSettingsGrail();RedrawCCCEM();">Default</a>';
  str+='<a class="option neato" '+Game.clickStr+'="PresetSettingsConsist();RedrawCCCEM();">consistency</a><br>';
  str+='<a class="option neato" '+Game.clickStr+'="PresetSettingsBSScry();RedrawCCCEM();">BS scry</a>';
  str+='<a class="option neato" '+Game.clickStr+'="promptN=0; GetPrompt();">Import Save</a><br>';
  for (var i in moreButtons[0]) {str+=moreButtons[0][i]}
  str+='<div class="line"></div>';
  str+='<a class="option neato" '+Game.clickStr+'="promptN=1; GetPrompt();">iniSeed '+iniSeed+'</a>';
  str+='<a class="option neato" '+Game.clickStr+'="promptN=2; GetPrompt();">Cookies '+(iniC.toPrecision(1))+'</a><br>';
  str+='<a class="option neato" '+Game.clickStr+'="promptN=3; GetPrompt();">CookiesB '+(iniCE.toPrecision(1))+'</a>';
  str+='<a class="option neato" '+Game.clickStr+'="promptN=4; GetPrompt();">Prestige '+(iniP.toPrecision(1))+'</a><br>';
  str+='<a class="option neato" '+Game.clickStr+'="promptN=5; GetPrompt();">Lumps '+(iniLumps)+'</a>';
  str+='<a class="option neato" '+Game.clickStr+'="chooseLump+=1; if (chooseLump>4) chooseLump=0;RedrawCCCEM();">LumpT '+(chooseLump)+'</a><br>';
  str+='<a class="option neato" '+Game.clickStr+'="promptN=6; GetPrompt();">Cursors '+(iniBC)+'</a>';
  str+='<a class="option neato" '+Game.clickStr+'="useEB=!useEB; RedrawCCCEM();">'+(useEB?'EB List':'No EB')+'</a>';
  str+='<a class="option neato" '+Game.clickStr+'="useRebuy+=2; if (useRebuy>2) useRebuy=0; RedrawCCCEM();">'+(useRebuy?'Rebuy':'No Rebuy')+'</a><br>';
  str+='<a class="option neato" '+Game.clickStr+'="promptN=7; GetPrompt();">Wizards '+(wizCount)+'</a>';
  str+='<a class="option neato" '+Game.clickStr+'="promptN=8; GetPrompt();">WizLev '+(wizLevel)+'</a>';
  str+='<a class="option neato" '+Game.clickStr+'="buyOption1?buyOption1--:buyOption1++; RedrawCCCEM();">'+(buyOption1?'Sell':'Buy')+'</a>';
  str+='<a class="option neato" '+Game.clickStr+'="buyOption2++; if (buyOption2>5) {buyOption2=2}; RedrawCCCEM();">'+(Math.pow(10,buyOption2-2))+'</a><br>';
  str+='<a class="option neato" '+Game.clickStr+'="Game.heralds=(Game.heralds==41)?100:41;Game.externalDataLoaded=true;RedrawCCCEM();">'+(Game.heralds)+' heralds</a>';
  str+='<a class="option neato" '+Game.clickStr+'="d1Aura+=1; if (d1Aura>21) d1Aura=0;RedrawCCCEM();">Aura1 '+(d1Aura)+'</a>';
  str+='<a class="option neato" '+Game.clickStr+'="d2Aura+=1; if (d2Aura>21) d2Aura=0;RedrawCCCEM();">Aura2 '+(d2Aura)+'</a><br>';
  str+='<a class="option neato" '+Game.clickStr+'="if (forceFortune<0.04) {forceFortune+=0.02} else {forceFortune+=0.04}; if (forceFortune>1.004) forceFortune=0;RedrawCCCEM();">Fortune: '+Math.round(forceFortune*100)+'%</a>';
  str+='<a class="option neato" '+Game.clickStr+'="forceFtHoF=CycleFtHoF(); RedrawCCCEM();">FtHoF '+(forceFtHoF)+'</a><br>';
  str+='<a class="option neato" '+Game.clickStr+'="gardenSeed+=1; if (gardenSeed>33) gardenSeed=0;RedrawCCCEM();">HeldS '+(gardenSeed)+'</a>';
  str+='<a class="option neato" '+Game.clickStr+'="setGardenR++; if (setGardenR>4) setGardenR=0;RedrawCCCEM();">Rotation '+(setGardenR?setGardenR:'R')+'</a>';
  str+='<a class="option neato" '+Game.clickStr+'="promptN=11; GetPrompt();RedrawCCCEM();">Tick '+(toNextTick?toNextTick+'s':'random')+'</a><br>';
  str+='<a class="option neato" '+Game.clickStr+'="gardenP1[0]+=1; if (gardenP1[0]>33) gardenP1[0]=0;RedrawCCCEM();">Seed1 '+(gardenP1[0])+'</a>';
  str+='<a class="option neato" '+Game.clickStr+'="gardenP1[1]+=5; if (gardenP1[1]>99) gardenP1[1]=0;RedrawCCCEM();">Age1 '+(gardenP1[1])+'</a><br>';
  str+='<a class="option neato" '+Game.clickStr+'="gardenP2[0]+=1; if (gardenP2[0]>33) gardenP2[0]=0;RedrawCCCEM();">Seed2 '+(gardenP2[0])+'</a>';
  str+='<a class="option neato" '+Game.clickStr+'="gardenP2[1]+=5; if (gardenP2[1]>99) gardenP2[1]=0;RedrawCCCEM();">Age2 '+(gardenP2[1])+'</a><br>';
  str+='<a class="option neato" '+Game.clickStr+'="officeL+=1; if (officeL>5) officeL=0;RedrawCCCEM();">office '+(officeL)+'</a>';
  str+='<a class="option neato" '+Game.clickStr+'="spirit1+=1; if (spirit1>10) spirit1=0;RedrawCCCEM();">Dia '+(spirit1)+'</a>';
  str+='<a class="option neato" '+Game.clickStr+'="spirit2+=1; if (spirit2>10) spirit2=0;RedrawCCCEM();">Ruby '+(spirit2)+'</a>';
  str+='<a class="option neato" '+Game.clickStr+'="spirit3+=1; if (spirit3>10) spirit3=0;RedrawCCCEM();">Jade '+(spirit3)+'</a><br>';
  for (var i in moreButtons[1]) {str+=moreButtons[1][i]}
  str+='<div class="line"></div>';
  str+='<a class="option neato" '+Game.clickStr+'="iniF=!iniF;RedrawCCCEM();">Frenzy '+(iniF?'On':'Off')+'</a>';
  str+='<a class="option neato" '+Game.clickStr+'="iniDH=!iniDH;RedrawCCCEM();">DH '+(iniDH?'On':'Off')+'</a>';
  str+='<a class="option neato" '+Game.clickStr+'="promptN=9; GetPrompt();">DH dur '+(iniDHdur)+'s</a><br>';
  str+='<a class="option neato" '+Game.clickStr+'="iniBSCount++; if (iniBSCount>Object.keys(Game.Objects).length) iniBSCount=0; RedrawCCCEM();">Extra BSs: '+(iniBSCount)+'</a>';
  str+='<a class="option neato" '+Game.clickStr+'="promptN=10; GetPrompt();">BS dur '+(iniBSdur)+'s</a><br>';
  str+='<a class="option neato" '+Game.clickStr+'="seedNats=!seedNats;RedrawCCCEM();">Seeding GC '+(seedNats?'On':'Off')+'</a>';
  str+='<a class="option neato" '+Game.clickStr+'="seedTicker=!seedTicker;RedrawCCCEM();">Seeding News '+(seedTicker?'On':'Off')+'</a><br>';
  str+='<a class="option neato" '+Game.clickStr+'="iniSpawn=!iniSpawn; moreButtons[2].splice(moreButtons[2].indexOf(iniTimerButton),1); if (!iniSpawn) {moreButtons[2].push(iniTimerButton)}; RedrawCCCEM();">Nat GC '+(iniSpawn?'On':'Off')+'</a>';
  str+='<a class="option neato" '+Game.clickStr+'="iniDO=!iniDO;RedrawCCCEM();">Dragon Orbs '+(iniDO?'On':'Off')+'</a>';
  str+='<a class="option neato" '+Game.clickStr+'="iniDEoRL=!iniDEoRL;RedrawCCCEM();">DEoRL '+(iniDEoRL?'On':'Off')+'</a><br>';
  str+='<a class="option neato" '+Game.clickStr+'="if (iniGC==\'R\') {iniGC=-1}; iniGC+=2; if (iniGC>27) iniGC=\'R\';RedrawCCCEM();">GC1 '+(Game.goldenCookieChoices[iniGC])+'</a><br>';
  str+='<a class="option neato" '+Game.clickStr+'="if (iniGC2==\'R\') {iniGC2=-1}; iniGC2+=2; if (iniGC2>27) iniGC2=\'R\';RedrawCCCEM();">GC2 '+(Game.goldenCookieChoices[iniGC2])+'</a><br>';
  str+='<a class="option neato" '+Game.clickStr+'="if (iniGC3==\'R\') {iniGC3=-1}; iniGC3+=2; if (iniGC3>27) iniGC3=\'R\';RedrawCCCEM();">GC3 '+(Game.goldenCookieChoices[iniGC3])+'</a><br>';
  for (var i in moreButtons[2]) {str+=moreButtons[2][i]}
  str+='</div>';
  l('devConsole').innerHTML=str;
  l('devConsole').style.minWidth='24px'
  l('devConsole').style.width='auto'
  l('debug').style.display='block';
  };
moreButtons[0].push(pForPauseButtons[0])
RedrawCCCEM();
invalidateScore=0
