# SmartPark - Parking Management System (DBMS)

A parking management system built as a database project: vehicle
registration, slot management, and check-in/check-out tracking with an
admin back office.

## Features

| Area | Details |
|---|---|
| Auth | Login and registration with protected routes |
| Dashboard | Operational overview |
| Vehicles | Registered vehicle management |
| Parking | Slot view, check-in flow, and per-slot check-out |
| Admin | Slot management, vehicle records, and full parking records |

## Stack

Next.js (App Router) - TypeScript - Tailwind CSS

## Structure

```text
src/app/(auth)/       # login, register
src/app/(dashboard)/  # dashboard, vehicles, parking (check-in / check-out)
src/app/admin/        # slots, vehicles, records
src/components/       # layout: navbar, sidebar, protected route
```

## Run locally

```bash
npm install
npm run dev
```
