#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

import * as crypto from "crypto";

// === MCP Server Setup ===

const server = new McpServer(
  { name: "password-forge", version: "1.0.0" },
  {
    capabilities: { tools: {} },
    instructions: "MCP server for generating secure passwords, passphrases, and checking password strength. Zero external deps.",
  }
);

// Tool: generate_password
server.tool(
  "generate_password",
  "Generate a cryptographically secure random password.",
  {
    length: z.number().min(4).max(128).default(16).describe("Password length"),
    uppercase: z.boolean().default(true).describe("Include uppercase letters"),
    lowercase: z.boolean().default(true).describe("Include lowercase letters"),
    numbers: z.boolean().default(true).describe("Include numbers"),
    symbols: z.boolean().default(true).describe("Include symbols"),
    count: z.number().min(1).max(20).default(5).describe("Number of passwords to generate")
  },
  async ({ length, uppercase, lowercase, numbers, symbols, count }) => {
    try {
      let charset = "";
      if (uppercase) charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      if (lowercase) charset += "abcdefghijklmnopqrstuvwxyz";
      if (numbers) charset += "0123456789";
      if (symbols) charset += "!@#$%^&*()_+-=[]{}|;:,.<>?";
      if (!charset) return { content: [{ type: "text", text: "Must enable at least one character set" }], isError: true };
      const passwords: string[] = [];
      for (let i = 0; i < count; i++) {
        const bytes = crypto.randomBytes(length);
        passwords.push(Array.from(bytes, b => charset[b % charset.length]).join(""));
      }
      return { content: [{ type: "text", text: passwords.join("\n") }] };
    } catch (e: unknown) {
      return { content: [{ type: "text", text: `Error: ${(e as Error).message}` }], isError: true };
    }
  }
);

// Tool: generate_passphrase
server.tool(
  "generate_passphrase",
  "Generate a memorable passphrase from random words (XKCD-style).",
  {
    words: z.number().min(3).max(10).default(4).describe("Number of words"),
    separator: z.string().default("-").describe("Word separator"),
    capitalize: z.boolean().default(true).describe("Capitalize first letter of each word"),
    count: z.number().min(1).max(10).default(3).describe("Number of passphrases")
  },
  async ({ words, separator, capitalize, count }) => {
    try {
      const wordList = ["correct","horse","battery","staple","abandon","ability","absent","absorb","abstract","absurd","abuse","access","accident","account","accuse","achieve","acid","acoustic","acquire","across","action","actor","actual","adapt","address","adjust","admit","adult","advance","advice","aerobic","affair","afford","agree","alarm","album","alcohol","alert","alien","allow","almost","alone","alpha","alter","always","amazing","among","amount","amused","anchor","ancient","anger","angle","animal","ankle","annual","another","answer","antenna","antique","anxiety","apart","apology","appear","apple","approve","arctic","arena","arrange","arrest","arrive","arrow","aspect","assume","atom","attack","attend","attract","auction","audit","august","autumn","avocado","avoid","awake","aware","awesome","awful","axis","baby","bachelor","bacon","badge","balance","balcony","bamboo","banana","banner","barely","bargain","barrel","basket","battle","beach","bean","beauty","become","bedroom","believe","bench","benefit","beyond","bicycle","blade","blanket","blast","blaze","bleak","bless","blind","blood","blossom","blue","board","body","bomb","bone","bonus","book","border","bottom","bounce","brain","brand","brave","bread","breeze","bridge","brief","bright","bring","broken","brother","brown","brush","bubble","buddy","budget","buffalo","build","bullet","bundle","burden","burger","burst","butter","cabin","cable","cactus","cage","camera","camp","canal","cancel","candy","capable","capital","capture","carbon","card","cargo","carpet","carry","castle","casual","catalog","catch","cattle","caught","cause","caution","cave","ceiling","celery","cement","census","cereal","certain","chair","chalk","champion","change","chaos","chapter","charge","chase","cheap","check","cheese","chef","cherry","chicken","chief","child","chimney","choice","chunk","circle","citizen","claim","clap","clarify","claw","clay","clean","clerk","clever","click","client","cliff","climb","clinic","clip","clock","close","cloud","clown","cluster","coach","coast","coconut","code","coffee","coil","coin","collect","color","column","combine","comfort","comic","common","company","concert","conduct","confirm","congress","connect","consider","control","convince","cookie","copper","coral","core","cotton","couch","country","couple","course","cousin","cover","craft","crane","crash","crater","crazy","cream","credit","crew","cricket","crime","crisp","critic","crop","cross","crowd","crucial","cruel","cruise","crystal","cube","culture","cupboard","curious","current","curtain","curve","cushion","custom","cycle","damage","dance","danger","daring","dash","daughter","dawn","debate","debris","decade","december","decide","decline","decorate","decrease","deer","defense","define","degree","delay","deliver","demand","denial","dentist","depend","deposit","depth","derive","describe","desert","design","detail","detect","develop","device","devote","diagram","diamond","diary","diesel","diet","differ","digital","dignity","dilemma","dinner","dinosaur","direct","dirt","discover","disease","dish","dismiss","disorder","display","distance","divert","divide","divorce","document","dolphin","domain","donate","donkey","donor","door","double","dragon","drama","dream","dress","drift","drill","drink","drip","drive","drop","drum","dry","duck","dumb","dune","during","dust","duty","dwarf","dynamic","eager","eagle","early","earth","easily","east","echo","ecology","economy","edge","educate","effort","eight","either","elbow","elder","electric","elegant","element","elephant","elevator","elite","embark","embrace","emerge","emotion","employ","empower","empty","enable","endorse","enemy","energy","enforce","engage","engine","enhance","enjoy","enlist","enough","enrich","enroll","ensure","enter","entire","entry","envelope","episode","equal","equip","erase","erode","erosion","error","escape","essay","essence","estate","eternal","evidence","evolve","exact","example","excess","exchange","excite","exclude","excuse","execute","exercise","exhaust","exhibit","exile","exist","expand","expect","expire","explain","expose","express","extend","extra","eyebrow","fabric","face","faculty","faint","faith","family","famous","fancy","fantasy","fashion","father","fatigue","fault","favorite","feature","federal","festival","fever","fiber","fiction","field","figure","final","finance","finger","finish","fire","firm","fiscal","fitness","flag","flame","flash","flavor","flee","flight","float","flock","floor","flower","fluid","flush","flutter","foam","focus","follow","force","forest","forget","fork","fortune","forum","forward","fossil","foster","found","frame","frequent","fresh","friend","fringe","frog","front","frost","frozen","fruit","fuel","funny","furnace","fury","future","gadget","galaxy","gallery","game","garage","garbage","garden","garlic","garment","gate","gather","gauge","general","genius","gentle","genuine","gesture","ghost","giant","gift","giggle","ginger","giraffe","glad","glance","glare","glass","globe","gloom","glory","glove","glow","glue","goat","goddess","gold","gorilla","gospel","gossip","govern","grace","grain","grant","grape","grass","gravity","great","green","grill","grip","grocery","group","grow","grunt","guard","guess","guide","guilt","guitar","habit","half","hammer","hamster","hand","happen","harbor","harvest","hawk","hazard","health","heart","heavy","hedgehog","height","helmet","help","hero","hidden","highway","hill","hire","history","hobby","hockey","holiday","hollow","home","honey","hood","hope","horn","horror","horse","hospital","host","hotel","hover","humble","humor","hundred","hungry","hurdle","hurry","hybrid","ice","icon","idea","identify","idle","ignore","illegal","illness","image","imitate","immense","immune","impact","impose","improve","impulse","include","income","increase","index","indicate","indoor","industry","infant","inflict","inform","initial","inject","inmate","inner","innocent","input","inquiry","insane","insect","inside","inspire","install","intact","interest","invest","invite","involve","island","isolate","issue","ivory","jacket","jaguar","jungle","junior","junk","justice","kangaroo","keep","ketchup","kidney","kingdom","kitchen","kite","kitten","knife","ladder","lake","lamp","language","laptop","large","later","laugh","laundry","layer","leader","leaf","learn","leave","lecture","legal","legend","leisure","lemon","length","lens","leopard","lesson","letter","level","liberty","library","license","life","light","limit","link","lion","liquid","list","little","live","lizard","loan","lobster","local","logic","lonely","loop","lottery","lumber","lunar","luxury","machine","magazine","magnet","maid","major","mammal","manage","mandate","mango","mansion","manual","maple","marble","march","margin","marine","market","master","match","material","matter","maximum","meadow","measure","mechanic","medal","media","melody","member","memory","mention","mentor","mercy","merit","method","middle","midnight","million","mimic","minimum","miracle","mirror","misery","mistake","mixture","mobile","model","modify","moment","monitor","monkey","monster","month","moral","morning","mosquito","mother","motion","mountain","mouse","movie","multiply","muscle","museum","mushroom","music","mystery","myth","naive","napkin","narrow","nation","nature","neck","negative","neglect","neither","nephew","nerve","network","neutral","never","noble","noise","nominee","normal","north","notable","nothing","novel","number","nurse","object","oblige","obscure","observe","obtain","obvious","ocean","october","odor","office","often","olive","olympic","omit","once","onion","online","open","opera","opinion","oppose","option","orange","orbit","orchard","order","ordinary","organ","orient","original","orphan","ostrich","other","outdoor","outer","output","outside","oval","owner","oxygen","oyster","ozone","paddle","palace","panda","panel","panic","panther","paper","parade","parent","park","parrot","party","patch","patient","patrol","pattern","pause","pave","payment","peace","peanut","pepper","perfect","permit","person","pet","phone","photo","phrase","physical","piano","picnic","picture","piece","pilot","pink","pioneer","pipe","pistol","pitch","pizza","place","planet","plastic","plate","play","please","pledge","pluck","plug","plunge","poem","point","polar","pole","police","pond","popular","portion","position","possible","potato","pottery","poverty","powder","practice","praise","predict","prefer","prepare","present","pretty","prevent","price","pride","primary","print","priority","prison","private","prize","problem","process","produce","profit","program","project","promote","proof","property","prosper","protect","proud","provide","public","pudding","pulse","pumpkin","punch","pupil","puppy","purchase","purity","purpose","puzzle","pyramid","quality","quantum","quarter","question","quick","quiz","quote","rabbit","raccoon","radar","radio","raise","rally","ramp","ranch","random","range","rapid","rare","rather","raven","razor","ready","reason","rebel","rebuild","recall","receive","recipe","record","recycle","reduce","reflect","reform","region","regret","regular","reject","relax","release","relief","rely","remain","remember","remind","remove","render","renew","repair","repeat","replace","report","require","rescue","resemble","resist","resource","response","result","retire","retreat","return","reunion","reveal","review","reward","rhythm","ribbon","rifle","ring","ritual","river","road","robot","robust","rocket","romance","roof","rookie","room","round","route","royal","rubber","rude","rugby","ruler","rural","saddle","sadness","safari","salad","salmon","salon","salt","salute","sample","sand","satisfy","satoshi","sauce","sausage","scale","scatter","scene","school","science","scissors","scorpion","scout","scrap","screen","script","scrub","search","season","second","secret","security","segment","select","seminar","senior","sense","sentence","series","service","session","settle","setup","seven","shadow","shaft","shallow","share","shed","sheriff","shield","shift","shine","ship","shiver","shock","shoe","shoot","short","shoulder","shove","shrimp","shuffle","sibling","siege","sight","silent","silver","similar","simple","since","siren","sister","situate","size","skate","sketch","skill","skull","slender","slice","slide","slight","slogan","slow","small","smart","smile","smoke","smooth","snack","snake","snap","sniff","snow","soap","soccer","social","soldier","solution","someone","song","sort","soul","sound","south","space","spare","spatial","spawn","speak","special","speed","spend","sphere","spider","spike","spirit","split","sponsor","spoon","sport","spray","spread","spring","squeeze","squirrel","stable","stadium","staff","stage","stairs","stamp","stand","start","state","stay","steak","steel","stem","step","stereo","stick","still","sting","stock","stomach","stone","stool","story","stove","strategy","street","strike","strong","struggle","student","stuff","stumble","style","subject","submit","subway","success","suffer","sugar","suggest","summer","sun","sunset","super","supply","supreme","surface","surge","surprise","surround","survey","suspect","sustain","swallow","swamp","swap","swarm","sweet","swim","swing","switch","sword","symbol","symptom","syrup","system","table","tackle","tag","talent","talk","tank","tape","target","task","taste","tattoo","taxi","teach","team","tell","ten","tenant","tennis","tent","term","test","text","thank","theme","then","theory","there","they","thing","this","thought","three","thrive","throw","thumb","thunder","ticket","tide","tiger","timber","time","tiny","tip","tired","tissue","title","toast","tobacco","today","toddler","together","toilet","token","tomato","tomorrow","tone","tongue","tonight","tool","tooth","topic","topple","torch","tornado","tortoise","total","tourist","toward","tower","town","track","trade","traffic","tragic","train","transfer","trap","trash","travel","tray","treat","tree","trend","trial","tribe","trick","trigger","trim","trip","trophy","trouble","truck","truly","trumpet","trust","truth","tube","tuna","tunnel","turkey","turn","turtle","twelve","twenty","twice","twin","twist","type","typical","ugly","umbrella","unable","unaware","uncle","under","undo","unfair","unfold","unhappy","uniform","unique","unit","universe","unknown","unlock","until","unusual","unveil","update","upgrade","uphold","upper","upset","urban","usage","used","useful","useless","usual","utility","vacant","vacuum","vague","valid","valley","valve","vanish","vapor","various","vault","vehicle","velvet","vendor","venture","venue","verb","verify","version","very","vessel","veteran","viable","victory","video","view","village","vintage","violin","virtual","virus","visa","visit","visual","vital","vivid","vocal","voice","void","volcano","volume","voyage","wage","wagon","wait","walk","wall","walnut","want","warfare","warm","warrior","wash","wasp","waste","water","wave","wealth","weapon","weather","wedding","weekend","weird","welcome","west","whale","wheat","wheel","when","where","whip","whisper","wide","width","wife","wild","will","window","wine","wing","winner","winter","wire","wisdom","wise","wish","witness","wolf","woman","wonder","wood","wool","world","worry","worth","wreck","wrestle","wrist","write","wrong","yard","year","yellow","young","youth","zebra","zero","zone"];
      const phrases: string[] = [];
      for (let i = 0; i < count; i++) {
        const indices = crypto.randomBytes(words * 2);
        const selected: string[] = [];
        for (let j = 0; j < words; j++) {
          const idx = (indices[j * 2] * 256 + indices[j * 2 + 1]) % wordList.length;
          let w = wordList[idx];
          if (capitalize) w = w.charAt(0).toUpperCase() + w.slice(1);
          selected.push(w);
        }
        phrases.push(selected.join(separator));
      }
      const entropy = Math.floor(words * Math.log2(wordList.length));
      return { content: [{ type: "text", text: phrases.join("\n") + `\n\nEntropy: ~${entropy} bits (${words} words from ${wordList.length}-word list)` }] };
    } catch (e: unknown) {
      return { content: [{ type: "text", text: `Error: ${(e as Error).message}` }], isError: true };
    }
  }
);

// Tool: check_strength
server.tool(
  "check_strength",
  "Analyze password strength — length, charset diversity, entropy estimate, and tips.",
  {
    password: z.string().describe("Password to analyze")
  },
  async ({ password }) => {
    try {
      const hasUpper = /[A-Z]/.test(password);
      const hasLower = /[a-z]/.test(password);
      const hasDigit = /[0-9]/.test(password);
      const hasSymbol = /[^A-Za-z0-9]/.test(password);
      let charsetSize = 0;
      if (hasUpper) charsetSize += 26;
      if (hasLower) charsetSize += 26;
      if (hasDigit) charsetSize += 10;
      if (hasSymbol) charsetSize += 32;
      const entropy = Math.floor(password.length * Math.log2(charsetSize || 1));
      let strength = "Weak";
      if (entropy >= 80) strength = "Very Strong";
      else if (entropy >= 60) strength = "Strong";
      else if (entropy >= 40) strength = "Moderate";
      const checks = [
        `Length: ${password.length}${password.length >= 12 ? " (good)" : " (too short, use 12+)"}`,
        `Uppercase: ${hasUpper ? "yes" : "NO - add uppercase"}`,
        `Lowercase: ${hasLower ? "yes" : "NO - add lowercase"}`,
        `Numbers: ${hasDigit ? "yes" : "NO - add numbers"}`,
        `Symbols: ${hasSymbol ? "yes" : "NO - add symbols"}`,
        `Charset size: ${charsetSize}`,
        `Entropy: ~${entropy} bits`,
        `Strength: ${strength}`,
      ];
      return { content: [{ type: "text", text: checks.join("\n") }] };
    } catch (e: unknown) {
      return { content: [{ type: "text", text: `Error: ${(e as Error).message}` }], isError: true };
    }
  }
);

// === Smithery sandbox support ===
export function createSandboxServer() {
  return server;
}

// === Start Server ===
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

// Only auto-start when run directly
const isDirectRun = !process.env.SMITHERY_SCAN;
if (isDirectRun) {
  main().catch((error) => {
    console.error("Fatal error:", error);
    process.exit(1);
  });
}
