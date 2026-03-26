CREATE TABLE features (
    id            BIGSERIAL PRIMARY KEY,
    name          VARCHAR(255) NOT NULL,
    description   TEXT,
    tags          VARCHAR(500),
    created_at    TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE scenarios (
    id            BIGSERIAL PRIMARY KEY,
    feature_id    BIGINT NOT NULL REFERENCES features(id) ON DELETE CASCADE,
    name          VARCHAR(255) NOT NULL,
    sort_order    INT NOT NULL DEFAULT 0,
    created_at    TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_scenarios_feature ON scenarios(feature_id);

CREATE TABLE step_definitions (
    id            BIGSERIAL PRIMARY KEY,
    keyword       VARCHAR(10) NOT NULL CHECK (keyword IN ('Given','When','Then')),
    text          VARCHAR(1000) NOT NULL,
    created_at    TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE(keyword, text)
);

CREATE INDEX idx_step_defs_text_trgm ON step_definitions USING gin (text gin_trgm_ops);

CREATE TABLE scenario_steps (
    id                  BIGSERIAL PRIMARY KEY,
    scenario_id         BIGINT NOT NULL REFERENCES scenarios(id) ON DELETE CASCADE,
    step_definition_id  BIGINT NOT NULL REFERENCES step_definitions(id),
    keyword_override    VARCHAR(10) NOT NULL,
    sort_order          INT NOT NULL DEFAULT 0
);

CREATE INDEX idx_scenario_steps_scenario ON scenario_steps(scenario_id);
