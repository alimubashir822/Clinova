export interface MedicalScenario {
  id: string;
  name: string;
  specialty: string;
  transcript: string;
  notes: {
    SOAP: {
      subjective: string;
      objective: string;
      assessment: string;
      plan: string;
    };
    PROGRESS: string;
    REFERRAL: {
      recipient: string;
      reason: string;
      history: string;
      urgency: string;
    };
    CONSULTATION: string;
  };
  qualityScore: number;
  qualityFeedback: {
    warnings: string[];
    suggestions: string[];
  };
}

export const SCENARIOS: MedicalScenario[] = [
  {
    id: "cardiology-chest-pain",
    name: "Cardiology - Chest Pain Consultation",
    specialty: "Cardiology",
    transcript: "Dr. Sarah: Welcome back John. What brings you in today?\nJohn Doe: Hi doctor. For the past three days, I've been feeling this strange chest pain whenever I walk up the stairs. It goes away after I sit down and rest for a few minutes.\nDr. Sarah: I see. Can you describe the pain? Is it sharp or more like pressure?\nJohn Doe: It's definitely a pressure or heaviness, like a squeezing feeling right in the center of my chest. It doesn't go to my neck or arm.\nDr. Sarah: Understood. Are you experiencing any shortness of breath, sweating, or nausea with it?\nJohn Doe: A little shortness of breath, yes. No sweating or nausea though.\nDr. Sarah: Okay, John. This is important. I'm going to run an EKG today. I'm also referring you to Cardiology for a comprehensive stress test. Starting today, I want you to take an Aspirin 81mg daily. If you feel severe crushing chest pain, sweating, or pain going into your jaw or arm, call 911 immediately. We must manage this closely.",
    notes: {
      SOAP: {
        subjective: "Patient is a 45-year-old male with history of hypertension who reports new onset of chest pain occurring over the last 3 days. Pain is triggered by exertion (climbing stairs) and relieved by rest within minutes. Describes pain as a central chest squeezing/heaviness. Admits to mild associated dyspnea. Denies radiation, diaphoresis, nausea, or palpitations.",
        objective: "Vitals: BP 138/86 mmHg, HR 74 bpm, O2 Sat 98% on room air. EKG performed in office: Normal sinus rhythm, no acute ST-segment changes or T-wave inversions. Cardiovascular: Normal S1/S2, regular rhythm, no murmurs or gallops. Lungs: Clear to auscultation bilaterally.",
        assessment: "New-onset exertional chest pain, suspicious for stable angina pectoris. History of essential hypertension, borderline lipid levels.",
        plan: "1. Refer to Cardiology for exercise stress testing and cardiology evaluation.\n2. Initiate low-dose Aspirin (81mg orally daily) for cardiovascular protection.\n3. Patient educated on strict warning signs of unstable angina/myocardial infarction (crushing pressure, neck/arm radiation, diaphoresis, severe dyspnea). Instructed to go to the nearest Emergency Department or call 911 immediately if symptoms intensify."
      },
      PROGRESS: "Patient seen for evaluation of central squeezing chest pain triggered by climbing stairs, lasting 3 days. EKG was normal in office. Aspirin 81mg started daily. Urgent Cardiology referral placed for exercise stress test. Patient counseled on emergency warning signs.",
      REFERRAL: {
        recipient: "Dr. Robert Chen, Chief of Cardiology, Heart & Vascular Institute",
        reason: "Cardiological evaluation and exercise stress test for new-onset exertional chest pressure.",
        history: "John Doe is a 45-year-old male with essential hypertension. He presents with a 3-day history of exertional central chest squeezing relieved by rest, associated with dyspnea. EKG is normal.",
        urgency: "Urgent (Within 7 days)"
      },
      CONSULTATION: "45-year-old male with exertional center chest squeezing relieved by rest. High suspicion of coronary artery disease. Normal resting EKG. Initializing Aspirin 81mg, referring to Cardiology for stress testing."
    },
    qualityScore: 92,
    qualityFeedback: {
      warnings: ["Missing follow-up appointment timeline.", "No mention of lipid panel statin adjustment."],
      suggestions: ["Specify if patient should carry sublingual Nitroglycerin.", "Document cardiovascular family history."]
    }
  },
  {
    id: "pediatrics-asthma",
    name: "Pediatrics - Asthma Flare-Up",
    specialty: "Pediatrics",
    transcript: "Dr. Sarah: Hi Sophia, how are you? Hello Mrs. Martinez.\nMother: Hi doctor. Sophia has had a cough for two days, and last night she was wheezing a lot. She woke up twice coughing.\nDr. Sarah: Okay. Does she have a fever or runny nose?\nMother: A minor runny nose, no fever. She's been using her Albuterol inhaler, but it only helps for about an hour.\nDr. Sarah: Let me listen to your lungs, Sophia. Take deep breaths... Okay, I hear mild expiratory wheezing in both lungs. Her oxygen level is good at 97%. Since her asthma is flaring up due to this cold, we are going to start her on a short course of oral Prednisolone, 15mg once daily for 5 days, to calm the inflammation. We will also schedule her Albuterol inhaler, 2 puffs every 4 hours as needed for the next few days. Please bring her back in 2 weeks for a follow-up, or go to the ER if she is struggling to breathe or has chest retractions.",
    notes: {
      SOAP: {
        subjective: "8-year-old female patient presents with mother reporting a cough for 2 days and nocturnal wheezing. Woke up twice last night due to cough. Using rescue Albuterol with short-term relief (approx. 1 hour). Denies fever. Mild rhinorrhea present.",
        objective: "Vitals: Temp 98.6 F, HR 98 bpm, RR 22 bpm, O2 Sat 97% on room air. Lungs: Mild, diffuse expiratory wheezing bilaterally. No accessory muscle use or retractions. Throat: Mild pharyngeal erythema.",
        assessment: "Acute asthma exacerbation, triggered by suspected viral upper respiratory tract infection.",
        plan: "1. Prescribed Prednisolone oral solution 15mg once daily for 5 days.\n2. Albuterol HFA inhaler 2 puffs every 4 hours as needed for cough/wheezing.\n3. Return to office in 2 weeks for asthma control review.\n4. Warning signs detailed: retractions, nasal flaring, accessory muscle use, or failure to respond to rescue inhaler warrant immediate emergency room visit."
      },
      PROGRESS: "Sophia presents with acute asthma cough/wheeze. Clear expiratory wheeze on exam. Oxygen stable. Started 5-day course of oral Prednisolone, continuing Albuterol. Follow-up scheduled for 2 weeks.",
      REFERRAL: {
        recipient: "Dr. Alan Mercer, Pediatric Allergy & Immunology",
        reason: "Consultation for refractory pediatric asthma and controller medication optimization.",
        history: "Sophia Martinez is an 8-year-old with moderate persistent asthma presenting with recurrent exacerbations triggered by viral respiratory infections, requiring multiple rescue inhaler adjustments.",
        urgency: "Routine (Within 30 days)"
      },
      CONSULTATION: "8-year-old child presenting with acute wheezing. Expiratory wheeze noted. Prescribed oral Prednisolone 15mg for 5 days, with scheduled Albuterol. Follow-up in 14 days."
    },
    qualityScore: 95,
    qualityFeedback: {
      warnings: [],
      suggestions: ["Attach updated Asthma Action Plan copy to the patient portal.", "Specify height and weight percentiles."]
    }
  },
  {
    id: "dermatology-acne",
    name: "Dermatology - Acne Follow-Up",
    specialty: "Dermatology",
    transcript: "Dr. Sarah: Hi Emily. Let's take a look at your skin today. How is the current regimen working?\nEmily Chen: Hello doctor. My skin is still breaking out on my forehead and cheeks. It gets dry and flaky, but I still get painful bumps.\nDr. Sarah: I see. Examination shows moderate inflammatory papules and comedones concentrated on the forehead and cheeks, with mild erythema and peeling. Since the current over-the-counter wash isn't sufficient, we will upgrade your treatment. I will prescribe Benzoyl Peroxide 5% wash to use in the morning, and Tretinoin 0.025% cream to apply a pea-sized amount at night. Be sure to apply a non-comedogenic moisturizer to manage the dryness. And don't forget daily sunscreen, as Tretinoin makes your skin highly sensitive to the sun. Let's see you back in 6 weeks.",
    notes: {
      SOAP: {
        subjective: "Patient is a 28-year-old female presenting for management of persistent acne. Reports breakouts on cheeks and forehead. Notes irritation, dryness, and flaking with current OTC regimen. Desires prescription intervention.",
        objective: "Skin Exam: Multiple moderate inflammatory papules and closed/open comedones on bilateral cheeks and forehead. Mild diffuse scaling and erythema. No cystic lesions or hypertrophic scarring noted.",
        assessment: "Moderate papulocomedonal acne vulgaris, complicated by skin barrier dryness/irritation.",
        plan: "1. Initiate Benzoyl Peroxide 5% wash once daily in the morning.\n2. Initiate Tretinoin 0.025% cream once daily at night (apply pea-sized amount to dry face).\n3. Apply liberal non-comedogenic moisturizer morning and evening.\n4. Educated on sunscreen use (SPF 30+ daily) due to increased photosensitivity.\n5. Follow-up clinic visit in 6 weeks to evaluate progress."
      },
      PROGRESS: "Moderate inflammatory acne. Peeling noted. Prescribed Benzoyl Peroxide 5% wash (AM) and Tretinoin 0.025% cream (PM). Counseled on moisturizing and sun safety. Re-evaluate in 6 weeks.",
      REFERRAL: {
        recipient: "Dr. Karen O'Connor, Dermatology Specialists",
        reason: "Referral for refractory acne and assessment for advanced topical/systemic therapies.",
        history: "Emily Chen is a 28-year-old female with moderate papulocomedonal acne unresponsive to basic OTC skin care, experiencing erythema and irritation.",
        urgency: "Routine (Within 30 days)"
      },
      CONSULTATION: "Moderate facial acne in 28yo female. Comedonal and papular lesions. Initiated morning Benzoyl Peroxide and nightly Tretinoin. Emphasized hydration and sunscreen."
    },
    qualityScore: 94,
    qualityFeedback: {
      warnings: [],
      suggestions: ["Note if patient is using any other active topicals (e.g. salicylic acid).", "Confirm birth control status as Tretinoin is teratogenic in pregnancy."]
    }
  },
  {
    id: "dental-cavity",
    name: "Dental - Routine Exam & Restoration",
    specialty: "Dental",
    transcript: "Dr. Sarah: Hello Marcus. We did some bitewing X-rays today, and I've finished your oral exam.\nMarcus Thompson: Hi doc. Any cavities or issues?\nDr. Sarah: Your oral hygiene is fair, but you have some moderate plaque and calculus buildup on the lower molars. The X-ray shows a small area of decay, a cavity, on the biting surface of tooth #14. It's still shallow, so we should schedule a composite filling to restore it before it gets deeper. The rest of your teeth and gums look healthy. The pocket depths are all normal, between 2 and 3 millimeters. Please make sure to brush twice daily with a fluoride toothpaste, floss at night, and we will see you next week for the tooth #14 restoration.",
    notes: {
      SOAP: {
        subjective: "Patient is a 67-year-old male who presents for routine dental examination and radiographic review. Denies active tooth pain, sensitivity to hot/cold, or bleeding gums.",
        objective: "Extraoral exam: WNL. Intraoral exam: Gingiva is pink and firm, normal pocket depths (2-3mm), no recession. Fair oral hygiene with moderate supra-gingival calculus on lower anterior teeth. Tooth #14: Occlusal caries noted, confirmed on bitewing radiograph showing shallow radiolucency in enamel/dentin junction.",
        assessment: "1. Occlusal caries, tooth #14.\n2. Mild gingival calculus buildup.",
        plan: "1. Scheduled for composite resin restoration on tooth #14 next week.\n2. Prophylaxis and scaling performed today.\n3. Patient educated on brushing technique, flossing, and using fluoride rinse."
      },
      PROGRESS: "Routine dental exam and scaling completed. Shallow occlusal caries detected on tooth #14. Scheduled for composite filling next week. Instructed on daily flossing.",
      REFERRAL: {
        recipient: "Dr. Thomas Brady, Endodontic Specialists",
        reason: "Referral for root canal evaluation of molar decay.",
        history: "Marcus Thompson is a 67-year-old male with deep occlusal caries on tooth #14 showing signs of pulpal involvement on X-ray.",
        urgency: "Routine (Within 30 days)"
      },
      CONSULTATION: "Calculus buildup cleared. Occlusal enamel decay found on upper left molar (#14). Composite restoration scheduled. Instructed on flossing and brushing hygiene."
    },
    qualityScore: 90,
    qualityFeedback: {
      warnings: ["Missing ICD-10/CDT billing code mapping."],
      suggestions: ["Note patient tolerance to local anesthetics in history.", "Confirm active medications (e.g. anticoagulants due to calculus scaling)."]
    }
  }
];
