package com.argus.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.util.List;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class ScenarioDto {
    private Long id;

    @NotNull
    private String name;

    private Integer sortOrder;

    @Valid
    private List<StepDto> steps;
}
