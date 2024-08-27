//the mod will make any save, even a fresh save, get all achievements, upgrades, and many other values as suitable for a combo attempt. After initial launch, using ResetAll(); will reset the game and minigames according to the variables without resetting the variables, so you can change the variables after launch to change the conditions for the combo. To change the variables to suit your own needs, you can set the variables yourself using a script, which can be done by copying over the variables to your own pastebin or bookmark, changing the values of the variables, and running that script after this one. 
//version 1.1: Fixed some minor issues including swapping seasons and minigames not unmuting, as well as magic not properly resetting if wizard towers are sold.
//version 1.2: Fixed some larger things I was considering fixing as I had some spare time on my laptop, including choosing own pantheon spirits, a lot of customization for golden cookies, including being able to spawn up to 3 golden cookies at the start (DO, nat, DEoRL), as well as being able to load a save of your own to override mainly upgrades and achievements, but not minigames, among other things. Turning off grandmapocalypse for immersion is now possible, but will not pop wrinklers.
//version 1.21: Small fix, making you able to disable fortunes, as well as making the golden cookie spawning its own function in case you want to reset only some parts of the game for some reason
//version 2.0: Pretty big update including GUI for using presets under Options, allowing for changing the chance of fortunes, and more!
//version 2.1: Kinda huge update, adds a nice and cool UI replacing the debug menu, fixes some bugs, adds seeding to golden cookies, makes it impossible to save normally in order to protect the save the mod is loaded onto, and is now split into two separate scripts in order to make it easier to update the mod in the future. As I'm moving all eval to the other script, forcing fortunes and the like will be unavailable if that script becomes inaccessible.
//version 2.11: Hotfix for some issues, now with even more seeding
//version 2.12: Made running it on a fresh save more pleasant, changed a building count bug in stats, made presets slightly better
//version 2.2: Made EB building list better, making it actually usable. Randomized garden rotation, made the duration calculation better, fixed the presets to take new variables into account, fixed importing messing up krumblor, removed the GC spawning sound from misc golden cookies during reset, and a few other small fixes.
//version 2.21: hotfix for having some golden cookie related things off throwing errors (again), as well as having random FtHoF being laggy
//version 2.22: added rebuy option for both building lists, made time until garden tick random
//version 2.23: small fix because krumblor still messed up
//versoin 2.24: made bank minigame get reset since it's not supposed to show you RNG about the save you load onto CCCEM

var iniSeed='R'; //use 'R' to randomize seed, otherwise set as a specific seed
var iniLoadSave=false //paste a save to load initially into this variable as a string by using 'apostrophes' around the text. Loading a save in this way will override most cookie, upgrade, prestige, and buildning settings, but not minigame settings.
var iniC=4e69 //initial cookie count
var iniCE=1e78 //cookies earned count
var iniP=1e22 //prestige level
var iniLumps=105 //lump count
var iniBC=1095; //cursor amount, used to determine other building amounts
var wizCount=951; //specifically wizard towers
var wizLevel=10; //set wizard tower level
var buildingRelList=  [[-8, -33, -17, -17, -17, -26, -13, -20, -19, -19, -14, -23, -20, -12, -16, -32, -47, -39, -24],0,
                      [-18, -22, -17, -17, -17, -19, -21, -18, -24, -16, -13, -27, -12, -15, -17, -34, -46, -33, -31],0] //good non-EB count for 2.052
var buildingRelListEB=[[-4, -36, -17, -17, -18, -22, -17, -19, -19, -11, -25, -20, -20, -15, -16, -26, -51, -39, -28],-2,
                      [-18, -22, -18, -17, -17, -19, -20, -21, -22, -5, -28, -23, -14, -16, -17, -26, -53, -34, -33],1] //good EB count for 2.052. Numbers represent how many fewer to buy compared to the previous building, wizard tower count is overriden by wizCount afterwards
var useEB=false
var useRebuy=0
var chooseLump=0 //4 is caramelized
var d1Aura=13 //13 is Epoch Manipulator
var d2Aura=4 //4 is Dragon Harvest
var seedNats=true
var seedTicker=true
var GCCount=77777
var iniRein=0
var forceFtHoF='blood frenzy' //'blood frenzy' is elder frenzy, setting as something that isn't a buff will result in random outcome
var gardenSeed=14 //14 means currently holding whiskerbloom seed
var gardenP1=[6, 60] //defalut [6, 60] (being fairly grown golden clover), will be planted on half of the columns
var gardenP2=[17, 60] //default [17, 60] (being fairly grown nursetulip), will be planted on the other half of the columns
var setGardenR='' //set to 1, 2, 3 or 4
var toNextTick='' //between 0 and 900 for time until next tick
var officeL=5 //5 is palace of greed
var spirit1=1 //1 is vomitrax
var spirit2=4 //4 is selebrak
var spirit3=6 //6 is muridal
var iniSpawn=true //true to have a regular golden cookie spawn immediately
var iniGC=19 //what first GC gives, 'R' for random
var iniDO=false //true to treat get an extra golden cookie at the start as if from DO, functionally equivalent to DEoRL
var iniGC2=21 //what DO GC gives, 'R' for random
var iniDEoRL=false //set to true to get an extra golden cookie at the start as if from DEoRL
var iniGC3=1 //what DEoRL GC gives, 'R' for random
var iniTimer=0 //set to a number of frames indicate how long since the last Golden cookie was spawned
var iniF=true //true to start with Frenzy
var iniFdur=600 //number of seconds of duration
var iniDH=true //true to start with Dragon Harvest
var iniDHdur=600
var iniBSCount=0 // number of BSs to start with (not including other golden cookies)
var iniBSdur=600
var iniSB=false //if you start with sugar blessing
var fortuneG=0 //0 to make GC fortune unclicked
var forceFortune=1 //set to value between 0 and 1 for probability of getting a fortune
var boughtSF=0 //0 or 1, 0 to make SF available
var boughtCE=0 //make chocolate egg available
var setSeason=183 //183 makes it halloween, set to the id of the season switcher toggle
var setPledge=true //true to automatically pledge at the start, otherwise false
var muteBuildings=[1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1] //list of which buildings to mute, 1 mutes
var unmuteMinigames=true //unmutes all buildings with minigames, overrides muteBuildings
var buyOption1=1 //set to 0 to have buy selected and 1 to have sell selected at the start
var buyOption2=4 //set to 2 to have "1" selected, 3 for "10", 4 for "100", 5 for "all"

function PresetSettingsGrail() {
  Game.bakeryNameSet('grail moments')
  iniSeed='R';
  iniLoadSave=false 
  iniC=4e69
  iniCE=1e78 
  iniP=1e22
  iniLumps=105 
  iniBC=1095; 
  wizCount=951; 
  wizLevel=10; 
  buildingRelList=  [[-8, -33, -17, -17, -17, -26, -13, -20, -19, -19, -14, -23, -20, -12, -16, -32, -47, -39, -24],0,
                    [-18, -22, -17, -17, -17, -19, -21, -18, -24, -16, -13, -27, -12, -15, -17, -34, -46, -33, -31],0]
  buildingRelListEB=[[-4, -36, -17, -17, -18, -22, -17, -19, -19, -11, -25, -20, -20, -15, -16, -26, -51, -39, -28],-2,
                    [-18, -22, -18, -17, -17, -19, -20, -21, -22, -5, -28, -23, -14, -16, -17, -26, -53, -34, -33],1]
  useEB=false
  useRebuy=0
  seedNats=true
  seedTicker=true
  GCCount=77777
  iniRein=0
  chooseLump=0 
  d1Aura=13 
  d2Aura=4 
  forceFtHoF='blood frenzy'
  gardenSeed=14
  gardenP1=[6, 60]
  gardenP2=[17, 60]
  setGardenR=''
  officeL=5 
  spirit1=1 
  spirit2=4 
  spirit3=6 
  iniSpawn=true
  iniGC=19
  iniDO=false 
  iniDEoRL=false 
  iniTimer=0 
  iniF=true 
  iniFdur=600
  iniDH=true 
  iniDHdur=600
  iniBSCount=0
  iniBSdur=600
  fortuneG=0 
  forceFortune=1
  boughtSF=0 
  boughtCE=0 
  setSeason=183
  setPledge=true 
  buyOption1=1
  buyOption2=4
  };
 
function PresetSettingsConsist() {
  PresetSettingsGrail();
  Game.bakeryNameSet('preset consistency')
  iniSeed='R';
  iniLoadSave='Mi4wNTJ8fDE2ODY0NDE5MDA0MTg7MTYwMzQ2NjgwMjcyMDsxNjg2NjQ4OTQ5MjcxO3ByZXNldCBjb25zaXN0ZW5jeTttaG9mYjswLDEsMCwwLDAsMCwwfDAxMTEwMDEwMTAxMTAwMTEwMTAxMDExMTAxMXw2LjA0NDM0MTA5NTQxMTAwNGUrNjQ7MS4wMDEwNTE5ODEzMzI1MTA5ZSs2NTs1OTsyNzc3NzsxLjQzODUxNDE0NzAxMTYyMDllKzYwOzM2MTsyMzszMTsxLjEwMDAwMDU5MDQ2NTk3NDJlKzY2OzA7NDsxMDE1NjE7MDstMTsxMTY7Nzs2LjE0NDEzMDgxMTE2MjI5NGUrNTU7NTsxNDsyOy0xOzE7OzA7MDsxMDMyMjgwMzAwMTYxMjY2MzAwOzU0MjM3Nzc2NTc2MjUwNDIwMDsyNTk0Mjg3MzE4Nzk2NTI4MDswOzA7NTM7NTI7NjQxOzIyMjs2Mzk7Mjc7MDswOzQ7NjU7MDswOzcxOzE0NzsxNjg2NTk1MDEwNDk5OzA7MTsyMjc7NDE7MDsxOzIuMjU0MzA3Mzc0NzM2MzA0ZSs1NTs1MDswOzA7fDEwMTEsMTM2MSwzLjY2MDg3NDYyMjAxMzQxNWUrNTcsMTIsLDAsMTAxMTsxMDAzLDEzNTMsMi4yODQ1MDgxNTI4MjQ5MjY3ZSs1NiwwLCwxLDEwMDM7OTY2LDEzMTYsNC4xMzcxNjM4MDU2MDA2NDVlKzU2LDcsMTY4NjY0ODk5NjIyMzoxOjE2ODY0NDMxMzg4MjE6MDowOjA6MTowOjE2ODY0NDE5MDA0NDQ6IDEwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAgMDowOjA6MDowOjA6MDowOjA6MDowOjA6MDowOjA6MDowOjA6MDowOjA6MDowOjA6MDowOjA6MDowOjA6MDowOjA6MDowOjA6MDowOjA6MDowOjA6MDowOjA6MDowOjA6MDowOjA6MDowOjA6MDowOjA6MDowOjA6MDowOjA6MDowOjA6MDowOjA6MDowOjA6LDAsOTY2Ozk0NiwxMjk2LDkuOTI3Mjk3ODc3NjY0MTQzZSs1NiwwLCwxLDk0Njs5MTksMTI2OSw2LjM2NDE3ODg3NjQ1NDUwOGUrNTUsMCwsMSw5MTk7ODkxLDEyNDEsNy41MDgyNjE1NjI1MjI2NGUrNTQsMSwwOjA6MTowOjE6IDM3ODI6MTo3OTo0OjA6MDowOjAhMjY0OjQ6LTg2OjQyODowOjA6MDowITMyMDA6MTotNDI6NTgwOjA6MDowOjAhNDMzODoxOjEzOjM5NjowOjA6MDowITI1NTI6NDotMTA1OjIyMTowOjA6MDowITQwODg6MjotMTI1OjE1MTowOjA6MDowITc5NzU6MTo0NzoyOTA6MDowOjA6MCE5MzQwOjE6NDI6MTk3OjA6MDowOjAhNzYyNTo1OjEyOjU0MTowOjA6MDowITMzNDY6NDotOTY6NjA4OjA6MDowOjAhMTA2MjE6MTo3OjQ1MTowOjA6MDowITEyNTEwOjE6LTM6MTgzOjA6MDowOjAhMTMxNjE6MToxOjQ2OTowOjA6MDowITEzMjY0OjA6LTI6NDA2OjA6MDowOjAhMTM4NjQ6NTotOToyMTU6MDowOjA6MCExNzkwODozOjQwOjU2NTowOjA6MDowITgzMzI6NDotODU6NTYxOjA6MDowOjAhMTY3Mzk6NDotMTAyOjU0NTowOjA6MDowISAxLDAsODkxOzg5MSwxMjQxLDYuODI0NzMwNTQ3ODY0MDczZSs1NiwxLC0xLy0xLy0xIDMgMTY4NjQ0MTkwMDQ0OSAxLDAsODkxOzg1NywxMjA3LDMuNDUzMzY1MTY1NTA0NjQyZSs1NCwyLDQzLjY2OTAwMTIyNTQyNDg5IDAgNzM0NiAxLDAsODU3Ozg0NywxMTk3LDUuNDYwODkwNjU1MzY3NjU4ZSs1MywwLCwxLDg0Nzs4MTksMTE2OSwxLjY4NzI4MDIxNDg2Njk4NWUrNTQsMCwsMSw4MTk7ODEwLDExNjAsMS45NDQ0NzQ3ODUzOTM2NDllKzU2LDAsLDEsODEwOzc5MiwxMTQyLDYuNTA3NDc1NzI4MDA4NjAzZSs1NiwwLCwxLDc5Mjs3NzMsMTEyMywxLjM3NjMzOTgyNTg4MDQxMDJlKzU2LDAsLDEsNzczOzc1NiwxMTA2LDQuMjIzMTQzNDUxODg3NTA2ZSs1NiwwLCwxLDc1Njs3MzcsMTA4Nyw0LjcxNjg4NDc5NTI5NjUzOGUrNTYsMCwsMSw3Mzc7NzIxLDEwNzEsMS43MTMxMTYxNDY2NTY5MTVlKzU3LDAsLDEsNzIxOzY4MSwxMDMxLDUuNTkyNTI2MTY2NzY0NDc2ZSs1NywwLCwxLDY4MTs2NDUsOTk1LDQuNzU4MzU2MzI4MzQyODgxZSs1NiwwLCwxLDY0NTs2MjAsOTcwLDEuMjE0NTc4MjIzNTIxNTllKzU3LDAsLDEsNjIwOzYwMCw5NTAsMi43ODcwNzgwNDg0NDU1ODg2ZSs1NywwLCwwLDYwMDt8MTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMDEwMTAxMDEwMTAxMDEwMTExMTExMTExMTEwMDExMTExMTAwMTAxMTExMDExMTExMTEwMDExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTEwMDExMTExMTExMTExMTExMTExMTAxMDEwMTAxMDEwMTAxMTEwMDAxMDEwMTAxMDEwMTAxMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTAwMTEwMTAxMDEwMTAxMDExMTExMTExMTExMTExMTEwMTAxMDEwMDAxMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTEwMDEwMDEwMTAxMDEwMTAxMDEwMTAxMDEwMTAxMTEwMTAxMDEwMTAwMDAwMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMDAwMTAxMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMDExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTAwMDAxMTExMTExMTExMTExMTExMTExMTExMTExMTExMTAxMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTEwMTExMTExMTExMTExMDAxMTExMTExMTExMTExMTExMTExMTAwMDAwMDAxMDEwMTAxMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTEwMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTAwMTExMTExMDEwMTAxMDExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTAwMTExMTExMTExMTExMTEwMTAxMDEwMTAxMDEwMTAxMDEwMTAxMDExMTExMTExMTExMTExMTExMDEwMTAxMDEwMTAxMTExMTAxMTExMTEwMTExMTExMTExMTExMTExMTExMTExMDExMTExMTEwMTAwMDExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTEwMTAxMTExMTEwMDExMTExMTExMDAwMDAwMDAwMDAwMTExMXwxMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTEwMTExMTExMTExMTExMTEwMDAwMDAwMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMDExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTEwMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMDExMTExMDExMDExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTAxMDAwMDAwMDAwMDAxMTEwMTExMTExMTExMTEwMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTEwMDExMTExMTExMTExMTExMTExMTExMTExMTExMTExMDExMTExMTExMTExMTExMTExMTEwMTExMTExMTExMTExMTExMDAxMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTEwMTExMTExMTExMTEwMTExMTExMTExMTExMTExMTEwMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMDAxMDEwMDAxMTEwMDAxMTExMTExMTExMTExMDExMTAxMTExMTExMTExMTExMTEwMDAwMDAxMTExfHw%3D%21END%21'
  iniLumps=105 
  chooseLump=0 
  d1Aura=13 
  d2Aura=9
  forceFtHoF='click frenzy'
  gardenSeed=14
  gardenP1=[6, 60]
  gardenP2=[17, 60]
  officeL=5 
  spirit1=2
  spirit2=8
  spirit3=6
  iniSpawn=true
  iniGC=19
  iniDO=false 
  iniDEoRL=false 
  iniTimer=0 
  iniF=true 
  iniDH=true 
  fortuneG=0 
  forceFortune=0.04
  boughtSF=0 
  boughtCE=0 
  setSeason=183
  setPledge=true 
  };
 
function PresetSettingsBSScry() {
  PresetSettingsGrail();
  Game.bakeryNameSet('preset BS scry')
  iniSeed='R';
  iniLoadSave='Mi4wNTJ8fDE2ODY0NDE5MDA0MTg7MTYwMzQ2NjgwMjcyMDsxNjg2NjQ5MDYyMTM5O3ByZXNldCBCUyBzY3J5O21ob2ZiOzAsMSwwLDAsMCwwLDB8MDExMTAwMTAxMDExMDAxMTAxMDEwMTExMDExfDkuNTkyMzU0NDg3MzcwOTFlKzY2OzEuMDAwMDAwMDAwMTkwNjUwNWUrNzE7NTk7Mjc3Nzc7MS40Mzg1MTQxNDcwMTE2MjA5ZSs2MDszNjA7MjM7MzE7MS4xMDAwMDA1OTA0NjU5NzQyZSs2NjswOzU7MTA2Nzk1OzA7LTE7MTE2OzEwOzEuMDUxOTI0NTMzMjM3MDkxMWUrNTQ7NDsxNDs0Oy0xOzE7OzA7MDsxMDMyMjgwMzAwMTYxMjY2MzAwOzU0MjM3Nzc2NTc2MjUwNDIwMDsyNTk0Mjg3MzE4Nzk2NTI4MDswOzA7NTM7NTI7NjQxOzIyMjs2Mzk7Mjc7MDswOzQ7NjU7MDswOzg2OzE0NzsxNjg2NTk1MDEwNDk5OzA7MTsyMjc7NDE7MDsxOzIuNTU0OTA2NTg1ODQ1OTI4M2UrNTc7NTA7MDswO3wxMDQxLDI1NDEsMy45Mjc3MTQ2Mzc0MjE3MjdlKzU5LDEwLCwwLDEwNTE7MTAzMywxMzgzLDIuNTE1MTk1MjYyNzk1MDUxZSs1OCwwLCwxLDEwMzM7MTAxNiwxMzY2LDUuMzUyNDIxMTAzODYyMTU4ZSs1OCw4LDE2ODY2NDkxNTU1NDY6MToxNjg2NDQzMTM4ODIxOjA6MDowOjE6MDoxNjg2NDQxOTAwNDQ0OiAxMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwIDA6MDowOjA6MDowOjA6MDowOjA6MDowOjA6MDowOjA6MDowOjA6MDowOjA6MDowOjA6MDowOjA6MDowOjA6MDowOjA6MDowOjA6MDowOjA6MDowOjA6MDowOjA6MDowOjA6MDowOjA6MDowOjA6MDowOjA6MDowOjA6MDowOjA6MDowOjA6MDowOjA6MDowOiwwLDEwMTY7OTk2LDEzNDYsMS4yNzQ4OTI5NzE4NTcyMzIzZSs1OSwwLCwxLDk5Njs5NjksMTMxOSw4LjAwNzA3Mzk3NTQxNjM1OWUrNTcsMCwsMSw5Njk7OTQxLDEyOTEsOS4xOTgwNjY1MDIyNjQwMzJlKzU2LDEsNDowOjE6MDoxOiAzOTA3OjM6NjE6MzUwOjA6MDowOjAhMjQ4OjQ6LTkxOjQyMTowOjA6MDowITMxMTU6MTotMjQ6NTczOjA6MDowOjAhMzcxNjoxOjM2OjM4OTowOjA6MDowITE0MzM6NDotMTE1OjIxNDowOjA6MDowITQwMzg6MjotOTA6MTQ0OjA6MDowOjAhODM3MDoxOjY5OjI4MzowOjA6MDowITkyNzQ6MTo1NDoxOTA6MDowOjA6MCE2ODk4OjU6MTA6NTM0OjA6MDowOjAhMjQ0OjQ6LTEyNjo2MDE6MDowOjA6MCExMDg5OToxOjEyOjQ0NDowOjA6MDowITEyNjYxOjE6MjM6MTc2OjA6MDowOjAhMTM0ODc6MToxOjQ2MjowOjA6MDowITEyOTg0OjA6LTI6Mzk5OjA6MDowOjAhMTMyNzY6NTotODk6MjA4OjA6MDowOjAhMTk4ODU6Mzo1NTo1NTg6MDowOjA6MCE2OTU1OjQ6LTk0OjU1NDowOjA6MDowITE0MTQxOjQ6LTEyNTo1Mzg6MDowOjA6MCEgMSwwLDk0MTs5NDEsMTI5MSw4LjkwNzI5MTUzNDM3MDYzZSs1OCwxLC0xLy0xLy0xIDMgMTY4NjQ0MTkwMDQ0OSAxLDAsOTQxOzg1NywxMjA3LDMuOTY5NjIxNjc2MTcyNTkzZSs1NiwyLDYyLjY3MDc0ODQxNjk4NTc0IDAgNzM0NiAxLDAsODU3Ozg5NywxMjQ3LDYuMjgzMzIyMDEzMzkzMDIyZSs1NSwwLCwxLDg5Nzs4NjksMTIxOSwxLjk1MDAzMzU1ODU2MDM3NzdlKzU2LDAsLDEsODY5Ozg2MCwxMjEwLDIuNDMyODY1ODI4OTE2OTI0MmUrNTgsMCwsMSw4NjA7ODQyLDExOTIsOC4zODE5NDUzNDY4MjMyNTVlKzU4LDAsLDEsODQyOzgyMywxMTczLDEuNjM2NzgwMzQ5OTkwNTk5MmUrNTgsMCwsMSw4MjM7ODA2LDExNTYsNS4yOTYwOTg2MjM0MjkzMDdlKzU4LDAsLDEsODA2Ozc4NywxMTM3LDUuODM0MzI0MDQwODc2ODA4ZSs1OCwwLCwxLDc4Nzs3NzEsMTEyMSwyLjEzMDYwNjA1MDI5Mzk2NjZlKzU5LDAsLDEsNzcxOzczMSwxMDgxLDcuMzYyMDk5ODcyODQ5NDI3NWUrNTksMCwsMSw3MzE7Njk1LDEwNDUsNy4zOTQzNDc3MzM4OTM0MmUrNTgsMCwsMSw2OTU7NjYwLDEwMTAsMi41OTMwNzgwOTE0NjcxNjkzZSs1OSwwLCwxLDY2MDs2NTAsMTAwMCw0LjkxMTYzMzc3OTQ5NTA1NWUrNTksMCwsMCw2NTA7fDExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTAxMDEwMTAxMDEwMTAxMDExMTExMTExMTExMDAxMTExMTEwMDEwMTExMTAxMTExMTExMDExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMDAxMTExMTExMTExMTExMTExMTEwMTAxMDEwMTAxMDEwMTExMDAwMTAxMDEwMTAxMDEwMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTEwMDExMDEwMTAxMDEwMTAxMTExMTExMTExMTExMTExMDEwMTAxMDAwMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMDAxMDAxMDEwMTAxMDEwMTAxMDEwMTAxMDEwMTExMDEwMTAxMDEwMDAwMDExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTAwMDEwMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTAxMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTEwMDAwMTExMTExMTExMTExMTExMTExMTExMTExMTExMTEwMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMDExMTExMTExMTExMTAwMTExMTExMTExMTExMTExMTExMTEwMDAwMDAwMTAxMDEwMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMDExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTEwMDExMTExMTAxMDEwMTAxMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMDEwMTAxMDEwMTAxMDEwMTAxMDEwMTAxMTExMTExMTExMTExMTExMTAxMDEwMTAxMDEwMTExMTEwMTExMTExMDExMTExMTExMTExMTExMTExMTExMTAxMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTEwMTExMTExMDExMDExMTExMTExMTExMDEwMTAxMDExMTF8MTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMDExMTExMTExMTExMTExMDAwMDAwMDExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTAxMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMDExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTAxMTExMTAxMTAxMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTEwMTAwMDAwMDAwMDAwMTExMDExMTExMTExMTExMDExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTAxMTExMTExMTExMTExMTExMTExMTExMTExMTExMTAxMTExMTExMTExMTExMTExMTExMDExMTExMTExMTExMTExMTAwMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMDExMTExMTExMTExMTExMTExMTExMTExMTExMTExMDExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTEwMTExMDEwMTExMTExMTExMTExMTExMTEwMTExMTExMTExMTExMTExMTAwMTExMTExMXx8%21END%21'
  iniLumps=103 
  chooseLump=0 
  d1Aura=13 
  d2Aura=4
  forceFtHoF='building special'
  gardenSeed=14
  gardenP1=[17, 60]
  gardenP2=[6, 60]
  officeL=4
  spirit1=1
  spirit2=4
  spirit3=6
  iniSpawn=true
  iniGC=19
  iniDO=false 
  iniDEoRL=false 
  iniTimer=0 
  iniF=true 
  iniDH=true 
  fortuneG=0 
  forceFortune=0.04
  boughtSF=0 
  boughtCE=0 
  setSeason=183
  setPledge=true 
  };
 
function ResetGame(toFindRaw) {
  Game.popups=0;
  if (!(typeof Game.Objects.Temple.minigame === "undefined")){Game.Objects.Temple.minigame.slot=[Game.Objects.Temple.minigame.slot[0],Game.Objects.Temple.minigame.slot[1],Game.Objects.Temple.minigame.slot[2]]}; //fixes import corruption before importing the save
  if (iniLoadSave!=false) {
    var isSpecialTab=Game.specialTab
    Game.ImportSaveCode(iniLoadSave); 
    iniCE=Game.cookiesEarned
    Game.specialTab=isSpecialTab
    } 
  else {
    var leftout=['Steamed cookies','Ultrascience','Gold hoard','Neuromancy','Perfect idling','Wrinkler doormat','Reindeer season','Eternal seasons','Turbo-charged soil','A really good guide book','Magic shenanigans','Occult obstruction','Glucose-charged air'];
    for (var i in Game.Upgrades) 
      {
        if (Game.Upgrades[i].pool=='toggle' || leftout.indexOf(Game.Upgrades[i].name)!=-1) {}
        else Game.Upgrades[i].earn();
      }
    Game.SetAllAchievs(1);
    Game.MaxSpecials();
    Game.nextResearch=0;
    Game.researchT=-1;
    var buildCount=iniBC;
    var rebuy=useRebuy
    if (toFindRaw) rebuy=0
    if (!useEB || toFindRaw) {buildCount+=buildingRelList[rebuy+1]} else {buildCount+=buildingRelListEB[rebuy+1]}
    var num=0
    for (var i = 0; i < Object.keys(Game.Objects).length; i++)
      {
        if (buildCount<0) buildCount=0;
        Game.ObjectsById[i].amount=buildCount;
        if (i==7) {num+=wizCount} else {num+=buildCount};
        if (!useEB || toFindRaw) {buildCount+=buildingRelList[rebuy][i]} else {buildCount+=buildingRelListEB[rebuy][i]}; 
      }
    Game.BuildingsOwned=num
    Game.cookies=iniC;
    Game.cookiesEarned=iniCE;
    Game.prestige=iniP;
    
    for (var i = 0; i < Object.keys(Game.Objects).length; i++)
      {
        var me=Game.ObjectsById[i];
        if (i==0) {me.level=19;} else if (i==7) {me.level=wizLevel-1;} else {me.level=9;};
        me.levelUp(true);
      }
    };
  if (iniSeed=='R') {Game.seed=Game.makeSeed();} else {Game.seed=iniSeed;};
  if (!toFindRaw) {console.log(Game.seed);};
  Game.prefs.autosave=0
  Game.ObjectsById[7].amount=wizCount
  Game.Upgrades['Chocolate egg'].bought=boughtCE;
  Game.Upgrades['Sugar frenzy'].bought=boughtSF;
  Game.popups=0
  if (setSeason!=false) Game.UpgradesById[setSeason].earn();
  if (setPledge!=false) Game.UpgradesById[74].earn();
  if (!Game.Has('Golden switch [on]')) {Game.UpgradesById[332].earn();Game.UpgradesById[331].bought = 0;}
  Game.seasonUses=0;
  Game.upgradesToRebuild=1;
  Game.recalculateGains=1;
  Game.storeBulkButton(buyOption1);
  Game.storeBulkButton(buyOption2);
  
  Game.killBuffs();
  Game.killShimmers();
  Game.shimmerTypes.golden.last=''
  Game.goldenClicks=GCCount
  Game.reindeerClicked=iniRein
  Game.cookieClicks=0
  Game.fortuneGC=fortuneG
  Game.fortuneCPS=1
  Game.lumpCurrentType=chooseLump;
  Game.computeLumpTimes();
  Game.lumpT=Date.now()-Game.lumpRipeAge;
  Game.dragonAura=(toFindRaw?0:d1Aura)
  Game.dragonAura2=(toFindRaw?0:d2Aura)
  
  Game.Logic();
  Game.popups=1;
  };
 
function ResetMinigames(toFindRaw) {
  if (toFindRaw) {Game.popups=0}
  for (var i = 0; i < Object.keys(Game.Objects).length; i++)
    {
      var me=Game.ObjectsById[i];
      if (me.minigame && me.minigame.onRuinTheFun) me.minigame.onRuinTheFun();
      if (muteBuildings[i]==0 || me.minigame && unmuteMinigames) {me.muted=0;me.switchMinigame(1)} else {me.muted=1;};
    }
  Game.lumps=iniLumps
  
  for (var i = 0; i < ((forceFtHoF=='random')?0:9999); i++) {
    Math.seedrandom(Game.seed+'/'+i);
    if (Math.random()<(1-0.15)) {
      Math.random();
      Math.random();
      var choices=[];
      choices.push('frenzy','multiply cookies');
      if (!Game.hasBuff('Dragonflight')) choices.push('click frenzy');
      if (Math.random()<0.1) choices.push('cookie storm','cookie storm','blab');
      if (Game.BuildingsOwned>=10 && Math.random()<0.25) choices.push('building special');
      if (Math.random()<0.15) choices=['cookie storm drop'];
      if (Math.random()<0.0001) choices.push('free sugar lump');
      var chosen=choose(choices);
      if (chosen!=forceFtHoF) {continue;};
      Game.Objects['Wizard tower'].minigame.spellsCastTotal=i
      Game.Notify('Successfully found a '+forceFtHoF,'Your seed is '+Game.seed,[11,5]);
      break
      }
    else {
      Math.random();
      Math.random();
      var choices=[];
      choices.push('clot','ruin cookies');
      if (Math.random()<0.1) choices.push('cursed finger','blood frenzy');
      if (Math.random()<0.003) choices.push('free sugar lump');
      if (Math.random()<0.1) choices=['blab'];
      var chosen=choose(choices);
      if (chosen!=forceFtHoF) {continue;};
      Game.Objects['Wizard tower'].minigame.spellsCastTotal=i
      Game.Notify('Successfully found a '+forceFtHoF,'Your seed is '+Game.seed,[11,5])
      break
      }
    }
  if (forceFtHoF=='random') {Game.Notify('FtHoF randomized','Your seed is '+Game.seed,[0, 7])}
  else if (chosen!=forceFtHoF) {Game.Notify('Failed to find a '+forceFtHoF,'Your seed is '+Game.seed,[15, 5])};
  Game.Objects['Wizard tower'].minigame.magicM=Math.floor(4+Math.pow(wizCount,0.6)+Math.log((wizCount+(wizLevel-1)*10)/15+1)*15);
  Game.Objects['Wizard tower'].minigame.magic=Game.Objects['Wizard tower'].minigame.magicM
  Game.lumpRefill=0;
  var gardenR=setGardenR?setGardenR:Math.floor(Math.random()*4+1)

  for (var y=0;y<6;y++) {
    for (var x=0;x<6;x++) {
      if (Game.Objects['Farm'].minigame.isTileUnlocked(x,y) == true && (gardenR>=3 && (x+gardenR)%2) || (gardenR<3 && (y+gardenR)%2)) {Game.Objects['Farm'].minigame.plot[y][x]=[gardenP1[0], gardenP1[1]]} else {Game.Objects['Farm'].minigame.plot[y][x]=[gardenP2[0], gardenP2[1]]}
      }
    }
  Game.Objects['Farm'].minigame.freeze=0;
  Game.Objects['Farm'].minigame.soil=2;
  if (toFindRaw) {Game.Objects['Farm'].minigame.harvestAll(); Game.Objects['Farm'].minigame.computeEffs()}
  Game.Objects['Farm'].minigame.nextStep=Date.now()
  if (!toFindRaw) {Game.Objects['Farm'].minigame.logic(); Game.Objects['Farm'].minigame.nextStep=Date.now()+(toNextTick?toNextTick:Math.round(Math.random()*900))*1000}
  Game.Objects['Farm'].minigame.seedSelected=gardenSeed;
  
  Game.Objects['Bank'].minigame.reset();
  Game.Objects['Bank'].minigame.officeLevel=officeL;
 
  Game.Objects['Temple'].minigame.reset();
  Game.Objects['Temple'].minigame.dragging=Game.Objects['Temple'].minigame.godsById[(toFindRaw?0:spirit1)];
  Game.Objects['Temple'].minigame.slotGod(Game.Objects['Temple'].minigame.godsById[(toFindRaw?0:spirit1)], 0);
  var div=l('templeGod'+(toFindRaw?0:spirit1));
  div.className='ready templeGod titleFont';
  div.style.transform='none';
  l('templeSlot'+0).appendChild(div);
  Game.Objects['Temple'].minigame.dragging=Game.Objects['Temple'].minigame.godsById[(toFindRaw?0:spirit2)];
  Game.Objects['Temple'].minigame.slotGod(Game.Objects['Temple'].minigame.godsById[(toFindRaw?0:spirit2)], 1);
  var div=l('templeGod'+(toFindRaw?0:spirit2));
  div.className='ready templeGod titleFont';
  div.style.transform='none';
  l('templeSlot'+1).appendChild(div);
  Game.Objects['Temple'].minigame.dragging=Game.Objects['Temple'].minigame.godsById[(toFindRaw?0:spirit3)];
  Game.Objects['Temple'].minigame.slotGod(Game.Objects['Temple'].minigame.godsById[(toFindRaw?0:spirit3)], 2);
  var div=l('templeGod'+(toFindRaw?0:spirit3));
  div.className='ready templeGod titleFont';
  div.style.transform='none';
  l('templeSlot'+2).appendChild(div);
  Game.Objects['Temple'].minigame.dragging=false;
  Game.Objects['Temple'].minigame.swaps=3
  if (toFindRaw) {Game.Objects['Temple'].minigame.reset();};
  
  Game.popups=1
  };
 
function SpawnGoldenCookies() {
  var priorVol=Game.volume
  Game.volume=0
  var newShimmer=new Game.shimmer('golden',{noWrath:true});
  newShimmer.spawnLead=1; 
  Game.shimmerTypes.golden.spawned=1;
  Game.Logic();
  Game.killShimmers();
  Game.volume=priorVol
  var effectDurMod=GetEffectDurMod();
  if (iniDO==true) 
    {
    var newShimmer=new Game.shimmer('golden',{noWrath:setPledge});
    if (iniGC2!='R') newShimmer.force=Game.goldenCookieChoices[iniGC2].toLowerCase();
    };
  if (iniSpawn==true) 
    {
    var newShimmer=new Game.shimmer('golden',{noWrath:setPledge}); 
    newShimmer.spawnLead=1; 
    Game.shimmerTypes.golden.spawned=1;
    if (iniGC!='R') newShimmer.force=Game.goldenCookieChoices[iniGC].toLowerCase();
    };
  if (iniDEoRL==true) 
    {
    var newShimmer=new Game.shimmer('golden',{noWrath:setPledge});
    if (iniGC3!='R') newShimmer.force=Game.goldenCookieChoices[iniGC3].toLowerCase();
    };
  for (var i in Game.shimmerTypes) {me=Game.shimmerTypes[i]; me.time=iniTimer};
  if (iniF==true) {Game.gainBuff('frenzy',(77*effectDurMod<iniFdur)?iniFdur:77*effectDurMod,7); Game.buffs['Frenzy'].time=iniFdur*Game.fps};
  if (iniDH==true) {Game.gainBuff('dragon harvest',(60*effectDurMod<iniDHdur)?iniDHdur:60*effectDurMod,15); Game.buffs['Dragon Harvest'].time=iniDHdur*Game.fps};
  
  var list=[];
  for (var i in Game.Objects) {if (Game.Objects[i].amount>=10) list.push(Game.Objects[i].id);}
  var len=Math.min(list.length, iniBSCount)
  var time=(30*effectDurMod<iniBSdur)?iniBSdur:30*effectDurMod
  for (var i=0; i<len; i++) {var obj=choose(list); list.splice(list.indexOf(obj), 1); Game.gainBuff('building buff',time,Game.ObjectsById[obj].amount/10+1,obj)}


  if (iniSB==true) Game.gainBuff('sugar blessing',24*60*60,1);
  };

function ResetAll(manual) {
  if (manual) {
    FindMaxComboPow();
    PrintScore();
    maxComboPow=1
    relComboPow=1
    maxBSCount=0
    maxGodz=1
  }
  ResetGame(1);
  ResetMinigames(1);
  Game.recalculateGains=1
  Game.Logic();
  if (!(typeof CCCEMUILoaded === "undefined")) {iniRaw=Game.cookiesPsRaw};
  ResetGame();
  ResetMinigames();
  SpawnGoldenCookies();
  };

function GetEffectDurMod() {
  var effectDurMod=1;
  if (Game.Has('Get lucky')) effectDurMod*=2;
  if (Game.Has('Lasting fortune')) effectDurMod*=1.1;
  if (Game.Has('Lucky digit')) effectDurMod*=1.01;
  if (Game.Has('Lucky number')) effectDurMod*=1.01;
  if (Game.Has('Green yeast digestives')) effectDurMod*=1.01;
  if (Game.Has('Lucky payout')) effectDurMod*=1.01;
  effectDurMod*=1+Game.auraMult('Epoch Manipulator')*0.05;
  if (setPledge) effectDurMod*=Game.eff('goldenCookieEffDur');
  else effectDurMod*=Game.eff('wrathCookieEffDur');

  if (Game.hasGod) {
    var godLvl=Game.hasGod('decadence');
    if (godLvl==1) effectDurMod*=1.07;
    else if (godLvl==2) effectDurMod*=1.05;
    else if (godLvl==3) effectDurMod*=1.02;
  };
  return effectDurMod
};

function CheckModLoaded() {
  if (typeof CCCEMUILoaded === "undefined") {var keepNotifs=Game.prefs.notifs; Game.prefs.notifs=0; Game.Notify('Mod partially not loaded','Try reloading, and maybe try later',[15, 5]); Game.prefs.notifs=keepNotifs};
  };

if (Game.ready) {
  Game.LoadMod("https://glander.club/asjs/cvCF2gMi")
  
  if (Game.chimeType==0) {PresetSettingsConsist(); ResetGame(1); PresetSettingsGrail()} else {ResetGame(1);};
  Game.prefs.autosave=0
  Game.bakeryNameSet('grail moments')

  setTimeout(CheckModLoaded, 1900);
  setTimeout(ResetAll, 2000); 
} else {console.log("mod launch halted, game not loaded")};
