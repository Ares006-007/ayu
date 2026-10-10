import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { DoctorsService } from './doctors.service.js';

@Controller('doctors')
export class DoctorsController {
  constructor(private readonly doctorsService: DoctorsService) {}

  @Get(':id/appointments/today')
  getTodaysAppointments(@Param('id') id: string) {
    return this.doctorsService.getTodaysAppointments(id);
  }

  @Get(':id/consultations')
  getConsultations(@Param('id') id: string) {
    return this.doctorsService.getConsultations(id);
  }

  @Get(':id/prescriptions')
  getPrescriptions(@Param('id') id: string) {
    return this.doctorsService.getPrescriptions(id);
  }

  @Get(':id/patients')
  getPatients(@Param('id') id: string) {
    return this.doctorsService.getPatients(id);
  }
}
