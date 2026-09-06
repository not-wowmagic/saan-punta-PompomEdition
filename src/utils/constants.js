// ponytail: Shared constants for transport modes to prevent duplication and drift.
import { Bus, Train, Car, Bike, Footprints, Zap } from 'lucide-react';

export const MODE_ICONS = {
  jeepney: Bus,
  bus: Bus,
  train: Train,
  taxi: Car,
  moto_taxi: Bike,
  walk: Footprints,
  tricycle: Zap
};

export const MODE_LABELS = {
  jeepney: "Jeepney",
  bus: "Public Bus",
  train: "LRT/MRT Train",
  taxi: "Taxi",
  moto_taxi: "Motorcycle Taxi",
  walk: "Walk",
  tricycle: "Tricycle"
};

export const MODE_COLORS = {
  jeepney: "#D97706",     // Amber
  bus: "#C2410C",         // Warm Rust/Orange
  train: "#7C3AED",       // Purple
  taxi: "#DC2626",        // Red
  moto_taxi: "#0891B2",   // Teal
  walk: "#78350F",        // Warm brown
  tricycle: "#EA580C"     // Orange
};
