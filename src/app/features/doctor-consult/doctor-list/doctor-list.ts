import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DoctorService } from '../../../core/services/doctor';

@Component({
  selector: 'app-doctor-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './doctor-list.html',
  styleUrls: ['./doctor-list.scss']
})
export class DoctorListComponent implements OnInit {
  private doctorService = inject(DoctorService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  specialty: string | null = null;
  doctors: any[] = [];
  isLoading = true;

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.specialty = params['specialty'] || null;
      this.fetchDoctors();
    });
  }

  fetchDoctors() {
    this.isLoading = true;
    this.doctorService.getDoctors(this.specialty || undefined).subscribe({
      next: (data) => {
        this.doctors = data;
        this.isLoading = false;
      },
      error: () => {
        this.doctors = [];
        this.isLoading = false;
      }
    });
  }

  selectDoctor(doctorId: string) {
    this.router.navigate(['/doctor-consult/summary'], { queryParams: { doctorId } });
  }
}
