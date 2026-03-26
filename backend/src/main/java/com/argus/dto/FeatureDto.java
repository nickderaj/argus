package com.argus.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class FeatureDto {
    private Long id;

    @NotBlank
    private String name;

    private String description;

    private String tags;

    @Valid
    private List<ScenarioDto> scenarios;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
