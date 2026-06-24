Created & Developed by [Mubashir Ali](#developer-creator) (Full-Stack Healthcare Technology Engineer | AI Healthcare Solutions Builder)

# Clinova AI - Premium AI Clinical Operating System

> Healthcare system by [Med Clinic X](https://www.medclinicx.com/)

Clinova AI is a professional, enterprise-grade **AI Clinical Operating System** that unifies patient files, medical charts, ambient voice scribing, lab analysis, and automated follow-up workflows into a single cohesive workspace. By listening to patient encounters, Clinova AI structures SOAP notes, translates medical jargon for patient instructions, scans PDF diagnostic documents, and maps billing parameters in real-time.

---

## 🚀 Key Features & Architectural Modules

### 1. Unified Doctor Dashboard
* **Patient Encounter Panel:** A streamlined scheduler view showing upcoming visits, visit reasons, status flags, and custom quick-actions. On mobile devices, tables are automatically converted into premium cards to prevent layout stretching.
* **Clinical Statistics & Quality Analytics:** Real-time calculation of daily patient volume, signed note counts, outstanding documentation queues, and AI Quality compliance rating scores.
* **HIPAA Secure Headers & Voice Console:** Contains dynamic Live Clinical Workspace banners and a responsive AI voice command bar enabling direct navigation controls via text or dictation.

### 2. Ambient AI Voice Scribe Console
* **Inline Scribe Workspace:** Integrated directly inside the patient record view. Clinicians can start, pause, or simulate ambient voice dialogs without leaving the patient page.
* **Canvas Waveform Visualizer:** Rendered inline to provide auditory feedback while dictating.
* **Multi-Format Note Structuring:** Instant formatting of dialogue transcripts into **SOAP Notes**, **Progress Notes**, **Referral Letters**, or **Consultation Summaries** utilizing fine-tuned medical models.
* **AI Quality Compliance Auditor:** Displays a dynamic completeness score (e.g., 98% quality rate) and alerts clinicians to missing parameters (like dosage instructions or warning triggers) before signing.

### 3. Patient Portal Summary Generator
* **Medical Jargon Translator:** Converts complicated clinical terminology (e.g., *exertional angina*, *myocardial infarction*, *dyspnea*, *Prednisolone*) into a patient-friendly summary in plain English.
* **Automatic Care Calendars:** Appends structured Day 7, Day 30, and Day 90 follow-up instructions and question prompts for the patient’s next visit.
* **Secure Portal Publishing:** Instantly publishes generated patient summaries to the secure Patient Portal and EHR Document timeline.

### 4. AI Medical Document Analyzer
* **Lab Scanner Portal:** Allows clinical users to index simulated reports (such as *CBC Lab Panels*, *Cardiology Treadmill Stress Scans*, and *Pathology Biopsies*).
* **Clinical Flag Extraction:** Pulls critical biometric values, flags diagnostic red lines (e.g., *Low Hemoglobin*), and arranges the parameters in a structured layout.

### 5. Automated AI Workflow Builder
* **Pipeline Rule Configurator:** Allows clinics to toggle automatic triggers (e.g., *Encounter Signed*, *New Patient Onboarding*).
* **Workflow Action Nodes:** Map post-visit automation nodes, enabling auto-generation of patient guides, follow-up notifications, and referral templates.

### 6. Admin Portal & Compliance Logger
* **Usage Quota Tracker:** Shows total monthly AI minutes consumed by clinicians with quota usage percentages.
* **Active Staff Directory:** Displays list profiles of registered doctors and admin workers.
* **HIPAA Audit Log table:** Logs every medical record access, edit, and AI generation timestamp with user identity records.

---

## 📱 Global Responsive Design System

Clinova AI utilizes a responsive architecture to support clinical workflows across multiple device classes:
* **Mobile (320px – 480px):**
  - The static sidebar transforms into an absolute sliding drawer with backdrop overlays and a click-outside dismiss handler.
  - Encounter lists convert from tables to layout cards.
  - The Note tab selector scrolls horizontally (`overflow-x-auto whitespace-nowrap scrollbar-none`) preventing text wrapping.
  - Select boxes, mic triggers, and action buttons scale to a minimum touch-target size of **44px** (`h-11`).
* **Tablets (481px – 1024px):**
  - Stats grids scale from 1-column to 2-columns.
  - Pre-visit AI clinical brief blocks adjust border styles responsively (vertical borders on desktop, bottom dividers on tablet stacking).
* **Laptops & Desktops (1025px+):**
  - Grid columns automatically rearrange into standard 3-column dashboard grids (`grid-cols-1 lg:grid-cols-3`).
  - Wide access logs tables feature scrollable container wrappers (`overflow-x-auto`) to protect structural grids.

---

## 🛠️ Technology Stack & Database Architecture

1. **Framework:** Next.js 16.2.9 & React 19 (compiled with Turbopack).
2. **Styling:** Tailwind CSS (v4) with vanilla CSS variables configuration.
3. **Database Client:** 
   - A persistent, server-safe local JSON repository (`prisma/db.json`) is maintained.
   - Built to avoid compile conflicts on local developer machines while securing dynamic updates and database checks.
   - Compliant with HIPAA secure tags and audit specifications.

---

## 💻 Running the Project Locally

First, clone the repository and install the dependencies:

```bash
npm install
```

Configure your environment file (copying `.env` defaults).

Start the Next.js development server:

```bash
npm run dev
```

Visit the dashboard in your browser:
- Main Landing page: [http://localhost:3000](http://localhost:3000)
- Doctor Workspace: [http://localhost:3000/doctor/dashboard](http://localhost:3000/doctor/dashboard)
- Admin Portal: [http://localhost:3000/admin](http://localhost:3000/admin)

To verify production bundle compilation:

```bash
npm run build
```

---
*Clinova AI is a clinical operating system developed in collaboration with modern healthcare provider groups.*

---

<a id="developer-creator"></a>
## 👤 Developer & Creator

I am a Full-Stack Healthcare Technology Developer specializing in building modern, scalable, and AI-powered healthcare platforms. I create high-performance digital solutions using React.js, Next.js, TypeScript, and Tailwind CSS to deliver fast, secure, and user-friendly experiences.

My expertise covers complete application development, from frontend architecture and responsive interfaces to backend systems powered by Node.js, REST APIs, GraphQL, PostgreSQL, and Prisma ORM. I build reliable platforms designed for scalability, performance, and long-term growth.

I work with modern cloud infrastructure including AWS, Vercel Edge, Google Cloud, Cloudflare CDN, Docker, and CI/CD pipelines to deploy secure and optimized applications.

With a strong focus on healthcare technology, I develop solutions including patient portals, AI automation systems, EHR integrations, and healthcare applications built around industry standards such as FHIR APIs and HIPAA compliance requirements.

My goal is to combine modern software engineering, cloud technologies, and healthcare innovation to help organizations build smarter digital experiences that improve patient engagement, operational efficiency, and healthcare delivery.

### 📫 Connect with Me

- 💼 **LinkedIn**: <a href="https://linkedin.com/in/mubashirali822" target="_blank" rel="noopener noreferrer">mubashirali822</a>
- 📧 **Email**: <a href="mailto:alimubashir822@gmail.com" target="_blank" rel="noopener noreferrer">alimubashir822@gmail.com</a>
- 🌐 **Website**: <a href="https://www.medclinicx.com/" target="_blank" rel="noopener noreferrer">medclinicx.com</a>
- 🏥 **View More Healthcare Solutions**: <a href="https://www.medclinicx.com/demo" target="_blank" rel="noopener noreferrer">medclinicx.com/demo</a>

⭐ *Building the next generation of digital healthcare technology.*
