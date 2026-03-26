package com.argus.dto;

import lombok.*;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class StepDefinitionDto {
    private Long id;
    private String keyword;
    private String text;
}
