package com.argus.service;

import com.argus.entity.StepDefinition;
import com.argus.repository.StepDefinitionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class StepService {

    private final StepDefinitionRepository stepDefinitionRepository;

    public StepDefinition findOrCreate(String keyword, String text) {
        return stepDefinitionRepository.findByKeywordAndText(keyword, text)
                .orElseGet(() -> stepDefinitionRepository.save(
                        StepDefinition.builder()
                                .keyword(keyword)
                                .text(text)
                                .build()
                ));
    }

    public List<StepDefinition> search(String query, String keyword) {
        if (keyword != null && !keyword.isBlank()) {
            return stepDefinitionRepository.searchByTextAndKeyword(query, keyword);
        }
        return stepDefinitionRepository.searchByText(query);
    }

    public List<StepDefinition> findAll() {
        return stepDefinitionRepository.findAll();
    }

    /**
     * Resolves the canonical keyword for a step.
     * "And" and "But" inherit the keyword of the preceding step.
     */
    public String resolveCanonicalKeyword(String keyword, String previousCanonicalKeyword) {
        if ("And".equals(keyword) || "But".equals(keyword)) {
            return previousCanonicalKeyword != null ? previousCanonicalKeyword : "Given";
        }
        return keyword;
    }
}
