"use client";

import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import NextImage from "next/image";
import { CSSProperties, useEffect, useRef, useState } from "react";
import SiteFooter from "../components/SiteFooter";
import SiteHeader from "../components/SiteHeader";
import styles from "./commercial.module.css";

function Image(props: React.ComponentProps<typeof NextImage>) { return <NextImage {...props} unoptimized />; }
function Fade({ children, className="" }: { children:React.ReactNode; className?:string }) { return <motion.div className={className} initial={{opacity:0,y:18}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.12}} transition={{duration:.72,ease:[.22,1,.36,1]}}>{children}</motion.div>; }
function Stars({ score }: { score:number }) { return <span className={styles.stars} aria-label={`${score} out of 5`}>{"★".repeat(score)}<i>{"☆".repeat(5-score)}</i></span>; }
function Sprite({ frame, className="", label }: { frame:number; className?:string; label:string }) { return <div className={`${styles.sprite} ${className}`} role="img" aria-label={label} style={{backgroundPosition:`${frame*16.6667}% center`} as CSSProperties}/>; }

const environments = [
  {name:"Executive Office",objective:"Executive Privacy",copy:"A focused setting for leadership, private conversations and controlled daylight.",system:"Smart Film + Screen Roller Shades",frame:0},
  {name:"Open Workspace",objective:"Daylight Comfort",copy:"Balanced glare control and thermal comfort without disconnecting teams from the view.",system:"Motorized Screen Shades",frame:6},
  {name:"Medical Office",objective:"Patient Discretion",copy:"Calm, hygienic privacy that preserves natural light and a reassuring atmosphere.",system:"Smart Film + Cellular Shades",frame:3},
  {name:"Conference Room",objective:"Confidential Meetings",copy:"Instant privacy and precise daylight control for important decisions.",system:"Smart Film + Motorized Screen Shades",frame:0},
  {name:"Reception / Lobby",objective:"First Impression",copy:"A refined arrival experience shaped by material warmth and architectural clarity.",system:"Custom Drapery + Screen Shades",frame:1},
  {name:"Restaurant",objective:"Guest Experience",copy:"Layered daylight, evening intimacy and softness that elevates hospitality.",system:"Ripple Fold Drapery + Screen Shades",frame:2},
  {name:"Hotel Suite",objective:"Rest & Comfort",copy:"Quiet, darkness and intuitive control designed around the guest experience.",system:"Blackout Shades + Custom Drapery",frame:1},
  {name:"Retail Store",objective:"Merchandise Presentation",copy:"Glare and heat control that protects displays while preserving storefront transparency.",system:"Screen Roller Shades + Smart Film",frame:4},
];

const recommendations = [
  {name:"Conference Room",headline:"Designed for confident conversations.",copy:"Control privacy without compromising natural light. Create the ideal environment for every important decision.",ratings:[["Smart Film",5],["Screen Roller Shades",5],["Drapery",2],["Cellular Shades",1]],best:"Smart Film + Motorized Screen Shades",frame:0},
  {name:"Lobby",headline:"A first impression that performs.",copy:"Welcome guests with natural light, visual warmth and glare control integrated quietly into the architecture.",ratings:[["Custom Drapery",5],["Screen Roller Shades",4],["Smart Film",3],["Cellular Shades",2]],best:"Ripple Fold Drapery + Screen Shades",frame:1},
  {name:"Executive Office",headline:"Privacy for decisive work.",copy:"Protect sensitive conversations while maintaining a calm, open and executive environment throughout the day.",ratings:[["Smart Film",5],["Screen Roller Shades",5],["Drapery",3],["Cellular Shades",2]],best:"Smart Film + Motorized Screen Shades",frame:0},
  {name:"Restaurant",headline:"Atmosphere becomes part of the experience.",copy:"Shape daylight, views and evening intimacy with a layered solution designed around hospitality.",ratings:[["Custom Drapery",5],["Screen Roller Shades",5],["Smart Film",3],["Cellular Shades",1]],best:"Ripple Fold Drapery + Screen Shades",frame:2},
  {name:"Hotel Suite",headline:"Comfort guests remember.",copy:"Create effortless privacy, darkness and acoustic softness in a suite designed for genuine rest.",ratings:[["Blackout Roller Shades",5],["Custom Drapery",5],["Cellular Shades",4],["Smart Film",2]],best:"Blackout Shades + Full-Height Drapery",frame:1},
  {name:"Retail Store",headline:"Presentation without compromise.",copy:"Protect merchandise and control heat while keeping the storefront bright, open and visually precise.",ratings:[["Screen Roller Shades",5],["Smart Film",4],["Custom Drapery",2],["Cellular Shades",1]],best:"Screen Roller Shades + Smart Film",frame:4},
  {name:"Healthcare",headline:"Privacy that still feels human.",copy:"Support patient dignity with clean, calm systems that preserve daylight and simplify everyday use.",ratings:[["Smart Film",5],["Cellular Shades",4],["Roller Shades",4],["Drapery",2]],best:"Smart Film + Light-Filtering Cellular Shades",frame:3},
];

const performance = [
  {name:"Privacy",copy:"Protect confidential conversations without closing spaces off from daylight.",score:5,frame:0},
  {name:"Comfort",copy:"Create stable, calm environments that support people throughout the day.",score:5,frame:5},
  {name:"Brand Experience",copy:"Use light, texture and atmosphere to reinforce how a business is perceived.",score:5,frame:1},
  {name:"Energy Efficiency",copy:"Reduce solar heat gain across large areas of high-performance glazing.",score:4,frame:4},
  {name:"Natural Daylight",copy:"Control glare while preserving views and the benefits of natural light.",score:5,frame:6},
];

const annotations = [
  {name:"Conference Room",objective:"Meeting Privacy",solution:"Smart Film",x:17,y:56},
  {name:"Executive Office",objective:"Executive Privacy",solution:"Smart Film + Screen Shades",x:37,y:50},
  {name:"Open Workspace",objective:"Daylight Comfort",solution:"Screen Roller Shades",x:55,y:61},
  {name:"Restaurant",objective:"Guest Experience",solution:"Ripple Fold Drapery + Screen Shades",x:72,y:47},
  {name:"Reception",objective:"First Impression",solution:"Custom Drapery",x:88,y:65},
];

const challenges = [
  ["Meeting Privacy","Keep conversations private and secure."],["Screen Reflection","Reduce glare on screens and work surfaces."],["Guest Comfort","Create comfortable, refined environments."],["Energy Costs","Minimize heat gain and unnecessary energy use."],["Large Glass Facades","Control light without compromising architecture."],["Employee Wellbeing","Support focus, wellness and productivity."],
];
const industries = ["Corporate Offices","Luxury Hotels","Restaurants","Healthcare","Retail","Multifamily Developments","Education"];
const projects = [["Brickell Law Firm","Miami, FL",0],["Luxury Hotel Miami","Downtown Miami",1],["Executive Headquarters","Coral Gables, FL",5],["Waterfront Restaurant","Miami Beach, FL",2],["Private Medical Center","Boca Raton, FL",3]] as const;
const process = [["Understand","We learn the objectives, people, architecture and operational requirements."],["Design","We develop the right combination of light control, privacy and material solutions."],["Coordinate","We align specifications, measurements, electrical requirements and project teams."],["Fabricate","We produce each system with precision, appropriate materials and quality control."],["Install","Our team completes a clean, accurate and professionally managed installation."],["Support","We remain available for programming, guidance, adjustments and continued service."]];

export default function CommercialPage(){
  const [building,setBuilding]=useState(3);
  const [recommendation,setRecommendation]=useState(0);
  const [performanceActive,setPerformanceActive]=useState(0);
  const [pinned,setPinned]=useState<number|null>(null);
  const [hovered,setHovered]=useState<number|null>(null);
  const purposeRef=useRef<HTMLDivElement>(null);
  const {scrollY}=useScroll();
  const heroY=useTransform(scrollY,[0,650],[0,42]);
  const activeEnvironment=environments[building];
  const activeRecommendation=recommendations[recommendation];
  const visibleAnnotation=pinned??hovered;

  useEffect(()=>{
    const key=(event:KeyboardEvent)=>{if(event.key==="Escape")setPinned(null)};
    const outside=(event:PointerEvent)=>{if(purposeRef.current&&!purposeRef.current.contains(event.target as Node))setPinned(null)};
    window.addEventListener("keydown",key); window.addEventListener("pointerdown",outside);
    return()=>{window.removeEventListener("keydown",key);window.removeEventListener("pointerdown",outside)};
  },[]);

  return <main className={styles.page}>
    <SiteHeader/>
    <section className={styles.hero} id="top"><motion.div className={styles.heroMedia} style={{y:heroY}} initial={{opacity:.75,scale:1.035}} animate={{opacity:1,scale:1.01}} transition={{duration:1.5}}><Image src="/images/commercial-hero-boardroom.png" alt="Executive boardroom overlooking the Miami skyline" fill priority sizes="100vw"/></motion.div><div className={styles.heroShade}/><motion.div className={styles.heroCopy} initial={{opacity:0,y:22}} animate={{opacity:1,y:0}} transition={{duration:.9,ease:[.22,1,.36,1]}}><span className={styles.kicker}>COMMERCIAL SOLUTIONS</span><h1>Where architecture<br/>meets <em>performance.</em></h1><p>Privacy, comfort, automation and architectural precision designed for workplaces, hospitality and commercial environments.</p><div className={styles.buttonRow}><a className="button button-gold" href="mailto:hello@luminixshades.com">SCHEDULE A CONSULTATION</a><a className="button button-outline" href="#industries">EXPLORE INDUSTRIES</a></div></motion.div></section>

    <section className={styles.builder} id="builder"><Fade className={styles.builderIntro}><span className={styles.kicker}>BUILD YOUR</span><h2>Commercial<br/>Environment.</h2><p>Select a space to define its objective and discover the recommended solution strategy.</p></Fade><div className={styles.buildingVisual}><Image src="/images/commercial-building.png" alt="Multi-level commercial building with distinct business environments" fill sizes="(max-width:800px) 100vw, 67vw"/>{environments.map((item,index)=><button key={item.name} type="button" className={building===index?styles.hotspotActive:""} style={{left:`${[37,44,35,54,42,58,50,45][index]}%`,top:`${[19,32,45,23,68,56,10,81][index]}%`}} aria-label={`Select ${item.name}`} aria-pressed={building===index} onClick={()=>setBuilding(index)}><span/></button>)}</div><AnimatePresence mode="wait"><motion.article className={styles.builderPanel} key={activeEnvironment.name} initial={{opacity:0,x:10}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-8}} transition={{duration:.3}}><span>{activeEnvironment.name}</span><small>OBJECTIVE</small><h3>{activeEnvironment.objective}</h3><p>{activeEnvironment.copy}</p><small>RECOMMENDED SYSTEM</small><strong>{activeEnvironment.system}</strong><a href="#environment">LEARN MORE <b>→</b></a></motion.article></AnimatePresence></section>

    <section className={styles.environment} id="environment"><AnimatePresence mode="wait" initial={false}><motion.div className={styles.environmentGrid} key={activeRecommendation.name} initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:.4}}><Sprite frame={activeRecommendation.frame} className={styles.environmentImage} label={`${activeRecommendation.name} commercial interior`}/><div className={styles.environmentCopy}><span className={styles.kicker}>{activeRecommendation.name.toUpperCase()}</span><h2>{activeRecommendation.headline}</h2><p>{activeRecommendation.copy}</p><div><small>BEST COMBINATION</small><strong>{activeRecommendation.best}</strong></div></div><div className={styles.environmentRatings}><span className={styles.kicker}>RECOMMENDED SOLUTIONS</span>{activeRecommendation.ratings.map(([name,score])=><div key={name}><span>{name}</span><Stars score={score as number}/></div>)}</div></motion.div></AnimatePresence><div className={styles.environmentTabs}>{recommendations.map((item,index)=><button type="button" key={item.name} aria-pressed={recommendation===index} onClick={()=>setRecommendation(index)}>{item.name}</button>)}</div></section>

    <section className={styles.business}><Fade className={styles.businessIntro}><span className={styles.kicker}>BUSINESS PERFORMANCE</span><h2>Every decision<br/>impacts your<br/>bottom line.</h2><p>Choose an objective to explore the strategy behind it.</p></Fade><div className={styles.performanceGrid}>{performance.map((item,index)=>{const active=performanceActive===index;return <article key={item.name} className={active?styles.performanceActive:""} onMouseEnter={()=>setPerformanceActive(index)} onFocus={()=>setPerformanceActive(index)} onClick={()=>setPerformanceActive(index)} onKeyDown={(event)=>{if(event.key==="Enter"||event.key===" "){event.preventDefault();setPerformanceActive(index)}}} tabIndex={0} aria-label={`Select ${item.name} objective`} aria-pressed={active}><Sprite frame={item.frame} label={`${item.name} business objective`}/><div><span>{item.name}</span><Stars score={item.score}/><p>{item.copy}</p><a href="#purpose" onClick={(event)=>event.stopPropagation()}>EXPLORE THIS STRATEGY <b>→</b></a></div></article>})}</div></section>

    <section className={styles.purpose} id="purpose" ref={purposeRef}><div className={styles.purposeIntro}><span className={styles.kicker}>INTEGRATED STRATEGY</span><h2>Every solution<br/>has a purpose.</h2><p>Different spaces. Different objectives. One integrated strategy that makes your entire environment perform better.</p></div><div className={styles.purposeMap}><Image src="/images/commercial-purpose-map.png" alt="Commercial interior with integrated privacy, daylight and hospitality zones" fill sizes="100vw"/>{annotations.map((item,index)=>{const active=visibleAnnotation===index;return <div className={styles.annotationWrap} style={{left:`${item.x}%`,top:`${item.y}%`}} key={item.name} onMouseEnter={()=>setHovered(index)} onMouseLeave={()=>setHovered(null)}><button type="button" aria-expanded={active} aria-pressed={pinned===index} aria-label={`View ${item.name} recommendation`} onClick={()=>setPinned(pinned===index?null:index)}><span/></button><AnimatePresence>{active&&<motion.article initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:6}}><small>{item.name}</small><p>OBJECTIVE<br/><strong>{item.objective}</strong></p><p>SOLUTION<br/><strong>{item.solution}</strong></p><button type="button" onClick={()=>setPinned(null)} aria-label="Close annotation">×</button></motion.article>}</AnimatePresence></div>})}</div></section>

    <section className={styles.challengesIndustries} id="industries"><div className={styles.challenges}><span className={styles.kicker}>COMMERCIAL CHALLENGES</span><div>{challenges.map(([title,copy],index)=><article key={title}><i className={styles[`challengeIcon${index+1}`]} aria-hidden="true"/><h3>{title}</h3><p>{copy}</p></article>)}</div></div><div className={styles.industries}><span className={styles.kicker}>INDUSTRIES WE SERVE</span><div>{industries.map((name,index)=><a href="#builder" key={name}><Sprite frame={index} label={`${name} commercial environment`}/><span>{name}</span><small>{index===0?"Privacy, performance and focus":index===1?"Comfort designed around every guest":"Integrated architectural solutions"}</small></a>)}</div></div></section>

    <section className={styles.projects}><Fade className={styles.projectsIntro}><span className={styles.kicker}>FEATURED COMMERCIAL PROJECTS</span><h2>Spaces designed<br/>to perform.</h2><a href="/#projects">VIEW ALL PROJECTS <b>→</b></a></Fade><div className={styles.projectStrip}>{projects.map(([name,location,frame],index)=><a href="/#projects" key={name}><Sprite frame={frame} label={name}/><b>{String(index+1).padStart(2,"0")}</b><div><h3>{name}</h3><span>{location}</span></div></a>)}</div></section>

    <section className={styles.process}><Fade className={styles.processIntro}><span className={styles.kicker}>OUR COMMERCIAL PROCESS</span><h2>A seamless experience<br/>from concept to completion.</h2></Fade><div className={styles.processSteps}>{process.map(([title,copy],index)=><article key={title}><i aria-hidden="true"/><small>{String(index+1).padStart(2,"0")}</small><h3>{title}</h3><p>{copy}</p>{index<process.length-1&&<b aria-hidden="true"/>}</article>)}</div></section>

    <section className={styles.finalCta} id="contact"><Image src="/images/commercial-purpose-map.png" alt="Luxury commercial interior at dusk" fill sizes="100vw"/><div/><Fade className={styles.finalCopy}><span className={styles.kicker}>DESIGNED FOR PERFORMANCE</span><h2>Architecture influences<br/>performance.<br/><em>Let&apos;s design yours.</em></h2><p>Create a commercial environment where privacy, comfort, light and perception work together.</p><div className={styles.buttonRow}><a className="button button-gold" href="mailto:hello@luminixshades.com">SCHEDULE A CONSULTATION</a><a className="button button-outline" href="mailto:hello@luminixshades.com?subject=Commercial%20Project%20Quote">REQUEST A QUOTE</a></div></Fade></section>
    <SiteFooter/>
  </main>;
}
