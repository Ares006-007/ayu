var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Controller, Get, Param } from '@nestjs/common';
import { DoctorsService } from './doctors.service.js';
let DoctorsController = class DoctorsController {
    doctorsService;
    constructor(doctorsService) {
        this.doctorsService = doctorsService;
    }
    getTodaysAppointments(id) {
        return this.doctorsService.getTodaysAppointments(id);
    }
    getConsultations(id) {
        return this.doctorsService.getConsultations(id);
    }
    getPrescriptions(id) {
        return this.doctorsService.getPrescriptions(id);
    }
    getPatients(id) {
        return this.doctorsService.getPatients(id);
    }
};
__decorate([
    Get(':id/appointments/today'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DoctorsController.prototype, "getTodaysAppointments", null);
__decorate([
    Get(':id/consultations'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DoctorsController.prototype, "getConsultations", null);
__decorate([
    Get(':id/prescriptions'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DoctorsController.prototype, "getPrescriptions", null);
__decorate([
    Get(':id/patients'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DoctorsController.prototype, "getPatients", null);
DoctorsController = __decorate([
    Controller('doctors'),
    __metadata("design:paramtypes", [DoctorsService])
], DoctorsController);
export { DoctorsController };
//# sourceMappingURL=doctors.controller.js.map