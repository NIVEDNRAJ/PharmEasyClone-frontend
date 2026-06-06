import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-select-concern',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './select-concern.html',
  styleUrls: ['./select-concern.scss']
})
export class SelectConcernComponent {
  private router = inject(Router);

  selectedConcern: string | null = null;

  concernsList = [
    { name: 'General Health', desc: 'Fever, Running Nose, Cough, Loose Motions, Vomiting', icon: '🩺' },
    { name: 'Sexual Health', desc: 'Erection Problems, Premature Ejaculation', icon: '🚻' },
    { name: "Women's Health", desc: 'Irregular Periods, Hot Flashes, Infertility', icon: '👩' },
    { name: 'Skin and Hair Health', desc: 'Hairfall, Acne, Dark Patches, Fungal and Other Infections', icon: '💇' },
    { name: 'Digestive and Liver Health', desc: 'Indigestion, Acidity, Diarrhea, Constipation, Abdominal Pain', icon: '🥑' },
    { name: 'Heart Health', desc: 'Change in Blood Pressure, Chest Pain, High / Low Heart Rate', icon: '❤️' },
    { name: 'Blood Sugar Health', desc: 'High / Low Blood Sugar, Excessive Hunger and Thirst', icon: '🩸' },
    { name: 'Bone and Joint Health', desc: 'Joint Pain, Muscle Pain, Difficulty in Body Movement', icon: '🦴' },
    { name: 'Child Care', desc: 'Weaning Issues, Allergies, Vaccination Guidance', icon: '👶' },
    { name: 'Pain Management', desc: 'Back / Neck / Joint Pain, Muscular Discomfort', icon: '🩹' },
    { name: 'Breathing and Lung Health', desc: 'Persistent Cough, Breathing Difficulty, Chest Tightness', icon: '🫁' },
    { name: 'Weight Management', desc: 'Difficulty in Weight Loss, Joint Problems', icon: '⚖️' },
    { name: 'Kidney Care', desc: 'Frequent Urination, Burning Urination, Urine Leakage', icon: '🧬' },
    { name: 'Eye Care', desc: 'Red Eye, Excessive Tearing, Dry Eyes, Blurred Vision', icon: '👁️' },
    { name: 'Piles and Surgery Opinion', desc: 'Piles, Anal fissure, Hernia, Hydrocele, Abscess', icon: '🩸' },
    { name: 'Dental Health', desc: 'Tooth Pain or Sensitivity, Bleeding or Swollen Gums', icon: '🦷' },
    { name: 'Elder Care', desc: 'Chronic Disease Management, Persistent Joint or Back Pain, Memory Loss', icon: '👴' }
  ];

  selectConcern(name: string) {
    this.selectedConcern = name;
  }

  proceedToDoctorSelection() {
    if (!this.selectedConcern) return;
    this.router.navigate(['/doctor-consult/doctors'], { queryParams: { specialty: this.selectedConcern } });
  }
}
