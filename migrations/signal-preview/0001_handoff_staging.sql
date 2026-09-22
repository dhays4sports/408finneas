-- Apply ONLY to a NEW dedicated 408-signal-handoff-preview D1 database.
-- Never apply to production or CoverageFit's rate-limit-only preview database.
PRAGMA foreign_keys = ON;
CREATE TABLE signal_preview_environment (
  singleton INTEGER PRIMARY KEY CHECK (singleton = 1),
  scope TEXT NOT NULL CHECK (scope = '408-signal-handoff-preview-v1'),
  synthetic_only INTEGER NOT NULL CHECK (synthetic_only = 1),
  delivery_enabled INTEGER NOT NULL CHECK (delivery_enabled = 0)
);
INSERT INTO signal_preview_environment VALUES (1, '408-signal-handoff-preview-v1', 1, 0);
CREATE TABLE signal_handoff_staging (
  request_id TEXT PRIMARY KEY,
  schema_version TEXT NOT NULL CHECK (schema_version = 'SIGNAL-LIFE-1.2'),
  signal_session_id TEXT NOT NULL,
  contact_mode TEXT NOT NULL CHECK (contact_mode IN ('call_now','choose_time','text')),
  synthetic_phone TEXT NOT NULL CHECK (synthetic_phone = '+12025550123'),
  time_preference TEXT NOT NULL,
  canonical_signals_json TEXT NOT NULL CHECK (json_valid(canonical_signals_json)),
  answers_json TEXT NOT NULL CHECK (json_valid(answers_json)),
  permission_evidence_json TEXT NOT NULL CHECK (json_valid(permission_evidence_json)),
  source_origin TEXT NOT NULL CHECK (source_origin = 'https://signal-life-1-0.408farmers-v2.pages.dev'),
  status TEXT NOT NULL CHECK (status = 'staging_only'),
  delivery_state TEXT NOT NULL CHECK (delivery_state = 'disabled'),
  created_at INTEGER NOT NULL,
  expires_at INTEGER NOT NULL CHECK (expires_at > created_at)
);
CREATE INDEX idx_signal_handoff_staging_expires ON signal_handoff_staging(expires_at);
