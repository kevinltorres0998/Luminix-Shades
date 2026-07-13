"use client";

import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import NextImage from "next/image";
import { useEffect, useRef, useState } from "react";
import SiteFooter from "../components/SiteFooter";
import SiteHeader from "../components/SiteHeader";
import styles from "./residential.module.css";

function Image(props: React.ComponentProps<typeof NextImage>) { return <NextImage {...props} unoptimized />; }
function Fade({ children, className = "" }: { children: React.ReactNode; className?: string }) { return <motion.div className={className} initial={{ opacity:0,y:22 }} whileInView={{ opacity:1,y:0 }} viewport={{ once:true,amount:.14 }} transition={{ duration:.76,ease:[.22,1,.36,1] }}>{children}</motion.div>; }

const rooms = [
  { name:"Living Room", image:"/images/residential.png", headline:"Where comfort meets atmosphere.", description:"The living room is where life happens. Control natural light, reduce glare, preserve the view, and create the right ambiance for every moment of the day.", ratings:[["Custom Drapery",5],["Motorized Roller Shades",5],["Smart Film",4],["Cellular Shades",2]] as [string,number][], combination:"Ripple Fold Linen Drapery + Motorized Roller Shades", why:"Softens the light, enhances privacy, and elevates the entire space.", detail:"/images/drapery-room-linen.png", hotspot:[39,60] },
  { name:"Bedroom", image:"/images/cellular-hero-winter.webp", headline:"Rest begins with complete comfort.", description:"Create a quieter, darker, and more temperature-controlled bedroom designed around deeper rest and effortless privacy.", ratings:[["Cellular Shades",5],["Motorized Blackout Shades",5],["Custom Drapery",4],["Smart Film",2]] as [string,number][], combination:"Room-Darkening Cellular Shades + Blackout Drapery", why:"Delivers darkness, insulation, acoustic softness, and a calm finished interior.", detail:"/images/drapery-room-blackout.png", hotspot:[64,18] },
  { name:"Kitchen", image:"/images/architecture.png", headline:"Practical light control, beautifully resolved.", description:"A kitchen needs durable, easy-to-use solutions that manage heat and glare while respecting cabinetry, stone, and clean architectural lines.", ratings:[["Motorized Roller Shades",5],["Smart Film",4],["Cellular Shades",3],["Custom Drapery",2]] as [string,number][], combination:"Screen Roller Shades + Smart Film", why:"Reduces heat and glare while keeping surfaces clean, functional, and visually quiet.", detail:"/images/roller-shades-demo-room.png", hotspot:[41,21] },
  { name:"Dining Room", image:"/images/drapery-room-linen.png", headline:"An atmosphere designed for gathering.", description:"Layered textiles and controlled daylight create warmth, intimacy, and a sense of occasion without overwhelming the architecture.", ratings:[["Custom Drapery",5],["Motorized Roller Shades",4],["Smart Film",3],["Cellular Shades",2]] as [string,number][], combination:"Sheer Linen Drapery + Screen Roller Shades", why:"Balances soft daylight, evening privacy, and elegant material depth.", detail:"/images/drapery-hero-sheer.png", hotspot:[44,40] },
  { name:"Bathroom", image:"/images/residential-smart-film-cover-v3.png", headline:"Privacy without visual compromise.", description:"Bathrooms benefit from instant discretion, clean surfaces, and solutions that tolerate humidity while preserving natural light.", ratings:[["Smart Film",5],["Cellular Shades",4],["Motorized Roller Shades",3],["Custom Drapery",1]] as [string,number][], combination:"Smart Film Total + Cellular Shade", why:"Provides immediate privacy, filtered daylight, and a minimal architectural finish.", detail:"/images/smart-film-control-detail.png", hotspot:[82,21] },
  { name:"Home Office", image:"/images/cellular-space-office-v2.webp", headline:"Comfort that helps you focus.", description:"Reduce screen glare, control meeting privacy, and maintain a stable environment throughout long workdays without disconnecting from the view.", ratings:[["Motorized Screen Shades",5],["Smart Film",5],["Cellular Shades",4],["Custom Drapery",2]] as [string,number][], combination:"Screen Roller Shades + Smart Film", why:"Controls glare and privacy while maintaining daylight and a professional atmosphere.", detail:"/images/commercial-smart-film-cover-v3.png", hotspot:[65,44] },
  { name:"Media Room", image:"/images/cellular-space-media-v2.webp", headline:"Cinema comfort at home.", description:"Control reflections, outside light, and acoustic distraction for an immersive viewing experience that still feels refined when the screen is off.", ratings:[["Blackout Roller Shades",5],["Cellular Shades",5],["Custom Drapery",4],["Smart Film",2]] as [string,number][], combination:"Blackout Roller Shades + Cellular Shades", why:"Creates near-total darkness, thermal comfort, and a quieter entertainment environment.", detail:"/images/drapery-room-velvet.png", hotspot:[84,48] },
  { name:"Outdoor Living", image:"/images/smart-film.png", headline:"Designed for the way South Florida lives.", description:"Extend privacy and comfort to terraces, cabanas, and transitional spaces while protecting the openness that makes outdoor living special.", ratings:[["Motorized Roller Shades",5],["Smart Film",4],["Custom Drapery",3],["Cellular Shades",1]] as [string,number][], combination:"Exterior Screen Shades + Smart Film", why:"Manages sun, heat, and privacy without closing the home off from the landscape.", detail:"/images/residential-smart-film-cover-v3.png", hotspot:[17,55] },
];

const collections = [["Waterfront Living","/images/residential.png"],["Modern Minimalism","/images/architecture.png"],["Family Homes","/images/drapery-room-linen.png"],["Luxury Condominiums","/images/hero.png"],["Private Estates","/images/about-hospitality.png"],["Smart Homes","/images/smart-film.png"]];
const challenges = [["Too Much Heat","Reduce heat gain and improve energy efficiency.","Motorized Screen + Cellular"],["No Privacy","Maintain privacy without sacrificing natural light.","Smart Film + Drapery"],["Morning Sun","Wake up on your terms, not with the sun.","Blackout Roller + Cellular"],["Large Windows","Control expansive glazing without visual weight.","Motorized Roller Shades"],["Glare","Protect screens, finishes, and everyday comfort.","Screen Shades + Smart Film"]];
const projects = [["Biscayne Bay Residence","Miami, Florida","/images/residential.png"],["Modern Oceanfront Home","Pompano Beach, Florida","/images/hero.png"],["Brickell Penthouse","Miami, Florida","/images/drapery-hero-sheer.png"],["Coral Gables Estate","Coral Gables, Florida","/images/architecture.png"]];

const compositionHotspots = [
  { room:"Living Room", solution:<>Ripple Fold Drapery<br/>+ Motorized Roller Shades</>, description:"Softens the space while controlling light and preserving views.", icon:"curtain", x:25, y:63, card:"left" },
  { room:"Master Bedroom", solution:<>Cellular Shades<br/>+ Blackout Roller Shades</>, description:"Improves sleep comfort with thermal insulation and total darkness.", icon:"bed", x:40, y:25, card:"top" },
  { room:"Primary Bathroom", solution:<>Smart Film</>, description:"Instant privacy with natural light whenever you need it.", icon:"bath", x:74, y:25, card:"rightTop" },
  { room:"Kitchen & Dining", solution:<>Screen Roller Shades</>, description:"Reduces glare while maintaining beautiful outdoor views.", icon:"shade", x:51, y:65, card:"bottom" },
  { room:"Home Office", solution:<>Smart Film<br/>+ Screen Roller Shades</>, description:"Privacy for focus with natural light and views when wanted.", icon:"office", x:77, y:58, card:"right" },
  { room:"Outdoor Living", solution:<>Motorized Roller Shades</>, description:"Comfort on demand with shade, privacy and protection.", icon:"outdoor", x:73, y:78, card:"bottomRight" },
];

const combinationBenefits = [
  ["Light Control","Balance daylight without sacrificing beautiful views.","light"],
  ["Thermal Comfort","Reduce heat gain while improving energy efficiency.","thermal"],
  ["Privacy","Privacy exactly where and when it is needed.","privacy"],
  ["Acoustic Comfort","Soft materials reduce echo and improve everyday comfort.","acoustic"],
  ["Architectural Integration","Solutions designed to disappear into the architecture.","architecture"],
];

export default function ResidentialPage(){
  const [room,setRoom]=useState(0);
  const [pinnedHotspot,setPinnedHotspot]=useState<number|null>(null);
  const [hoveredHotspot,setHoveredHotspot]=useState<number|null>(null);
  const compositionRef=useRef<HTMLDivElement>(null);
  const active=rooms[room];
  const visibleHotspot=pinnedHotspot??hoveredHotspot;
  const {scrollY}=useScroll();
  const heroY=useTransform(scrollY,[0,760],[0,52]);
  useEffect(()=>{
    const onKeyDown=(event:KeyboardEvent)=>{if(event.key==="Escape")setPinnedHotspot(null)};
    const onPointerDown=(event:PointerEvent)=>{if(compositionRef.current&&!compositionRef.current.contains(event.target as Node))setPinnedHotspot(null)};
    window.addEventListener("keydown",onKeyDown);
    window.addEventListener("pointerdown",onPointerDown);
    return()=>{window.removeEventListener("keydown",onKeyDown);window.removeEventListener("pointerdown",onPointerDown)};
  },[]);
  return <main className={styles.page}>
    <SiteHeader />
    <section className={styles.hero} id="top"><motion.div className={styles.heroMedia} style={{y:heroY}} initial={{opacity:.75,scale:1.03}} animate={{opacity:1,scale:1.01}} transition={{duration:1.6}}><Image src="/images/residential.png" alt="Luxury waterfront living room at sunset" fill priority sizes="100vw" /></motion.div><div className={styles.heroShade}/><motion.div className={styles.heroCopy} initial={{opacity:0,y:26}} animate={{opacity:1,y:0}} transition={{duration:.95,ease:[.22,1,.36,1]}}><span className={styles.kicker}>RESIDENTIAL SOLUTIONS</span><h1>Designed around<br/>the way <em>you live</em><br/>at home.</h1><p>Every room has different light, privacy, comfort and atmosphere requirements. Discover tailored window treatment solutions for every part of your home.</p><a className={styles.textLink} href="#explore">EXPLORE YOUR HOME <span>→</span></a></motion.div></section>

    <section className={styles.explore} id="explore"><Fade className={styles.exploreIntro}><span className={styles.kicker}>EXPLORE YOUR HOME</span><h2>Every room.<br/>Every need.</h2><p>Choose a space to discover the ideal window treatment solutions.</p><div className={styles.roomList}>{rooms.map((item,index)=><button type="button" key={item.name} aria-pressed={room===index} onClick={()=>setRoom(index)}>{item.name}</button>)}</div></Fade><div className={styles.floorplan}><Image src="/images/residential-floorplan.png" alt="Interactive isometric floor plan of a luxury residence" fill sizes="(max-width:760px) 100vw, 72vw" />{rooms.map((item,index)=><button key={item.name} type="button" className={room===index?styles.activeHotspot:""} style={{left:`${item.hotspot[0]}%`,top:`${item.hotspot[1]}%`}} aria-label={`Explore ${item.name}`} aria-pressed={room===index} onClick={()=>setRoom(index)}><span>+</span></button>)}</div></section>

    <section className={styles.recommendation}><AnimatePresence mode="wait" initial={false}><motion.div className={styles.recommendationStage} key={active.name} initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-10}} transition={{duration:.38,ease:[.22,1,.36,1]}}><div className={styles.roomImage}><Image src={active.image} alt={`${active.name} residential recommendation`} fill sizes="(max-width:800px) 100vw, 47vw" /></div><div className={styles.roomCopy}><span className={styles.kicker}>{active.name.toUpperCase()}</span><h2>{active.headline}</h2><p>{active.description}</p><div className={styles.bestCombination}><small>BEST COMBINATION</small><strong>{active.combination}</strong><p>{active.why}</p><a href="/solutions">VIEW DETAILS →</a></div></div><div className={styles.ratings}><span className={styles.kicker}>RECOMMENDED SOLUTIONS</span>{active.ratings.map(([name,score])=><div key={name}><i>{"★".repeat(score)}<em>{"☆".repeat(5-score)}</em></i><span>{name}</span></div>)}<figure><Image src={active.detail} alt={`${active.name} recommended material detail`} fill sizes="280px" /></figure></div></motion.div></AnimatePresence><div className={styles.roomTabs}><button type="button" onClick={()=>setRoom((room-1+rooms.length)%rooms.length)}>←</button>{rooms.map((item,index)=><button type="button" key={item.name} aria-pressed={room===index} onClick={()=>setRoom(index)}>{item.name}</button>)}<button type="button" onClick={()=>setRoom((room+1)%rooms.length)}>→</button></div></section>

    <section className={styles.collections}><Fade><span className={styles.kicker}>LIFESTYLE COLLECTIONS</span><h2>Solutions inspired by<br/>the way you <em>live.</em></h2></Fade><div className={styles.collectionGrid}>{collections.map(([name,image])=><a href="#explore" key={name}><Image src={image} alt={`${name} residential collection`} fill sizes="(max-width:760px) 70vw, 17vw"/><span>{name}</span></a>)}</div><a className={styles.textLink} href="/solutions">VIEW ALL COLLECTIONS <span>→</span></a></section>

    <section className={styles.guidance}><div className={styles.challenges}><span className={styles.kicker}>COMMON RESIDENTIAL CHALLENGES</span><h2>We solve the problems<br/>homes face every day.</h2><div>{challenges.map(([title,copy,solution],index)=><article key={title}><i className={styles[`challengeIcon${index+1}`]} aria-hidden="true"/><h3>{title}</h3><p>{copy}</p><small>{solution}</small></article>)}</div></div></section>

    <section className={styles.architecturalComposition} ref={compositionRef}>
      <div className={styles.architecturalIntro}>
        <div><span className={styles.kicker}>ARCHITECTURAL COMPOSITION</span><h2>Every solution<br/>has its <em>place.</em></h2></div>
        <p>Explore how Smart Film, Motorized Roller Shades, Custom Drapery and Cellular Shades work together throughout one thoughtfully designed residence.</p>
      </div>
      <div className={styles.residenceStage}>
        <Image src="/images/residential-architectural-composition.png" alt="Waterfront residence demonstrating integrated Luminix window solutions" fill sizes="100vw"/>
        {visibleHotspot!==null&&<span className={styles.localHighlight} style={{left:`${compositionHotspots[visibleHotspot].x}%`,top:`${compositionHotspots[visibleHotspot].y}%`}} aria-hidden="true"/>}
        {compositionHotspots.map((item,index)=>{
          const isVisible=visibleHotspot===index;
          const isPinned=pinnedHotspot===index;
          return <div className={`${styles.hotspotWrap} ${styles[item.card]}`} style={{left:`${item.x}%`,top:`${item.y}%`}} key={item.room} onMouseEnter={()=>setHoveredHotspot(index)} onMouseLeave={()=>setHoveredHotspot(null)}>
            <button type="button" className={styles.archHotspot} aria-label={`View ${item.room} window solution`} aria-expanded={isVisible} aria-pressed={isPinned} onClick={()=>setPinnedHotspot(isPinned?null:index)}><span/></button>
            <article className={`${styles.annotationCard} ${isVisible?styles.annotationActive:""}`}><small>{item.room}</small><h3>{item.solution}</h3><div><i className={styles[`annotationIcon_${item.icon}`]} aria-hidden="true"/><p>{item.description}</p></div></article>
          </div>;
        })}
      </div>
      <AnimatePresence mode="wait">{pinnedHotspot!==null&&<motion.div className={styles.mobileAnnotation} key={pinnedHotspot} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}}><button type="button" onClick={()=>setPinnedHotspot(null)} aria-label="Close room details">×</button><small>{compositionHotspots[pinnedHotspot].room}</small><h3>{compositionHotspots[pinnedHotspot].solution}</h3><p>{compositionHotspots[pinnedHotspot].description}</p></motion.div>}</AnimatePresence>
    </section>

    <section className={styles.combinationsMatter}>
      <div className={styles.combinationsHeadline}><span className={styles.kicker}>WHY COMBINATIONS MATTER</span><h2>Every room asks for<br/>something <em>different.</em></h2></div>
      <div className={styles.benefitGrid}>{combinationBenefits.map(([title,copy,icon])=><article key={title}><i className={styles[`benefitIcon_${icon}`]} aria-hidden="true"/><h3>{title}</h3><p>{copy}</p></article>)}</div>
    </section>

    <section className={styles.projects}><Fade className={styles.projectsIntro}><span className={styles.kicker}>FEATURED RESIDENTIAL PROJECTS</span><h2>Real homes.<br/>Real solutions.</h2><p>View more projects in our gallery.</p><a className={styles.textLink} href="/#projects">EXPLORE GALLERY <span>→</span></a></Fade><div className={styles.projectGrid}>{projects.map(([name,location,image])=><a href="/#projects" key={name}><Image src={image} alt={name} fill sizes="(max-width:760px) 100vw, 22vw"/><div><h3>{name}</h3><span>{location}</span></div></a>)}</div></section>

    <section className={styles.finalCta}><div/><div><h2>Let&apos;s design a home<br/>that feels as good<br/>as it looks.</h2><p>Schedule a private consultation and we&apos;ll help create the ideal balance of privacy, comfort, light control, and architectural beauty for your home.</p><a className="button button-gold" href="mailto:hello@luminixshades.com">SCHEDULE A CONSULTATION</a><a className="button button-outline" href="mailto:hello@luminixshades.com">CONTACT OUR TEAM</a></div></section>
    <SiteFooter />
  </main>;
}
