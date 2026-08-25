# Samvad-Psy-Phi-# PROJECT SAMVAAD

## Digital Public Infrastructure & Edge AI Communication Framework for Indian Sign Language (ISL) Mainstreaming

> **Scan → Sign/Speak → Understand**

PROJECT SAMVAAD is an accessibility-focused communication framework designed to make public-service interactions more accessible to Deaf citizens using **Indian Sign Language (ISL)**, **Edge AI**, **offline-first processing**, **QR-based access**, and **open APIs**.

The proposed system is designed around a simple objective:

> **Make every public-service counter accessible to Deaf citizens — without requiring an interpreter, an app download, or continuous internet connectivity.**

---

## Table of Contents

- [1. Problem Statement](#1-problem-statement)
- [2. Problem Context](#2-problem-context)
- [3. Why Existing Solutions Do Not Scale](#3-why-existing-solutions-do-not-scale)
- [4. Proposed Solution](#4-proposed-solution)
- [5. Key Features](#5-key-features)
- [6. System Workflow](#6-system-workflow)
- [7. ISL-to-Text/Speech Pipeline](#7-isl-to-textspeech-pipeline)
- [8. Speech-to-ISL/Avatar Pipeline](#8-speech-to-islavatar-pipeline)
- [9. Sector-Aware Accessibility](#9-sector-aware-accessibility)
- [10. Proposed Architecture](#10-proposed-architecture)
- [11. Technology Components](#11-technology-components)
- [12. Digital Public Infrastructure Approach](#12-digital-public-infrastructure-approach)
- [13. Recommended Policy](#13-recommended-policy)
- [14. Implementation and Scalability Roadmap](#14-implementation-and-scalability-roadmap)
- [15. Impact and Success Metrics](#15-impact-and-success-metrics)
- [16. Unique Innovation](#16-unique-innovation)
- [17. Target Stakeholders](#17-target-stakeholders)
- [18. Advantages](#18-advantages)
- [19. Limitations and Engineering Challenges](#19-limitations-and-engineering-challenges)
- [20. Future Scope](#20-future-scope)
- [21. Project Status](#21-project-status)
- [22. Conclusion](#22-conclusion)

---

# 1. Problem Statement

**Digital Public Infrastructure & Edge AI Communication Framework for Indian Sign Language (ISL) Mainstreaming**

Communication barriers can prevent Deaf citizens from independently accessing essential public services. The project presentation identifies a significant gap between the number of Deaf citizens and the availability of certified ISL interpreters.

The problem is therefore not only a communication challenge but also a **public-service accessibility challenge**.

PROJECT SAMVAAD addresses this gap by proposing a technology framework that can provide accessible communication at service counters using existing devices, QR-based browser access, Edge AI, and offline-first processing.

---

# 2. Problem Context

According to the project presentation:

- Approximately **18 million Deaf citizens** are considered in the project context.
- There are **fewer than 300 certified ISL interpreters**.
- This represents an approximate ratio of **1 interpreter for 60,000 citizens**.
- The resulting communication barrier can become a **service-access gap**.

The problem can affect several important public-service environments:

| Sector | Example Use Cases |
|---|---|
| Healthcare | Registration, triage, learning |
| Banking | KYC, transactions, customer support |
| Government | Offices, Panchayat, public services |
| Education | Classrooms, learning, examinations |

The objective is to make communication more direct and accessible instead of depending entirely on human interpreters.

---

# 3. Why Existing Solutions Do Not Scale

The presentation identifies three major limitations.

### 3.1 Cloud Dependence

Cloud-based processing can become unreliable in locations with poor or intermittent connectivity.

**Problem:** Communication assistance may fail when a continuous internet connection is unavailable.

**SAMVAAD approach:** Use Edge AI and an offline-first architecture so core recognition can operate locally.

---

### 3.2 Installation Friction

Requiring users to download and install an application is impractical at many public-service counters.

**Problem:** A citizen should not need to install a specialized application before accessing a service.

**SAMVAAD approach:** Use **QR-first browser access** for frictionless entry.

---

### 3.3 One-Way Translation

Many existing translation approaches focus primarily on one direction.

**Problem:** A public-service interaction is naturally conversational and requires both participants to communicate.

**SAMVAAD approach:** Provide a proposed **two-way communication flow**:

```text
ISL ↔ Text/Speech
```

This allows a Deaf citizen and a staff member/official to communicate through the same accessibility layer.

---

# 4. Proposed Solution

PROJECT SAMVAAD combines four core ideas:

1. **QR-First Access**
2. **Edge AI + Offline-First Processing**
3. **Two-Way ISL ↔ Text/Speech Communication**
4. **Sector-Aware Accessibility**

### High-Level Concept

```text
                 PROJECT SAMVAAD
                       |
        +--------------+--------------+
        |              |              |
    QR Access       Edge AI       Two-Way
        |          / Offline       Communication
        |              |              |
        +--------------+--------------+
                       |
              Sector-Aware Vocabulary
                       |
       +---------------+---------------+
       |       |       |       |
   Healthcare Banking Government Education
```

---

# 5. Key Features

## 5.1 QR-First Access

A QR code placed at a participating service counter provides instant access through a browser.

### Benefits

- No application installation
- Minimal onboarding friction
- Suitable for public-service counters
- Uses existing camera-enabled devices

---

## 5.2 Edge AI

ISL recognition is proposed to run locally using a lightweight local AI module.

The presentation specifies an approximately **200 MB local module** for on-device ISL recognition.

### Benefits

- Lower latency
- Reduced cloud dependency
- Better operation in poor-connectivity environments
- Local processing of the recognition pipeline

---

## 5.3 Offline-First Operation

The system is designed so that important communication functions can continue without continuous internet connectivity.

The architecture therefore prioritizes:

```text
Local Processing
      ↓
Low Dependency on Cloud
      ↓
Reliable Accessibility
```

---

## 5.4 Two-Way Communication

SAMVAAD is designed around:

```text
Deaf Citizen
    ↓
ISL
    ↓
Text / Speech
    ↓
Staff / Official

Staff / Official
    ↓
Speech / Text
    ↓
ISL Representation
    ↓
Deaf Citizen
```

This is intended to support a more natural conversation than one-way translation.

---

## 5.5 Sector-Aware Accessibility

The system is designed to use context-specific vocabulary for:

- Healthcare
- Banking
- Panchayat/Government services
- Education

This helps the translation system operate within the terminology relevant to the service being accessed.

---

# 6. System Workflow

The presentation's workflow contains two primary communication paths.

```text
                  PROJECT SAMVAAD
                         |
             +-----------+-----------+
             |                       |
        ISL → Text/Audio       Speech → ISL/Avatar
             |                       |
          Citizen                 Staff/Official
```

---

# 7. ISL-to-Text/Speech Pipeline

The proposed ISL-to-text/audio flow is:

```text
Deaf Citizen
     ↓
Video Capture
     ↓
Pose & Landmark Detection
     ↓
Edge AI Gesture Classification
     ↓
ISL-to-Text Conversion
     ↓
Text-to-Speech
     ↓
Output to Staff / Official
```

## Step 1 — ISL Input

The Deaf citizen uses a camera to perform signs in ISL.

## Step 2 — Video Capture

A device camera captures a live video stream.

The presentation identifies web/mobile camera input as the capture mechanism.

## Step 3 — Pose and Landmark Detection

The proposed workflow uses **MediaPipe Holistic** for:

- Hand landmarks
- Face landmarks
- Pose landmarks

The presentation specifically references extraction of **21 hand points** along with face and pose information.

## Step 4 — Edge AI Gesture Classification

The extracted landmarks are processed by an on-device classification layer.

The presentation references:

- TensorFlow Lite
- ONNX Runtime
- On-device inference
- Gesture classification
- Confidence-score generation

## Step 5 — ISL-to-Text Conversion

Recognized gestures are mapped to ISL gloss/text using a localized dictionary.

```text
Gesture
   ↓
Recognized ISL Sign
   ↓
ISL Gloss / Text
```

## Step 6 — Text-to-Speech

The generated text is converted to speech using a local TTS engine.

The presentation references local TTS options such as Piper/Vosk.

## Step 7 — Output

The resulting communication can be provided to the staff member or official through:

- Audio output
- Text display

---

# 8. Speech-to-ISL/Avatar Pipeline

The reverse communication flow is proposed as:

```text
Staff / Official
       ↓
Speech Input
       ↓
Audio Capture
       ↓
Speech Recognition
       ↓
Domain NLP + Semantic Mapping
       ↓
ISL Gloss Sequencing
       ↓
3D ISL Avatar Rendering
       ↓
Output to Deaf Citizen
```

## Step 1 — Speech Input

The staff member or official speaks to the system.

## Step 2 — Audio Capture

A microphone captures the speech as an audio stream.

## Step 3 — Speech Recognition

An offline ASR engine converts speech into recognized text.

The presentation references:

- Whisper
- Vosk
- Offline ASR

## Step 4 — Domain NLP and Semantic Mapping

Recognized text is mapped using a domain glossary and NLP layer.

The mapping is intended to be:

- Context-aware
- Sector-specific
- Semantically aligned with ISL representation

## Step 5 — ISL Gloss Sequencing

The recognized meaning is converted into an ordered ISL gloss sequence.

```text
Recognized Text
      ↓
Semantic Representation
      ↓
ISL Gloss Sequence
```

## Step 6 — 3D ISL Avatar Rendering

The ordered ISL gloss sequence is passed to a proposed 3D ISL avatar engine.

The presentation describes:

- Viseme + sign animation
- Animated 3D ISL output

## Step 7 — Output to Deaf Citizen

The generated sign representation is displayed to the citizen through the 3D ISL avatar, with optional text display.

---

# 9. Sector-Aware Accessibility

SAMVAAD is intended to be **sector-aware rather than generic-only**.

## Healthcare

Potential contexts:

- Registration
- Triage
- Patient communication
- Healthcare learning

## Banking

Potential contexts:

- KYC
- Transactions
- Customer support

## Government

Potential contexts:

- Government offices
- Panchayat services
- Public-service interactions

## Education

Potential contexts:

- Classrooms
- Learning
- Examinations

A domain glossary can help reduce ambiguity by providing terminology appropriate to each service environment.

---

# 10. Proposed Architecture

A high-level architecture based on the presentation is:

```text
                    USER ACCESS LAYER
                           |
                    QR Code / Browser
                           |
                +----------+----------+
                |                     |
           ISL Input              Speech Input
                |                     |
          Camera Stream          Microphone
                |                     |
                v                     v
       Pose & Landmark          Offline ASR
          Detection                  |
                |                    |
                v                    v
       Edge AI Gesture       Domain NLP / Semantic
         Classification             Mapping
                |                    |
                v                    v
        ISL → Text/Gloss       ISL Gloss Sequence
                |                    |
                v                    v
          Local TTS             3D ISL Avatar
                |                    |
                +---------+----------+
                          |
                   Accessible Output
                          |
                  Staff / Deaf Citizen
```

---

# 11. Technology Components

The presentation references the following technology components in the proposed workflow:

| Component | Proposed Technology / Approach |
|---|---|
| User access | QR-based browser access |
| Video input | Device camera |
| Landmark detection | MediaPipe Holistic |
| Hand representation | 21 hand landmarks |
| Edge inference | TensorFlow Lite / ONNX Runtime |
| ISL recognition | On-device gesture classification |
| ISL conversion | Localized ISL gloss dictionary |
| Speech recognition | Whisper / Vosk |
| NLP | Domain-specific semantic mapping |
| Speech synthesis | Local TTS engine |
| Avatar | 3D ISL avatar engine |
| Integration | Open translation APIs |
| Deployment | Edge/offline-first |

> These technologies represent the architecture and implementation direction shown in the presentation. They should be treated as proposed components unless independently validated in the final implementation.

---

# 12. Digital Public Infrastructure Approach

SAMVAAD is positioned not simply as an isolated application, but as an **open and interoperable accessibility layer**.

The intended DPI approach is:

```text
Existing Public-Service System
            |
            v
     SAMVAAD API Layer
            |
     +------+------+
     |             |
   ISL           Speech/Text
 Translation     Translation
     |             |
     +------+------+
            |
     Accessible Service
```

The presentation proposes open translation APIs that can integrate with:

- State e-Governance systems
- e-Hospital systems
- Public-service counters
- Education ecosystems

The goal is to allow multiple services to use the accessibility infrastructure without requiring separate application-specific deployments.

---

# 13. Recommended Policy

The presentation identifies a policy gap between existing accessibility/inclusion frameworks and the absence of a common technical standard across service counters.

It references:

- **RPwD Act 2016**
- **NEP 2020**

## Proposed Recommendations

### 13.1 Standardize QR Access

Deploy standardized QR-based accessibility entry points at public-service locations.

### 13.2 Standardize ISL

Promote a unified and interoperable ISL representation for digital accessibility systems.

### 13.3 Open the API

Provide open APIs for integration with e-Governance and other public-service platforms.

### 13.4 Embed ISL Learning

Integrate ISL-related learning modules into education ecosystems.

---

# 14. Implementation and Scalability Roadmap

The presentation proposes an **18-month roadmap**.

## Stage 1 — Pilot

**Timeline:** Months 1–4

Objectives:

- Validate usability
- Validate recognition
- Validate communication
- Validate adoption

The implementation plan references pilot deployment across selected healthcare and education/public-service environments. The roadmap slide specifies pilot deployment in **5 district hospitals + 20 Kendriya Vidyalayas**, while another slide mentions **5 district PHCs + 2 public bank branches in Karnataka**. These should be treated as pilot-scope alternatives requiring final confirmation before deployment.

---

## Stage 2 — State Expansion

**Timeline:** Months 5–10

Objectives:

- Expand to more hospitals
- Expand to public-service points
- Integrate with state e-Governance hubs
- Extend into education ecosystems

---

## Stage 3 — National Institutionalization

**Timeline:** Months 11–18

Objectives:

- Align with RPwD frameworks
- Support 22 languages
- Move toward nationwide deployment
- Establish institutional integration

---

## Scaling Mechanism

The presentation proposes:

> **Open-source translation APIs within state e-Governance and e-Hospital systems.**

The intended outcome is API-driven expansion across thousands of public touchpoints without requiring major hardware replacement or app-specific deployment.

---

# 15. Impact and Success Metrics

The presentation identifies the following intended impact and pilot metrics.

## Direct Beneficiaries

The project presentation identifies approximately:

**18 million Deaf / hearing-impaired citizens**

as the direct beneficiary population considered in the project context.

## Indirect Beneficiaries

The presentation identifies **500,000+** potential indirect beneficiaries, including:

- Doctors
- ASHA workers
- Nurses
- Bank clerks
- Public-service personnel

## Proposed Pilot Success Metrics

| Metric | Target |
|---|---:|
| Reduction in healthcare triage latency | >60% |
| First-contact resolution | >85% |
| Potential annual interactions at state-level scale | 100,000+ |

## Expected Timeline

The presentation highlights:

- **4 months:** Reduced communication friction at pilot PHC counters
- **12 months:** State-level expansion with 100,000+ annual interactions

These are **project targets**, not measured results.

---

# 16. Unique Innovation

SAMVAAD's proposed innovation is based on combining accessibility, Edge AI, and DPI principles.

## 16.1 Zero-Install + Offline

QR-based web access combined with Edge AI is intended to allow communication without:

- Application installation
- Continuous internet connectivity

## 16.2 Bidirectional Communication

Instead of limiting the system to one-way recognition, the framework supports:

```text
ISL ↔ Speech/Text
```

## 16.3 Open and Interoperable

SAMVAAD is proposed as an open DPI layer with APIs capable of integration across different public-service sectors.

## 16.4 Scalable and Inclusive

The architecture is designed to use existing devices and remain sector-agnostic, reducing deployment friction.

---

# 17. Target Stakeholders

The presentation identifies the following stakeholder groups:

- Department of Empowerment of Persons with Disabilities
- National Health Mission
- NCERT
- Ministry of Electronics & Information Technology
- State e-Governance organizations
- Public hospitals
- Banks
- Educational institutions
- Panchayat and government service centers
- Public-service personnel
- Deaf citizens and ISL users

---

# 18. Advantages

### Accessibility

Reduces dependence on the limited availability of interpreters for routine service interactions.

### Offline Capability

Edge processing reduces dependence on continuous cloud connectivity.

### Low Deployment Friction

QR-based access avoids mandatory application installation.

### Two-Way Interaction

Supports communication in both directions.

### Sector Adaptability

Domain-specific vocabulary allows the system to target healthcare, banking, government, and education.

### Interoperability

An API-based architecture can allow integration with existing digital public-service systems.

### Scalability

The proposed architecture is designed to expand through software/API integration rather than complete hardware replacement.

---

# 19. Limitations and Engineering Challenges

The presentation establishes the intended architecture but does not provide complete implementation benchmarks. Several engineering challenges therefore remain important.

## 19.1 ISL Recognition Accuracy

Real-world sign recognition must handle:

- Different users
- Different signing speeds
- Variations in signing style
- Lighting conditions
- Camera positioning
- Occlusion
- Continuous sign sequences

A final system should be evaluated using representative ISL datasets and real-user testing.

## 19.2 Continuous Sign Language

Recognizing isolated gestures is simpler than translating continuous ISL sentences.

The system therefore needs robust temporal modeling and sequence handling for practical conversation.

## 19.3 Semantic Translation

Direct word-to-word translation is insufficient for natural language communication.

The NLP layer needs to map recognized content into an appropriate semantic representation before generating ISL gloss sequences.

## 19.4 3D Avatar Complexity

The reverse pipeline includes 3D ISL avatar rendering, which can be computationally expensive.

A practical implementation should evaluate:

- Model size
- Rendering latency
- Device capabilities
- Animation quality
- Offline feasibility
- Frame rate
- Memory consumption

## 19.5 Domain Vocabulary

Healthcare, banking, government, and education require different terminology. Maintaining reliable sector-specific glossaries is therefore important.

## 19.6 Privacy

Because camera and microphone data may contain sensitive information, the deployment architecture should prioritize local processing, minimal data retention, and appropriate access controls.

---

# 20. Future Scope

The proposed roadmap enables several future extensions.

### National Deployment

Expand the accessibility layer across public-service touchpoints.

### 22-Language Support

Extend the communication framework to support regional-language interactions as proposed in the roadmap.

### Government API Integration

Integrate with state e-Governance systems and e-Hospital platforms.

### Education Integration

Embed ISL accessibility and learning modules into educational systems.

### Improved Continuous ISL Translation

Move from isolated gesture classification toward continuous sentence-level ISL understanding.

### Improved 3D Avatar

Develop more natural sign animation, facial expressions, body movement, and contextual rendering.

### Edge Optimization

Further compress and optimize recognition and translation models for low-resource devices.

### Open Ecosystem

Enable third-party developers and public institutions to build services on top of the proposed accessibility APIs.

---

# 21. Project Status

The presentation describes **PROJECT SAMVAAD as a proposed accessibility framework and implementation roadmap**.

The documented material establishes:

- The problem
- Proposed solution
- High-level workflow
- Technology direction
- Policy recommendations
- Scalability roadmap
- Expected impact metrics
- Unique innovation

The presentation does **not** provide enough evidence to claim that all listed components have already been fully implemented, benchmarked, or deployed.

Therefore, implementation documentation should clearly distinguish between:

```text
Proposed Architecture
        ↓
Prototype Implementation
        ↓
Experimental Validation
        ↓
Pilot Deployment
        ↓
Production Deployment
```

Only components supported by actual test results should be described as implemented or validated.

---

# 22. Conclusion

PROJECT SAMVAAD proposes an accessibility-focused Digital Public Infrastructure layer for Indian Sign Language communication.

The framework combines:

```text
QR-First Access
       +
Edge AI
       +
Offline-First Processing
       +
ISL Recognition
       +
Speech/Text Translation
       +
3D ISL Representation
       +
Open APIs
       +
Sector-Aware Vocabulary
```

Its central objective is to reduce communication barriers at public-service counters and enable more inclusive interaction between Deaf citizens and service personnel.

Rather than treating accessibility as a separate application, SAMVAAD proposes an interoperable infrastructure approach that can be integrated across healthcare, banking, government, and education.

The long-term vision is:

> **Accessible public services for Deaf citizens without requiring an interpreter, app installation, or continuous internet connectivity.**

---

## Project Name

**PROJECT SAMVAAD**

### Problem Statement

**Digital Public Infrastructure & Edge AI Communication Framework for Indian Sign Language (ISL) Mainstreaming**

### Core Flow

```text
Scan → Sign/Speak → Understand
```

### Core Communication

```text
ISL ↔ Text/Speech
```

### Roadmap

```text
Pilot → State Expansion → National Institutionalization
```

---

## Team

- Kishor T L
- Meghana
- Parvati H
- Lohith H
- Namith K

## Institution

**Global Academy of Technology, Bengaluru**

## Track

**Young Indians (Yi) Bengaluru — Accessibility Track**

---

## License

This project currently represents the architecture and implementation direction described in the project presentation. Add an appropriate open-source license (for example, MIT, Apache-2.0, or another license selected by the project owners) before publishing the source code publicly.

---

## Acknowledgement

This README is based on the contents of the PROJECT SAMVAAD presentation, including its problem statement, solution architecture, workflow diagrams, recommended policy, implementation roadmap, scalability plan, impact metrics, and unique innovation.
