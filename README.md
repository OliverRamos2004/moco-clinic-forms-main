# Digital Patient Intake System

Montgomery County Free Clinic (MCFC) — CSC 400 Capstone Project

Authors: Oliver Ramos, Curtis Faughnan, Haile, Lucas

Semester: Fall 2024 / Spring 2025

📌 Overview

The Digital Patient Intake System modernizes the Montgomery County Free Clinic’s manual intake process by allowing patients to submit demographic and medical information online.

All data is securely stored in a structured PostgreSQL database (Supabase) and can be viewed through a staff-facing Patient List and Patient Details interface.

🚀 Features
✔️ Patient Intake Form

- Multi-tab layout for intuitive navigation

- Demographic information

- Address & contact info

- Insurance & residency

- Nutrition history

- Social history (alcohol, tobacco, drug use)

- Allergies (multiple entries)

- Current medications (multiple entries)

- Past medical events

- Family history (with problem lookup)

- Dental / Male / Female health history

- TB screening

- Emergency contacts

- Digital signature

✔️ Staff Tools

View all patient submissions

Detailed patient record view

Relational joins across 20+ linked tables

Real-time data from Supabase

🛠️ Tech Stack
Frontend

React (TypeScript)

Vite

ShadCN UI

TailwindCSS

React Router

React Hooks

Backend

Supabase PostgreSQL

Supabase JavaScript Client

PostgREST API (automatically generated)

Deployment

Vercel (frontend)

Supabase (database + backend)

📁 Project Structure
src/
components/
PatientForm/
BasicInfoTab.tsx
AddressTab.tsx
HealthHistoryTab.tsx
...
pages/
Index.tsx
PatientsList.tsx
PatientDetails.tsx
lib/
supabaseClient.ts

⚙️ Installation & Setup

1. Clone the repository
   git clone https://github.com/<repo>/moco-clinic-forms-main.git
   cd moco-clinic-forms-main

2. Install dependencies
   npm install

3. Create .env file
   VITE_SUPABASE_URL=https://xxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=your_anon_key_here

4. Run the development server
   npm run dev

🔄 How Data Flows (Frontend → Backend)
1️⃣ Forms collect data

Each input field updates a master formData object via useState and updateFormData.

2️⃣ User submits → handleSubmit() runs

This function inserts data in the correct order:

person

address

application

intake

child tables

allergy

medication

nutrition_history

social_history

tb_screening

male_history / female_history

family_history + family_history_problem

dental_history

others

Each insert uses .select().single() to retrieve primary keys (e.g., person_id, intake_id) and link records correctly.

🔐 HIPAA Considerations

Supabase’s free tier is NOT HIPAA-compliant.
To move toward compliance:

Option A — Move backend to a HIPAA server

Use:

AWS RDS PostgreSQL

GCP SQL

Azure Postgres

Then:

Self-host PostgREST or a Node API

Add audit logs + access control

Protect PHI with encryption and secure auth

Option B — Allow clinic to export data manually

Clinic can export CSVs from Supabase and upload to their internal HIPAA system.

🚧 Current Status

✔ All forms functional
✔ All insert logic completed
✔ All child tables fixed
✔ PatientDetails displays every section
✔ Fully deployed to Vercel
✔ Clean ERD + schema mapping completed
✔ All GitHub commits synced
✔ Ready for staff testing

📌 Future Roadmap

Add patient edit functionality

Add delete/archive functionality

Add clinic staff login (Supabase Auth / Clerk / Auth0)

Add PDF export for patient records

UI polish on PatientDetails sections

Add bilingual form support

HIPAA migration plan (backend self-hosting)

Form validation + required-field rules

🖼 Recommended Screenshots for README

You can insert images later:

Intake form screenshot

Patient List dashboard

Patient Details screen

Supabase ERD

A sample row in Supabase

Deployment screenshot from Vercel

Place them under a "Screenshots" section if desired.

👥 Credits

This system was built as a collaborative capstone project for the Montgomery County Free Clinic by:

Oliver Ramos
Database mapping, ERD, foreign-key joins, insertion pipeline, deployment, debugging

Curtis Faughnan
Frontend architecture, routing, structure

Haile
UI component design, styling

Lucas
Requirements gathering, HIPAA research
