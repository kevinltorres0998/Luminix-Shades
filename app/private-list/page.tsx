import Image from "next/image";
import Link from "next/link";
import SubscriberForm from "./SubscriberForm";
import styles from "./private-list.module.css";

export const metadata = { title: "The Private List | Luminix Shades", description: "Join the Luminix Shades private list for future offers, design inspiration and product news." };

export default function PrivateListPage() {
  return <main className={styles.page}><section className={styles.visual}><Image src="/images/hero.png" alt="Luminix Shades architectural interior" fill priority sizes="(max-width: 800px) 100vw, 58vw" /><div className={styles.shade}/><Link href="/"><Image src="/images/logo-white.png" alt="Luminix Shades" width={190} height={54} unoptimized /></Link><div><span>THE PRIVATE LIST</span><h1>Beautiful spaces.<br/><i>Exclusive access.</i></h1><p>Be first to discover seasonal offers, new collections and considered ideas for privacy, comfort and light.</p></div><small>SMART FILM · MOTORIZED SHADES · CUSTOM DRAPERY</small></section><section className={styles.formSide}><div className={styles.formWrap}><span>INSIDER ACCESS</span><h2>A more considered way to stay inspired.</h2><p>Join our private list for future discounts, curated product news and design inspiration. No noise—only occasional updates worth opening.</p><SubscriberForm/><footer>By subscribing, you can unsubscribe at any time. View our <Link href="/privacy-policy">Privacy Policy</Link>.</footer></div></section></main>;
}
