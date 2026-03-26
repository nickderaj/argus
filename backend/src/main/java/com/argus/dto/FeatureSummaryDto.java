package com.argus.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class FeatureSummaryDto {
    private Long id;
    private String name;
    private String tags;
    private int scenarioCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
