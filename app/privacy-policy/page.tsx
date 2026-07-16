import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import styles from "./privacy-policy.module.css";

export default function PrivacyPolicyPage() {
  return <><SiteHeader /><main className={styles.page}><span>PRIVACY POLICY</span><h1>Your privacy matters.</h1><p>Luminix Shades uses the information you provide to respond to project inquiries, prepare recommendations, coordinate consultations and deliver requested services. We do not sell your personal information.</p><h2>Information we collect</h2><p>Project details, contact information and files you choose to share may be used by our team and trusted service providers solely to support your request.</p><h2>Your choices</h2><p>You may request access, correction or deletion of your information by contacting Luminix Shades. Files and draft information should only include details you are comfortable sharing for project evaluation.</p><p className={styles.note}>For privacy questions, contact <a href="mailto:hello@luminixshades.com">hello@luminixshades.com</a>.</p></main><SiteFooter /></>;
}
