package com.argus.controller;

import com.argus.dto.StepDefinitionDto;
import com.argus.mapper.FeatureMapper;
import com.argus.service.StepService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/steps")
@RequiredArgsConstructor
public class StepController {

    private final StepService stepService;
    private final FeatureMapper featureMapper;

    @GetMapping("/search")
    public List<StepDefinitionDto> search(
            @RequestParam String q,
            @RequestParam(required = false) String keyword) {
        return stepService.search(q, keyword).stream()
                .map(featureMapper::toStepDefinitionDto)
                .collect(Collectors.toList());
    }

    @GetMapping
    public List<StepDefinitionDto> listAll() {
        return stepService.findAll().stream()
                .map(featureMapper::toStepDefinitionDto)
                .collect(Collectors.toList());
    }
}
