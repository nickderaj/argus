package com.argus.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "step_definitions", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"keyword", "text"})
})
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class StepDefinition {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 10)
    private String keyword;

    @Column(nullable = false, length = 1000)
    private String text;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}
