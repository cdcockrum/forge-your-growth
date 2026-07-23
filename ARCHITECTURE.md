# Forge Architecture

> A Personal Intelligence Platform

---

# Philosophy

Forge is organized as a pipeline.

Data flows forward.

Every stage adds meaning.

Nothing skips stages.

This makes the system explainable,
testable,
and extensible.

---

# High-Level Architecture

                Vision
                   │
                   ▼
          Planning Engine
                   │
                   ▼
          Practice Sessions
                   │
                   ▼
            Daily Evidence
                   │
                   ▼
           Reflection Engine
                   │
                   ▼
             Forge Engine
                   │
      ┌────────────┼────────────┐
      ▼            ▼            ▼
  Identity     Momentum     Progress
      │            │            │
      └────────────┼────────────┘
                   ▼
            Intelligence
                   │
      ┌────────────┼─────────────┐
      ▼            ▼             ▼
 Chronicle     Observatory   Morning Briefing

---

# Layers

Forge follows four layers.

UI

↓

View Models

↓

Domain Engines

↓

Persistence

Each layer only depends on the layer below.

---

# UI Layer

Purpose

Display information.

No business logic.

Examples

Today

Practice

Observatory

Review

Story

Dashboard

Components

Charts

Cards

Timeline

Identity Tree

Morning Briefing

---

# View Model Layer

Purpose

Prepare domain data for UI.

No calculations.

Only formatting.

Examples

IdentityTreeViewModel

ObservatoryViewModel

MorningBriefingModel

ChronicleViewModel

---

# Domain Layer

The heart of Forge.

Contains all intelligence.

Identity

Momentum

Coach

Patterns

Traits

History

Evidence

Chronicle

Advisor

Narrative

Forge Score

Health Score

Reasoning

Interpretation

Explanation

Context

No React.

No UI.

Pure TypeScript.

---

# Persistence Layer

Supabase

Authentication

Database

Snapshots

Practice Sessions

Skills

Life Areas

Reviews

Achievements

---

# Data Flow

Vision

↓

Planning

↓

Practice

↓

Reflection

↓

Evidence

↓

Forge Engine

↓

View Models

↓

UI

---

# Observatory

Purpose

Help users understand what is happening.

Consumes

Identity

Momentum

History

Patterns

Evidence

Outputs

Charts

Heatmap

Timeline

Identity Tree

Pattern Discovery

---

# Morning Briefing

Purpose

Summarize today's most important information.

Consumes

Identity

Momentum

Advisor

Coach

Patterns

Produces

Greeting

Summary

Metrics

Observations

Recommendation

Confidence

---

# Identity

The core differentiator.

Identity grows through evidence.

Evidence comes from practice.

Identity is never manually edited.

Identity changes slowly.

---

# Chronicle

Chronicle is the memory of Forge.

Every important event becomes an observation.

Observations become stories.

Stories become understanding.

---

# Pattern Discovery

Patterns are inferred.

Never invented.

Every pattern must have evidence.

Confidence reflects evidence.

---

# AI

AI never replaces evidence.

AI explains evidence.

AI summarizes evidence.

AI reasons over evidence.

Evidence always comes first.

---

# Principles

Pure functions.

Immutable inputs.

Composable engines.

Explainable outputs.

Reusable components.

---

# Future Modules

Ask Forge

Time Machine

Trait Evolution

Future Forecasting

Digital Twin

Voice Coach

Wearables

All future modules consume the same Forge Engine.

Nothing bypasses it.

---

# Final Principle

The Forge Engine is the single source of intelligence.

Everything else is presentation.