import { useState, useEffect } from "react";

// === FOUNDRY DARK TOKENS ===
const T={canvas:"#1E2128",panelBg:"#282C34",panelBorder:"#3A3F4A",fieldBg:"#1E2128",fieldBorder:"#3A3F4A",titleColor:"#FFFFFF",labelColor:"#8892A0",dimColor:"#555B66",valueColor:"#E0E0E0",indOff:"#3A3F4A",indGreen:"#00E676",indRed:"#FF1744",indAmber:"#FFD600",alarmFill:"#3D1111",alarmFrame:"#E74C3C",alarmText:"#FF6B6B",warnFill:"#3D3511",warnFrame:"#F39C12",warnText:"#FFD93D",okFill:"#0D2E1A",okFrame:"#2ECC71",okText:"#66FF99",accDash:"#2980B9",accQueue:"#2ECC71",accStation:"#E67E22",accTiming:"#1ABC9C",accMES:"#3498DB",accDB:"#9B59B6",accRCI:"#E74C3C",accAlarm:"#C0392B",accConfig:"#7F8C8D",accOPC:"#E74C3C",accPaapri:"#F39C12",accProd:"#16A085",accHist:"#2980B9",accOEE:"#8E44AD",navBg:"#14161A",btnFace:"#3A3F4A",btnText:"#E0E0E0",btnBorder:"#555B66",mainBg:"#111318",statusBar:"#0D0F12"};
const font="Arial, sans-serif";

// === SHARED COMPONENTS ===
function Ind({on, color="green", size=14}) {
  const f = !on ? T.indOff : color==="green" ? T.indGreen : color==="red" ? T.indRed : T.indAmber;
  return (<span style={{display:"inline-block",width:size,height:size,borderRadius:"50%",background:f,border:`1px solid ${on?f:"#555B66"}`,flexShrink:0,boxShadow:on?`0 0 6px ${f}55`:"none"}}/>);
}
function BoolInd({on, color="green", label}) {
  return (<div style={{display:"flex",alignItems:"center",gap:6}}><Ind on={on} color={color}/><span style={{fontSize:12,fontFamily:font,color:T.valueColor}}>{label}</span></div>);
}
function Field({value, alert, warn, ok, w, bold, align="LEFT", size=12, mono}) {
  const bg=alert?T.alarmFill:warn?T.warnFill:ok?T.okFill:T.fieldBg;
  const bd=alert?T.alarmFrame:warn?T.warnFrame:ok?T.okFrame:T.fieldBorder;
  const c=alert?T.alarmText:warn?T.warnText:ok?T.okText:T.valueColor;
  return (<div style={{background:bg,border:`1px solid ${bd}`,padding:"3px 7px",fontFamily:mono?"Consolas,monospace":font,fontSize:size,fontWeight:bold?"bold":"normal",color:c,textAlign:align==="CENTER"?"center":align==="RIGHT"?"right":"left",width:w||"auto",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{value}</div>);
}
function NumText({num, text, alert, warn}) {
  return (<div style={{display:"flex"}}><Field value={num} alert={alert} warn={warn} w={45} bold align="CENTER"/><div style={{width:1}}/><div style={{flex:1}}><Field value={text} alert={alert} warn={warn}/></div></div>);
}
function Lbl({children}) {
  return (<span style={{fontSize:11,fontFamily:font,color:T.labelColor}}>{children}</span>);
}
function Panel({title, accent, children, badge}) {
  return (<div style={{background:T.panelBg,border:`1px solid ${T.panelBorder}`,display:"flex",flexDirection:"column"}}><div style={{background:accent,padding:"5px 10px",minHeight:28,display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0}}><span style={{fontSize:13,fontWeight:"bold",fontFamily:font,color:"#FFF",letterSpacing:.5}}>{title}</span>{badge&&<span style={{fontSize:9,padding:"1px 8px",background:"rgba(0,0,0,.3)",color:"rgba(255,255,255,.6)"}}>{badge}</span>}</div><div style={{padding:"8px 10px",display:"flex",flexDirection:"column",gap:7,flex:1,overflow:"hidden"}}>{children}</div></div>);
}
function Btn({text, active, onClick, small}) {
  return (<div onClick={onClick} style={{padding:small?"3px 10px":"5px 16px",fontFamily:font,fontSize:small?10:12,background:active?T.accDash:T.btnFace,border:`1px solid ${active?T.accDash:T.btnBorder}`,color:active?"#FFF":T.btnText,cursor:"pointer",display:"inline-block",fontWeight:active?"bold":"normal"}}>{text}</div>);
}
function StatCard({label, value, accent, alert, sub}) {
  return (<div style={{background:T.panelBg,border:`1px solid ${T.panelBorder}`,padding:"10px 14px",flex:1,textAlign:"center"}}><div style={{fontSize:10,color:T.labelColor,letterSpacing:1,textTransform:"uppercase",marginBottom:4}}>{label}</div><div style={{fontSize:28,fontWeight:"bold",color:alert?T.alarmText:accent||T.valueColor,fontFamily:font,lineHeight:1}}>{value}</div>{sub&&<div style={{fontSize:10,color:T.dimColor,marginTop:4}}>{sub}</div>}</div>);
}
function LV({l, v, lw=75, alert, mono, bold}) {
  return (<div style={{display:"flex",alignItems:"center",gap:4}}><span style={{width:lw,fontSize:11,color:T.labelColor,textAlign:"right",flexShrink:0}}>{l}</span><div style={{flex:1}}><Field value={v} alert={alert} mono={mono} bold={bold}/></div></div>);
}

// =============================================================================
// 1. OVERVIEW (absorbs station tracking + downstream)
// =============================================================================
function S_Overview({tick}){
  const st=[{n:"Stn1",o:1,j:"0047"},{n:"Stn2",o:1,j:"0048"},{n:"Stn3",o:0},{n:"Stn4",o:1,j:"0045"},{n:"Stn5",o:0},{n:"Stn6",o:1,j:"0046"},{n:"Stn7",o:0},{n:"Stn8",o:0},{n:"Stn9",o:0},{n:"Stn10",o:0}];
  const ds=[{n:"Trolley",b:"STE-0049",s:"Transit",m:3.2},{n:"Seamer",b:"STE-0044",s:"Processing",m:12.8},{n:"Outfeed",b:"",s:"Empty",m:0},{n:"BarrelRoll",b:"",s:"Empty",m:0}];
  return (<>
    <div style={{display:"flex",gap:10,marginBottom:10}}><StatCard label="MES" value="ONLINE" accent={T.indGreen} sub="HB active"/><StatCard label="DB" value="OK" accent={T.indGreen} sub="MariaDB"/><StatCard label="Jobs" value="6" accent={T.accStation} sub="of 12"/><StatCard label="Queue" value="8" accent={T.accQueue} sub="L+R"/><StatCard label="Alarms" value="2" alert sub="2 High"/></div>
    <div style={{display:"flex",gap:10}}>
      <div style={{flex:2}}>
        <Panel title="Buffer Stations 1-10" accent={T.accStation} badge="OPC +20">
          <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:6}}>{st.map((s,i)=><div key={i} style={{background:s.o?"#1A3A2A":T.fieldBg,border:`1px solid ${s.o?T.indGreen+"44":T.fieldBorder}`,padding:"6px 4px",textAlign:"center"}}><div style={{fontSize:9,color:T.labelColor,marginBottom:2}}>{s.n}</div><Ind on={!!s.o} size={12}/>{s.j&&<div style={{fontSize:9,color:T.dimColor,marginTop:2,fontFamily:"Consolas,monospace"}}>..{s.j}</div>}</div>)}</div>
        </Panel>
      </div>
      <div style={{flex:1}}>
        <Panel title="Downstream Tracking" accent={T.accPaapri} badge="OPC +8">
          {ds.map((d,i)=><div key={i} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"4px 6px",background:d.b?"#1A2818":T.fieldBg,border:`1px solid ${d.b?T.indGreen+"44":T.fieldBorder}`}}><div><span style={{fontSize:11,color:T.labelColor,fontWeight:"bold"}}>{d.n}</span>{d.b&&<span style={{fontSize:10,color:T.valueColor,fontFamily:"Consolas,monospace",marginLeft:8}}>{d.b}</span>}</div><span style={{fontSize:10,color:d.b?T.indGreen:T.dimColor}}>{d.s}{d.m>0?` ${d.m.toFixed(1)}m`:""}</span></div>)}
        </Panel>
      </div>
    </div>
    <div style={{display:"flex",gap:10,marginTop:10}}>
      <div style={{flex:1}}><Panel title="Recent Alarms" accent={T.accAlarm}>{[{t:"14:31",m:"DB: Max retries -- STE-0041",s:"high"},{t:"14:28",m:"MES: Overflow -- Paapri",s:"high"},{t:"13:45",m:"HB timeout",s:"med"},{t:"12:22",m:"Orphan -- 0039",s:"low"}].map((a,i)=><div key={i} style={{display:"flex",gap:6,padding:"3px 0",borderBottom:`1px solid ${T.panelBorder}22`}}><span style={{fontSize:9,color:T.dimColor,width:36,fontFamily:"Consolas,monospace"}}>{a.t}</span><Ind on color={a.s==="high"?"red":a.s==="med"?"amber":"green"} size={10}/><span style={{fontSize:9,color:a.s==="high"?T.alarmText:T.valueColor}}>{a.m}</span></div>)}</Panel></div>
      <div style={{flex:1}}><Panel title="Throughput Today" accent={T.accDash}><div style={{display:"flex",gap:10}}><StatCard label="Received" value="49"/><StatCard label="Completed" value="47"/><StatCard label="Orphaned" value="0" accent={T.indGreen}/><StatCard label="Faults" value="3" accent={T.alarmText}/></div></Panel></div>
    </div>
  </>);
}

// =============================================================================
// 2. PRODUCTION (DAVI Status + Handshake + TransferCart + FinalSeamer + Barrels)
// =============================================================================
function S_Production(){
  return (<>
    <div style={{display:"flex",gap:10}}>
      {/* DAVI Status */}
      <div style={{flex:1}}>
        <Panel title="DAVI Status" accent={T.accProd}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:4}}>
            {[["MotorsOn",true],["Running",false],["Auto",true],["Faulted",false],["Calibrating",false],["DaviTableReady",true],["DaviTableBusy",false]].map(([l,on])=><BoolInd key={l} on={on} color={l==="Faulted"?"red":"green"} label={l}/>)}
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:4,marginTop:4}}>
            <LV l="Mode:" v="Auto" lw={55}/><LV l="RunState:" v="Idle" lw={55}/><LV l="HmiState:" v="Ready" lw={55}/><LV l="Step:" v="0" lw={55}/><LV l="Recipe:" v="DAVI-12MM" lw={55}/><LV l="Project:" v="STE-2026-0047" lw={55}/>
          </div>
        </Panel>
        <div style={{marginTop:8}}>
          <Panel title="DAVI Handshake" accent={T.accProd}>
            <div style={{display:"flex",gap:12}}><BoolInd on={false} label="StartLoadingSheet"/><BoolInd on={false} label="LoadComplete"/></div>
            <LV l="LoadingState:" v="0" lw={90}/>
            <div style={{display:"flex",gap:12}}><BoolInd on={false} label="ReadyToUnload"/><BoolInd on={false} label="UnloadCompleted"/></div>
            <LV l="UnloadingState:" v="0" lw={90}/>
            <div style={{display:"flex",gap:10,marginTop:4}}>
              <LV l="RecipeFeedback:" v="0" lw={100}/><LV l="RecipeError:" v="0" lw={80}/>
            </div>
            <div style={{display:"flex",gap:12,marginTop:4}}><BoolInd on={false} color="amber" label="Busy"/><BoolInd on={false} label="Done"/><BoolInd on={false} color="red" label="Error"/></div>
          </Panel>
        </div>
      </div>

      {/* TransferCart + FinalSeamer */}
      <div style={{flex:1}}>
        <Panel title="TransferCart" accent={T.accProd}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:4}}>
            {[["DAVI Station",false],["Welder Station",false],["Ronzani Station",true],["Barrel Sensor 1",true],["Barrel Sensor 2",false],["Barrel Sensor 3",true]].map(([l,on])=><BoolInd key={l} on={on} color={on?"green":"red"} label={l}/>)}
          </div>
          <LV l="Current Location:" v="Station 4 (A008)" lw={105}/>
        </Panel>
        <div style={{marginTop:8}}>
          <Panel title="FinalSeamer" accent={T.accProd}>
            <div style={{display:"flex",gap:12}}><BoolInd on={true} label="In Auto Mode"/><BoolInd on={false} label="In Maint Mode"/><BoolInd on={false} color="red" label="Estopped"/></div>
            <LV l="Current Status:" v="Idle" lw={95}/>
          </Panel>
        </div>
      </div>

      {/* Barrel Queue */}
      <div style={{flex:1.2}}>
        <Panel title="Downstream Job Queue" accent={T.accStation}>
          <div style={{display:"flex",gap:6,marginBottom:6}}>
            <Btn text="Move Up"/><Btn text="Move Down"/><Btn text="Delete (Hold 2s)"/>
          </div>
          {[1,2,3,4,5].map(n=>{
            const data=n===1?{j:"STE-2026-0044",d:"SEAM-STD",w:"R1-STD",r:"R1-GRIND"}:n===2?{j:"STE-2026-0047",d:"DAVI-12MM",w:"",r:"R1-STD"}:{j:"",d:"",w:"",r:""};
            return <div key={n} style={{background:data.j?"#1A2818":T.fieldBg,border:`1px solid ${data.j?T.indGreen+"44":T.fieldBorder}`,padding:"6px 8px",marginBottom:4}}>
              <div style={{fontSize:11,fontWeight:"bold",color:T.labelColor,marginBottom:3}}>Barrel {n}</div>
              <div style={{display:"flex",flexDirection:"column",gap:2}}>
                <LV l="Job:" v={data.j||"--"} lw={65} bold={!!data.j} mono={!!data.j}/>
                <LV l="Davi Rcp:" v={data.d||"--"} lw={65}/>
                <LV l="Welder Rcp:" v={data.w||"--"} lw={65}/>
                <LV l="Ronzani Rcp:" v={data.r||"--"} lw={65}/>
              </div>
            </div>;
          })}
        </Panel>
      </div>
    </div>
  </>);
}

// =============================================================================
// 3. RECIPE QUEUE
// =============================================================================
function S_Queue(){
  const slots=[];for(let i=0;i<20;i++){if(i<2)slots.push({i,s:"CONSUMED",b:`STE-00${40+i}`,t:"03/19 12:0"+i});else if(i<5)slots.push({i,s:"RUNNING",b:`STE-00${44+i}`,t:"03/19 13:1"+i});else if(i<13)slots.push({i,s:"LOADED",b:`STE-00${48+i}`,t:"03/19 14:0"+i});else slots.push({i,s:"EMPTY",b:"",t:""});}
  const sc={EMPTY:T.dimColor,LOADED:T.accQueue,RUNNING:T.accStation,CONSUMED:T.labelColor};
  return (<><div style={{display:"flex",gap:10,marginBottom:10}}><StatCard label="Empty" value="87" accent={T.dimColor}/><StatCard label="Loaded" value="8" accent={T.accQueue}/><StatCard label="Running" value="3" accent={T.accStation}/><StatCard label="Consumed" value="2" accent={T.labelColor}/><StatCard label="Received" value="49"/><StatCard label="Completed" value="47"/></div>
  <Panel title="gRecipeQueue[0..99]" accent={T.accQueue} badge="LOCAL"><div style={{fontSize:11}}><div style={{display:"flex",borderBottom:`1px solid ${T.panelBorder}`,paddingBottom:3,marginBottom:2}}>{["Slot","Status","BatchID","Timestamp","COE","Trumpf","A006"].map((h,i)=><div key={i} style={{width:[35,80,150,110,50,90,60][i],color:T.labelColor,fontSize:10,fontWeight:"bold"}}>{h}</div>)}</div>{slots.map(s=><div key={s.i} style={{display:"flex",padding:"2px 0",borderBottom:`1px solid ${T.panelBorder}15`,background:s.s==="RUNNING"?"#1A2A1A":"transparent"}}><div style={{width:35,color:T.dimColor}}>{s.i}</div><div style={{width:80,color:sc[s.s],fontWeight:"bold"}}>{s.s}</div><div style={{width:150,color:T.valueColor,fontFamily:"Consolas,monospace"}}>{s.b||"--"}</div><div style={{width:110,color:T.dimColor,fontSize:10}}>{s.t||"--"}</div>{s.s!=="EMPTY"?[12,"TL-S1-001","R-STD"].map((v,i)=><div key={i} style={{width:[50,90,60][i],color:T.valueColor,fontSize:10}}>{v}</div>):[0,0,0].map((_,i)=><div key={i} style={{width:[50,90,60][i],color:T.dimColor,fontSize:10}}>--</div>)}</div>)}</div></Panel></>);
}

// =============================================================================
// 4. JOB TIMING (Option C: 6 full + 6 summary)
// =============================================================================
function S_Timing(){
  const full=[{s:0,st:1,j:"STE-0047",sh:3,tot:42.1,g:12.3,se:0,ro:0,da:0,fa:1.2,pa:0.8,fc:1,cp:false},{s:1,st:1,j:"STE-0048",sh:2,tot:18.7,g:6.1,se:0,ro:0,da:0,fa:0,pa:0,fc:0,cp:false},{s:2,st:2,j:"STE-0044",sh:3,tot:127.4,g:42.1,se:31.2,ro:8.4,da:6.1,fa:3.8,pa:4.5,fc:2,cp:true},{s:3,st:1,j:"STE-0045",sh:4,tot:88.3,g:28.4,se:15.3,ro:0,da:0,fa:.5,pa:2.1,fc:1,cp:false},{s:4,st:1,j:"STE-0046",sh:3,tot:65.2,g:21.7,se:0,ro:0,da:0,fa:0,pa:1.3,fc:0,cp:false},{s:5,st:1,j:"STE-0049",sh:1,tot:3.2,g:3.2,se:0,ro:0,da:0,fa:0,pa:0,fc:0,cp:false}];
  const sL={0:"EMPTY",1:"ACTIVE",2:"COMPLETE"};const sC={0:T.dimColor,1:T.indGreen,2:T.accPaapri};
  return (<><div style={{display:"flex",gap:10,marginBottom:10}}><StatCard label="Active" value={full.filter(t=>t.st===1).length} accent={T.indGreen} sub="of 12"/><StatCard label="Complete" value={full.filter(t=>t.st===2).length} accent={T.accPaapri}/><StatCard label="Empty" value="7" accent={T.dimColor}/></div>
  <Panel title="JobTimers[0..5] -- Full Detail" accent={T.accTiming} badge="OPC 24x6=144">{full.map(t=><div key={t.s} style={{display:"flex",gap:8,padding:"5px 0",borderBottom:`1px solid ${T.panelBorder}33`}}><div style={{width:120,flexShrink:0}}><div style={{display:"flex",alignItems:"center",gap:5,marginBottom:2}}><span style={{fontSize:11,color:T.dimColor,fontWeight:"bold"}}>Slot {t.s}</span><span style={{fontSize:10,fontWeight:"bold",color:sC[t.st]}}>{sL[t.st]}</span>{t.cp&&<Ind on color="amber" size={10}/>}</div><div style={{fontSize:12,color:T.valueColor,fontWeight:"bold",fontFamily:"Consolas,monospace"}}>{t.j}</div><div style={{fontSize:10,color:T.dimColor,marginTop:2}}>{t.sh}sh | {t.fc}flt</div></div><div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:"2px 4px",flex:1,fontSize:10}}>{[["Tot",t.tot],["Gntry",t.g],["Seamr",t.se],["Ronz",t.ro],["DAVI",t.da],["Fault",t.fa],["Pause",t.pa]].map(([l,v])=><div key={l} style={{display:"flex",justifyContent:"space-between",padding:"1px 3px",background:T.fieldBg,border:`1px solid ${T.fieldBorder}`}}><span style={{color:T.labelColor}}>{l}</span><span style={{color:v>0?T.valueColor:T.dimColor,fontWeight:v>0?"bold":"normal"}}>{v.toFixed(1)}</span></div>)}</div></div>)}</Panel>
  <div style={{marginTop:10}}><Panel title="JobTimers[6..11] -- Summary" accent={T.accConfig} badge="OPC 2x6=12"><div style={{display:"flex",gap:10}}>{[6,7,8,9,10,11].map(s=><div key={s} style={{flex:1,background:T.fieldBg,border:`1px solid ${T.fieldBorder}`,padding:"8px 10px",textAlign:"center"}}><div style={{fontSize:10,color:T.dimColor}}>Slot {s}</div><div style={{fontSize:11,fontWeight:"bold",color:T.dimColor,marginTop:2}}>EMPTY</div></div>)}</div></Panel></div></>);
}

// =============================================================================
// 5. SYSTEM (MES + DB + Config merged)
// =============================================================================
function S_System({tick}){
  return (<><div style={{display:"flex",gap:10}}>
    {/* MES Comm */}
    <div style={{flex:1}}><Panel title="MES Communication" accent={T.accMES}>
      <div style={{display:"flex",gap:6}}><div style={{flex:1}}><Lbl>Inbound</Lbl><NumText num={0} text="Idle"/></div><div style={{flex:1}}><Lbl>Outbound</Lbl><NumText num={0} text="Idle"/></div></div>
      <div style={{display:"flex",gap:12}}><BoolInd on={false} color="amber" label="Busy"/><BoolInd on={false} color="red" label="Overflow"/></div>
      <div style={{borderTop:`1px solid ${T.panelBorder}`,paddingTop:4,marginTop:2}}><BoolInd on={false} label="BatchComplete"/><div style={{display:"flex",gap:8,marginTop:4}}><LV l="NJC:" v="0" lw={30} bold/><LV l="BCID:" v="STE-2026-0047" lw={35}/></div></div>
      <div style={{borderTop:`1px solid ${T.panelBorder}`,paddingTop:4,marginTop:2}}><div style={{display:"flex",gap:12}}><span style={{fontSize:12,fontWeight:"bold",color:T.valueColor}}>HB</span><div style={{display:"flex",alignItems:"center",gap:4}}><Ind on={tick%2===0} color="green"/><Lbl>Out</Lbl></div><div style={{display:"flex",alignItems:"center",gap:4}}><Ind on={tick%2!==0} color="green"/><Lbl>In</Lbl></div><BoolInd on label="Online"/></div></div>
      <div style={{borderTop:`1px solid ${T.panelBorder}`,paddingTop:4,marginTop:2,display:"flex",gap:6}}><Btn text="Arm Reset" small/><Btn text="Confirm" small/></div>
    </Panel></div>
    {/* DB Comm */}
    <div style={{flex:1}}><Panel title="DB Communication" accent={T.accDB}>
      <NumText num={0} text="Idle"/>
      <div style={{display:"flex",gap:12}}><BoolInd on label="Connected"/><BoolInd on={false} color="red" label="Error"/></div>
      <div style={{display:"flex",gap:6}}>{[["Ins",47],["Upd",2],["Err",0],["Retry",0]].map(([l,v])=><div key={l} style={{display:"flex",alignItems:"center",gap:3}}><Lbl>{l}:</Lbl><Field value={v} bold align="CENTER" w={40}/></div>)}</div>
      <LV l="Last Insert:" v="03/19_14:32:07" lw={70}/>
      <div style={{borderTop:`1px solid ${T.panelBorder}`,paddingTop:4,marginTop:2}}>{[["Host","127.0.0.1"],["Port","3306"],["DB","mpc_production"],["User","mpc_logger"]].map(([l,v])=><LV key={l} l={l+":"} v={v} lw={40}/>)}</div>
    </Panel></div>
    {/* Config */}
    <div style={{flex:1}}><Panel title="Configuration" accent={T.accConfig}>
      <div style={{fontSize:11,color:T.labelColor,fontWeight:"bold",marginBottom:2}}>OPC UA</div>
      {[["Endpoint","opc.tcp://192.168.1.10:4840"],["Program","EP107116_GantryLine"],["Rate","100ms"]].map(([l,v])=><LV key={l} l={l+":"} v={v} lw={60} mono/>)}
      <div style={{fontSize:11,color:T.labelColor,fontWeight:"bold",marginTop:6,marginBottom:2}}>Runtime</div>
      {[["CODESYS","V3.5 SP17 P3"],["Controller","Win V3 x64"],["Main Task","20ms"],["Recipe","500ms"]].map(([l,v])=><LV key={l} l={l+":"} v={v} lw={65} mono/>)}
      <div style={{borderTop:`1px solid ${T.panelBorder}`,paddingTop:4,marginTop:6}}><div style={{display:"flex",gap:10}}><div><div style={{fontSize:10,color:T.labelColor}}>OPC Budget</div><div style={{fontSize:18,fontWeight:"bold",color:T.accPaapri}}>510/600</div></div></div></div>
    </Panel></div>
  </div>
  {/* Bottom row: queue summary + last batch */}
  <div style={{display:"flex",gap:10,marginTop:10}}>
    <div style={{flex:1}}><Panel title="Recipe Queue Summary" accent={T.accQueue}><div style={{display:"flex",gap:6}}>{[["E",87],["L",8],["R",3],["C",2]].map(([l,v])=><div key={l} style={{flex:1,textAlign:"center"}}><Lbl>{l}</Lbl><div style={{marginTop:2}}><Field value={v} bold align="CENTER" size={14}/></div></div>)}</div><div style={{display:"flex",gap:6,marginTop:4}}>{[["Recv",49],["Done",47],["Orph",0]].map(([l,v])=><div key={l} style={{display:"flex",alignItems:"center",gap:3}}><Lbl>{l}:</Lbl><Field value={v} bold align="CENTER" w={45}/></div>)}</div></Panel></div>
    <div style={{flex:1}}><Panel title="Paapri Outbound" accent={T.accPaapri}><div style={{display:"flex",gap:8}}><LV l="NJC:" v="0" lw={30} bold/><LV l="BID:" v="STE-2026-0047" lw={30} mono/></div><LV l="Timestamp:" v="03/19/2026_14:32:07" lw={70}/></Panel></div>
    <div style={{flex:1}}><Panel title="Last Logged Batch" accent={T.accConfig}><div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"3px 8px"}}>{[["Total",127.4],["Gntry",42.1],["Seamr",31.2],["Ronz",8.4],["DAVI",6.1],["Fault",3.8]].map(([l,v])=><div key={l} style={{display:"flex",alignItems:"center",gap:2}}><span style={{width:38,fontSize:10,color:T.labelColor,textAlign:"right"}}>{l}:</span><Field value={v.toFixed(1)} w={48} align="RIGHT" size={11}/></div>)}</div></Panel></div>
  </div></>);
}

// =============================================================================
// 6. RECIPE HISTORY (full variable drill-down per screenshot)
// =============================================================================
function S_RecipeHistory(){
  const [selIdx,setSelIdx]=useState(0);
  const [selSheet,setSelSheet]=useState(1);
  const jobs=["STE-2026-0047","STE-2026-0046","STE-2026-0045","STE-2026-0044","STE-2026-0043","","","","","",""];
  // Simulated sheet data
  const sheetInfo={startLoc:"COE Table 1",startID:"ID-A1-2026",laserReq:"Yes",laserSide:"Outside",laserInner:"No",coeRcp:12,trumpfRcp:"TL-S1-001"};
  const origPart={pn:"PT-2026-A1",len:2440.0,wid:1220.5,thk:12.7,wgt:285.3,off:0.0,dest:"Buffer",fid:"FID-001"};
  const laserParts=[1,2,3,4,5].map(n=>n<=2?{pn:`PT-2026-A1-L${n}`,len:1220.0,wid:610.2,thk:12.7,wgt:71.3,off:n*610,dest:n===1?"Seamer":"Stage",fid:`FID-L${n}`}:{pn:"",len:0,wid:0,thk:0,wgt:0,off:0,dest:"",fid:""});

  const PF=({l,v,alert})=>(<div style={{display:"flex",gap:4,padding:"1px 0"}}><span style={{width:55,fontSize:10,color:T.labelColor,textAlign:"right",flexShrink:0}}>{l}:</span><span style={{fontSize:10,color:alert?T.alarmText:v&&v!=="0"&&v!=="0.0"?T.valueColor:T.dimColor,fontFamily:"Consolas,monospace"}}>{v||"--"}</span></div>);

  return (<><div style={{display:"flex",gap:10}}>
    {/* Job selector */}
    <div style={{width:190,flexShrink:0}}>
      <Panel title="Job Number Selection" accent={T.accHist}>
        <div style={{maxHeight:460,overflow:"auto"}}>{jobs.map((j,i)=><div key={i} onClick={()=>setSelIdx(i)} style={{padding:"4px 6px",cursor:"pointer",background:selIdx===i?"#1A2A3A":"transparent",borderLeft:selIdx===i?`3px solid ${T.accHist}`:"3px solid transparent",borderBottom:`1px solid ${T.panelBorder}18`}}><span style={{fontSize:10,color:T.dimColor,marginRight:6}}>{i}</span><span style={{fontSize:11,color:j?T.valueColor:T.dimColor,fontFamily:j?"Consolas,monospace":font}}>{j||"(empty)"}</span></div>)}</div>
        <div style={{marginTop:6}}><Btn text="Load History"/></div>
      </Panel>
    </div>

    {/* Right: Batch + Sheet tabs + Parts */}
    <div style={{flex:1}}>
      {/* Batch row */}
      <Panel title="Batch" accent={T.accHist}>
        <div style={{display:"flex",gap:10}}><LV l="Job Number:" v="STE-2026-0047" lw={80} bold mono/><LV l="(Ronzani) Planisher:" v="R1-STD-25" lw={130}/><LV l="(DAVI) Roller:" v="DAVI-12MM" lw={90}/><LV l="(Ronzani) Final Grind:" v="R1-GRIND" lw={140}/></div>
      </Panel>

      {/* Sheet tabs */}
      <div style={{display:"flex",gap:2,marginTop:8}}>{[1,2,3,4,5].map(n=><Btn key={n} text={`Sheet ${n}`} active={selSheet===n} onClick={()=>setSelSheet(n)}/>)}</div>

      <div style={{display:"flex",gap:10,marginTop:6}}>
        {/* Sheet info sidebar */}
        <div style={{width:160,flexShrink:0}}>
          <Panel title={`Sheet ${selSheet}`} accent={T.accHist}>
            <PF l="Start Loc" v={sheetInfo.startLoc}/><PF l="Start ID" v={sheetInfo.startID}/><PF l="Laser Req" v={sheetInfo.laserReq}/><PF l="Laser Side" v={sheetInfo.laserSide}/><PF l="Inner Side" v={sheetInfo.laserInner}/><PF l="COE Rcp" v={String(sheetInfo.coeRcp)}/><PF l="Trumpf Rcp" v={sheetInfo.trumpfRcp}/>
          </Panel>
        </div>

        {/* Parts grid */}
        <div style={{flex:1}}>
          <div style={{display:"flex",gap:6}}>
            {/* Original Part */}
            <div style={{flex:1}}><Panel title={`Sheet ${selSheet} Original Part`} accent={T.accConfig}>
              <PF l="Part#" v={origPart.pn}/><PF l="Length" v={origPart.len.toFixed(1)}/><PF l="Width" v={origPart.wid.toFixed(1)}/><PF l="Thick" v={origPart.thk.toFixed(1)}/><PF l="Weight" v={origPart.wgt.toFixed(1)}/><PF l="Offset" v={origPart.off.toFixed(1)}/><PF l="Dest" v={origPart.dest}/><PF l="Final ID" v={origPart.fid}/>
            </Panel></div>
            {/* Laser Cut Parts 1-5 */}
            {laserParts.map((p,i)=><div key={i} style={{flex:1}}><Panel title={`Laser Cut Part ${i+1}`} accent={p.pn?T.accTiming:T.accConfig}>
              <PF l="Part#" v={p.pn} alert={p.pn&&p.wid===0}/><PF l="Length" v={p.len?p.len.toFixed(1):""}/><PF l="Width" v={p.wid?p.wid.toFixed(1):""}/><PF l="Thick" v={p.thk?p.thk.toFixed(1):""}/><PF l="Weight" v={p.wgt?p.wgt.toFixed(1):""}/><PF l="Offset" v={p.off?p.off.toFixed(1):""}/><PF l="Dest" v={p.dest}/><PF l="Final ID" v={p.fid}/>
            </Panel></div>)}
          </div>
        </div>
      </div>
    </div>
  </div></>);
}

// =============================================================================
// 7. DB HISTORY / OEE
// =============================================================================
function S_OEE(){
  const [range,setRange]=useState("today");
  return (<>
    <div style={{display:"flex",gap:8,marginBottom:10}}><Btn text="Today" active={range==="today"} onClick={()=>setRange("today")}/><Btn text="This Week" active={range==="week"} onClick={()=>setRange("week")}/><Btn text="Last 30 Days" active={range==="30d"} onClick={()=>setRange("30d")}/><Btn text="Refresh"/></div>
    <div style={{display:"flex",gap:10,marginBottom:10}}>
      <StatCard label="Batches Completed" value="47" accent={T.indGreen}/><StatCard label="Batches Aborted" value="1" alert/><StatCard label="Completion Rate" value="97.9%" accent={T.indGreen}/><StatCard label="Avg Cycle (min)" value="108.4" accent={T.accTiming}/><StatCard label="Throughput/hr" value="3.2" accent={T.accDash}/><StatCard label="Total Faults" value="8" accent={T.alarmText}/>
    </div>
    <div style={{display:"flex",gap:10}}>
      <div style={{flex:1}}>
        <Panel title="Daily Batch Count" accent={T.accOEE}>
          <div style={{display:"flex",alignItems:"flex-end",gap:3,height:120,padding:"0 4px"}}>
            {[{d:"Mon",v:42},{d:"Tue",v:48},{d:"Wed",v:47},{d:"Thu",v:0},{d:"Fri",v:0}].map(b=><div key={b.d} style={{flex:1,textAlign:"center"}}><div style={{background:b.v>0?T.accDash:T.fieldBorder,height:b.v>0?(b.v/50)*100:2,transition:"height 0.3s"}}></div><div style={{fontSize:9,color:T.dimColor,marginTop:3}}>{b.d}</div><div style={{fontSize:10,color:b.v>0?T.valueColor:T.dimColor,fontWeight:"bold"}}>{b.v||"--"}</div></div>)}
          </div>
        </Panel>
      </div>
      <div style={{flex:1}}>
        <Panel title="Fault Breakdown" accent={T.accAlarm}>
          <div style={{display:"flex",flexDirection:"column",gap:4}}>
            {[["E-Stop",3],["Sensor Timeout",2],["Material Jam",2],["Communication",1]].map(([l,v])=><div key={l} style={{display:"flex",alignItems:"center",gap:8}}><span style={{width:110,fontSize:11,color:T.labelColor}}>{l}</span><div style={{flex:1,height:16,background:T.fieldBg,border:`1px solid ${T.fieldBorder}`}}><div style={{height:"100%",width:`${(v/3)*100}%`,background:T.alarmFrame}}/></div><span style={{fontSize:11,color:T.valueColor,fontWeight:"bold",width:20,textAlign:"right"}}>{v}</span></div>)}
          </div>
        </Panel>
      </div>
      <div style={{flex:1}}>
        <Panel title="Avg Time by Station (min)" accent={T.accTiming}>
          {[["Gantry",38.2],["COE/Trumpf",24.8],["Seamer",28.4],["Ronzani",7.2],["DAVI",5.8],["Inspect",1.1]].map(([l,v])=><div key={l} style={{display:"flex",alignItems:"center",gap:6}}><span style={{width:75,fontSize:11,color:T.labelColor,textAlign:"right"}}>{l}</span><div style={{flex:1,height:14,background:T.fieldBg,border:`1px solid ${T.fieldBorder}`}}><div style={{height:"100%",width:`${(v/40)*100}%`,background:T.accTiming}}/></div><span style={{fontSize:10,color:T.valueColor,width:30,textAlign:"right"}}>{v}</span></div>)}
        </Panel>
      </div>
    </div>
    <div style={{marginTop:10}}>
      <Panel title="Recent Completions" accent={T.accDB}>
        <div style={{fontSize:11}}><div style={{display:"flex",borderBottom:`1px solid ${T.panelBorder}`,paddingBottom:3,marginBottom:2}}>{["ID","BatchID","Timestamp","Status","Sheets","Total","Faults"].map((h,i)=><div key={i} style={{width:[35,150,100,80,45,70,45][i],color:T.labelColor,fontSize:10,fontWeight:"bold",textAlign:i>3?"right":"left"}}>{h}</div>)}</div>
        {[{id:47,b:"STE-2026-0047",t:"03/19 14:32",s:"COMPLETE",sh:3,tot:127.4,f:2},{id:46,b:"STE-2026-0046",t:"03/19 14:28",s:"COMPLETE",sh:3,tot:115.8,f:0},{id:45,b:"STE-2026-0045",t:"03/19 14:15",s:"COMPLETE",sh:4,tot:142.1,f:1},{id:44,b:"STE-2026-0044",t:"03/19 13:58",s:"COMPLETE",sh:3,tot:131.2,f:0},{id:41,b:"STE-2026-0041",t:"03/19 12:10",s:"ABORTED",sh:3,tot:95.3,f:3}].map(r=><div key={r.id} style={{display:"flex",padding:"2px 0",borderBottom:`1px solid ${T.panelBorder}15`,background:r.s==="ABORTED"?T.alarmFill:"transparent"}}><div style={{width:35,color:T.dimColor}}>{r.id}</div><div style={{width:150,color:T.valueColor,fontFamily:"Consolas,monospace"}}>{r.b}</div><div style={{width:100,color:T.dimColor,fontSize:10}}>{r.t}</div><div style={{width:80,color:r.s==="ABORTED"?T.alarmText:T.okText,fontWeight:"bold",fontSize:10}}>{r.s}</div><div style={{width:45,textAlign:"right"}}>{r.sh}</div><div style={{width:70,textAlign:"right",fontWeight:"bold"}}>{r.tot.toFixed(1)}</div><div style={{width:45,textAlign:"right",color:r.f>0?T.alarmText:T.dimColor,fontWeight:r.f>0?"bold":"normal"}}>{r.f}</div></div>)}</div>
      </Panel>
    </div>
  </>);
}

// =============================================================================
// 8. RCI MONITOR (complete per screenshot)
// =============================================================================
function S_RCI(){
  return (<>
    <div style={{display:"flex",gap:10}}>
      <div style={{flex:1}}><Panel title="Connection" accent={T.accRCI}><NumText num={0} text="Idle"/><div style={{display:"flex",gap:10,marginTop:4}}><BoolInd on={true} label="RCI Connected"/><BoolInd on={true} label="Connect Enable"/><BoolInd on={false} color="red" label="Disconnect Request"/></div><div style={{display:"flex",gap:8,marginTop:6}}><Btn text="Connect"/><Btn text="Disconnect"/></div></Panel></div>
      <div style={{flex:1}}><Panel title="Command Sequence" accent={T.accRCI}><NumText num={0} text="Idle"/><div style={{display:"flex",gap:10,marginTop:4}}><BoolInd on={false} color="amber" label="Waiting for Response"/><BoolInd on={false} label="Response Ready"/></div><LV l="Telegram:" v="" lw={65} mono/><LV l="Response:" v="" lw={65} mono/></Panel></div>
      <div style={{flex:1}}><Panel title="File IO" accent={T.accRCI}>
        <div style={{fontSize:11,color:T.labelColor,fontWeight:"bold"}}>iWrite - Telegram Writer</div>
        <NumText num={0} text="Idle"/>
        <div style={{display:"flex",gap:8,marginTop:4}}><BoolInd on={false} color="amber" label="Write Trigger"/><BoolInd on={false} label="Write Done"/><BoolInd on={false} color="red" label="Write Error"/></div>
        <div style={{display:"flex",alignItems:"center",gap:4,marginTop:2}}><Lbl>Retries (Max 3):</Lbl><Field value="0" bold align="CENTER" w={40}/></div>
        <div style={{fontSize:11,color:T.labelColor,fontWeight:"bold",marginTop:6}}>iPoll - Background Poller</div>
        <NumText num={0} text="Idle - Poll Timer"/>
        <div style={{display:"flex",gap:12,marginTop:4}}><div style={{display:"flex",alignItems:"center",gap:3}}><Lbl>Messages Rx:</Lbl><Field value="142" bold align="CENTER" w={50}/></div><div style={{display:"flex",alignItems:"center",gap:3}}><Lbl>Errors:</Lbl><Field value="0" bold align="CENTER" w={50}/></div></div>
      </Panel></div>
    </div>
    <div style={{display:"flex",gap:10,marginTop:10}}>
      <div style={{flex:1}}><Panel title="Error Reporting" accent={T.accAlarm}>
        <NumText num={0} text="OK - No Error"/>
        <div style={{display:"flex",gap:8,marginTop:4}}><LV l="Failed At:" v="0" lw={60}/><LV l="Cmd:" v="" lw={35}/></div>
        <LV l="Response:" v="" lw={65} mono/>
        <div style={{marginTop:4}}><Btn text="ACK"/></div>
      </Panel></div>
      <div style={{flex:1}}><Panel title="Last Async Message" accent={T.accRCI}>
        <LV l="Type:" v="" lw={40}/>
        <LV l="Raw Telegram:" v="" lw={90} mono/>
        <div style={{marginTop:6}}><BoolInd on={false} label="A003Execute (OPC trigger)"/></div>
      </Panel>
      <div style={{marginTop:8}}>
        <Panel title="Async Machine Flags" accent={T.accConfig}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:4}}>
            {["Machine Running","Machine Stopped","NC Prog Started","NC Prog Ended","NC Prog Reset","Prod Plan Changed","Pallet Chgr Pos","Pallet Situation","Current Alarms","Feedrate","NC User Message","Machine Message","Server Connect","Server Disconnect"].map(f=><BoolInd key={f} on={false} label={f}/>)}
          </div>
        </Panel>
      </div></div>
      <div style={{flex:1}}><Panel title="Configuration" accent={T.accConfig}>
        {[["Shared Dir","C:\\tempRCI\\"],["MPC Data","C:\\tempRCI\\T1.dat"],["MPC Write Sem","C:\\tempRCI\\T1.wr"],["MPC Read Sem","C:\\tempRCI\\T1.rd"],["Trumpf Data","C:\\tempRCI\\T2.dat"],["Trumpf Write Sem","C:\\tempRCI\\T2.wr"],["Trumpf Read Sem","C:\\tempRCI\\T2.rd"]].map(([l,v])=><LV key={l} l={l+":"} v={v} lw={100} mono/>)}
        <div style={{marginTop:4}}><BoolInd on={true} label="Paths Initialized"/></div>
      </Panel></div>
    </div>
  </>);
}

// =============================================================================
// 9. ALARMS
// =============================================================================
function S_Alarms(){
  const evts=[{t:"03/19 14:31",s:"HIGH",r:"DBcomm",m:"Max retries -- STE-0041",a:false},{t:"03/19 14:28",s:"HIGH",r:"MEScomm",m:"Overflow -- Paapri not reset",a:false},{t:"03/19 13:45",s:"MED",r:"MEScomm",m:"HB timeout 5s",a:true},{t:"03/19 12:22",s:"LOW",r:"Queue",m:"Orphan -- STE-0039",a:true},{t:"03/19 11:05",s:"INFO",r:"DBcomm",m:"MySQL connected",a:true},{t:"03/19 11:05",s:"INFO",r:"System",m:"Application started -- 20ms",a:true},{t:"03/18 16:44",s:"HIGH",r:"MEScomm",m:"R_TRIG deadlock 847s",a:true}];
  const sc={HIGH:T.alarmText,MED:T.warnText,LOW:T.accPaapri,INFO:T.labelColor};const sb={HIGH:T.alarmFill,MED:T.warnFill,LOW:"transparent",INFO:"transparent"};
  return (<><div style={{display:"flex",gap:10,marginBottom:10}}><StatCard label="Unacked" value="2" alert/><StatCard label="High" value="2" alert/><StatCard label="Med" value="0" accent={T.warnText}/><StatCard label="Total" value={evts.length}/><div style={{display:"flex",gap:6,alignItems:"center"}}><Btn text="ACK All"/><Btn text="Clear Acked"/></div></div>
  <Panel title="Alarm / Event Log" accent={T.accAlarm}>{evts.map((e,i)=><div key={i} style={{display:"flex",padding:"3px 0",borderBottom:`1px solid ${T.panelBorder}22`,background:sb[e.s]}}><div style={{width:90,fontSize:10,color:T.dimColor,fontFamily:"Consolas,monospace"}}>{e.t}</div><div style={{width:42,fontSize:10,fontWeight:"bold",color:sc[e.s]}}>{e.s}</div><div style={{width:80,fontSize:10,color:T.labelColor}}>{e.r}</div><div style={{flex:1,fontSize:10,color:e.s==="HIGH"?T.alarmText:T.valueColor}}>{e.m}</div><div style={{width:35,textAlign:"center"}}>{e.a?<span style={{fontSize:9,color:T.dimColor}}>ACK</span>:<Ind on color="red" size={10}/>}</div></div>)}</Panel></>);
}

// =============================================================================
// NAV + APP SHELL (1920x1080)
// =============================================================================
const SCREENS=[{id:"dash",label:"Overview",accent:T.accDash},{id:"prod",label:"Production",accent:T.accProd},{id:"queue",label:"Recipe Queue",accent:T.accQueue},{id:"timing",label:"Job Timing",accent:T.accTiming},{id:"system",label:"System",accent:T.accMES},{id:"history",label:"Recipe History",accent:T.accHist},{id:"oee",label:"DB History / OEE",accent:T.accOEE},{id:"rci",label:"RCI Monitor",accent:T.accRCI},{id:"alarms",label:"Alarms",accent:T.accAlarm}];

export default function MPCHMI(){
  const[screen,setScreen]=useState("dash");
  const[tick,setTick]=useState(0);
  useEffect(()=>{const iv=setInterval(()=>setTick(t=>t+1),1000);return()=>clearInterval(iv);},[]);
  const cur=SCREENS.find(s=>s.id===screen);
  const render=()=>{switch(screen){case"dash":return <S_Overview tick={tick}/>;case"prod":return <S_Production/>;case"queue":return <S_Queue/>;case"timing":return <S_Timing/>;case"system":return <S_System tick={tick}/>;case"history":return <S_RecipeHistory/>;case"oee":return <S_OEE/>;case"rci":return <S_RCI/>;case"alarms":return <S_Alarms/>;default:return null;}};
  return(
    <div style={{width:1920,height:1080,background:T.mainBg,fontFamily:font,display:"flex",flexDirection:"column",overflow:"hidden",margin:"0 auto"}}>
      <div style={{display:"flex",flex:1}}>
        <div style={{width:185,background:T.navBg,borderRight:`1px solid ${T.panelBorder}`,display:"flex",flexDirection:"column",flexShrink:0}}>
          <div style={{height:62,display:"flex",alignItems:"center",justifyContent:"center",borderBottom:`1px solid ${T.panelBorder}`}}><div style={{textAlign:"center"}}><div style={{fontSize:20,fontWeight:"bold",color:T.accDash,letterSpacing:2}}>MWES</div><div style={{fontSize:9,color:T.dimColor,marginTop:1}}>EP109307 MPC</div></div></div>
          {SCREENS.map(s=><div key={s.id} onClick={()=>setScreen(s.id)} style={{padding:"11px 12px",cursor:"pointer",background:screen===s.id?T.panelBg:"transparent",borderLeft:screen===s.id?`3px solid ${s.accent}`:"3px solid transparent",borderBottom:`1px solid ${T.panelBorder}22`}}><span style={{fontSize:12,color:screen===s.id?T.valueColor:T.labelColor,fontWeight:screen===s.id?"bold":"normal"}}>{s.label}</span></div>)}
          <div style={{marginTop:"auto",padding:"10px 12px",borderTop:`1px solid ${T.panelBorder}`,fontSize:9,color:T.dimColor}}>510/600 OPC<br/>Foundry Dark v1.0</div>
        </div>
        <div style={{width:1660,display:"flex",flexDirection:"column",flexShrink:0}}>
          <div style={{height:36,padding:"0 14px",display:"flex",alignItems:"center",justifyContent:"space-between",borderBottom:`1px solid ${T.panelBorder}`,background:T.canvas,flexShrink:0}}>
            <div style={{display:"flex",alignItems:"baseline",gap:12}}><span style={{fontSize:15,fontWeight:"bold",color:T.titleColor}}>{cur.label}</span><span style={{fontSize:11,color:T.dimColor}}>STE / Paapri MES Integration</span></div>
            <div style={{display:"flex",alignItems:"center",gap:12}}><BoolInd on label="MES"/><BoolInd on label="DB"/></div>
          </div>
          <div style={{flex:1,overflow:"auto",padding:10,background:T.canvas}}>{render()}</div>
        </div>
        <div style={{flex:1,background:T.mainBg}}/>
      </div>
      <div style={{height:32,background:T.statusBar,borderTop:`1px solid ${T.panelBorder}`,display:"flex",alignItems:"center",padding:"0 14px",flexShrink:0}}>
        <span style={{width:140,fontSize:10,color:T.labelColor,fontFamily:"Consolas,monospace"}}>03/23/2026 09:14</span>
        <div style={{flex:1,fontSize:10,color:T.valueColor,paddingLeft:20}}>System OK</div>
        <span style={{fontSize:10,color:T.dimColor}}>1920x1080 | Frame 1660x900 | 9 screens</span>
      </div>
    </div>
  );
}
