import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home').then(m => m.HomeComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./features/login/login').then(m => m.LoginComponent)
  },
  {
    path: 'admin',
    canActivate: [authGuard, roleGuard(['Admin'])],
    loadComponent: () => import('./features/admin/dashboard/admin-dashboard').then(m => m.AdminDashboardComponent)
  },
  {
    path: 'vendor',
    canActivate: [authGuard, roleGuard(['Vendor'])],
    loadComponent: () => import('./features/vendor/dashboard/vendor-dashboard').then(m => m.VendorDashboardComponent)
  },
  {
    path: 'doctor',
    canActivate: [authGuard, roleGuard(['Doctor'])],
    loadComponent: () => import('./features/doctor/dashboard/doctor-dashboard').then(m => m.DoctorDashboardComponent)
  },
  {
    path: 'prescription',
    loadComponent: () => import('./features/prescription/upload-prescription').then(m => m.UploadPrescriptionComponent)
  },
  {
    path: 'lab-tests',
    loadComponent: () => import('./features/lab-tests/lab-tests').then(m => m.LabTestsComponent)
  },
  {
    path: 'doctor-consult',
    loadComponent: () => import('./features/doctor-consult/consult-home/consult-home').then(m => m.ConsultHomeComponent)
  },
  {
    path: 'doctor-consult/concern',
    loadComponent: () => import('./features/doctor-consult/select-concern/select-concern').then(m => m.SelectConcernComponent)
  },
  {
    path: 'doctor-consult/doctors',
    loadComponent: () => import('./features/doctor-consult/doctor-list/doctor-list').then(m => m.DoctorListComponent)
  },
  {
    path: 'doctor-consult/summary',
    loadComponent: () => import('./features/doctor-consult/consult-summary/consult-summary').then(m => m.ConsultSummaryComponent)
  },
  {
    path: 'doctor-consult/confirmation',
    loadComponent: () => import('./features/doctor-consult/booking-success/booking-success').then(m => m.BookingSuccessComponent)
  },
  {
    path: 'doctor-consult/history',
    canActivate: [authGuard],
    loadComponent: () => import('./features/doctor-consult/booking-history/booking-history').then(m => m.BookingHistoryComponent)
  },
  {
    path: 'search',
    loadComponent: () => import('./features/product-search/product-search').then(m => m.ProductSearchComponent)
  },
  {
    path: 'product/:id',
    loadComponent: () => import('./features/product-detail/product-detail').then(m => m.ProductDetailComponent)
  },
  {
    path: 'cart',
    loadComponent: () => import('./features/cart/cart').then(m => m.CartComponent)
  },
  {
    path: 'orders',
    canActivate: [authGuard, roleGuard(['Customer'])],
    loadComponent: () => import('./features/order-history/order-history').then(m => m.OrderHistoryComponent)
  }
];
