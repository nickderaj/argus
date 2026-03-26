package com.argus.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class StepDto {
    private Long id;

    @NotBlank
    private String keyword;

    @NotBlank
    private String text;

    private Integer sortOrder;

    private Long stepDefinitionId;
}
