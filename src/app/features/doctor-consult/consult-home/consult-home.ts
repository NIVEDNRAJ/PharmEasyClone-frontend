import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { DoctorService } from '../../../core/services/doctor';

@Component({
  selector: 'app-consult-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './consult-home.html',
  styleUrls: ['./consult-home.scss']
})
export class ConsultHomeComponent implements OnInit {
  private doctorService = inject(DoctorService);
  private router = inject(Router);

  specialties: any[] = [
    { name: 'General Health', icon: '🩺', desc: 'Fever, Cough, Cold' },
    { name: "Women's Health", icon: '👩', desc: 'Periods, Pregnancy' },
    { name: 'Heart Health', icon: '❤️', desc: 'BP, Chest Pain' },
    { name: 'Skin and Hair Health', icon: '💇', desc: 'Acne, Hairfall' },
    { name: 'Child Care', icon: '👶', desc: 'Fever, Growth issues' },
    { name: 'Sexual Health', icon: '🚻', desc: 'Erection, Stamina' }
  ];

  popularDoctors: any[] = [];
  faqOpenIndex: number | null = null;

  faqs = [
    { q: 'How does online doctor consultation work?', a: 'Online doctor consultation allows you to connect with a certified physician via audio or video call. You can discuss symptoms, upload reports, and receive a digital prescription instantly.' },
    { q: 'Will I be able to talk to the same doctor if I have follow-ups?', a: 'Yes, we provide free follow-ups for up to 3 days post-consultation where you can contact the same doctor to update them on your health.' },
    { q: 'Is my consultation data private and secure?', a: 'Absolutely. We comply with medical privacy standards. All consultation logs and shared documents are 100% confidential and secure.' },
    { q: 'What modes of consultation are available?', a: 'You can choose between high-quality Audio Call and Video Call options as per your preference.' }
  ];

  ngOnInit() {
    this.doctorService.getDoctors().subscribe(docs => {
      // Show top 3 doctors as popular doctors
      this.popularDoctors = docs.slice(0, 3);
    });
  }

  toggleFaq(index: number) {
    this.faqOpenIndex = this.faqOpenIndex === index ? null : index;
  }

  selectSpecialty(specialtyName: string) {
    this.router.navigate(['/doctor-consult/doctors'], { queryParams: { specialty: specialtyName } });
  }
}
