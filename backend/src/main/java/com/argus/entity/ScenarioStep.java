package com.argus.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "scenario_steps")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class ScenarioStep {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "scenario_id", nullable = false)
    private Scenario scenario;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "step_definition_id", nullable = false)
    private StepDefinition stepDefinition;

    @Column(name = "keyword_override", nullable = false, length = 10)
    private String keywordOverride;

    @Column(name = "sort_order")
    private Integer sortOrder;
}
