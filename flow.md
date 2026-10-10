# AYU - Workflows

## Patient Workflow
1. Views home dashboard for today's schedule and active treatments.
2. Manages appointments and reviews consultation reports.
3. Receives medicine reminders and confirms adherence.

## Doctor Workflow
1. Views daily schedule and consultation queue.
2. Conducts consultations and creates prescriptions.
3. Reviews patient adherence data for follow-ups.

## Pharmacy Workflow
1. Receives incoming prescriptions.
2. Verifies stock and prepares orders.
3. Updates order status for patient pickup/dispatch.

## Prescription-to-Reminder Workflow
1. Doctor creates a prescription and verifies medicine instructions.
2. Patient receives the prescription and confirms the treatment schedule.
3. AYU creates automated medicine reminders based on the schedule.
4. Pharmacy receives the prescription if the patient chooses fulfillment through the platform.
5. Pharmacy verifies availability and creates an invoice.
6. Doctor monitors adherence information during follow-up visits.

## Connections Between Roles
The prescription acts as the core connector:
- Created by the **Doctor**.
- Acted upon by the **Pharmacy** for fulfillment.
- Acted upon by the **Patient** for consumption.
